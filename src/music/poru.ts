import { Poru } from 'poru';
import { Client, GuildMember, VoiceBasedChannel } from 'discord.js';
import { logger } from '../lib/logger.js';

export type ExtendedClient = Client & { poru?: Poru };

export function createPoru(client: Client) {
  const nodes: any[] = [
    {
      name: 'local-lavalink',
      host: process.env.LAVALINK_HOST || 'localhost',
      port: Number(process.env.LAVALINK_PORT || 2333),
      password: process.env.LAVALINK_PASSWORD || 'youshallnotpass',
      secure: false,
    },
  ];

  const options: any = {
    library: 'discord.js',
    defaultPlatform: 'ytsearch',
    reconnectTries: 3,
  };

  const poru = new Poru(client, nodes, options);

  poru.on('nodeConnect', (node: any) => logger.info({ node: node.name }, 'Lavalink node connected'));
  poru.on('nodeDisconnect', (node: any, reason: any) =>
    logger.warn({ node: node.name, reason }, 'Lavalink node disconnected'),
  );
  poru.on('nodeError', (node: any, err: any) => logger.error({ node: node.name, err }, 'Lavalink error'));
  (poru as any).on('playerStart', (player: any) => {
    const track = player.currentTrack;
    logger.info({ guildId: player.guildId, track: track?.info?.title }, 'Track start');
  });
  (poru as any).on('queueEnd', (player: any) => {
    logger.info({ guildId: player.guildId }, 'Queue ended');
    player.destroy();
  });

  (client as ExtendedClient).poru = poru;
  return poru;
}

export function getVoiceChannel(member: GuildMember | null): VoiceBasedChannel | null {
  if (!member) return null;
  return member.voice.channel;
}

export async function connectAndPlay(
  poru: Poru,
  interactionGuildId: string,
  voiceId: string,
  textId: string,
  query: string,
) {
  const player: any = await poru.createConnection({
    guildId: interactionGuildId,
    voiceChannel: voiceId,
    textChannel: textId,
    deaf: true,
  });

  let resolved: any;
  if (query.startsWith('http://') || query.startsWith('https://')) {
    resolved = await poru.resolve({ query });
  } else {
    resolved = await poru.resolve({ query: `ytsearch:${query}` });
  }

  if (!resolved || !resolved.tracks.length) {
    return { ok: false, message: 'Не намерих нищо за това търсене.' };
  }

  const track = resolved.tracks[0];
  player.queue.add(track);
  if (!player.isPlaying && !player.isPaused) {
    await player.play();
    return { ok: true, message: `Пускам: **${track.info.title}**` };
  }
  return { ok: true, message: `Добавено в опашката: **${track.info.title}**` };
}

import { Client } from 'discord.js';
import { logger } from '../lib/logger.js';
import { ExtendedClient, connectAndPlay } from '../music/poru.js';

export const name = 'ready';
export const once = true;

export async function execute(client: Client) {
  logger.info({ user: client.user?.tag }, 'Bot is ready');

  const guildId = process.env.DISCORD_GUILD_ID;
  const vcId = process.env.AUTOJOIN_VC_ID;
  const stream = process.env.RADIO_STREAM_URL || 'https://www.youtube.com/watch?v=jfKfPfyJRdk';

  if (guildId && vcId) {
    const poru = (client as ExtendedClient).poru;
    if (!poru) {
      logger.warn('Poru not initialized, cannot auto-join');
      return;
    }
    // init poru after ready
    // @ts-ignore
    poru.init(client);

    const doJoin = async () => {
      try {
        await connectAndPlay(poru, guildId, vcId, vcId, stream);
        logger.info({ guildId, vcId }, 'Auto-joined voice channel');
      } catch (err) {
        logger.error({ err, guildId, vcId }, 'Failed to auto-join voice');
      }
    };

    const scheduleJoin = () => setTimeout(doJoin, 1500);

    const anyNode = (poru.nodes && (Array.isArray(poru.nodes) ? poru.nodes[0] : poru.nodes.values().next().value)) as any;
    if (anyNode && anyNode.isConnected) {
      scheduleJoin();
    } else {
      (poru as any).once('nodeConnect', scheduleJoin);
    }
  }
}

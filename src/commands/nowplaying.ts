import { AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Bloom } from 'musicard';
import { ExtendedClient } from '../music/poru.js';

const FALLBACK_ART =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Simple_music_note.svg/512px-Simple_music_note.svg.png';

export const data = new SlashCommandBuilder().setName('nowplaying').setDescription('Show now playing card');

export async function execute(interaction: ChatInputCommandInteraction) {
  const player: any = (interaction.client as ExtendedClient).poru?.players.get(interaction.guildId!);
  if (!player || !player.currentTrack) {
    await interaction.reply({ content: 'Няма активен трак.', ephemeral: true });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  const track = player.currentTrack;
  const info = track.info || {};
  const title = info.title || 'Unknown title';
  const author = info.author || 'Unknown artist';
  const art = info.artworkUrl || FALLBACK_ART;

  const buffer = await Bloom({
    albumArt: art,
    fallbackArt: FALLBACK_ART,
    artistName: author,
    trackName: title,
    timeAdjust: { timeStart: 'LIVE', timeEnd: '' },
    progressBar: undefined,
    styleConfig: {
      artistStyle: { textColor: '#FFFFFF', textGlow: true },
      trackStyle: { textColor: '#E0E0E0', textGlow: true },
      timeStyle: { textColor: '#9e9e9e' },
      progressBarStyle: { barColor: '#00e5ff', barColorDuo: true },
    },
    backgroundColor: '#0b0c10',
  });

  const attachment = new AttachmentBuilder(buffer, { name: 'nowplaying.png' });
  await interaction.editReply({ files: [attachment] });
}

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient, connectAndPlay } from '../music/poru.js';

export const data = new SlashCommandBuilder()
  .setName('radioon')
  .setDescription('Start/restore the configured radio stream');

export async function execute(interaction: ChatInputCommandInteraction) {
  const guildId = interaction.guildId;
  if (!guildId) return interaction.reply({ content: 'No guild context.', ephemeral: true });

  const vcId = process.env.AUTOJOIN_VC_ID;
  const stream = process.env.RADIO_STREAM_URL;
  if (!vcId || !stream) {
    await interaction.reply({ content: 'Radio is not configured (env missing).', ephemeral: true });
    return;
  }

  const poru = (interaction.client as ExtendedClient).poru;
  if (!poru) {
    await interaction.reply({ content: 'Audio backend missing.', ephemeral: true });
    return;
  }

  try {
    await interaction.deferReply({ ephemeral: true });
    const res = await connectAndPlay(poru, guildId, vcId, vcId, stream);
    await interaction.editReply({ content: res.message });
  } catch {
    await interaction.editReply({ content: 'Failed to start radio.' });
  }
}

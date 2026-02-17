import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../music/poru.js';

export const data = new SlashCommandBuilder().setName('resume').setDescription('Resume playback');

export async function execute(interaction: ChatInputCommandInteraction) {
  const player = (interaction.client as ExtendedClient).poru?.players.get(interaction.guildId!);
  if (!player) return interaction.reply({ content: 'Няма плеър.', ephemeral: true });
  await player.pause(false);
  await interaction.reply({ content: 'Продължавам.', ephemeral: true });
}

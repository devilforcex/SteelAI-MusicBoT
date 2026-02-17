import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../music/poru.js';

export const data = new SlashCommandBuilder().setName('stop').setDescription('Stop playback and clear queue');

export async function execute(interaction: ChatInputCommandInteraction) {
  const player = (interaction.client as ExtendedClient).poru?.players.get(interaction.guildId!);
  if (!player) return interaction.reply({ content: 'Няма плеър.', ephemeral: true });
  player.queue.clear();
  await player.destroy();
  await interaction.reply({ content: 'Спрях и изчистих опашката.', ephemeral: true });
}

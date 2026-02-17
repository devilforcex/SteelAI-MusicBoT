import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../music/poru.js';

export const data = new SlashCommandBuilder().setName('filters').setDescription('Show filters panel');

export async function execute(interaction: ChatInputCommandInteraction) {
  const player = (interaction.client as ExtendedClient).poru?.players.get(interaction.guildId!);
  if (!player) return interaction.reply({ content: 'Няма плеър.', ephemeral: true });
  await interaction.reply({ content: 'Filters TBD (ще добавя по-късно).', ephemeral: true });
}

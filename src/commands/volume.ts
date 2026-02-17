import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../music/poru.js';

export const data = new SlashCommandBuilder()
  .setName('volume')
  .setDescription('Set volume (0-100)')
  .addIntegerOption((opt) =>
    opt.setName('level').setDescription('Volume level').setRequired(true).setMinValue(0).setMaxValue(100),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const player = (interaction.client as ExtendedClient).poru?.players.get(interaction.guildId!);
  if (!player) return interaction.reply({ content: 'Няма плеър.', ephemeral: true });
  const level = interaction.options.getInteger('level', true);
  await player.setVolume(level);
  await interaction.reply({ content: `Volume: ${level}%`, ephemeral: true });
}

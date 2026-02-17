import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../music/poru.js';

export const data = new SlashCommandBuilder().setName('pause').setDescription('Pause playback');

export async function execute(interaction: ChatInputCommandInteraction) {
  const player = (interaction.client as ExtendedClient).poru?.players.get(interaction.guildId!);
  if (!player) return interaction.reply({ content: 'Няма плеър.', ephemeral: true });
  await player.pause(true);
  await interaction.reply({ content: 'Пауза.', ephemeral: true });
}

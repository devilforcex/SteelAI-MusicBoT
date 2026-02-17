import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../music/poru.js';

export const data = new SlashCommandBuilder().setName('skip').setDescription('Skip the current track');

export async function execute(interaction: ChatInputCommandInteraction) {
  const player: any = (interaction.client as ExtendedClient).poru?.players.get(interaction.guildId!);
  if (!player) return interaction.reply({ content: 'Няма плеър.', ephemeral: true });
  if (player.queue.size === 0) {
    await player.stop();
  } else {
    await player.stop();
  }
  await interaction.reply({ content: 'Прескочих.', ephemeral: true });
}

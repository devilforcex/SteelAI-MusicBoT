import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../music/poru.js';

export const data = new SlashCommandBuilder().setName('autoplay').setDescription('Toggle autoplay');

export async function execute(interaction: ChatInputCommandInteraction) {
  const player: any = (interaction.client as ExtendedClient).poru?.players.get(interaction.guildId!);
  if (!player) return interaction.reply({ content: 'Няма плеър.', ephemeral: true });
  const next = !player.isAutoPlay;
  player.setAutoPlay(next);
  await interaction.reply({ content: `Autoplay: ${next ? 'on' : 'off'}`, ephemeral: true });
}

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../music/poru.js';

export const data = new SlashCommandBuilder()
  .setName('radiooff')
  .setDescription('Stop the radio stream and clear the player');

export async function execute(interaction: ChatInputCommandInteraction) {
  const player: any = (interaction.client as ExtendedClient).poru?.players.get(interaction.guildId!);
  if (!player) {
    await interaction.reply({ content: 'Няма активен плеър.', ephemeral: true });
    return;
  }
  player.queue.clear();
  await player.destroy();
  await interaction.reply({ content: 'Спрях радиото и изчистих плеъра.', ephemeral: true });
}

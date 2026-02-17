import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../music/poru.js';

export const data = new SlashCommandBuilder()
  .setName('radiostatus')
  .setDescription('Show current radio/player status');

export async function execute(interaction: ChatInputCommandInteraction) {
  const player: any = (interaction.client as ExtendedClient).poru?.players.get(interaction.guildId!);
  if (!player || !player.currentTrack) {
    await interaction.reply({ content: 'Нищо не свири в момента.', ephemeral: true });
    return;
  }

  const info = player.currentTrack.info || {};
  const embed = new EmbedBuilder()
    .setTitle('Radio status')
    .addFields(
      { name: 'Title', value: info.title || 'Unknown', inline: true },
      { name: 'Author', value: info.author || 'Unknown', inline: true },
      { name: 'Volume', value: `${player.volume ?? 100}%`, inline: true },
      { name: 'Loop', value: player.loop || 'NONE', inline: true },
      { name: 'Queue', value: `${player.queue.length || 0} tracks`, inline: true },
    );

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

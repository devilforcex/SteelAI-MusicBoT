import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../music/poru.js';

export const data = new SlashCommandBuilder().setName('queue').setDescription('View the current queue');

export async function execute(interaction: ChatInputCommandInteraction) {
  const player = (interaction.client as ExtendedClient).poru?.players.get(interaction.guildId!);
  if (!player) return interaction.reply({ content: 'Няма плеър.', ephemeral: true });

  const current = player.currentTrack;
  const next = player.queue.slice(0, 5);

  const embed = new EmbedBuilder().setTitle('Queue');
  embed.addFields({ name: 'Now playing', value: current ? current.info.title : '—' });
  if (next.length) {
    embed.addFields({
      name: 'Next',
      value: next.map((t, i) => `${i + 1}. ${t.info.title}`).join('\n'),
    });
  } else {
    embed.addFields({ name: 'Next', value: '—' });
  }

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

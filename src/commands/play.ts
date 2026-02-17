import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient, connectAndPlay, getVoiceChannel } from '../music/poru.js';

export const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play a track by URL or search query')
  .addStringOption((opt) =>
    opt.setName('query').setDescription('URL or search terms').setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const client = interaction.client as ExtendedClient;
  const poru = client.poru;
  if (!poru) {
    await interaction.reply({ content: 'Audio backend не е готов.', ephemeral: true });
    return;
  }

  const member = interaction.guild?.members?.cache.get(interaction.user.id) || null;
  const voice = getVoiceChannel(member);
  if (!voice) {
    await interaction.reply({ content: 'Влез в voice канал първо.', ephemeral: true });
    return;
  }

  await interaction.deferReply({ ephemeral: true });
  const query = interaction.options.getString('query', true);
  const res = await connectAndPlay(poru, interaction.guildId!, voice.id, interaction.channelId, query);
  await interaction.editReply({ content: res.message });
}

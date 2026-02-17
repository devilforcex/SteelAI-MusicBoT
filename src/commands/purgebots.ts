import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('purgebots')
  .setDescription('Delete bot messages in a channel (by cutoff days)')
  .addIntegerOption((opt) =>
    opt
      .setName('days')
      .setDescription('How many days back (1-90)')
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(90),
  )
  .addIntegerOption((opt) =>
    opt
      .setName('limit')
      .setDescription('How many messages to scan (max 2000)')
      .setRequired(false)
      .setMinValue(50)
      .setMaxValue(2000),
  )
  .addChannelOption((opt) =>
    opt.setName('channel').setDescription('Channel to purge').setRequired(false),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction: ChatInputCommandInteraction) {
  const days = interaction.options.getInteger('days') ?? 60;
  const limit = interaction.options.getInteger('limit') ?? 1000;
  const channelOpt = interaction.options.getChannel('channel');
  const channel = (channelOpt ?? interaction.channel) as TextChannel | null;

  if (!channel || channel.isDMBased() || !channel.isTextBased()) {
    await interaction.reply({ content: 'Невалиден канал.', ephemeral: true });
    return;
  }

  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  await interaction.deferReply({ ephemeral: true });

  let fetched = 0;
  let deleted = 0;
  let lastId: string | undefined;

  try {
    while (fetched < limit) {
      const batch = await channel.messages.fetch({ limit: 100, before: lastId });
      if (!batch.size) break;
      let stop = false;
      for (const msg of batch.values()) {
        fetched++;
        if (msg.createdTimestamp < cutoff) {
          stop = true;
          break;
        }
        if (msg.author?.bot) {
          try {
            await msg.delete();
            deleted++;
          } catch (err) {
            // ignore per-message errors
          }
        }
        lastId = msg.id;
        if (fetched >= limit) {
          stop = true;
          break;
        }
      }
      if (stop) break;
    }
  } catch (err: any) {
    await interaction.editReply({ content: `Грешка при чистене: ${err?.message || err}` });
    return;
  }

  await interaction.editReply({
    content: `Приключих. Изтрити бот съобщения: ${deleted}. Сканирани: ${fetched}. Обхват: ${days} дни.`,
  });
}

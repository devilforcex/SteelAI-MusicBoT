import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';

const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder().setCustomId('music:play').setLabel('▶ Play').setStyle(ButtonStyle.Success),
  new ButtonBuilder().setCustomId('music:pause').setLabel('⏸ Pause').setStyle(ButtonStyle.Secondary),
  new ButtonBuilder().setCustomId('music:skip').setLabel('⏭ Skip').setStyle(ButtonStyle.Secondary),
  new ButtonBuilder().setCustomId('music:queue').setLabel('📜 Queue').setStyle(ButtonStyle.Secondary),
);

const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder().setCustomId('music:repeat').setLabel('🔁 Repeat').setStyle(ButtonStyle.Secondary),
  new ButtonBuilder().setCustomId('music:shuffle').setLabel('🔀 Shuffle').setStyle(ButtonStyle.Secondary),
  new ButtonBuilder().setCustomId('music:volup').setLabel('🔊 +10').setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId('music:voldown').setLabel('🔉 -10').setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId('music:nowplaying').setLabel('🖼 Now Playing').setStyle(ButtonStyle.Secondary),
);

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Show music controls and commands.');

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle('Music Controls')
    .setDescription(
      [
        '**Basic**: /play, /pause, /resume, /skip, /stop, /shuffle, /repeat, /queue, /volume',
        '**Panels**: buttons below are quick controls.',
        '\u200b',
        '> Note: backend wiring (audio node) is still pending.',
      ].join('\n'),
    );

  await interaction.reply({ embeds: [embed], components: [row1, row2], ephemeral: true });
}

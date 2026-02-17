import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
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

type HelpCategory = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  commands?: { name: string; desc: string }[];
  tips?: string[];
};

const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'overview',
    label: 'Overview',
    emoji: '🪩',
    description: 'Бърз старт и къде са основните неща',
    tips: [
      'Избери категория от менюто, за да видиш командите по роли.',
      'Бутоните по-долу са живи контроли — можеш да ги ползваш без slash команда.',
      'Всичко в /help е **ephemeral** (само ти го виждаш).',
    ],
  },
  {
    id: 'playback',
    label: 'Playback',
    emoji: '▶️',
    description: 'Пускане/спиране и сила на звука',
    commands: [
      { name: '/play <линк/търсене>', desc: 'Пуска или добавя трак/плейлист' },
      { name: '/pause · /resume', desc: 'Пауза и връщане към свиренето' },
      { name: '/skip', desc: 'Прескача текущия трак' },
      { name: '/stop', desc: 'Спира и чисти опашката' },
      { name: '/volume 0-100', desc: 'Нива на звука (бутоните ±10 също работят)' },
    ],
    tips: ['Влез във voice канал преди да стартираш /play.'],
  },
  {
    id: 'queue',
    label: 'Queue & Loop',
    emoji: '🔂',
    description: 'Подреди, разбъркай, върти',
    commands: [
      { name: '/queue', desc: 'Показва текущия трак + следващите' },
      { name: '/repeat off|track|queue', desc: 'Loop режим за трак или опашка' },
      { name: '/shuffle', desc: 'Разбърква опашката' },
      { name: '/autoplay', desc: 'Включва/изключва auto-play' },
    ],
    tips: ['Repeat и Shuffle работят и през бутоните по-долу.'],
  },
  {
    id: 'radio',
    label: 'Radio & Status',
    emoji: '📻',
    description: 'Радио поток и визуализации',
    commands: [
      { name: '/radioon · /radiooff', desc: 'Пускане/спиране на конфигурирания радио стрийм' },
      { name: '/radiostatus', desc: 'Показва текущия радио/плеър статус' },
      { name: '/nowplaying', desc: 'Генерира card с обложка и инфо' },
      { name: '/filters', desc: 'Филтри панел (placeholder, идва скоро)' },
    ],
    tips: ['RADIO_STREAM_URL и AUTOJOIN_VC_ID трябва да са сетнати в .env.'],
  },
  {
    id: 'utility',
    label: 'Utility & Admin',
    emoji: '🛠️',
    description: 'Помощни и модерация',
    commands: [
      { name: '/purgebots [days] [limit] [channel]', desc: 'Чисти бот съобщения (по cut-off дни)' },
      { name: '/ping', desc: 'Латентност ping/pong' },
      { name: '/help', desc: 'Отваря това боогѝ меню' },
    ],
    tips: ['/purgebots изисква Manage Messages и работи само в текстови канали.'],
  },
];

const COLOR = 0xff7b00;

function buildOverviewEmbed(): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(COLOR)
    .setTitle('SteelAI MusicBoT — Help')
    .setDescription('🪩 Избери категорията от менюто, виж командите и натискай бутоните за бърз контрол.');

  embed.addFields(
    {
      name: 'Quick start',
      value: ['1) Влез във voice', '2) /play <линк или търсене>', '3) Ползвай бутоните за live контрол'].join(
        ' · ',
      ),
    },
    {
      name: 'Категории',
      value: HELP_CATEGORIES.filter((c) => c.id !== 'overview')
        .map((c) => `${c.emoji} **${c.label}** — ${c.description}`)
        .join('\n'),
    },
    {
      name: 'Бележки',
      value: [
        'Всички реакции тук са ephemeral (само ти).',
        'Ако аудио backend липсва, ще получиш предупреждение от командите.',
      ].join('\n'),
    },
  );

  return embed;
}

function buildCategoryEmbed(categoryId: string): EmbedBuilder {
  const selected = HELP_CATEGORIES.find((c) => c.id === categoryId) ?? HELP_CATEGORIES[0];
  if (selected.id === 'overview') return buildOverviewEmbed();

  const embed = new EmbedBuilder()
    .setColor(COLOR)
    .setTitle(`${selected.emoji} ${selected.label}`)
    .setDescription(selected.description)
    .setFooter({ text: 'Смени категорията от падащото меню или ползвай бутоните долу.' });

  if (selected.commands?.length) {
    embed.addFields({
      name: 'Команди',
      value: selected.commands.map((c) => `• ${c.name} — ${c.desc}`).join('\n'),
    });
  }

  if (selected.tips?.length) {
    embed.addFields({ name: 'Съвети', value: selected.tips.map((t) => `• ${t}`).join('\n') });
  }

  return embed;
}

function buildComponents(categoryId: string) {
  const select = new StringSelectMenuBuilder()
    .setCustomId('help:categories')
    .setPlaceholder('Избери категория')
    .addOptions(
      HELP_CATEGORIES.map((c) => ({
        label: c.label,
        value: c.id,
        emoji: c.emoji,
        description: c.description,
        default: c.id === categoryId,
      })),
    );

  const selectRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
  return [selectRow, row1, row2];
}

export function buildHelpResponse(categoryId = 'overview') {
  return {
    embeds: [buildCategoryEmbed(categoryId)],
    components: buildComponents(categoryId),
  };
}

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Help меню с интерактивни контроли и категории.');

export async function execute(interaction: ChatInputCommandInteraction) {
  const payload = buildHelpResponse('overview');
  await interaction.reply({ ...payload, ephemeral: true });
}

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../music/poru.js';

export const data = new SlashCommandBuilder()
  .setName('repeat')
  .setDescription('Set repeat mode')
  .addStringOption((opt) =>
    opt
      .setName('mode')
      .setDescription('Repeat mode')
      .setRequired(true)
      .addChoices(
        { name: 'off', value: 'off' },
        { name: 'track', value: 'track' },
        { name: 'queue', value: 'queue' },
      ),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const player: any = (interaction.client as ExtendedClient).poru?.players.get(interaction.guildId!);
  if (!player) return interaction.reply({ content: 'Няма плеър.', ephemeral: true });
  const mode = interaction.options.getString('mode', true);
  const loop = mode === 'off' ? 'NONE' : mode.toUpperCase();
  player.setLoop(loop);
  await interaction.reply({ content: `Repeat: ${mode}.`, ephemeral: true });
}

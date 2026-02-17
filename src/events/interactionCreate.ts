import { Events, Interaction } from 'discord.js';
import * as ping from '../commands/ping.js';
import * as help from '../commands/help.js';
import * as play from '../commands/play.js';
import * as pause from '../commands/pause.js';
import * as resume from '../commands/resume.js';
import * as skip from '../commands/skip.js';
import * as stop from '../commands/stop.js';
import * as shuffle from '../commands/shuffle.js';
import * as repeat from '../commands/repeat.js';
import * as queue from '../commands/queue.js';
import * as volume from '../commands/volume.js';
import * as autoplay from '../commands/autoplay.js';
import * as filters from '../commands/filters.js';
import * as nowplaying from '../commands/nowplaying.js';
import * as radioon from '../commands/radioon.js';
import * as radiostatus from '../commands/radiostatus.js';
import * as radiooff from '../commands/radiooff.js';
import * as purgebots from '../commands/purgebots.js';
import { logger } from '../lib/logger.js';

const commands = new Map(
  [
    ping,
    help,
    play,
    pause,
    resume,
    skip,
    stop,
    shuffle,
    repeat,
    queue,
    volume,
    autoplay,
    filters,
    nowplaying,
    radioon,
    radiostatus,
    radiooff,
    purgebots,
  ].map((c) => [c.data.name, c]),
);

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction: Interaction) {
  if (interaction.isChatInputCommand()) {
    const command = commands.get(interaction.commandName);
    if (!command) {
      await interaction.reply({ content: 'Unknown command', ephemeral: true });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error({ error }, 'Error executing command');
      const content = 'There was an error while executing this command!';
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content, ephemeral: true });
      } else {
        await interaction.reply({ content, ephemeral: true });
      }
    }
    return;
  }

  if (interaction.isButton()) {
    const id = interaction.customId;
    const chatCommand = id.replace('music:', '');

    if (chatCommand === 'play') {
      await interaction.reply({ content: 'Ползвай /play с текст.', ephemeral: true });
      return;
    }

    if (chatCommand === 'volup' || chatCommand === 'voldown') {
      const player: any = (interaction.client as any).poru?.players.get(interaction.guildId!);
      if (!player) {
        await interaction.reply({ content: 'Няма плеър.', ephemeral: true });
        return;
      }
      const delta = chatCommand === 'volup' ? 10 : -10;
      const next = Math.max(0, Math.min(100, (player.volume || 50) + delta));
      await player.setVolume(next);
      await interaction.reply({ content: `Volume: ${next}%`, ephemeral: true });
      return;
    }

    if (chatCommand === 'nowplaying') {
      const command = commands.get('nowplaying');
      if (!command) return;
      // @ts-ignore
      await command.execute(interaction);
      return;
    }

    const command = commands.get(chatCommand);
    if (!command || typeof command.execute !== 'function') {
      const msg = 'Командата не е налична.';
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: msg, ephemeral: true });
      } else {
        await interaction.reply({ content: msg, ephemeral: true });
      }
      return;
    }
    try {
      // @ts-ignore
      await command.execute(interaction);
    } catch (error) {
      logger.error({ error, id }, 'Error executing button command');
      const msg = 'Грешка при бутона.';
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: msg, ephemeral: true });
      } else {
        await interaction.reply({ content: msg, ephemeral: true });
      }
    }
    return;
  }

  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'help:categories') {
      const selected = interaction.values?.[0] ?? 'overview';
      const payload = help.buildHelpResponse?.(selected) ?? null;
      if (!payload) {
        await interaction.update({ content: 'Help payload недостъпно.', components: [] });
        return;
      }
      await interaction.update(payload);
    }
  }
}

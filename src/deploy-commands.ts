import { REST, Routes } from 'discord.js';
import { config } from './config.js';
import { logger } from './lib/logger.js';
import * as ping from './commands/ping.js';
import * as help from './commands/help.js';
import * as play from './commands/play.js';
import * as pause from './commands/pause.js';
import * as resume from './commands/resume.js';
import * as skip from './commands/skip.js';
import * as stop from './commands/stop.js';
import * as shuffle from './commands/shuffle.js';
import * as repeat from './commands/repeat.js';
import * as queue from './commands/queue.js';
import * as volume from './commands/volume.js';
import * as autoplay from './commands/autoplay.js';
import * as filters from './commands/filters.js';
import * as nowplaying from './commands/nowplaying.js';
import * as radioon from './commands/radioon.js';
import * as radiostatus from './commands/radiostatus.js';
import * as radiooff from './commands/radiooff.js';
import * as purgebots from './commands/purgebots.js';

const commandModules = [
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
];

async function main() {
  const commands = commandModules.map((c) => c.data.toJSON());

  const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);

  try {
    logger.info('Refreshing application (/) commands...');
    if (config.DISCORD_GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, config.DISCORD_GUILD_ID),
        { body: commands },
      );
      logger.info('Successfully reloaded guild (/) commands.');
    } else {
      await rest.put(Routes.applicationCommands(config.DISCORD_CLIENT_ID), { body: commands });
      logger.info('Successfully reloaded global (/) commands.');
    }
  } catch (error) {
    logger.error({ error }, 'Error reloading commands');
  }
}

main();

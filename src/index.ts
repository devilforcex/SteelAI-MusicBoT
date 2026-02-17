import { Collection } from 'discord.js';
import { createClient } from './client.js';
import { config } from './config.js';
import * as ping from './commands/ping.js';
import * as ready from './events/ready.js';
import * as interactionCreate from './events/interactionCreate.js';
import { logger } from './lib/logger.js';
import { createPoru } from './music/poru.js';

const client = createClient();

const commands = new Collection();
commands.set(ping.data.name, ping);

createPoru(client);

client.once(ready.name, (...args) => ready.execute(...args));
client.on(interactionCreate.name, (...args) => interactionCreate.execute(...args));
// @ts-ignore
client.on('raw', (d) => (client as any).poru?.packetUpdate(d));

client.login(config.DISCORD_TOKEN).catch((error) => {
  logger.error({ error }, 'Failed to login');
  process.exit(1);
});

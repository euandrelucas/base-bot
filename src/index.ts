import config from "./config.js";
import ClientBuilder from "./builders/client.js"
import BotlistUpdater from "./internal/botlists.js";
import API from "./internal/api.js";
const client = new ClientBuilder(config.client.token, {
    allowedMentions: {
        repliedUser: false,
        everyone: false,
        roles: false,
        users: true
    },
    gateway: {
        intents: ['ALL'],
        compress: true
    },
});

process.on('uncaughtException', (err) => client.logger.error(`[ERROR] (uncaughtException) ${err}`));
process.on('unhandledRejection', (err) => client.logger.error(`[ERROR] (unhandledRejection) ${err}`));

client.connect().then(async () => {
    await client.restMode(true);
    await client.loadEvents();
    await client.loadCommands();
    if (config.botlists.enabled) {
        const botlistUpdater = new BotlistUpdater(client);
        botlistUpdater.start();
    }
    if (config.metrics.enabled) {
        const api = new API(client);
        api.start();
    }
});
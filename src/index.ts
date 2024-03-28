import config from "./config.js";
import ClientBuilder from "./builders/client.js"
const client = new ClientBuilder(config.client.token, {
    allowedMentions: {
        repliedUser: false,
        everyone: false,
        roles: false,
        users: true
    },
    gateway: {
        intents: ['ALL'],
    },
});

client.connect().then(async () => {
    await client.restMode(true);
    await client.loadEvents();
    await client.loadCommands();
});
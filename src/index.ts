import 'dotenv/config';
import config from "./config.js";
import ClientBuilder from "./builders/client.js"
const client = new ClientBuilder(config.client.token);

client.connect().then(async () => {
    await client.loadEvents();
});
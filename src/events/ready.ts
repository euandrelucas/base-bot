import EventBuilder from "../builders/event.js";
import { Client } from "oceanic.js";
export default new EventBuilder({
    name: "ready",
    once: true,
    run: async (client: Client) => {
        console.log(`Logged in as ${client.user.tag}`);
    }
})
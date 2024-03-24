import EventBuilder from "../builders/event.js";
import ClientBuilder from "../builders/client.js";
export default new EventBuilder({
    name: "ready",
    once: true,
    run: async (client: ClientBuilder) => {
        client.logger.info(`[CLIENT] Logado em ${client.user.tag}`);
    }
})
import EventBuilder from "../builders/event.js";
import ClientBuilder from "../builders/client.js";
import CommandContext from "../structures/commandContext.js";
import { Message } from "oceanic.js";
export default new EventBuilder({
    name: "messageCreate",
    once: false,
    run: async (client: ClientBuilder, message: Message) => {
        const prefixes = client.config.commands.prefixes;
        if (!client.config.commands.prefixCommands.enabled) return;
        if (message.author.bot) return;
        if (!prefixes.some(prefix => message.content.startsWith(prefix))) return;
        const prefix = prefixes.find(prefix => message.content.startsWith(prefix));
        const args = message.content.slice(prefix?.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName) return;
        const command = await client.searchCommand(commandName);
        if (!command) return;
        const ctx = new CommandContext({
            name: command.name,
            description: command.description,
            message: message,
            client: client
        })
        command.run(ctx)
    }
})
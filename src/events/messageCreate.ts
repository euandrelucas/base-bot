import EventBuilder from "../builders/event.js";
import ClientBuilder from "../builders/client.js";
import CommandContext from "../structures/commandContext.js";
import { Message, ChannelTypes, ApplicationCommandOptionTypes } from "oceanic.js";
export default new EventBuilder({
    name: "messageCreate",
    once: false,
    run: async (client: ClientBuilder, message: Message) => {
        client.metrics.messagesReceived++;
        const prefixes = client.config.commands.prefixes;
        if (message.channel?.type !== ChannelTypes.GUILD_TEXT && message.channel?.type !== ChannelTypes.GUILD_ANNOUNCEMENT) return;
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
            client: client,
            args: []
        })
        if (!command.enabled) return ctx.reply(`:x: ${message.author.mention} **|** Este comando está desativado.`)
        if (command.developer && !client.config.client.developers.includes(message.author.id)) return ctx.reply(`:x: ${message.author.mention} **|** Este comando é restrito para desenvolvedores.`)
        if (command.nsfw && !message.channel?.nsfw && !ctx.client.config.client.bypassNsfw.includes(message.author.id)) return ctx.reply(`:x: ${message.author.mention} **|** Este comando só pode ser executado em canais NSFW.`)
        if (command.options) {
            const options = command.options;
            const args = message.content.slice(prefix?.length).trim().split(/ +/);
            args.shift();
            const argumentos = [];
            const requeridos = options.filter(option => option.required === true);
            for (const option of requeridos) {
                if (option.type === ApplicationCommandOptionTypes.STRING) {
                    if (requeridos.length === 1) {
                        const arg = args.join(" ");
                        if (!arg) return ctx.reply(`:x: ${message.author.mention} **|** O argumento \`${option.name}\` é obrigatório.`)
                        argumentos.push(arg);
                    }
                    if (requeridos.length > 1) {
                        const current = args.find(arg => arg === option.name);
                        if (!current) return ctx.reply(`:x: ${message.author.mention} **|** O argumento \`${option.name}\` é obrigatório.`)
                        argumentos.push(current);
                    }
                }
                if (option.type === ApplicationCommandOptionTypes.USER) {
                    const user = message.mentions.users[0] || await client.users.get(args.shift() as string);
                    if (!user) return ctx.reply(`:x: ${message.author.mention} **|** O argumento \`${option.name}\` é obrigatório.`)
                    argumentos.push(user);
                }
                if (option.type === ApplicationCommandOptionTypes.INTEGER) {
                    const arg = parseInt(args.shift() as string);
                    if (!arg) return ctx.reply(`:x: ${message.author.mention} **|** O argumento \`${option.name}\` é obrigatório.`)
                    argumentos.push(arg.toString());
                }
                if (option.type === ApplicationCommandOptionTypes.CHANNEL) {
                    const channel = message.mentions.channels[0] || await client.getChannel(args.shift() as string);
                    if (!channel) return ctx.reply(`:x: ${message.author.mention} **|** O argumento \`${option.name}\` é obrigatório.`)
                    argumentos.push(channel);
                }
                if (option.type === ApplicationCommandOptionTypes.ROLE) {
                    const role = message.mentions.roles[0] || await client.guilds.get(message.guildID as string)?.roles.get(args.shift() as string);
                    if (!role) return ctx.reply(`:x: ${message.author.mention} **|** O argumento \`${option.name}\` é obrigatório.`)
                    argumentos.push(role);
                }
            }
            ctx.args = argumentos as any;
        }
        client.metrics.messageCommandsExecuted++;
        return command.run(ctx)
    }
})
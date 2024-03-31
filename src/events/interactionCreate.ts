import EventBuilder from "../builders/event.js";
import ClientBuilder from "../builders/client.js";
import CommandContext from "../structures/commandContext.js";
import { Interaction, ChannelTypes, ApplicationCommandOptionTypes } from "oceanic.js";
export default new EventBuilder({
    name: "interactionCreate",
    once: false,
    run: async (client: ClientBuilder, interaction: Interaction) => {
        if (interaction.isCommandInteraction()) {
            if (interaction.channel?.type !== ChannelTypes.GUILD_TEXT && interaction.channel?.type !== ChannelTypes.GUILD_ANNOUNCEMENT) return;
            const command = await client.searchCommand(interaction.data.name);
            if (!command) return;
            const ctx = new CommandContext({
                name: command.name,
                description: command.description,
                message: interaction,
                client: client,
                args: []
            })
            if (!command.enabled) return ctx.reply(`:x: ${interaction.user.mention} **|** Este comando está desativado.`)
            if (command.nsfw && !interaction.channel?.type && !ctx.client.config.client.bypassNsfw.includes(interaction.user.id)) return ctx.reply(`:x: ${interaction.user.mention} **|** Este comando só pode ser executado em canais NSFW.`)
            if (command.options) {
                const data = interaction.data.options.raw;
                const options = command.options;
                const filtered = options.filter(option => option.type !== ApplicationCommandOptionTypes.SUB_COMMAND && option.type !== ApplicationCommandOptionTypes.SUB_COMMAND_GROUP);
                const args = filtered.map(option => option.value);
                for (const option of data) {
                    if (option.type === ApplicationCommandOptionTypes.STRING) {
                        const arg = args.shift();
                        if (!arg) return ctx.reply(`:x: ${message.author.mention} **|** O argumento \`${option.name}\` é obrigatório.`)
                        argumentos.push(arg.toString());
                    }
                }
            }
            return command.run(ctx)
        }
    }
})
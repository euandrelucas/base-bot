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
            if (command.developer && !client.config.client.developers.includes(interaction.user.id)) return ctx.reply(`:x: ${interaction.user.mention} **|** Este comando é restrito para desenvolvedores.`)
            if (command.nsfw && !interaction.channel?.type && !ctx.client.config.client.bypassNsfw.includes(interaction.user.id)) return ctx.reply(`:x: ${interaction.user.mention} **|** Este comando só pode ser executado em canais NSFW.`)
            if (command.options) {
                const argumentos = []
                const filtered = command.options.filter(option => option.required === true);
                const data = interaction.data.options.raw;
                if (data.length < filtered.length) return ctx.reply(`:x: ${interaction.user.mention} **|** Você não forneceu todos os argumentos necessários.`)
                if (data.length > filtered.length) return ctx.reply(`:x: ${interaction.user.mention} **|** Você forneceu argumentos demais.`)
                for (const option of filtered) {
                    const current = data.find((optionData: any) => optionData.name === option.name);
                    if (!current) return ctx.reply(`:x: ${interaction.user.mention} **|** O argumento \`${option.name}\` é obrigatório.`)
                    if (current.type === ApplicationCommandOptionTypes.STRING) {
                        if (!current.value) return ctx.reply(`:x: ${interaction.user.mention} **|** O argumento \`${option.name}\` é obrigatório.`)
                        argumentos.push(current.value);
                    }
                    if (current.type === ApplicationCommandOptionTypes.USER) {
                        const user = await client.users.get(current.value as string);
                        if (!user) return ctx.reply(`:x: ${interaction.user.mention} **|** O argumento \`${option.name}\` é obrigatório.`)
                        argumentos.push(user);
                    }
                    if (current.type === ApplicationCommandOptionTypes.INTEGER) {
                        if (!current.value) return ctx.reply(`:x: ${interaction.user.mention} **|** O argumento \`${option.name}\` é obrigatório.`)
                        argumentos.push(current.value);
                    }
                    if (current.type === ApplicationCommandOptionTypes.CHANNEL) {
                        const channel = await client.getChannel(current.value as string);
                        if (!channel) return ctx.reply(`:x: ${interaction.user.mention} **|** O argumento \`${option.name}\` é obrigatório.`)
                        argumentos.push(channel);
                    }
                    if (current.type === ApplicationCommandOptionTypes.ROLE) {
                        const role = await client.guilds.get(interaction.guildID as string)?.roles.get(current.value as string);
                        if (!role) return ctx.reply(`:x: ${interaction.user.mention} **|** O argumento \`${option.name}\` é obrigatório.`)
                        argumentos.push(role);
                    }
                }
                ctx.args = argumentos as any;
            }
            client.metrics.interactionCommandsExecuted++;
            return command.run(ctx)
        }
    }
})
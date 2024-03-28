import EventBuilder from "../builders/event.js";
import ClientBuilder from "../builders/client.js";
import CommandContext from "../structures/commandContext.js";
import { Interaction, ChannelTypes } from "oceanic.js";
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
                client: client
            })
            if (!command.enabled) return ctx.reply(`:x: ${interaction.user.mention} **|** Este comando está desativado.`)
            if (command.nsfw && !interaction.channel?.type && !ctx.client.config.client.bypassNsfw.includes(interaction.user.id)) return ctx.reply(`:x: ${interaction.user.mention} **|** Este comando só pode ser executado em canais NSFW.`)
            return command.run(ctx)
        }
    }
})
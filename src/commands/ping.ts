import CommandBuilder from "../builders/command.js";
import CommandContext from "../structures/commandContext.js";
export default new CommandBuilder({
    name: "ping",
    description: "Ping command",
    aliases: ["pong"],
    run: async (ctx: CommandContext) => {
        const embed = new ctx.client.embed();
        embed.setTitle("Pong!")
        embed.setDescription(`Latência: ${(await ctx.client.rest.getGateway()).url}ms`)
        await ctx.reply('', {
            embeds: [embed.build()]
        })
    }
})
import CommandBuilder from "../builders/command.js";
import CommandContext from "../structures/commandContext.js";
export default new CommandBuilder({
    name: "ping",
    description: "Ping command",
    aliases: ["pong"],
    run: async (ctx: CommandContext) => {
        await ctx.reply("Pong!")
    }
})
import CommandBuilder from "../../builders/command.js";
import CommandContext from "../../structures/commandContext.js";
export default new CommandBuilder({
    name: "nsfw",
    description: "NSFW Command",
    aliases: ["+18", "proibido"],
    nsfw: true,
    enabled: true,
    run: async (ctx: CommandContext) => {
        const embed = new ctx.client.embed();
        embed.setTitle('NSFW')
        embed.setDescription('Este é um comando NSFW!')
        embed.setColor('random')
        ctx.reply('', {
            embeds: [embed.build()]
        })
    }
})
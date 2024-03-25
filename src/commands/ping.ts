import CommandBuilder from "../builders/command.js";
import CommandContext from "../structures/commandContext.js";
import { Message } from "oceanic.js";
export default new CommandBuilder({
    name: "ping",
    description: "Ping command",
    aliases: ["pong"],
    enabled: false,
    run: async (ctx: CommandContext) => {
        const embed = new ctx.client.embed();
        embed.setTitle("Pong!")
        embed.setDescription(`Calculando a latência...`)
        embed.setThumbnail(ctx.client.user.avatarURL())
        embed.setColor('RANDOM')
        await ctx.reply('', {
            embeds: [embed.build()]
        }).then(async (msg) => {
            if (msg instanceof Message) {
                const messageLatency = msg.createdAt.getTime() - ctx.message.createdAt.getTime();
                const apiLatency = ctx.client.shards.get(0)?.latency;
                embed.setDescription(`Ping da API: **${apiLatency}ms**\nPing de mensagem: **${messageLatency}ms**`)
                await msg.edit({
                    embeds: [embed.build()]
                })
            }
        })
    }
})
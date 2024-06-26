import CommandBuilder from "../../builders/command.js";
import CommandContext from "../../structures/commandContext.js";
import { ApplicationCommandOptionTypes } from "oceanic.js";
export default new CommandBuilder({
    name: "ping",
    description: "Ping command",
    aliases: ["pong"],
    enabled: true,
    category: 'bot',
    run: async (ctx: CommandContext) => {
        const embed = new ctx.client.embed();
        embed.setTitle("Pong!")
        embed.setDescription(`Calculando a latência...`)
        embed.setThumbnail(ctx.client.user.avatarURL())
        embed.setColor('RANDOM')
        await ctx.reply('', {
            embeds: [embed.build()]
        }).then(async (msg) => {
            if (msg !== undefined) {
                const messageLatency = msg.createdAt.getTime() - ctx.message.createdAt.getTime();
                const apiLatency = ctx.client.shards.get(0)?.latency;
                embed.setDescription(`Ping da API: **${apiLatency}ms**\nPing de mensagem: **${messageLatency}ms**\nUso de RAM: **${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)}MB**`)
                return ctx.edit(msg, '', {
                    embeds: [embed.build()]
                })
            }
        })
    }
})
import CommandBuilder from "../../builders/command.js";
import CommandContext from "../../structures/commandContext.js";
import { ApplicationCommandOptionTypes } from "oceanic.js";
import { inspect } from 'node:util'
export default new CommandBuilder({
    name: "eval",
    description: "Eval command",
    aliases: ["ev", "evaluate"],
    enabled: true,
    options: [
        {
            name: "code",
            description: "Code to eval",
            type: ApplicationCommandOptionTypes.STRING,
            required: true
        }
    ],
    developer: true,
    category: 'developer',
    run: async (ctx: CommandContext) => {
        const createBlockCode = (code: string, lang: string) => {
            return `\`\`\`${lang}\n${code}\`\`\``
        }
        const code = ctx.args[0] as string;
        try {
            let evaled = eval(code)
            const type = typeof evaled;
            if (evaled === null) evaled = "null";
            if (evaled === undefined) evaled = "undefined";
            if (typeof evaled !== "string") evaled = inspect(evaled);
            if (evaled.length > 1000 && evaled.length < 6000) {
                const splitted = evaled.match(/[\s\S]{1,1000}/g);
                const embed = new ctx.client.embed();
                embed.setTitle("Eval")
                embed.setDescription(`Type: ${type}`)
                embed.addField("Input", createBlockCode(code, "js"))
                for (let i = 0; i < splitted.length; i++) {
                    embed.addField(`Output ${i + 1}`, createBlockCode(splitted[i], "js"))
                }
                embed.setColor('blue')
                return ctx.reply('', {
                    embeds: [embed.build()]
                })
            
            } else if (evaled.length > 6000) {
                evaled = evaled.slice(0, 5000);
                const embed = new ctx.client.embed();
                embed.setTitle("Eval")
                embed.setDescription(`Type: ${type}`)
                embed.addField("Input", createBlockCode(code, "js"))
                const splitted = evaled.match(/[\s\S]{1,1000}/g);
                for (let i = 0; i < splitted.length; i++) {
                    embed.addField(`Output ${i + 1}`, createBlockCode(splitted[i], "js"))
                }
                embed.setColor('red')
                return ctx.reply('', {
                    embeds: [embed.build()]
                })
            } else {
                const embed = new ctx.client.embed();
                embed.setTitle("Eval")
                embed.setDescription(`Type: ${type}`)
                embed.addField("Input", createBlockCode(code, "js"))
                embed.addField("Output", createBlockCode(inspect(evaled), "js"))
                embed.setColor('blue')
                return ctx.reply('', {
                    embeds: [embed.build()]
                })
            }
        } catch (err) {
            const embed = new ctx.client.embed();
            embed.setTitle("Eval")
            embed.setDescription(`Type: Error`)
            embed.addField("Input", createBlockCode(code, "js"))
            embed.addField("Output", createBlockCode(String(err), "js"))
            embed.setColor('red')
            return ctx.reply('', {
                embeds: [embed.build()]
            })
        }
    }
})
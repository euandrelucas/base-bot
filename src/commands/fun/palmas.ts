import CommandBuilder from "../../builders/command.js";
import CommandContext from "../../structures/commandContext.js";
import { ApplicationCommandOptionTypes } from "oceanic.js";
export default new CommandBuilder({
    name: "palmas",
    description: "Altere tudo por palmas",
    aliases: ["clap"],
    enabled: true,
    options: [
        {
            name: "texto",
            description: "Texto para alterar",
            type: ApplicationCommandOptionTypes.STRING,
            required: true
        }
    ],
    category: 'fun',
    run: async (ctx: CommandContext) => {
        const text = ctx.args[0] as string;
        const clap = text.split(' ').join(' 👏 ');
        return ctx.reply(clap)
    }
})
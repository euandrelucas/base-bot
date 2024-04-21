import CommandBuilder from "../../builders/command.js";
import config from "../../config.js";
import CommandContext from "../../structures/commandContext.js";
import { ApplicationCommandOptionTypes } from "oceanic.js";
export default new CommandBuilder({
    name: "help",
    description: "Comando para ver os comandos do bot",
    aliases: ["ajuda", "commands"],
    enabled: true,
    options: [
        {
            name: "comando",
            description: "O comando que você deseja ver as informações",
            type: ApplicationCommandOptionTypes.STRING,
            required: false
        }
    ],
    category: 'bot',
    run: async (ctx: CommandContext) => {
        const commandName = ctx.args[0] as string;
        if (commandName === null) {
            const commands = await ctx.client.getAllCommands();
            const embed = new ctx.client.embed();
            embed.setTitle('Comandos')
            embed.setDescription(`Comandos do bot`)
            embed.setThumbnail(ctx.client.user.avatarURL())
            const categories = commands.map(c => c.category).filter((value, index, self) => self.indexOf(value) === index);
            for (const category of categories) {
                if (category === 'developer') continue;
                const cmds = commands.filter(c => c.category === category);
                const categoryInfo = config.commands.categories.find(c => c.name === category);
                embed.addField(`${categoryInfo?.emoji} » ${categoryInfo?.label}`, cmds.map(c => c.name).join(', '))
            }
            embed.setColor('RANDOM')
            embed.setFooter('Utilize /help <comando> para ver informações de um comando específico', ctx.client.user.avatarURL())
            ctx.reply('', {
                embeds: [embed.build()]
            })
        } else {
            const command = await ctx.client.searchCommand(commandName);
            if (!command) return ctx.reply(`:x: **|** Comando não encontrado.`)
            const embed = new ctx.client.embed();
            embed.setTitle('Informações do comando')
            embed.setDescription(`Informações de ${command.name}`)
            embed.setThumbnail(ctx.client.user.avatarURL())
            embed.addField('Nome', command.name, true)
            embed.addField('Descrição', command.description, true)
            embed.addField('Ativado?', command.enabled ? 'Sim' : 'Não', true)
            embed.addField('Opções', command.options?.map(o => `${o.name} (${o.type})`).join(', ') || 'Nenhuma', true)
            embed.setColor('RANDOM')
            ctx.reply('', {
                embeds: [embed.build()]
            })
        }
    }
})
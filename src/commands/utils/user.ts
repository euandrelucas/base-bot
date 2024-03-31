import CommandBuilder from "../../builders/command.js";
import CommandContext from "../../structures/commandContext.js";
import { ApplicationCommandOptionTypes, User } from "oceanic.js";
export default new CommandBuilder({
    name: "user",
    description: "Comando para ver informações de um usuário",
    aliases: ["userinfo", "whois"],
    enabled: true,
    options: [
        {
            name: "user",
            description: "O usuário que você deseja ver as informações",
            type: ApplicationCommandOptionTypes.USER,
            required: true
        }
    ],
    run: async (ctx: CommandContext) => {
        const user = ctx.args[0] as User;
        const embed = new ctx.client.embed();
        embed.setTitle('Informações do usuário')
        embed.setDescription(`Informações de ${user.mention}`)
        embed.setThumbnail(user.avatarURL())
        embed.addField('ID', user.id, true)
        embed.addField('Bot?', user.bot ? 'Sim' : 'Não', true)
        embed.addField('Criado em', user.createdAt.toDateString(), true)
        embed.setImage(user.bannerURL() || '')
        embed.setColor('RANDOM')
        ctx.reply('', {
            embeds: [embed.build()]
        })
    }
})
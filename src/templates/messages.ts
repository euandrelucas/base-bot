import EmbedBuilder from "../builders/embed.js";
import ClientBuilder from "../builders/client.js";

export const messages = {
    MENTION_BOT: (client: ClientBuilder, user: string, prefix: string) => {
        const embed = new EmbedBuilder()
        embed.setTitle("Olá!")
        embed.setDescription(`Olá, <@${user}> Meu prefixo é \`${prefix}\`, se precisar de ajuda, use \`${prefix}ajuda\``)
        embed.setColor('RANDOM')
        embed.setThumbnail(client.user.avatarURL())
        return embed.build()
    }
}
import { Message, Interaction, CreateMessageOptions } from "oceanic.js";
import ClientBuilder from "../builders/client.js";
interface ContextOptions {
    name: string;
    description: string;
    message: Message | Interaction;
    client: ClientBuilder;
}

export default class CommandContext {
    name: string;
    description: string;
    message: Message | Interaction;
    client: ClientBuilder;

    constructor(data: ContextOptions) {
        this.name = data.name
        this.description = data.description
        this.message = data.message
        this.client = data.client
    }

    async reply(content: string, options?: CreateMessageOptions) {
        if (this.message instanceof Message) {
            const conteudo = content !== null ? content : undefined
            return this.message.channel?.createMessage({
                messageReference: {
                    channelID: this.message.channel?.id,
                    guildID: this.message.guild?.id,
                    messageID: this.message.id,
                    failIfNotExists: false
                },
                content: conteudo,
                ...options
            })
        } else if (this.message instanceof Interaction) {
            if (this.message.isCommandInteraction()) {
                return this.message.reply({
                    content: content,
                    ...options
                })
            }
        }
    }

    async send(content: string, options?: CreateMessageOptions) {
        if (this.message instanceof Message) {
            return this.message.channel?.createMessage({
                content: content,
                ...options
            })
        } else if (this.message instanceof Interaction) {
            if (this.message.isCommandInteraction()) {
                return this.message.reply({
                    content: content,
                    ...options
                })
            }
        }
    }
}
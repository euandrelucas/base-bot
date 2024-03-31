import { Message, Interaction, CreateMessageOptions, User, AnyChannel, Role } from "oceanic.js";
import ClientBuilder from "../builders/client.js";
interface ContextOptions {
    name: string;
    description: string;
    message: Message | Interaction;
    args: User[] | number[] | AnyChannel[] | Role[] | string[];
    client: ClientBuilder;
}

export default class CommandContext {
    name: string;
    description: string;
    message: Message | Interaction;
    client: ClientBuilder;
    args: User[] | number[] | AnyChannel[] | Role[] | string[];

    constructor(data: ContextOptions) {
        this.name = data.name
        this.description = data.description
        this.message = data.message
        this.client = data.client
        this.args = data.args || []
    }

    async reply(content: string, options?: CreateMessageOptions): Promise<Message | undefined> {
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
            }) as Promise<Message>
        } else if (this.message instanceof Interaction) {
            if (this.message.isCommandInteraction()) {
                const reply = await this.message.reply({
                    content: content,
                    ...options
                })
                return reply.getMessage() as Promise<Message>
            }
        } else if (this === undefined) {
            throw new Error("Context is undefined")
        }
    }

    async send(content: string, options?: CreateMessageOptions): Promise<Message | undefined> {
        if (this.message instanceof Message) {
            return this.message.channel?.createMessage({
                content: content,
                ...options
            }) as Promise<Message>
        } else if (this.message instanceof Interaction) {
            if (this.message.isCommandInteraction()) {
                const reply = await this.message.reply({
                    content: content,
                    ...options
                })
                return reply.getMessage() as Promise<Message>
            }
        } else if (this === undefined) {
            throw new Error("Context is undefined")
        }
    }

    async edit(message: Message | Interaction, content: string, options?: CreateMessageOptions) {
        if (message instanceof Message) {
            return message.edit({
                content: content,
                ...options
            })
        } else if (message instanceof Interaction) {
            if (message.isCommandInteraction()) {
                return message.editOriginal({
                    content: content,
                    ...options
                })
            }
        }
    }
}
import { Client, Collection, ClientOptions, CreateApplicationCommandOptions } from "oceanic.js"
import axios, { AxiosRequestConfig } from "axios"
import logger from "../structures/logger.js"
import CommandBuilder from "./command.js"
import EmbedBuilder from "./embed.js"
import config from "../config.js"
import path from "node:path"
import fs from "node:fs"
import didyoumean from "didyoumean"
const { get, post } = axios;

export default class ClientBuilder extends Client {
    commands = new Collection()
    aliases = new Collection()
    events = new Collection()
    embed = EmbedBuilder
    logger = logger
    config = config
    metrics = {
        messageCommandsExecuted: 0,
        interactionCommandsExecuted: 0,
        messagesReceived: 0,
        messagesSent: 0,
        messagesDeleted: 0,
        messagesEdited: 0,
        interactionsReceived: 0,
        errors: 0
    }

    constructor(token: string, options?: ClientOptions) {
        super({
            auth: "Bot " + token,
            ...options
        });
    }

    async loadCommands() {
        const commandFiles = fs.readdirSync('./dist/commands').filter(file => file.endsWith(".js"))
        const subFolders = fs.readdirSync('./dist/commands').filter(file => fs.statSync(path.join('./dist/commands', file)).isDirectory())
        for (const folder of subFolders) {
            const startDate = new Date()
            const subCommandFiles = fs.readdirSync(`./dist/commands/${folder}`).filter(file => file.endsWith(".js"))
            for (const file of subCommandFiles) {
                const command = await import(`../commands/${folder}/${file}`)
                this.commands.set(command.default.name, command.default)
                command.default.aliases.forEach((alias: string) => {
                    this.aliases.set(alias, command.default.name)
                })
                const endDate = new Date()
                const time = endDate.getTime() - startDate.getTime()
                this.logger.info(`[COMANDOS] Comando ${command.default.name} carregado! ~ ${time}ms`)
            }
        }
        for (const file of commandFiles) {
            const startDate = new Date()
            const command = await import('../commands/' + file)
            this.commands.set(command.default.name, command.default)
            command.default.aliases.forEach((alias: string) => {
                this.aliases.set(alias, command.default.name)
            })
            const endDate = new Date()
            const time = endDate.getTime() - startDate.getTime()
            this.logger.info(`[COMANDOS] Comando ${command.default.name} carregado! ~ ${time}ms`)
        }
        if (config.commands.slashCommands.enabled) {
            const commands: CommandBuilder[] = this.commands.map((command: any) => command.toJSON())
            const slashCommands: CreateApplicationCommandOptions[] = commands.map((command: CommandBuilder) => {
                return {
                    name: command.name,
                    description: command.description,
                    options: command.options || [],
                    type: 1,
                    nsfw: command.nsfw,
                }
            })
            await this.application.bulkEditGlobalCommands(slashCommands)
            this.logger.info(`[COMANDOS] Comandos de slash carregados!`)
        }
    }

    async loadEvents() {
        const eventFiles = fs.readdirSync('./dist/events').filter(file => file.endsWith(".js"))
        for (const file of eventFiles) {
            const startDate = new Date()
            const event = await import('../events/' + file)
            this[event.default.once ? "once" : "on"](event.default.name, event.default.run.bind(null, this))
            const endDate = new Date()
            const time = endDate.getTime() - startDate.getTime()
            this.logger.info(`[EVENTOS] Evento ${event.default.name} carregado! ~ ${time}ms`)
        }
    }

    async searchCommand(name: string) {
        const command = this.commands.get(name) as CommandBuilder || this.commands.get(this.aliases.get(name)) as CommandBuilder
        if (!command) {
            const commands = this.commands.map((command: any) => command.name);
            const suggestion = didyoumean(name, commands)
            if (suggestion) {
                return this.commands.get(suggestion) as CommandBuilder
            } else if (!suggestion) {
                const aliases = this.commands.map((command: any) => command.aliases).flat();
                const aliasSuggestion = didyoumean(name, aliases)
                if (aliasSuggestion) {
                    return this.commands.find((command: any) => command.aliases.includes(aliasSuggestion)) as CommandBuilder
                }
            }
        } else if (command) {
            return command
        }
    }

    async get(url: string, options?: AxiosRequestConfig) {
        return get(url, options)
    }

    async post(url: string, data: any, options?: AxiosRequestConfig) {
        return post(url, data, options)
    }

    async getAllCommands() {
        return this.commands as Collection<string, CommandBuilder>
    }
}
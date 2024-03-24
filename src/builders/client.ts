import { Client, Collection, ClientOptions } from "oceanic.js"
import CommandBuilder from "./command.js"
import logger from "../structures/logger.js"
import EmbedBuilder from "./embed.js"
import config from "../config.js"
import path from "node:path"
import fs from "node:fs"

export default class ClientBuilder extends Client {
    commands = new Collection()
    aliases = new Collection()
    events = new Collection()
    embed = EmbedBuilder
    logger = logger
    config = config

    constructor(token: string, options: ClientOptions) {
        super({
            auth: "Bot " + token,
            ...options
        });
    }

    async loadCommands() {
        const commandFiles = fs.readdirSync('./dist/commands').filter(file => file.endsWith(".js"))
        for (const file of commandFiles) {
            const command = await import('../commands/' + file)
            this.commands.set(command.default.name, command.default)
            command.default.aliases.forEach((alias: string) => {
                this.aliases.set(alias, command.default.name)
            })
        }
    }

    async loadEvents() {
        const eventFiles = fs.readdirSync('./dist/events').filter(file => file.endsWith(".js"))
        for (const file of eventFiles) {
            const event = await import('../events/' + file)
            this[event.default.once ? "once" : "on"](event.default.name, event.default.run.bind(null, this))
        }
    }

    async searchCommand(name: string) {
        return this.commands.get(name) as CommandBuilder || this.commands.get(this.aliases.get(name)) as CommandBuilder
    }
}
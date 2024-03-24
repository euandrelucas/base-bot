import { Client, Collection } from "oceanic.js"
import path from "node:path"
import fs from "node:fs"

export default class ClientBuilder extends Client {
    commands = new Collection()
    events = new Collection()

    constructor(Token: string) {
        super({
            auth: "Bot " + Token
        })
    }

    async loadCommands() {
        const commandFiles = fs.readdirSync(path.join(__dirname, "../commands")).filter(file => file.endsWith(".js"))

        for (const file of commandFiles) {
            const command = await import(path.join(__dirname, "../commands", file))
            this.commands.set(command.name, command)
        }
    }
    
    async loadEvents() {
        const eventFiles = fs.readdirSync('./dist/events').filter(file => file.endsWith(".js"))

        for (const file of eventFiles) {
            const event = await import('../events/' + file)
            this[event.default.once ? "once" : "on"](event.default.name, event.default.run.bind(null, this))
        }
    }
}
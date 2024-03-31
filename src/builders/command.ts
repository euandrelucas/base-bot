

interface CommandOptionChoice {
    name: string;
    value: string | number;
}

interface CommandOption {
    name: string;
    description: string;
    type: number;
    required?: boolean;
    choices?: CommandOptionChoice[];
}

interface CommandOptions {
  name: string;
  description: string;
  options?: CommandOption[];
  aliases?: string[];
  nsfw?: boolean;
  developer?: boolean;
  enabled?: boolean;
  run: (...args: any) => void;
}

export default class CommandBuilder implements CommandOptions {
    name: string;
    description: string;
    options?: CommandOption[];
    aliases?: string[];
    nsfw?: boolean;
    developer?: boolean;
    enabled?: boolean;
    run: (...args: any) => void;

    constructor(data: CommandOptions) {
        this.name = data.name
        this.description = data.description
        this.options = data.options
        this.aliases = data.aliases
        this.nsfw = data.nsfw
        this.developer = data.developer
        this.enabled = data.enabled
        this.run = data.run
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
            aliases: this.aliases,
            nsfw: this.nsfw,
            developer: this.developer,
            enabled: this.enabled
        }
    }
}
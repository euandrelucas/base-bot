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
}

export default class CommandBuilder implements CommandOptions {
    name: string;
    description: string;
    options?: CommandOption[];

    constructor(data: CommandOptions) {
        this.name = data.name
        this.description = data.description
        this.options = data.options
    }
}
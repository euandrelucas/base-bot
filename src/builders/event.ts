interface EventOptions {
    name: string;
    once?: boolean;
    run: (...args: any) => void;
}

export default class EventBuilder implements EventOptions {
    name: string;
    once?: boolean;
    run: (...args: any) => void;

    constructor(data: EventOptions) {
        this.name = data.name
        this.once = data.once
        this.run = data.run
    }
}
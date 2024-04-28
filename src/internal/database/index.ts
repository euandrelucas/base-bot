import ClientBuilder from "../../builders/client.js";
import User from "./models/user.js";
import Cooldown from "./models/cooldown.js";

export default class Database {
    private client: ClientBuilder;
    user: User;
    cooldown: Cooldown;

    constructor(client: ClientBuilder) {
        this.client = client;
        this.user = new User(this.client);
        this.cooldown = new Cooldown(this.client);
    }
}
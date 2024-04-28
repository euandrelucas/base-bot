import ClientBuilder from "../../builders/client.js";
import User from "./models/user.js";

export default class Database {
    client: ClientBuilder;
    user: User;

    constructor(client: ClientBuilder) {
        this.client = client;
        this.user = new User(this.client);
    }
}
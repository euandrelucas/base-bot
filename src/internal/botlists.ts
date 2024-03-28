import axios from "axios"
import { Client } from "oceanic.js"

interface BotlistOptions {
    token: string;
    botID: string;
    servers: number;
    shards: number;
    userCount: number;
    voiceConnections: number;
    status: string;
    shardID: number;
    shardCount: number;
}

export default class BotlistUpdater {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    async updateTopGG(options: BotlistOptions) {
        const { token, servers, shards, userCount, voiceConnections, status, shardID, shardCount, botID } = options;
        const data = {
            server_count: servers,
            shard_count: shards,
            user_count: userCount,
            voice_connections: voiceConnections,
            status: status,
            shard_id: shardID,
        }
        await this.post(`https://top.gg/api/bots/${botID}/stats`, data, {
            headers: {
                Authorization: token
            }
        })
    }

    async post (url: string, data: any, options: any) {
        return axios.post(url, data, ...options)
    }

    async get (url: string, options: any) {
        return axios.get(url, ...options)
    }

    start() {
        setInterval(() => {
            this.updateTopGG({
                token: "top.gg token",
                botID: "bot id",
                servers: this.client.guilds.size,
                shards: this.client.shards.size,
                userCount: this.client.users.size,
                voiceConnections: this.client.voiceConnections.size,
                status: this.client.status,
                shardID: this.client.shardID,
                shardCount: this.client.shardCount
            })
        }, 1800000)
    }
}
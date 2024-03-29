import axios from "axios"
import ClientBuilder from "../builders/client.js";

interface BotlistOptions {
    token: string;
    botID: string;
    serverCount: number;
    shardCount: number;
    shards: number[];
}

export default class BotlistUpdater {
    client: ClientBuilder;

    constructor(client: ClientBuilder) {
        this.client = client;
    }

    async updateTopGG(options: BotlistOptions) {
        const { token, botID, serverCount, shardCount, shards } = options;
        const data = {
            server_count: serverCount,
            shard_count: shardCount,
            shards: shards
        }
        await this.post(`https://top.gg/api/bots/${botID}/stats`, data, {
            headers: {
                Authorization: token
            }
        }).catch((e) => this.client.logger.error(`[BOTLIST] Erro ao atualizar os status na lista de bots do Top.gg: ${e.message}`))
    }

    async post (url: string, data: any, options: any) {
        return axios.post(url, data, options)
    }

    async get (url: string, options: any) {
        return axios.get(url, options)
    }

    async start() {
        await this.updateTopGG({
            token: this.client.config.botlists.topgg.token,
            botID: this.client.user.id,
            serverCount: this.client.guilds.size,
            shardCount: this.client.shards.size,
            shards: this.client.shards.toArray().map((shard) => shard.id)
        })
        const updateInterval = 30 * 60 * 1000; // 30 minutos em milissegundos
        setInterval(async () => {
            await this.updateTopGG({
                token: this.client.config.botlists.topgg.token,
                botID: this.client.user.id,
                serverCount: this.client.guilds.size,
                shardCount: this.client.shards.size,
                shards: this.client.shards.toArray().map((shard) => shard.id)
            })
        }, updateInterval)
    }
}
import ClientBuilder from "../../../builders/client.js";

export default class Cooldown {
    client: ClientBuilder;

    constructor(client: ClientBuilder) {
        this.client = client;
    }

    async createCooldown(id: string, command: string, expiresAt: number) {
        const seconds = expiresAt * 1000 // Convert seconds to milliseconds
        await this.client.prisma.cooldown.create({
            data: {
                id: id,
                command: command,
                expiresAt: Date.now() + seconds
            }
        })
    }

    async getCooldown(id: string, command: string) {
        return await this.client.prisma.cooldown.findFirst({
            where: {
                id: id,
                command: command
            }
        })
    }

    async deleteCooldown(id: string, command: string) {
        await this.client.prisma.cooldown.delete({
            where: {
                id: id,
                command: command
            }
        })
    }

    async deleteAllCooldowns(id: string) {
        await this.client.prisma.cooldown.deleteMany({
            where: {
                id: id
            }
        })
    }
}
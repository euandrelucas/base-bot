import ClientBuilder from "../../../builders/client.js";

export default class User {
    client: ClientBuilder;

    constructor(client: ClientBuilder) {
        this.client = client;
    }

    async createUser(data: { id: string, commands: number }) {
        await this.client.prisma.user.create({
            data: {
                id: data.id,
                commands: data.commands,
            }
        }).catch((e) => this.client.logger.error(`[DATABASE] Erro ao criar um usuário: ${e.message}`))
    }

    async getUser(id: string) {
        return await this.client.prisma.user.findUnique({
            where: {
                id: id
            }
        }).catch((e) => this.client.logger.error(`[DATABASE] Erro ao buscar um usuário: ${e.message}`))
    }

    async updateUser(id: string, data: { commands: number }) {
        await this.client.prisma.user.update({
            where: {
                id: id
            },
            data: {
                commands: data.commands
            }
        }).catch((e) => this.client.logger.error(`[DATABASE] Erro ao atualizar um usuário: ${e.message}`))
    }

    async deleteUser(id: string) {
        await this.client.prisma.user.delete({
            where: {
                id: id
            }
        }).catch((e) => this.client.logger.error(`[DATABASE] Erro ao deletar um usuário: ${e.message}`))
    }

    async addCommand(id: string) {
        await this.client.prisma.user.update({
            where: {
                id: id
            },
            data: {
                commands: {
                    increment: 1
                }
            }
        }).catch((e) => this.client.logger.error(`[DATABASE] Erro ao adicionar um comando a um usuário: ${e.message}`))
    }

    async getUsers() {
        return this.client.prisma.user.findMany()
    }
}
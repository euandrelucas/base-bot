import ClientBuilder from '../builders/client.js'
import CommandBuilder from '../builders/command.js';
import config from '../config.js'
import Fastify from 'fastify'

export default class API {
    private server: Fastify.FastifyInstance;
    client: ClientBuilder;

    constructor(client: ClientBuilder) {
        this.server = Fastify();
        this.client = client;
    }

    public async start() {
        this.server.listen({ port: config.metrics.port })
        this.client.logger.info(`[METRICS] API rodando em http://localhost:${config.metrics.port}`)
        this.get()
    }

    public async get() {
        this.server.get('/', async (request, reply) => {
            return { hello: 'world' }
        })

        this.server.get('/metrics', async (request, reply) => {
            return this.client.metrics
        })
    }
}
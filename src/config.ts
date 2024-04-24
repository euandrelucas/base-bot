import { Templates } from './templates/index.js'

export default {
   messages: Templates.messages,
   client: {
      id: process.env.ID as string,
      secret: process.env.SECRET as string,
      token: process.env.TOKEN as string,
      bypassNsfw: ['717766639260532826'] as string[],
      developers: ['717766639260532826'] as string[],
      guilds: ['993194961895956521'] as string[],
      mention: true as boolean,
   },
   commands: {
      prefixes: ['!', '?', '%'],
      failMessage: false,
      slashCommands: {
         enabled: true
      },
      prefixCommands: {
         enabled: true
      },
      categories: [
         {
            name: 'fun',
            emoji: '🎉',
            label: 'Diversão',
            description: 'Comandos divertidos'
         },
         {
            name: 'bot',
            emoji: '🤖',
            label: 'Bot',
            description: 'Comandos para o bot'
         },
         {
            name: 'nsfw',
            emoji: '🔞',
            label: 'NSFW',
            description: 'Comandos NSFW'
         },
         {
            name: 'developer',
            emoji: '🛠️',
            label: 'Desenvolvedor',
            description: 'Comandos para desenvolvedores'
         },
         {
            name: 'utility',
            emoji: '🔧',
            label: 'Utilidade',
            description: 'Comandos de utilidade'
         },
         {
            name: 'moderation',
            emoji: '🔨',
            label: 'Moderação',
            description: 'Comandos de moderação'
         },
         {
            name: 'info',
            emoji: '📰',
            label: 'Informações',
            description: 'Comandos de informações'
         }
      ]
   },
   database: {
      enabled: false,
      type: 'mongodb' as 'mongodb' | 'sqlite' | 'mysql' | 'postgres',
      uri: 'mongodb://localhost:27017',
      database: 'oceanic',
      options: {
         useNewUrlParser: true,
         useUnifiedTopology: true
      }
   },
   botlists: {
      enabled: true as boolean,
      topgg: {
         enabled: true,
         token: process.env.TOPGG as string
      }
   },
   metrics: {
      enabled: true as boolean,
      port: 3000 as number
   }
}
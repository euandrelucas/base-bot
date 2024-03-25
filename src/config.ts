export default {
   client: {
      id: process.env.ID as string,
      secret: process.env.SECRET as string,
      token: process.env.TOKEN as string,
      bypassNsfw: ['717766639260532826'] as string[],
      developers: ['717766639260532826'] as string[]
   },
   commands: {
      prefixes: ['!', '?', '%'],
      failMessage: false,
      slashCommands: {
         enabled: true
      },
      prefixCommands: {
         enabled: true
      }
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
   }
}
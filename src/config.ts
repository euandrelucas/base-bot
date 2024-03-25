export default {
   client: {
      id: process.env.ID as string,
      secret: process.env.SECRET as string,
      token: process.env.TOKEN as string,
      bypassNsfw: [] as string[]
   },
   commands: {
      prefixes: ['!', '?', '%'],
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
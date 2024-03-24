export default {
   client: {
      id: 'your-client-id',
      secret: 'your-client-secret',
      token: process.env.TOKEN as string
   },
   commands: {
      prefixes: ['!', '?', '%'],
      slashCommands: {
         enabled: true
      },
      prefixCommands: {
         enabled: true
      }
   }
}
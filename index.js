require('dotenv').config();

const {
  Client,
  GatewayIntentBits
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

require('./xpSystem')(client);
require('./stickyMessages')(client);
console.log('Sticky system loaded');

require('./scamTickets')(client);
console.log('Scam ticket system loaded');
require('./promoteServices')(client);
console.log('Marketplace system loaded');
require('./jobs')(client);
console.log('Jobs system loaded');
require('./roles')(client);
console.log('Roles embed loaded');
require('./serverguide')(client);
console.log('Server guide loaded');
client.login(process.env.TOKEN);
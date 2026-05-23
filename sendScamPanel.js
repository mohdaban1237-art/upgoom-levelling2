require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  ChannelType
} = require('discord.js');




const userTickets = {};
const ticketLogs = {};

const client = new Client({


intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers
]


});

client.once('ready', async () => {

  console.log(`${client.user.tag} ready`);

  // REPORT CHANNEL ID
  const channel =
    await client.channels.fetch('1427252951059005469');

  const embed = new EmbedBuilder()

    .setColor('#ff3d3d')

    .setTitle('🚨 Scam Reporting System')

    .setDescription(
`
Before creating a report:

• Make sure you have valid proof
• Fake reports may result in punishment
• Upload screenshots/videos/payment proofs
• Support team will review your case

Click the button below to create a private scam report ticket.
`
    )

    .setFooter({
      text: 'UpGoom Protection System'
    });

  const row = new ActionRowBuilder()

    .addComponents(

      new ButtonBuilder()

        .setCustomId('create_scam_ticket')

        .setLabel('Create Report Ticket')

        .setEmoji('🚨')

        .setStyle(ButtonStyle.Danger)

    );

  await channel.send({

    embeds: [embed],

    components: [row]

  });

  console.log('Scam panel sent');

});

client.on('interactionCreate', async (interaction) => {

  if (!interaction.isButton()) return;

  if (interaction.customId !== 'create_scam_ticket') return;
  await interaction.deferReply({
  ephemeral: true
});

  const userId = interaction.user.id;

  // MONTH LIMIT
  if (!userTickets[userId]) {
    userTickets[userId] = [];
  }

  // REMOVE OLD 30 DAY ENTRIES
  userTickets[userId] =
    userTickets[userId].filter(
      t => Date.now() - t < 30 * 24 * 60 * 60 * 1000
    );

  if (userTickets[userId].length >= 5) {

    return interaction.editReply({
      content:
'⚠️ You already created 5 report tickets this month.',
    });

  }

  userTickets[userId].push(Date.now());

  // CREATE CHANNEL
  const channel = await interaction.guild.channels.create({

    name:
`report-${interaction.user.username}`,

    type: ChannelType.GuildText,

    permissionOverwrites: [

      {
        id: interaction.guild.id,
        deny: [
          PermissionsBitField.Flags.ViewChannel
        ]
      },

      {
        id: interaction.user.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.AttachFiles,
          PermissionsBitField.Flags.ReadMessageHistory
        ]
      }

    ]

  });

  ticketLogs[channel.id] = [];

  await interaction.editReply({

    content:
`✅ Your report ticket has been created: ${channel}`

  });

  await channel.send({

    content:
`🚨 ${interaction.user}

Please explain the full situation clearly.

Upload:
• screenshots
• payment proof
• videos
• usernames
• transaction details

⏳ Ticket closes automatically in 30 minutes.`

  });

  // AUTO CLOSE
  setTimeout(async () => {

    try {

      const logs =
        ticketLogs[channel.id] || [];

      console.log(logs);

      await channel.send(
'🔒 Ticket closed automatically after 30 minutes.'
      );

      await channel.delete();

    } catch (err) {

      console.log(err);

    }

  }, 30 * 60 * 1000);

});

client.on('messageCreate', async (message) => {

  if (message.author.bot) return;

  if (
    !message.channel.name.startsWith('report-')
  ) return;

  if (!ticketLogs[message.channel.id]) {
    ticketLogs[message.channel.id] = [];
  }

  ticketLogs[message.channel.id].push({

    author: message.author.tag,

    content: message.content,

    attachments:
      message.attachments.map(a => a.url)

  });

});

client.login(process.env.TOKEN);
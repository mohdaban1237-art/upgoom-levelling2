const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField
} = require('discord.js');

module.exports = (client) => {

  // =========================
  // CONFIG
  // =========================

  const SUPPORT_ROLE_ID = '1427252949884731486';

  const TICKET_CATEGORY_ID = '1427252951059005468';

  const LOGS_CHANNEL_ID = '1504858808462082271';

  const SCAMMERS_CHANNEL_ID = '1427252951222845470';


  // STORE OPEN TICKETS
  const openTickets = new Map();
const ticketTimeouts = new Map();

  // =========================
  // BUTTON CLICK
  // =========================

  client.on('interactionCreate', async (interaction) => {

    try {

      // =====================================
      // CREATE TICKET BUTTON
      // =====================================

      if (
        interaction.isButton() &&
        interaction.customId === 'create_scam_ticket'
      ) {

        await interaction.deferReply({
  ephemeral: true
});

        const existingTicket = interaction.guild.channels.cache.find(
          ch =>
            ch.topic === interaction.user.id
        );

        if (existingTicket) {

          return interaction.editReply({
            content: `❌ You already have an open ticket: ${existingTicket}`,
            ephemeral: true
          });

        }

        // CREATE CHANNEL
        const ticketChannel = await interaction.guild.channels.create({

          name: `scam-${interaction.user.username}`,

          type: ChannelType.GuildText,

          parent: TICKET_CATEGORY_ID,

          topic: interaction.user.id,

          permissionOverwrites: [

            {
              id: interaction.guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel]
            },

            {
              id: interaction.user.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.AttachFiles,
                PermissionsBitField.Flags.ReadMessageHistory
              ]
            },

            {
              id: SUPPORT_ROLE_ID,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.AttachFiles,
                PermissionsBitField.Flags.ReadMessageHistory,
                PermissionsBitField.Flags.ManageChannels
              ]
            }

          ]

        });


        // BUTTONS

const buttons = new ActionRowBuilder()
  .addComponents(

    new ButtonBuilder()
      .setCustomId('submit_ticket')
      .setLabel('Submit Report')
      .setStyle(ButtonStyle.Danger),

    new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('Close Ticket')
      .setStyle(ButtonStyle.Secondary)

  );



        // EMBED
        const embed = new EmbedBuilder()

          .setColor('#ff3d3d')

          .setTitle('🚨 Scam Report Ticket')

          .setDescription(
`
Please provide:

• Scammer Username
• What happened
• Amount involved
• Payment method
• Proof screenshots/videos/files

You can upload screenshots directly in this ticket.
`
          )

          .setFooter({
            text: 'Support Team Will Review This Report'
          });


   const timerMessage = await ticketChannel.send({

  content:
`<@${interaction.user.id}> <@&${SUPPORT_ROLE_ID}>`,

  embeds: [embed],

  components: [buttons]

});

let timeLeft = 15 * 60;

const interval = setInterval(async () => {

  if (!ticketChannel) return;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  try {

    await timerMessage.edit({

      content:
`<@${interaction.user.id}> <@&${SUPPORT_ROLE_ID}>

⏳ Ticket Auto Close Timer: \`${minutes}:${seconds
  .toString()
  .padStart(2, '0')}\`

⚠️ Submit your report before timer ends or ticket will close automatically.`,

      embeds: [embed],

      components: [buttons]

    });

  } catch (err) {}

  timeLeft--;

  if (timeLeft < 0) {

    clearInterval(interval);

  }

}, 1000);


// AUTO CLOSE AFTER 15 MINUTES

const timeout = setTimeout(async () => {

  try {

    const latestMessages =
      await ticketChannel.messages.fetch({
        limit: 20
      });

    const submitted =
      latestMessages.some(
        msg =>
          msg.content &&
          msg.content.includes(
            '✅ Scam report submitted successfully.'
          )
      );

    if (!submitted) {

      await ticketChannel.send(
        '⏰ Ticket closed automatically because no report was submitted within 15 minutes.'
      );

      openTickets.delete(interaction.user.id);

      ticketTimeouts.delete(interaction.user.id);

      clearInterval(interval);

      setTimeout(async () => {

        await ticketChannel.delete();

      }, 5000);

    }

  } catch (err) {}

}, 15 * 60 * 1000);


ticketTimeouts.set(interaction.user.id, {
  timeout,
  interval
});


        openTickets.set(interaction.user.id, ticketChannel.id);


        await interaction.reply({
          content: `✅ Your scam report ticket has been created: ${ticketChannel}`
        });

      }

// =====================================
// SUBMIT TICKET
// =====================================

if (
  interaction.isButton() &&
  interaction.customId === 'submit_ticket'
) {

  await interaction.deferReply({
    ephemeral: true
  });

  const logsChannel =
    interaction.guild.channels.cache.get(
      LOGS_CHANNEL_ID
    );

  // FETCH ALL MESSAGES
  const messages =
    await interaction.channel.messages.fetch({
      limit: 100
    });

  const sorted =
    [...messages.values()].reverse();

  let reportText = '';

  const files = [];
let hasProof = false;


  for (const msg of sorted) {

    if (msg.author.bot) continue;

    reportText +=
`\n👤 ${msg.author.tag}\n`;

    if (msg.content) {

      reportText +=
`${msg.content}\n`;

    }

  if (msg.attachments.size > 0) {

  hasProof = true;

  msg.attachments.forEach(att => {

    reportText +=
`📎 ${att.url}\n`;

    files.push(att.url);

  });

}

    reportText += '\n';
  }

if (!hasProof) {

  return interaction.editReply({

    content:
'⚠️ You must attach at least one screenshot or screen recording before submitting the report.'

  });

}


  const embed = new EmbedBuilder()

    .setColor('#ff3d3d')

    .setTitle('🚨 New Scam Report Submitted')

    .setDescription(
      reportText.slice(0, 4000)
    )

    .addFields(

      {
        name: 'Reported By',
        value: `${interaction.user}`
      },

      {
        name: 'Ticket',
        value: interaction.channel.name
      }

    )

    .setFooter({
      text: 'UpGoom Scam Protection System'
    });

  const adminButtons = new ActionRowBuilder()

    .addComponents(

      new ButtonBuilder()
        .setCustomId('confirm_scam')
        .setLabel('Confirm Scam')
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId('false_report')
        .setLabel('False Report')
        .setStyle(ButtonStyle.Secondary)

    );

  await logsChannel.send({

    embeds: [embed],

    files: files,

    components: [adminButtons]

  });

  await interaction.editReply({

    content:
'✅ Scam report submitted successfully.'

  });

  const timerData =
  ticketTimeouts.get(interaction.user.id);

if (timerData) {

  clearTimeout(timerData.timeout);
  clearInterval(timerData.interval);

  ticketTimeouts.delete(interaction.user.id);

}

}

      // =====================================
      // CLOSE TICKET
      // =====================================

      if (
  interaction.isButton() &&
  interaction.customId === 'close_ticket'
) {
  await interaction.deferReply();

  const timerData =
    ticketTimeouts.get(interaction.channel.topic);

  if (timerData) {

    clearTimeout(timerData.timeout);
    clearInterval(timerData.interval);

    ticketTimeouts.delete(interaction.channel.topic);

  }

  await interaction.editReply({
  content: '🔒 Closing ticket in 5 seconds...'
});

  setTimeout(async () => {

    openTickets.delete(interaction.channel.topic);

    await interaction.channel.delete();

  }, 5000);

}


      // =====================================
      // FALSE REPORT
      // =====================================

      if (
        interaction.isButton() &&
        interaction.customId === 'false_report'
      ) {
        await interaction.deferReply();

        const embed = new EmbedBuilder()
          .setColor('#808080')
          .setTitle('❌ False Report')
          .setDescription(
`This report has been marked as a false report by support team.`
          );

        await interaction.editReply({
  embeds: [embed]
});

      }


      // =====================================
      // CONFIRM SCAM
      // =====================================

      if (
        interaction.isButton() &&
        interaction.customId === 'confirm_scam'
      ) {

      await interaction.deferReply();

        const messages = await interaction.channel.messages.fetch({
          limit: 20
        });

        let reportText = '';

        messages.reverse().forEach(msg => {

          if (msg.author.bot) return;

          reportText += `\n${msg.author.tag}: ${msg.content}`;

        });


        const embed = new EmbedBuilder()

          .setColor('#ff0000')

          .setTitle('⚠️ CONFIRMED SCAMMER')

          .setDescription(
`A user has been confirmed as scammer by support team.`
          )

          .addFields(

            {
              name: 'Ticket',
              value: interaction.channel.name
            },

            {
              name: 'Handled By',
              value: `${interaction.user}`
            }

          )

          .setFooter({
            text: 'Stay cautious while dealing with unknown freelancers/clients.'
          });


        const scammersChannel =
          interaction.guild.channels.cache.get(
            SCAMMERS_CHANNEL_ID
          );


        await scammersChannel.send({
          embeds: [embed]
        });


        await interaction.editReply({
  content: '✅ User marked as confirmed scammer.'
});

      }

    } catch (err) {

      console.log(err);

    }

  });
};
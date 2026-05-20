const {
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

module.exports = (client) => {

  const userSelections = {};

  client.once(Events.ClientReady, async () => {
    console.log('BOT RESTARTED');

    const channel = await client.channels.fetch('1434953577050407106');

    const embed = new EmbedBuilder()
      .setTitle('🚀 Post A Professional Job')
      .setDescription(

`Looking to hire skilled freelancers?
Use the button below to submit a professional job request to the Upgoom server.

### 📌 Guidelines
• Clearly explain your project
• Mention realistic budget & timeline
• Add references/examples whenever possible
• Low effort or vague requests may be rejected
• Serious clients only

⚠️ Only Members with the <@&1427252949863891001> or <@&1427252949863891000> Role can post jobs.`

      )
      .setImage('https://cdn.discordapp.com/attachments/1135186964207902730/1425114248991866920/20251007_185059.jpg')
      .setColor('#8d8d8d');

    const row = new ActionRowBuilder().addComponents(

      new ButtonBuilder()
        .setCustomId('create_job')
        .setLabel('Post A Job')
        .setStyle(ButtonStyle.Primary)

    );

    const messages = await channel.messages.fetch({ limit: 10 });

    const existingMessage = messages.find(
      msg =>
        msg.author.id === client.user.id &&
        msg.embeds.length > 0 &&
        msg.embeds[0].title === '🚀 Post A Professional Job'
    );

    if (!existingMessage) {

      await channel.send({
        embeds: [embed],
        components: [row]
      });

    }

  });

  async function rejectApplication(
    interaction,
    reason
  ) {

    const row = new ActionRowBuilder().addComponents(

      new ButtonBuilder()
        .setCustomId('retry_job_form')
        .setLabel('Make Request Again')
        .setStyle(ButtonStyle.Primary)

    );

    return await interaction.reply({

      content: `❌ ${reason}`,

      components: [row],

      flags: 64

    });

  }

  client.on(Events.InteractionCreate, async interaction => {

    try {

      // =========================
      // BUTTON CLICK
      // =========================

      if (
        interaction.isButton() &&
        interaction.customId === 'create_job'
      ) {

        const member = interaction.member;

        const allowed =
  member.roles.cache.has('1427252949863891001') ||
  member.roles.cache.has('1427252949863891000') ||
  member.roles.cache.has('1427252949863891002');

        if (!allowed) {

          return await interaction.reply({
            content: '⚠️ Only Members with the <@&1427252949863891001>, <@&1427252949863891000> or <@&1427252949863891002> Role can post jobs.',
            flags: 64
          });

        }

        const row = new ActionRowBuilder().addComponents(

          new StringSelectMenuBuilder()
            .setCustomId('who_are_you')
            .setPlaceholder('Who Are You?')
            .addOptions(
              {
                label: 'Creator',
                value: 'Creator'
              },
              {
                label: 'Business',
                value: 'Business'
              },
              {
                label: 'Brand',
                value: 'Brand'
              },
              {
                label: 'Agency',
                value: 'Agency'
              }
            )

        );

        return await interaction.reply({

          content: 'Select who you are:',

          components: [row],

          flags: 64

        });

      }

      // =========================
      // WHO ARE YOU
      // =========================

      if (
        interaction.isStringSelectMenu() &&
        interaction.customId === 'who_are_you'
      ) {

    
if (!userSelections[interaction.user.id]) {

  userSelections[interaction.user.id] = {};

}

userSelections[interaction.user.id].who =
  interaction.values[0];


        const row = new ActionRowBuilder().addComponents(

          new StringSelectMenuBuilder()
            .setCustomId('service_select')
            .setPlaceholder('Select Required Service')
            .addOptions(
              {
                label: 'Video Editing',
                value: 'Video Editing'
              },
              {
                label: 'Thumbnail Design',
                value: 'Thumbnail Design'
              },
              {
                label: 'Graphic Design',
                value: 'Graphic Design'
              },
              {
                label: 'Animation',
                value: 'Animation'
              },
              {
                label: 'Motion Graphics',
                value: 'Motion Graphics'
              },
              {
                label: 'UI/UX Design',
                value: 'UI/UX Design'
              },
              {
                label: 'Web Development',
                value: 'Web Development'
              },
              {
                label: 'Content Management',
                value: 'Content Management'
              },
              {
                label: 'Script Writing',
                value: 'Script Writing'
              },
              {
                label: 'Other',
                value: 'Other'
              }
            )

        );

        return await interaction.update({

          content: `Selected: ${interaction.values[0]}\n\nNow select required service:`,

          components: [row]

        });

      }

      // =========================
      // SERVICE SELECT
      // =========================

if (
  interaction.isStringSelectMenu() &&
  interaction.customId === 'service_select'
) {

  if (!userSelections[interaction.user.id]) {

    userSelections[interaction.user.id] = {};

  }

  userSelections[interaction.user.id].service =
    interaction.values[0];

  const service = interaction.values[0];

  const modal = new ModalBuilder()
    .setCustomId('job_modal')
    .setTitle('Job Application Form');

  // =========================
  // VIDEO / MOTION / ANIMATION
  // =========================

  if (
  service === 'Video Editing' ||
  service === 'Motion Graphics' ||
  service === 'Animation'
) {

  const referenceInput = new TextInputBuilder()
    .setCustomId('reference_links')
    .setLabel('Editing Style References')
    .setPlaceholder(
      'Reference videos/channels/styles'
    )
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const descriptionInput = new TextInputBuilder()
    .setCustomId('project_description')
    .setLabel('Describe Your Project')
    .setPlaceholder(
      'Explain your project properly'
    )
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const durationInput = new TextInputBuilder()
    .setCustomId('video_duration')
    .setLabel('Video Duration')
    .setPlaceholder(
      'Short Form / Mid Form / Long Form'
    )
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const quantityInput = new TextInputBuilder()
    .setCustomId('video_quantity')
    .setLabel('Number Of Videos')
    .setPlaceholder(
      '1 video / 4 videos weekly / ongoing'
    )
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const softwareInput = new TextInputBuilder()
    .setCustomId('software_needed')
    .setLabel('Software Needed')
    .setPlaceholder(
      'Premiere Pro, After Effects etc.'
    )
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder().addComponents(referenceInput),
    new ActionRowBuilder().addComponents(descriptionInput),
    new ActionRowBuilder().addComponents(durationInput),
    new ActionRowBuilder().addComponents(quantityInput),
    new ActionRowBuilder().addComponents(softwareInput)
  );

}
  // =========================
  // DESIGN SERVICES
  // =========================

  else if (
  service === 'Thumbnail Design' ||
  service === 'Graphic Design'
) {

  const referenceInput = new TextInputBuilder()
    .setCustomId('reference_links')
    .setLabel('Design References')
    .setPlaceholder(
      'Behance, Pinterest, examples etc.'
    )
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const descriptionInput = new TextInputBuilder()
    .setCustomId('project_description')
    .setLabel('Describe Your Design Project')
    .setPlaceholder(
      'Explain the design requirements'
    )
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const quantityInput = new TextInputBuilder()
    .setCustomId('design_quantity')
    .setLabel('Quantity Of Designs')
    .setPlaceholder(
      '2 thumbnails / 10 posts etc.'
    )
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const budgetInput = new TextInputBuilder()
    .setCustomId('budget')
    .setLabel('Budget Range')
    .setPlaceholder(
      '$50 / ₹2000 / €20 etc.'
    )
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const paymentInput = new TextInputBuilder()
    .setCustomId('payment_method')
    .setLabel('Payment Method')
    .setPlaceholder(
      'PayPal, Crypto, UPI etc.'
    )
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const deadlineInput = new TextInputBuilder()
    .setCustomId('deadline')
    .setLabel('Deadline / Turnaround Time')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder().addComponents(referenceInput),
    new ActionRowBuilder().addComponents(descriptionInput),
    new ActionRowBuilder().addComponents(quantityInput),
    new ActionRowBuilder().addComponents(budgetInput),
    new ActionRowBuilder().addComponents(paymentInput)
  );

}

// =========================
// UI UX + WEB DEV
// =========================

else if (
  service === 'UI/UX Design' ||
  service === 'Web Development'
) {

  const referenceInput = new TextInputBuilder()
    .setCustomId('reference_links')
    .setLabel('Website/App References')
    .setPlaceholder(
      'Reference websites, apps, UI inspiration'
    )
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const descriptionInput = new TextInputBuilder()
    .setCustomId('project_description')
    .setLabel('Describe Your Project')
    .setPlaceholder(
      'Explain pages, features and requirements'
    )
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const pagesInput = new TextInputBuilder()
    .setCustomId('pages_needed')
    .setLabel('Pages / Screens Needed')
    .setPlaceholder(
      'Landing page / 5 pages / dashboard etc.'
    )
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const platformInput = new TextInputBuilder()
    .setCustomId('platform_needed')
    .setLabel('Platform / Stack Needed')
    .setPlaceholder(
      'Figma, React, Next.js, WordPress etc.'
    )
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const budgetInput = new TextInputBuilder()
    .setCustomId('budget')
    .setLabel('Budget Range')
    .setPlaceholder(
      '$100 / ₹5000 / €50 etc.'
    )
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder().addComponents(referenceInput),
    new ActionRowBuilder().addComponents(descriptionInput),
    new ActionRowBuilder().addComponents(pagesInput),
    new ActionRowBuilder().addComponents(platformInput),
    new ActionRowBuilder().addComponents(budgetInput)
  );

}

else if (
  service === 'UI/UX Design' ||
  service === 'Web Development'
) {

  const pages =
    interaction.fields.getTextInputValue('pages_needed');

  const platform =
    interaction.fields.getTextInputValue('platform_needed');

  extraFields = [

    {
      name: '📄 Pages / Screens',
      value: pages,
      inline: true
    },

    {
      name: '🧩 Platform / Stack',
      value: platform,
      inline: true
    }

  ];

}

  // =========================
  // DEFAULT SERVICES
  // =========================

  else {

    const referenceInput = new TextInputBuilder()
      .setCustomId('reference_links')
      .setLabel('Reference Examples')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    const descriptionInput = new TextInputBuilder()
      .setCustomId('project_description')
      .setLabel('Describe Your Project')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const budgetInput = new TextInputBuilder()
      .setCustomId('budget')
      .setLabel('Budget Range')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const paymentInput = new TextInputBuilder()
      .setCustomId('payment_method')
      .setLabel('Payment Method')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const deadlineInput = new TextInputBuilder()
      .setCustomId('deadline')
      .setLabel('Deadline / Turnaround Time')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(referenceInput),
      new ActionRowBuilder().addComponents(descriptionInput),
      new ActionRowBuilder().addComponents(budgetInput),
      new ActionRowBuilder().addComponents(paymentInput),
      new ActionRowBuilder().addComponents(deadlineInput)
    );

  }

  return await interaction.showModal(modal);

}

      if (

        interaction.isButton() &&
        interaction.customId === 'retry_job_form'

      ) {

        const saved =
          userSelections[interaction.user.id];


console.log('USER ID:', interaction.user.id);

console.log(
  'USER SELECTION:',
  userSelections[interaction.user.id]
);


console.log(
'RETRY CLICKED BY:',
interaction.user.id
);

console.log(
'FOUND DATA:',
saved
);

console.log(
'FULL STORAGE:',
userSelections
);
   
if (!saved) {

  userSelections[interaction.user.id] = {};

}

        const modal = new ModalBuilder()
          .setCustomId('job_modal')
          .setTitle('Project Request Form');

        const referenceInput = new TextInputBuilder()
          .setCustomId('reference_links')
          .setLabel('Reference Examples / Inspiration')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false)
       .setValue(saved?.formData?.references || '')

        const descriptionInput = new TextInputBuilder()
          .setCustomId('project_description')
          .setLabel('Describe Your Project')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setValue(saved?.formData?.description || '')

        const budgetInput = new TextInputBuilder()
          .setCustomId('budget')
          .setLabel('Budget Range')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setValue(saved?.formData?.budget || '')

        const paymentInput = new TextInputBuilder()
          .setCustomId('payment_method')
          .setLabel('Payment Method')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setValue(saved?.formData?.payment || '')

        const deadlineInput = new TextInputBuilder()
          .setCustomId('deadline')
          .setLabel('Deadline / Turnaround Time')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setValue(saved?.formData?.deadline || '')

        modal.addComponents(
          new ActionRowBuilder().addComponents(referenceInput),
          new ActionRowBuilder().addComponents(descriptionInput),
          new ActionRowBuilder().addComponents(budgetInput),
          new ActionRowBuilder().addComponents(paymentInput),
          new ActionRowBuilder().addComponents(deadlineInput)
        );

        return await interaction.showModal(modal);

      }

      // =========================
      // MODAL SUBMIT
      // =========================

      if (
        interaction.isModalSubmit() &&
        interaction.customId === 'job_modal'
      ) {


        const data = userSelections[interaction.user.id];

        const references =
          interaction.fields.getTextInputValue('reference_links') ||
          'No references provided';

        if (
          references !== 'No references provided' &&
          !references.includes('http')
        ) {

          return await rejectApplication(

            interaction,

            'Reference section must contain valid links.'

          );

        }

        const description =
          interaction.fields.getTextInputValue('project_description');

      const wordCount =
  description
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

if (wordCount < 20) {

  const channel =
    interaction.channel;

  await interaction.reply({

    content:
'❌ Your project description was detected as low effort/spam.\nYou have been temporarily blocked from posting in this channel.',

    flags: 64

  });

  try {

    await channel.permissionOverwrites.edit(
      interaction.user.id,
      {
        SendMessages: false
      }
    );

    setTimeout(async () => {

      try {

        await channel.permissionOverwrites.delete(
          interaction.user.id
        );

      } catch (err) {}

    }, 30 * 60 * 1000);

  } catch (err) {}

  return;

}
        

        const budget =
          interaction.fields.getTextInputValue('budget');

        const lowerBudget = budget.toLowerCase();

        const hasDollar =
          lowerBudget.includes('$') ||
          lowerBudget.includes('dollar');

        const hasRupee =
          lowerBudget.includes('₹') ||
          lowerBudget.includes('rupee') ||
          lowerBudget.includes('rs');

        const hasEuro =
          lowerBudget.includes('€') ||
          lowerBudget.includes('euro');

        const number =
          parseInt(lowerBudget.replace(/\D/g, ''));

        if (
          !hasDollar &&
          !hasRupee &&
          !hasEuro
        ) {

          return await rejectApplication(

            interaction,

            'Budget must include a valid currency ($, ₹, €).'

          );

        }

        if (hasRupee && number < 500) {

          return await rejectApplication(

            interaction,

            'Minimum budget is ₹500.'

          );

        }

        if (hasDollar && number < 5) {

          return await rejectApplication(

            interaction,

            'Minimum budget is $5.'

          );

        }

        if (hasEuro && number < 10) {

          return await rejectApplication(

            interaction,

            'Minimum budget is €10.'

          );

        }

        const payment =
          interaction.fields.getTextInputValue('payment_method');

          const service =
  data.service;

let extraFields = [];

if (
  service === 'Video Editing' ||
  service === 'Motion Graphics' ||
  service === 'Animation'
) {

  const duration =
    interaction.fields.getTextInputValue('video_duration');

  const quantity =
    interaction.fields.getTextInputValue('video_quantity');

  const software =
    interaction.fields.getTextInputValue('software_needed');

  extraFields = [

    {
      name: '🎬 Video Duration',
      value: duration,
      inline: true
    },

    {
      name: '📦 Number Of Videos',
      value: quantity,
      inline: true
    },

    {
      name: '💻 Software Needed',
      value: software,
      inline: true
    }

  ];

}

else if (
  service === 'Thumbnail Design' ||
  service === 'Graphic Design'
) {

  const quantity =
    interaction.fields.getTextInputValue('design_quantity');

  extraFields = [

    {
      name: '🖼 Design Quantity',
      value: quantity,
      inline: true
    }

  ];

}

        const validPayments = [

          'paypal',
          'crypto',
          'upi',
          'wise',
          'bank'

        ];

        const paymentValid = validPayments.some(method =>
          payment.toLowerCase().includes(method)
        );

        if (!paymentValid) {

          return await rejectApplication(

            interaction,

            'Invalid payment method.'

          );

        }

        const deadline =
          interaction.fields.getTextInputValue('deadline');

        if (!data) {
          return await interaction.reply({
            content: '❌ Session expired. Please submit the form again.',
            flags: 64
          });
        }

        if (!userSelections[interaction.user.id]) {
          userSelections[interaction.user.id] = {};
        }

        userSelections[interaction.user.id].formData = {
          references,
          description,
          budget,
          payment,
          deadline
        };

        console.log('SAVED DATA:', userSelections[interaction.user.id]);

        const jobsChannel =
          await client.channels.fetch('1502200204214927510');

        const embed = new EmbedBuilder()
          .setTitle(`🎯 New Job Request`)
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL()
          })
          .addFields(

            {
              name: '👤 Client Type',
              value: data.who,
              inline: true
            },

            {
              name: '🛠 Required Service',
              value: data.service,
              inline: true
            },

            {
              name: '💰 Budget',
              value: budget,
              inline: true
            },

            {
              name: '⏳ Timeline',
              value: deadline,
              inline: true
            },

            {
              name: '📝 Project Details',
              value:
                description.length > 1000
                  ? description.slice(0, 1000) + '...'
                  : description
            },

            {
              name: '🔗 References',
              value: references
            },

            {
              name: '💳 Payment Method',
              value: payment,
              inline: true
            },

            {
              name: '📩 Contact',
              value: `<@${interaction.user.id}>`
            }

          )
          .setColor('#ff00df')
          .setFooter({
            text: 'Posted via Upgoom'
          })
          .setTimestamp();

        const sentMessage = await jobsChannel.send({
          embeds: [embed]
        });

        await interaction.user.send(
          `✅ Your job request has been approved and posted successfully.\n🔗 ${sentMessage.url}`
        );

        return await interaction.reply({

          content: '✅ Your job request has been submitted.',

          flags: 64

        });

      }

    } catch (err) {

      console.log('INTERACTION ERROR:');
      console.log(err);

    }

  });

};
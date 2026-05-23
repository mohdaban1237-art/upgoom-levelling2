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
  const JOB_LOGS_CHANNEL_ID =
  '1507827342414843944';
  async function safeReply(interaction, options) {
  if (interaction.deferred || interaction.replied) {
    return await interaction.followUp(options);
  }

  return await interaction.reply(options);
}

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
  reason,
  resetField = null
) {

  if (
    resetField &&
    userSelections[interaction.user.id]?.formData
  ) {
    userSelections[interaction.user.id].formData[resetField] = '';
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('retry_job_form')
      .setLabel('Make Request Again')
      .setStyle(ButtonStyle.Primary)
  );

  return await safeReply(interaction, {
  content: `❌ ${reason}`,
  components: [row],
  flags: 64
});

}

function getJobFields(service) {

  if (service === 'Video Editing') {
    return [
      ['video_type', '🎬 Video Type & Style', 'Short-form reels, YouTube videos, gaming edits, podcasts, ads, documentaries, etc.', TextInputStyle.Paragraph],
      ['project_description', '📝 Project Details', 'Explain editing style, software required, pacing, etc.', TextInputStyle.Paragraph],
      ['reference_links', '🔗 Reference Links', 'YouTube/Instagram links showing the editing style you want.', TextInputStyle.Paragraph],
      ['quantity', '📦 QuantityOf Videos/Timeframe', '5 reels daily / 4 YouTube videos monthly / 30 shorts monthly.', TextInputStyle.Short],
      ['budget', '💰 Budget', '₹50k/month, $100 per video.', TextInputStyle.Short]
    ];
  }

  if (service === 'Thumbnail Design') {
    return [
      ['thumbnail_type', '🖼️ Thumbnail Style', 'Gaming, finance, documentary, MrBeast style, anime, reaction, etc.', TextInputStyle.Paragraph],
      ['project_description', '🎨 Design Requirements', 'Mention text style, emotions, colors, composition, branding, etc.', TextInputStyle.Paragraph],
      ['reference_links', '🔗 References', 'Paste YouTube channels or thumbnail examples.', TextInputStyle.Paragraph],
      ['quantity', '📦 Quantity / Frequency', '3 thumbnails weekly / daily uploads / one-time project.', TextInputStyle.Short],
      ['budget', '💰 Budget', '$10 per thumbnail / $500 monthly.', TextInputStyle.Short]
    ];
  }

  if (service === 'Graphic Design') {
    return [
      ['design_type', '🎨 Design Type', 'Branding, posters, social media posts, logos, UI, banners, etc.', TextInputStyle.Paragraph],
      ['project_description', '📝 Project Details', 'Explain brand style, audience, colors, purpose, dimensions, etc.', TextInputStyle.Paragraph],
      ['reference_links', '🔗 Brand Assets', 'Behance, Pinterest, Drive links, existing branding, etc.', TextInputStyle.Paragraph],
      ['quantity', '📦 Deliverables Needed', '5 Instagram posts, logo package, full brand kit, etc.', TextInputStyle.Short],
      ['budget', '💰 Budget', '₹10k project budget / $1000 monthly.', TextInputStyle.Short]
    ];
  }

  if (service === 'Web Development') {
    return [
      ['website_type', '💻 Website Type', 'Portfolio, SaaS, agency website, eCommerce, dashboard, landing page, etc.', TextInputStyle.Paragraph],
      ['tech_preference', '🧩 Tech Preference', 'WordPress, React, Next.js, Shopify, custom code, etc.', TextInputStyle.Short],
      ['project_description', '⚙️ Features Required', 'Login system, payment gateway, CMS, animations, admin panel, etc.', TextInputStyle.Paragraph],
      ['reference_links', '🔗 References', 'Share websites or UI styles you like.', TextInputStyle.Paragraph],
      ['budget', '💰 Budget', '$300 budget / $2000 monthly.', TextInputStyle.Short]
    ];
  }

  if (service === 'Script Writing') {
    return [
      ['content_type', '✍️ Content Type', 'YouTube documentary, shorts hooks, ads, storytelling, explainer, etc.', TextInputStyle.Paragraph],
      ['project_description', '📝 Script Requirements', 'Tone, target audience, pacing, storytelling style, CTA, etc.', TextInputStyle.Paragraph],
      ['reference_links', '🔗 References', 'Channels/videos/scripts you want similar quality from.', TextInputStyle.Paragraph],
      ['quantity', '📦 Length / Frequency', '60 sec shorts daily / 10 min scripts weekly.', TextInputStyle.Short],
      ['budget', '💰 Budget & Delivery', '₹2k per script / 24h turnaround needed.', TextInputStyle.Short]
    ];
  }

  if (service === 'Motion Design') {
    return [
      ['motion_type', '✨ Motion Type', 'Explainer animation, UI motion, logo animation, reels motion graphics, etc.', TextInputStyle.Paragraph],
      ['project_description', '🎞️ Animation Details', 'Mention transitions, typography, effects, pacing, branding, etc.', TextInputStyle.Paragraph],
      ['reference_links', '🔗 References', 'Share animation styles/videos you want matched.', TextInputStyle.Paragraph],
      ['quantity', '📦 Duration / Quantity', '30 sec promo / 10 reels monthly / one-time project.', TextInputStyle.Short],
      ['budget', '💰 Budget & Timeline', '$15k project budget.', TextInputStyle.Short]
    ];
  }

  return [
    ['animation_type', '🎞️ Animation Type', '2D explainer, anime, 3D product animation, cinematic scenes, rigging, etc.', TextInputStyle.Paragraph],
    ['project_description', '📝 Project Details', 'Explain story, characters, environments, animation style, rendering quality, etc.', TextInputStyle.Paragraph],
    ['reference_links', '🔗 References / Assets', 'Reference videos, concept art, scripts, models, storyboard links, etc.', TextInputStyle.Paragraph],
    ['quantity', '📦 Animation Length', '15 sec cinematic / full episode / looping animation / trailer.', TextInputStyle.Short],
    ['budget', '💰 Budget & Deadline', '$500 budget / needed before launch date.', TextInputStyle.Short]
  ];

}

function buildJobModal(service, savedData = {}) {

  const modal = new ModalBuilder()
    .setCustomId('job_modal')
    .setTitle('Job Request Form');

  const fields = getJobFields(service);

  for (const field of fields) {
    const input = new TextInputBuilder()
      .setCustomId(field[0])
      .setLabel(field[1])
      .setPlaceholder(field[2])
      .setStyle(field[3])
      .setRequired(true);

    if (savedData[field[0]]) {
      input.setValue(savedData[field[0]]);
    }

    modal.addComponents(
      new ActionRowBuilder().addComponents(input)
    );
  }

  return modal;

}

  client.on(Events.InteractionCreate, async interaction => {

  try {


    function validateField(fieldId, value) {

  const text = value.toLowerCase();

  if (fieldId === 'reference_links') {
    return text.includes('http');
  }

  if (
    fieldId === 'budget'
  ) {

    return (
      /\d/.test(text) &&
      (
        text.includes('$') ||
        text.includes('₹') ||
        text.includes('€') ||
        text.includes('usd') ||
        text.includes('inr')
      )
    );

  }

  if (
    fieldId.includes('quantity') ||
    fieldId.includes('duration') ||
    fieldId.includes('length')
  ) {

    return (
      /\d/.test(text) ||
      text.includes('daily') ||
      text.includes('weekly') ||
      text.includes('monthly')
    );

  }

  if (
    fieldId.includes('type') ||
    fieldId.includes('style')
  ) {

    return text.length > 8;
  }

  if (
    fieldId === 'project_description'
  ) {

    return (
      text.split(/\s+/).length >= 15
    );

  }

  return text.length >= 5;

}

      // =========================
      // BUTTON CLICK
      // =========================

      if (
        interaction.isButton() &&
        interaction.customId === 'create_job'
      ) {
        await interaction.deferReply({
  flags: 64
});

        const member = interaction.member;

        const allowed =
  member.roles.cache.has('1427252949863891001') ||
  member.roles.cache.has('1427252949863891000') ||
  member.roles.cache.has('1427252949863891002');

        if (!allowed) {

          return await interaction.editReply({
            content: '⚠️ Only Members with the <@&1427252949863891001>, <@&1427252949863891000> or <@&1427252949863891002> Role can post jobs.'
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

return await safeReply(interaction, {
        content: 'Select who you are:',
  components: [row]
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
    label: '🎬 Video Editing',
    value: 'Video Editing'
  },
  {
    label: '🖼️ Thumbnail Design',
    value: 'Thumbnail Design'
  },
  {
    label: '🎨 Graphic Design',
    value: 'Graphic Design'
  },
  {
    label: '💻 Web Development',
    value: 'Web Development'
  },
  {
    label: '✍️ Script Writing',
    value: 'Script Writing'
  },
  {
    label: '✨ Motion Design',
    value: 'Motion Design'
  },
  {
    label: '🎞️ 2D / 3D Animation',
    value: '2D / 3D Animation'
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

  const modal = buildJobModal(service);


  return await interaction.showModal(modal);

}
      if (
  interaction.isButton() &&
  interaction.customId === 'retry_job_form'
) {

  const service =
    userSelections[interaction.user.id]?.service;

  if (!service) {
    return await safeReply(interaction, {
      content: '❌ Session expired. Please start again.',
      flags: 64
    });
  }

  const modal = buildJobModal(
    service,
    userSelections[interaction.user.id]?.formData || {}
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
        if (!data || !data.service) {
  return await interaction.reply({
    content: '❌ Session expired. Please start again.',
    flags: 64
  });
}

const formData = {};

const invalidFields = [];

for (const [key, field] of interaction.fields.fields) {

  formData[key] = field.value;

  const valid =
    validateField(
      key,
      field.value
    );

  if (!valid) {
    invalidFields.push(key);
  }

}

if (invalidFields.length > 0) {

  for (const field of invalidFields) {

    formData[field] = '';

  }

  userSelections[interaction.user.id].formData =
    formData;

  return await rejectApplication(

    interaction,

    'Some fields were filled incorrectly. Please follow the required format properly by reading placeholders of fields.'

  );

}



        const references =
          interaction.fields.getTextInputValue('reference_links') ||
          'No references provided';

        if (
          references !== 'No references provided' &&
          !references.includes('http')
        ) {

          return await rejectApplication(

  interaction,

  'Reference section must contain valid links.',

  'reference_links'

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

    userSelections[interaction.user.id].formData.project_description = '';

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

          const service =
  data.service;

        

        if (!data) {
          return await interaction.reply({
            content: '❌ Session expired. Please submit the form again.',
          });
        }

        if (!userSelections[interaction.user.id]) {
          userSelections[interaction.user.id] = {};
        }

        userSelections[interaction.user.id].formData = formData;

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
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
StringSelectMenuBuilder,
Events

} = require('discord.js');

module.exports = (client) => {

  // =========================
  // CONFIG
  // =========================

  const PROMOTE_CHANNEL_ID =
    '1505230156858396804';

  const FREELANCER_FORUM_ID =
  '1502166599422054420';

const AGENCY_FORUM_ID =
  '1507412924979871905';

const TAGS = {

  editor: '1502753456266547301',

  designer: '1502753627637420172',

  developer: '1502753774601769122',

  animator: '1502753855681597562'

};

const AGENCY_TAGS = {

  'Video Editing':
    '1507414248630780026',

  'Design':
    '1507414348950274248',

  'Development':
    '1507414551182708796',

  'Web Design':
    '1507414655243391047',

  'IG Marketing':
    '1507414940355661865',

  'YT Marketing':
    '1507415121797058722',

  'Advertising':
    '1507415238696374382',

  'Influencer Marketing':
    '1507453408951664821'

};

const pendingAgencyPosts = new Map();

const agencyTestimonials = new Map();

const agencyCooldowns = new Map();

const AGENCY_ROLE_ID =
  '1427252949863891002';


  // =========================
  // READY
  // =========================

client.once(Events.ClientReady, async () => {
    console.log('Promote services loaded');

    const channel =
      await client.channels.fetch(
        PROMOTE_CHANNEL_ID
      );

    const embed = new EmbedBuilder()

      .setColor('#d5d5d5')

      .setTitle('📢 Promote Your Services')

      .setDescription(
`Create a professional freelancer listing for clients to discover your services.

Include:
• portfolio
• experience
• pricing
• specialization
• delivery details

Click the button below to create your listing.`
      )

      .setFooter({
        text:
'UpGoom Freelancer Marketplace'
      });

    const row = new ActionRowBuilder()

      .addComponents(

        new ButtonBuilder()

          .setCustomId('create_listing')

          .setLabel('Create Listing')

          .setEmoji('📢')

          .setStyle(ButtonStyle.Primary)

      );

      const existingMessages = await channel.messages.fetch({ limit: 20 });

const alreadySent = existingMessages.find(msg =>
  msg.author.id === client.user.id &&
  msg.components?.some(row =>
    row.components?.some(component =>
      component.customId === 'create_listing'
    )
  )
);

if (alreadySent) {
  console.log('Promote services embed already exists, skipping send.');
  return;
}

    await channel.send({

      embeds: [embed],

      components: [row]

    });

  });

  // =========================
  // INTERACTIONS
  // =========================

client.on(Events.InteractionCreate, async (interaction) => {
    try {

      // =========================
      // BUTTON CLICK
      // =========================

if (
  interaction.isButton() &&
  interaction.customId === 'create_listing'
) {

  const row = new ActionRowBuilder()

    .addComponents(

      new StringSelectMenuBuilder()

        .setCustomId('select_listing_type')

        .setPlaceholder(
          'Choose listing type'
        )

        .addOptions(

          {
            label: 'Freelancer',
            value: 'freelancer',
            emoji: '🧑‍💻',
            description:
'Individual freelancer services'
          },

          {
            label: 'Agency',
            value: 'agency',
            emoji: '🏢',
            description:
'Professional creative agency'
          }

        )

    );

  return interaction.reply({

    content:
'Select what type of listing you want to create.',

    components: [row],

    flags: 64

  });

}


if (
  interaction.isStringSelectMenu() &&
  interaction.customId === 'select_service'
) {

  const selectedService =
    interaction.values[0];

  const modal = new ModalBuilder()

    .setCustomId(
      `listing_modal_${selectedService}`
    )

    .setTitle('Create Service Listing');

 const serviceInput =
  new TextInputBuilder()

    .setCustomId('service')

    .setLabel('Service / Niche')

    .setPlaceholder(
      'Short Form Video Editing'
    )

    .setStyle(TextInputStyle.Short)

    .setRequired(true);

const experienceInput =
  new TextInputBuilder()

    .setCustomId('experience')

    .setLabel('Experience')

    .setPlaceholder(
      '2 years working with creators'
    )

    .setStyle(TextInputStyle.Short)

    .setRequired(true);

const portfolioInput =
  new TextInputBuilder()

    .setCustomId('portfolio')

    .setLabel('Portfolio Link')

    .setPlaceholder(
      'https://behance.net/yourname'
    )

    .setStyle(TextInputStyle.Short)

    .setRequired(true);

const pricingInput =
  new TextInputBuilder()

    .setCustomId('pricing')

    .setLabel('Pricing')

    .setPlaceholder(
      '₹4000 per reel'
    )

    .setStyle(TextInputStyle.Short)

    .setRequired(true);

const availabilityInput =
  new TextInputBuilder()

    .setCustomId('availability')

    .setLabel('Availability')

    .setPlaceholder(
      'Available 6 days/week'
    )

    .setStyle(TextInputStyle.Short)

    .setRequired(true);

const toolsInput =
  new TextInputBuilder()

    .setCustomId('tools')

    .setLabel('Tool Stack')

    .setPlaceholder(
'Premiere Pro, After Effects, Photoshop'
    )

    .setStyle(TextInputStyle.Short)

    .setRequired(true);

const detailsInput =
  new TextInputBuilder()

    .setCustomId('details')

    .setLabel('Specialization / Details')

    .setPlaceholder(
'High retention edits for creators and brands'
    )

    .setStyle(TextInputStyle.Paragraph)

    .setRequired(true);

  modal.addComponents(

  new ActionRowBuilder()
    .addComponents(serviceInput),

  new ActionRowBuilder()
    .addComponents(experienceInput),

  new ActionRowBuilder()
    .addComponents(portfolioInput),

  new ActionRowBuilder()
    .addComponents(pricingInput),

  new ActionRowBuilder()
    .addComponents(availabilityInput)

);

  return interaction.showModal(modal);

}

// =========================
// LISTING TYPE SELECT
// =========================

if (
  interaction.isStringSelectMenu() &&
  interaction.customId === 'select_listing_type'
) {

  const selectedType =
    interaction.values[0];

 
  // =========================
  // AGENCY FLOW
  // =========================

  if (selectedType === 'agency') {

   const member =
  await interaction.guild.members.fetch(
    interaction.user.id
  );

if (
  !member.roles.cache.has(
    AGENCY_ROLE_ID
  )
) {

return interaction.update({

    content:
'❌ Only users with the Agency role can create agency listings.',
components: []

  });

}

  const row = new ActionRowBuilder()

    .addComponents(

      new StringSelectMenuBuilder()

        .setCustomId('agency_primary_service')

        .setPlaceholder(
          'Choose your agency primary service'
        )

        .addOptions(

  {
    label: 'Video Editing Agency',
    value: 'Video Editing',
    emoji: '🎬'
  },

  {
    label: 'Graphic Design Agency',
    value: 'Design',
    emoji: '🎨'
  },

  {
    label: 'Web Development Agency',
    value: 'Development',
    emoji: '💻'
  },

  {
    label: 'Web Design Agency',
    value: 'Web Design',
    emoji: '🖥️'
  },

  {
    label: 'Instagram Marketing',
    value: 'IG Marketing',
    emoji: '📈'
  },

  {
    label: 'Advertisements',
    value: 'Advertising',
    emoji: '💸'
  },

  {
    label: 'Influencer Marketing',
    value: 'Influencer Marketing',
    emoji: '🤝'
  },

  {
    label: 'Youtube Marketing',
    value: 'YT Marketing',
    emoji: '📈'
  }

        )

    );

  return interaction.update({

    content:
'Select your agency primary service below.',

    components: [row]

  });

  }

    // =========================
  // FREELANCER FLOW
  // =========================

  if (selectedType === 'freelancer') {

    const row = new ActionRowBuilder()

      .addComponents(

        new StringSelectMenuBuilder()

          .setCustomId('select_service')

          .setPlaceholder(
            'Choose your service category'
          )

          .addOptions(

            {
              label: 'Video Editor',
              value: 'editor',
              emoji: '🎬'
            },

            {
              label: 'Designer',
              value: 'designer',
              emoji: '🎨'
            },

            {
              label: 'Developer',
              value: 'developer',
              emoji: '💻'
            },

            {
              label: 'Animator',
              value: 'animator',
              emoji: '🖌️'
            }

          )

      );

    return interaction.update({

      content:
'Select your freelancer service category below.',

      components: [row]

    });
    
    }
  }


 // =========================
// AGENCY PRIMARY SERVICE
// =========================

if (
  interaction.isStringSelectMenu() &&
  interaction.customId ===
    'agency_primary_service'
) {

  const primaryService =
    interaction.values[0];

  const modal = new ModalBuilder()

    .setCustomId(
      `agency_listing_modal_${primaryService}`
    )

    .setTitle('Create Agency Listing');

  const agencyName =
    new TextInputBuilder()

      .setCustomId('agency_name')

      .setLabel('Agency Name')

      .setPlaceholder(
        'Pexa Visuals'
      )

      .setStyle(TextInputStyle.Short)

      .setRequired(true);

  const founded =
    new TextInputBuilder()

      .setCustomId('founded')

      .setLabel('Agency Running Since')

      .setPlaceholder(
        'Started in January 2025'
      )

      .setStyle(TextInputStyle.Short)

      .setRequired(true);

  const website =
    new TextInputBuilder()

      .setCustomId('website')

      .setLabel(
'Website (.com/.in/.co.in)'
)

      .setPlaceholder(
        'https://youragency.com'
      )

      .setStyle(TextInputStyle.Short)

      .setRequired(true);

  const teamSize =
    new TextInputBuilder()

      .setCustomId('team_size')

      .setLabel('Team Size')

      .setPlaceholder(
        '5 Editors + 2 Designers'
      )

      .setStyle(TextInputStyle.Short)

      .setRequired(true);

  const details =
    new TextInputBuilder()

      .setCustomId('details')

      .setLabel('Overview/About')

      .setPlaceholder(
'Your specialization, workflow, pricing and niche'
      )

      .setStyle(TextInputStyle.Paragraph)

      .setRequired(true);

  modal.addComponents(

    new ActionRowBuilder()
      .addComponents(agencyName),

       new ActionRowBuilder()
  .addComponents(details),

    new ActionRowBuilder()
      .addComponents(founded),

    new ActionRowBuilder()
      .addComponents(website),

new ActionRowBuilder()
  .addComponents(teamSize)

  );

  return interaction.showModal(modal);

}

// =========================
// TESTIMONIAL BUTTON
// =========================

if (
  interaction.isButton() &&
  interaction.customId ===
    'upload_testimonials'
) {

  agencyTestimonials.set(
    interaction.user.id,
    true
  );

  return interaction.reply({

    content:
'📸 Upload exactly 2 testimonial screenshots to publish your verified agency listing.',
    flags: 64

  });

}


// =========================
// AGENCY MODAL SUBMIT
// =========================

if (
  interaction.isModalSubmit() &&
  interaction.customId.startsWith(
    'agency_listing_modal_'
  )
) {

  const primaryService =
    interaction.customId.replace(
      'agency_listing_modal_',
      ''
    );

  const agencyName =
    interaction.fields.getTextInputValue(
      'agency_name'
    );

  const founded =
    interaction.fields.getTextInputValue(
      'founded'
    );

  const website =
    interaction.fields.getTextInputValue(
      'website'
    );

  const teamSize =
    interaction.fields.getTextInputValue(
      'team_size'
    );

  const details =
    interaction.fields.getTextInputValue(
      'details'
    );

  const cleanAgency =
  agencyName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const cleanDomain =
  website
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .replace(/\.(com|in|co\.in)$/i, '')
    .replace(/[^a-z0-9]/g, '');

const validExtension =
  /\.(com|in|co\.in)$/i.test(
    website
  );

const matchingName =
  cleanDomain.includes(
    cleanAgency.slice(0, 4)
  ) ||
  cleanAgency.includes(
    cleanDomain.slice(0, 4)
  );

const validWebsite =
  validExtension &&
  matchingName;

if (!validWebsite) {

  return interaction.reply({

    content:
'❌ Domain must end with .com, .in or .co.in and should roughly match your agency name.',

    flags: 64

  });

}

const cooldown =
  agencyCooldowns.get(
    interaction.user.id
  );

if (
  cooldown &&
  Date.now() < cooldown
) {

  const remaining =
    Math.ceil(
      (cooldown - Date.now()) /
      (1000 * 60 * 60)
    );

  return interaction.reply({

    content:
`❌ You can create another agency listing in ${remaining} hours.`,

    flags: 64

  });

}

  pendingAgencyPosts.set(
    interaction.user.id,
    {
      agencyName,
      founded,
      website,
      teamSize,
      details,
      primaryService
    }
  );


  const row = new ActionRowBuilder()

    .addComponents(

      new ButtonBuilder()

        .setCustomId(
          'upload_testimonials'
        )

        .setLabel(
          'Upload Testimonials'
        )

        .setEmoji('📸')

        .setStyle(
          ButtonStyle.Secondary
        )

    );

  return interaction.reply({

    content:
'📸 Upload exactly 2 testimonials. Your agency listing will only be posted after successful verification.',
    components: [row],

    flags: 64

  });

}

      // =========================
      // MODAL SUBMIT
      // =========================

if (
  interaction.isModalSubmit() &&
  interaction.customId.startsWith(
    'listing_modal_'
  )
) {


const selectedService =
  interaction.customId.replace(
    'listing_modal_',
    ''
  );

        const service =
          interaction.fields.getTextInputValue(
            'service'
          );

        const experience =
          interaction.fields.getTextInputValue(
            'experience'
          );

        const portfolio =
          interaction.fields.getTextInputValue(
            'portfolio'
          );

        const pricing =
          interaction.fields.getTextInputValue(
            'pricing'
          );
         
const availability =
  interaction.fields.getTextInputValue(
    'availability'
  );

        const details =
          interaction.fields.getTextInputValue(
            'details'
          );

const forum =
  await client.channels.fetch(
    FREELANCER_FORUM_ID
  );

        await forum.threads.create({

          name:
`${service} • ${interaction.user.username}`,

appliedTags: [
  TAGS[selectedService]
],


          message: {

            embeds: [

              new EmbedBuilder()

                .setColor('#d5d5d5')

                .setTitle(`📢 ${agencyName}`)

                .setDescription(details)

                .addFields(

                  {
                    name: '👨‍💻 Experience',
                    value: experience
                  },

                  {
                    name: '💰 Pricing',
                    value: pricing
                  },

                  {
  name: '⏰ Availability',
  value: availability
},

                  {
                    name: '🌐 Portfolio',
                    value: portfolio
                  },

                  {
                    name: '📩 Contact',
                    value: `${interaction.user}`
                  }

                )

                .setFooter({
                  text:
'UpGoom Freelancer Marketplace'
                })

            ]

          }

        });

        await interaction.reply({

          content:
'✅ Your listing has been posted successfully.',

          flags: 64

        });

         }

    } catch (err) {

      console.log(err);

    }

  });

  // =========================
  // TESTIMONIAL UPLOADS
  // =========================

  client.on('messageCreate', async (message) => {

    try {

      if (message.author.bot) return;

      const waiting =
        agencyTestimonials.get(
          message.author.id
        );

      if (!waiting) return;

      const pending =
        pendingAgencyPosts.get(
          message.author.id
        );

      if (!pending) return;

      if (
        message.attachments.size < 2
      ) {

        return message.reply(
'❌ Upload exactly 2 screenshots.'
        );

      }

      const attachments =
        [...message.attachments.values()];

      const testimonial1 =
        attachments[0]?.url;

      const testimonial2 =
        attachments[1]?.url;

      const row =
        new ActionRowBuilder()

          .addComponents(

            new ButtonBuilder()

              .setLabel(
                'View Testimonial 1'
              )

              .setStyle(
                ButtonStyle.Link
              )

              .setURL(testimonial1),

            new ButtonBuilder()

              .setLabel(
                'View Testimonial 2'
              )

              .setStyle(
                ButtonStyle.Link
              )

              .setURL(testimonial2)

          );

const forum =
  await client.channels.fetch(
    AGENCY_FORUM_ID
  );

      await forum.threads.create({

  appliedTags: [
    AGENCY_TAGS[
      pending.primaryService
    ]
  ],

name:
`${pending.agencyName} - ${pending.primaryService} Agency (Verified)`,

        message: {

          embeds: [

            new EmbedBuilder()

              .setColor('#d5d5d5')

              .setTitle(
`${pending.agencyName} - ${pending.primaryService} Agency (Verified)`
)

              .setDescription(
                pending.details
              )

              .addFields(

                {
                  name:
'🎯 Primary Service',

                  value:
pending.primaryService
                },

                {
                  name:
'📅 Running Since',

                  value:
pending.founded
                },

                {
                  name:
'👥 Team Size',

                  value:
pending.teamSize
                },

                {
                  name:
'🌐 Website',

                  value:
pending.website
                },

              )

              .setFooter({

                text:
'UpGoom Agency Marketplace'

              })

          ],

          components: [row]

        }

      });

      agencyCooldowns.set(
  message.author.id,
  Date.now() +
  3 * 24 * 60 * 60 * 1000
);

      pendingAgencyPosts.delete(
        message.author.id
      );

      agencyTestimonials.delete(
        message.author.id
      );

      await message.reply(
'✅ Verified agency listing posted successfully.'
      );

    } catch (err) {

      console.log(err);

    }

  });

};
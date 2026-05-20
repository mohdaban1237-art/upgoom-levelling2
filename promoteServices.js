const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
StringSelectMenuBuilder

} = require('discord.js');

module.exports = (client) => {

  // =========================
  // CONFIG
  // =========================

  const PROMOTE_CHANNEL_ID =
    '1505230156858396804';

  const FORUM_CHANNEL_ID =
    '1502166599422054420';

const TAGS = {

  editor: '1502753456266547301',

  designer: '1502753627637420172',

  developer: '1502753774601769122',

  animator: '1502753855681597562'

};


  // =========================
  // READY
  // =========================

  client.once('ready', async () => {

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

    await channel.send({

      embeds: [embed],

      components: [row]

    });

  });

  // =========================
  // INTERACTIONS
  // =========================

  client.on('interactionCreate', async (interaction) => {

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

  return interaction.reply({

    content:
'Select your service category below.',

    components: [row],

    ephemeral: true

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

      .setStyle(TextInputStyle.Short)

      .setRequired(true);

  const experienceInput =
    new TextInputBuilder()

      .setCustomId('experience')

      .setLabel('Experience')

      .setStyle(TextInputStyle.Short)

      .setRequired(true);

  const portfolioInput =
    new TextInputBuilder()

      .setCustomId('portfolio')

      .setLabel('Portfolio Link')

      .setStyle(TextInputStyle.Short)

      .setRequired(true);

  const pricingInput =
    new TextInputBuilder()

      .setCustomId('pricing')

      .setLabel('Pricing')

      .setStyle(TextInputStyle.Short)

      .setRequired(true);

  const detailsInput =
    new TextInputBuilder()

      .setCustomId('details')

      .setLabel('Specialization / Details')

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
      .addComponents(detailsInput)

  );

  return interaction.showModal(modal);

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

        const details =
          interaction.fields.getTextInputValue(
            'details'
          );

        const forum =
          await client.channels.fetch(
            FORUM_CHANNEL_ID
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

                .setTitle(`📢 ${service}`)

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

          ephemeral: true

        });

      }

    } catch (err) {

      console.log(err);

    }

  });

};
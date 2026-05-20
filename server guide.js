const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events
} = require('discord.js');

/* =========================
   ROLE IDS
========================= */

const ROLES = {
  FREELANCER: '1502182709252853860',
  AGENCY: '1427252949863891002',
  CREATOR: '1427252949863891000',
  CLIENT: '1427252949863891001'
};

/* =========================
   CHANNEL
========================= */

const GUIDE_CHANNEL_ID = '1427252950421471258';

module.exports = (client) => {

  /* =========================
     READY
  ========================= */

  client.once(Events.ClientReady, async () => {

    console.log(`${client.user.tag} is online`);

    const channel = await client.channels.fetch(GUIDE_CHANNEL_ID);

    const embed = new EmbedBuilder()
      .setTitle('🗺️ UpGoom Personalized Server Guide')
      .setDescription(
        'Click the button below to view your personalized server guide based on your current role.'
      )
      .setColor(14540253)
      .setFooter({
        text: 'UpGoom • Freelancers × Creators × Agencies'
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('open_guide')
        .setLabel('Open My Guide')
        .setStyle(ButtonStyle.Primary)
    );

    await channel.send({
      embeds: [embed],
      components: [row]
    });

  });

  /* =========================
     INTERACTION
  ========================= */

  client.on(Events.InteractionCreate, async (interaction) => {

    if (!interaction.isButton()) return;

    if (interaction.customId !== 'open_guide') return;

    const member = interaction.member;

    const isFreelancer = member.roles.cache.has(ROLES.FREELANCER);
    const isAgency = member.roles.cache.has(ROLES.AGENCY);
    const isCreator = member.roles.cache.has(ROLES.CREATOR);
    const isClient = member.roles.cache.has(ROLES.CLIENT);

    /* =========================
       PUBLIC CHANNELS
    ========================= */

    let fields = [

      {
        name: '📖 Info Section',
        value:
` <#1427252950421471257> — Start here after joining the server.
 <#1427252950421471258> — Full server navigation and systems.
 <#1427252950421471259> — Read all rules carefully.
 <#1434535059020316797> — Pick your roles to unlock channels.`
      },

      {
        name: '📢 System & Updates',
        value:
` <#1433031595509551154> — Important server announcements and updates.
 <#1427252950421471261> — Level-up rewards and progression updates.`
      },

      {
        name: '💬 Public Community',
        value:
` <#1427252950635647011> — General discussions and networking.
 <#1427252950635647015> — Suggestions and feedback.
 <#1432664339516620810> — Memes and fun content.
 <#1432663701521174559> — Off-topic discussions.
 <#1503369346406289549> — Freelancing help and advice.`
      }

    ];

    /* =========================
       FREELANCER GUIDE
    ========================= */

    if (isFreelancer) {

      fields.push(
        {
          name: '🎨 Freelancers Space',
          value:
` <#1427252950903947326> — Editors networking hub for discussions & help.
 <#1502568507123175514> — Designers networking hub for discussions & help.
 <#1427252950903947330> — Developers discussion space for discussions & help.
 <#1427252950903947328> — Animators and artists space for discussions & help.

 <#1501871825297342474> — Share your edits here.
 <#1501872045187924008> — Share your designs here.
 <#1501872159176527981> — Share your deployed websites/apps here.
 <#1501872466753228800> — Share animations and artwork here.`
        },

        {
          name: '💼 Jobs & Hiring',
          value:
` <#1498293849540395010> — Read before posting or applying.
 <#1502200204214927510> — Browse server jobs.
 <#1434954841360433354> — Latest remote creator jobs.
 <#1503368196344905859> — Latest verified company jobs.`
        },

        {
          name: '📢 Promote Yourself',
          value:
` <#1505230156858396804> — Promote your freelance services.
 <#1502166599422054420> — Browse and hire freelancers.`
        }
      );
    }

    /* =========================
       AGENCY GUIDE
    ========================= */

    if (isAgency) {

      fields.push(
        {
          name: '💼 Agency Hiring System',
          value:
` <#1434953577050407106> — Create professional job requests.
 <#1502166599422054420> — Browse and hire freelancers.
 <#1505230156858396804> — Service marketplace.
 <#1433533918937612308> — Promotions and advertisements.`
        },

        {
          name: '🎥 Agency & Creator Network',
          value:
` <#1432426803003396236> — Agency networking and discussions.
 <#1433032412299788309> — Instagram creators hub.
 <#1502182556571926668> — YouTube creators hub.`
        },

        {
          name: '☕ Agency VC',
          value:
`☕ <#1502198827892084846> — Agencies VC.`
        }
      );
    }

    /* =========================
       CREATOR / CLIENT GUIDE
    ========================= */

    if (isCreator || isClient) {

      fields.push(
        {
          name: '🎥 Creator & Client Area',
          value:
` <#1433032412299788309> — Instagram creators hub.
 <#1502182556571926668> — YouTube creators hub.
 <#1433032745549955142> — Buy and sell creator accounts.`
        },

        {
          name: '💼 Hiring Freelancers',
          value:
` <#1434953577050407106> — Create job requests.
 <#1502166599422054420> — Browse freelancers.
 <#1502200204214927510> — Explore server jobs channel.`
        }
      );
    }

    /* =========================
       SECURITY
    ========================= */

    fields.push({
      name: '⚠️ Inspection & Protection',
      value:
` <#1427252951059005469> — Report scams and suspicious activity.
 <#1427252951222845470> — Confirmed scammers archive.`
    });

    /* =========================
       FINAL EMBED
    ========================= */

    const guideEmbed = new EmbedBuilder()
      .setTitle('🗺️ Your Personalized UpGoom Guide')
      .setDescription(
        'This guide is automatically customized according to your current server roles.'
      )
      .setColor(14540253)
      .addFields(fields)
      .setFooter({
        text: 'UpGoom • Freelancers × Creators × Agencies'
      });

    await interaction.reply({
      embeds: [guideEmbed],
      ephemeral: true
    });

  });

};
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
  CLIENT: '1427252949863891001',
  VIDEO_EDITOR: '1427252949884731485',
  DESIGNER: '1427252949863891005', 
  DEVELOPER: '1427252949863891004',
  ANIMATOR: '1427252949863890999'
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

const isVideoEditor = member.roles.cache.has(ROLES.VIDEO_EDITOR);
const isDesigner = member.roles.cache.has(ROLES.DESIGNER);
const isDeveloper = member.roles.cache.has(ROLES.DEVELOPER);
const isAnimator = member.roles.cache.has(ROLES.ANIMATOR);

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
   VIDEO EDITOR GUIDE
========================= */

if (isVideoEditor) {

  fields.push({
    name: '🎞️ Video Editors Space',
    value:
` <#1427252950903947326> — Editors networking hub.
 <#1501871825297342474> — Share your edits here.
 <#1505950140723105832> — Editing help section.
 <#1427252951059005465> — Editors VC lounge.`
  });

}

/* =========================
   DESIGNER GUIDE
========================= */

if (isDesigner) {

  fields.push({
    name: '🎨 Designers Space',
    value:
` <#1502568507123175514> — Designers networking hub.
 <#1501872045187924008> — Share your designs here.
 <#1505950191063404647> — Design help section.
 <#1427252951059005466> — Designers VC lounge.`
  });

}

/* =========================
   DEVELOPER GUIDE
========================= */

if (isDeveloper) {

  fields.push({
    name: '💻 Developers Space',
    value:
` <#1427252950903947330> — Developers networking hub.
 <#1501872159176527981> — Share your deploys here.
 <#1505950283904057441> — Developer help section.
 <#1427252951059005464> — Developers VC lounge.`
  });

}

/* =========================
   ANIMATOR GUIDE
========================= */

if (isAnimator) {

  fields.push({
    name: '🚀 Animators & Artists Space',
    value:
` <#1427252950903947328> — Animators networking hub.
 <#1501872466753228800> — Share your animations here.
 <#1505950359305064569> — Animator help section.`
  });

}

/* =========================
   FREELANCER MARKETPLACE
========================= */

if (
  isVideoEditor ||
  isDesigner ||
  isDeveloper ||
  isAnimator
) {

  fields.push({
    name: '📢 Promote & Get Clients',
    value:
` <#1505230156858396804> — Promote your freelance services.
 <#1502166599422054420> — Browse client hiring posts.
 <#1502200204214927510> — Explore server jobs.
 <#1434953577050407106> — Clients create jobs here.
 <#1433533918937612308> — Promotions and advertisements.`
  });

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
 <#1502166599422054420> — Browse and hire talented freelancers.
 <#1505230156858396804> — Promote your agency services.
 <#1433533918937612308> — Other Promotions and advertisements.`
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
 <#1433032745549955142> — Buy and sell creator accounts.
 <#1502198379575509062> — Creators VC.`
    },

    {
      name: '💼 Hiring Freelancers',
      value:
` <#1434953577050407106> — Create job requests.
 <#1502166599422054420> — Browse freelancers & agencies.
 <#1502200204214927510> — Explore server jobs channel.`
    },

    {
      name: '🎨 Freelancer Showcases',
      value:
` <#1501871825297342474> — Explore the edits works of our editors.
 <#1501872045187924008> — Explore the designs works of our designers.
 <#1501872159176527981> — Explore the sites/apps of our developers.
 <#1501872466753228800> — Explore the animations/art works of our animators.

Browse freelancer work and directly hire through DMs.`
    }
  );

}

/* =========================
   JOBS PREVIEW
========================= */

let jobsPreview = `
🔒 Most jobs channels are locked.

 <#1498293849540395010> — Unlock channels guide.
 <#1434954841360433354> — Creator hiring jobs.
 <#1503368196344905859> — Company hiring jobs.
`;

if (isVideoEditor || isAgency) {
  jobsPreview += `\n <#1505558906003525653> — Get Genuine Video Editing Warm leads (Creators/Businesses looking for video editors urgently).`;
}

if (isDesigner || isAgency) {
  jobsPreview += `\n <#1505559138283819008> — Get Genuine Designing Warm leads (Creators/Businesses looking for designers urgently).`;
}

if (isDeveloper || isAgency) {
  jobsPreview += `\n <#1505558994956324955> — Get Genuine Web Development Warm leads (Brands/Businesses looking for developers urgently).`;
}

if (!isCreator && !isClient) {

  fields.push({
    name: '💼 Exclusive Jobs & Warm Leads',
    value: jobsPreview
  });

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
require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  AttachmentBuilder
} = require('discord.js');

const { Rank } = require('canvacord');

const path = require('path');

module.exports = (client) => {

/* =========================
   CONFIG
========================= */

// CHANNEL WHERE LEVEL-UP MSGS GO
const LEVEL_CHANNEL_ID = '1427252950421471261';

// CHANNELS WHERE XP IS ALLOWED
const XP_CHANNELS = [
  '1427252950635647011',
  '1427252950635647015',
  '1427252950635647019',
  '1432426803003396236',
  '1427252950903947326',
  '1502568507123175514',
  '1427252950903947330',
  '1427252950903947328',
  '1432663701521174559'
];

// BASE ROLES
const FREELANCER_ROLE = '1502182709252853860';
const CREATOR_ROLE = '1427252949863891000';
const AGENCY_ROLE = '1427252949863891002';


// NICHE BASE ROLES
const VIDEO_EDITOR_ROLE = '1427252949884731485';
const DESIGNER_ROLE = '1427252949863891005';
const DEVELOPER_ROLE = '1427252949863891004';
const ANIMATOR_ROLE = '1427252949863890999';

// NICHE ACTIVE ROLES
const ACTIVE_VIDEO_EDITOR = '1501869255602208788';
const ACTIVE_DESIGNER = '1501869423567568958';
const ACTIVE_DEVELOPER = '1501869512126103622';
const ACTIVE_ANIMATOR = '1501869583273824316';



// REWARD ROLES
const ACTIVE_FREELANCER = '1502199257564971028';
const VERIFIED_FREELANCER = '1427252949863891003';

const ACTIVE_CREATOR = '1502288072031862844';
const ACTIVE_AGENCY = '1502200446604017684';

// XP SETTINGS
const XP_PER_MESSAGE = 500;
const COOLDOWN = 1000; // 1 second

// LEVEL FORMULA
function getLevel(xp) {
  return Math.floor(xp / 1000)+ 1;
}

/*
200 XP = level 1
1000 XP = level 5
2000 XP = level 10

5 messages = level 2
10 messages = level 5
20 messages = level 10
*/

/* =========================
   MEMORY STORAGE
========================= */

const userXP = new Map();
const cooldowns = new Map();

/* =========================
   MESSAGE EVENT
========================= */

client.on('messageCreate', async (message) => {

  if (message.author.bot) return;

  // XP CHANNEL CHECK
  if (!XP_CHANNELS.includes(message.channel.id)) return;

  const userId = message.author.id;

  // COOLDOWN CHECK
  const now = Date.now();

  if (cooldowns.has(userId)) {
    const expiration = cooldowns.get(userId);

    if (now < expiration) return;
  }

  cooldowns.set(userId, now + COOLDOWN);

  // USER DATA
  if (!userXP.has(userId)) {
    userXP.set(userId, {
      xp: 0,
      level: 0
    });
  }

  const data = userXP.get(userId);

  // ADD XP
  data.xp += XP_PER_MESSAGE;

  const oldLevel = data.level;
  const newLevel = getLevel(data.xp);


  // LEVEL UP CHECK
  const member = message.member;
let currentRank = 1;

if (newLevel >= 3) {

  currentRank = 2;

}

if (newLevel >= 4) {

  currentRank = 3;

}


if (newLevel > oldLevel) {

  data.level = newLevel;

  const levelChannel =
    message.guild.channels.cache.get(
      LEVEL_CHANNEL_ID
    );

  let nextRole = 'No further unlocks';
  let currentRole = 'Base Member';
  let targetXP = data.xp;

  /* =========================
     FREELANCER PATH
  ========================= */

  if (member.roles.cache.has(FREELANCER_ROLE)) {

    currentRole = '🧑 Freelancer';

    if (
      member.roles.cache.has(
        ACTIVE_FREELANCER
      )
    ) {

      currentRole =
        '🔥 Active Freelancer';

    }

    if (
      member.roles.cache.has(
        VERIFIED_FREELANCER
      )
    ) {

      currentRole =
        '💎 Verified Freelancer';

    }

    if (
      !member.roles.cache.has(
        ACTIVE_FREELANCER
      )
    ) {

      nextRole =
        '🔥 Active Freelancer';

      targetXP = 2000;

    }

    else if (

      member.roles.cache.has(
        VIDEO_EDITOR_ROLE
      ) &&

      !member.roles.cache.has(
        ACTIVE_VIDEO_EDITOR
      )

    ) {

      nextRole =
        '🎬 Active Video Editor';

      targetXP = 3000;

    }

    else if (

      member.roles.cache.has(
        DESIGNER_ROLE
      ) &&

      !member.roles.cache.has(
        ACTIVE_DESIGNER
      )

    ) {

      nextRole =
        '🎨 Active Designer';

      targetXP = 3000;

    }

    else if (

      member.roles.cache.has(
        DEVELOPER_ROLE
      ) &&

      !member.roles.cache.has(
        ACTIVE_DEVELOPER
      )

    ) {

      nextRole =
        '💻 Active Developer';

      targetXP = 3000;

    }

    else if (

      member.roles.cache.has(
        ANIMATOR_ROLE
      ) &&

      !member.roles.cache.has(
        ACTIVE_ANIMATOR
      )

    ) {

      nextRole =
        '🚀 Active Animator';

      targetXP = 3000;

    }

    else if (

      !member.roles.cache.has(
        VERIFIED_FREELANCER
      )

    ) {

      nextRole =
        '💎 Verified Freelancer';

      targetXP = 4000;

    }

  }

  /* =========================
     CREATOR PATH
  ========================= */

  if (member.roles.cache.has(CREATOR_ROLE)) {

    currentRole = '🎬 Creator';

    if (
      member.roles.cache.has(
        ACTIVE_CREATOR
      )
    ) {

      currentRole =
        '🚀 Active Creator';

    }

    if (
      !member.roles.cache.has(
        ACTIVE_CREATOR
      )
    ) {

      nextRole =
        '🚀 Active Creator';

      targetXP = 2000;

    }

  }

  /* =========================
     AGENCY PATH
  ========================= */

  if (member.roles.cache.has(AGENCY_ROLE)) {

    currentRole = '🏢 Agency';

    if (
      member.roles.cache.has(
        ACTIVE_AGENCY
      )
    ) {

      currentRole =
        '⭐ Active Agency';

    }

    if (
      !member.roles.cache.has(
        ACTIVE_AGENCY
      )
    ) {

      nextRole =
        '⭐ Active Agency';

      targetXP = 2000;

    }

  }

  const xpLeft =
    Math.max(
      targetXP - data.xp,
      0
    );

  const rank = new Rank()

    .setAvatar(
      message.author.displayAvatarURL({
        forceStatic: true
      })
    )

    .setCurrentXP(data.xp)

    .setRequiredXP(targetXP)

    .setStatus('online')

    .setProgressBar(
      '#d5d5d5',
      'COLOR'
    )

    .setUsername(
      message.author.username
    )

    .setLevel(newLevel)

.setRank(
  currentRank,
  'RANK',
  true
)
.setDiscriminator('0001')

    .setOverlay('#00000066')

    .setBackground(
      'IMAGE',
      './assets/level-bg.png'
    );

  const image =
    await rank.build();

  const attachment =
    new AttachmentBuilder(
      image,
      {
        name:
          'level-up.png'
      }
    );

  if (levelChannel) {

    const embed =
      new EmbedBuilder()

        .setColor('#d5d5d5')

        .setDescription(

`🎉 ${message.author} reached **Level ${newLevel}**

🏅 Current Role:
**${currentRole}**

🚀 Next Unlock:
**${nextRole}**

📈 Progress:
**${data.xp} / ${targetXP} XP**

⏳ XP Left:
**${xpLeft}**`

        );

    levelChannel.send({

      embeds: [embed],

      files: [attachment]

    });

  }

    /* =========================
       FREELANCER
    ========================= */

    if (member.roles.cache.has(FREELANCER_ROLE)) {

      // LEVEL 5
   if (
  newLevel >= 3 &&
  !member.roles.cache.has(ACTIVE_FREELANCER)
) {

  await member.roles.add(ACTIVE_FREELANCER);

  const rewardEmbed = new EmbedBuilder()
    .setColor('#00ff99')
    .setTitle('🏆 Rank 2 Unlocked!')
    .setDescription(
`🎉 ${member}

🔓 Role Unlocked:
<@&1502199257564971028>

📂 Channels Unlocked:
<#1434954841360433354> & <#1503368196344905859>

🚀 Keep grinding for the next rank!`
    );

  levelChannel.send({
    embeds: [rewardEmbed],
    files: [attachment]
  });

  member.send({
    embeds: [rewardEmbed],
    files: [attachment]
  }).catch(() => {});
}

      if (
  newLevel >= 5 &&
  !member.roles.cache.has(VERIFIED_FREELANCER)
) {

  await member.roles.add(VERIFIED_FREELANCER);

  const rewardEmbed = new EmbedBuilder()
    .setColor('#ffd700')
    .setTitle('💎 Rank 4 Unlocked!')
    .setDescription(
`🎉 ${member}

🔓 Role Unlocked:
<@&1427252949863891003>

📂 New Access:
<#1427252950635647015>

🔥 You reached Verified Freelancer rank!`
    );

  levelChannel.send({
    embeds: [rewardEmbed],
    files: [attachment]
  });

  member.send({
    embeds: [rewardEmbed],
    files: [attachment]
  }).catch(() => {});
}
      }

      /* =========================
   CREATOR
========================= */

if (member.roles.cache.has(CREATOR_ROLE)) {

  if (
    newLevel >= 3 &&
    !member.roles.cache.has(ACTIVE_CREATOR)
  ) {

    await member.roles.add(ACTIVE_CREATOR);
  }
}

/* =========================
   AGENCY
========================= */

if (member.roles.cache.has(AGENCY_ROLE)) {

  
  if (
    newLevel >= 3 &&
    !member.roles.cache.has(ACTIVE_AGENCY)
  ) {

    await member.roles.add(ACTIVE_AGENCY);

  }
}

/* =========================
   VIDEO EDITOR
========================= */

if (

  member.roles.cache.has(VIDEO_EDITOR_ROLE) &&

  newLevel >= 4 &&

  !member.roles.cache.has(
    ACTIVE_VIDEO_EDITOR
  )

) {

  await member.roles.add(
    ACTIVE_VIDEO_EDITOR
  );

  const rewardEmbed =
    new EmbedBuilder()

      .setColor('#ff4141')

      .setTitle(
        '🎬 Rank 3 Unlocked!'
      )

      .setDescription(

`🎉 ${member}

🔓 Role Unlocked:
<@&1501869255602208788>

📂 Channels Unlocked:
<#1505558906003525653>

🔥 You are now an Active Video Editor.`

      );

  levelChannel.send({

    embeds: [rewardEmbed],
    files: [attachment]

  });

}

/* =========================
   DESIGNER
========================= */

if (

  member.roles.cache.has(DESIGNER_ROLE) &&

  newLevel >= 4 &&

  !member.roles.cache.has(
    ACTIVE_DESIGNER
  )

) {

  await member.roles.add(
    ACTIVE_DESIGNER
  );

  const rewardEmbed =
    new EmbedBuilder()

      .setColor('#9b59b6')

      .setTitle(
        '🎨 Active Designer Unlocked!'
      )

      .setDescription(

`🎉 ${member}

🔓 Role Unlocked:
<@&1501869423567568958>

📂 New Access:
<#1493208129612283914>

🔥 You are now an Active Designer.`

      );

  levelChannel.send({

    embeds: [rewardEmbed],
    files: [attachment]

  });

}

/* =========================
   DEVELOPER
========================= */

if (

  member.roles.cache.has(DEVELOPER_ROLE) &&

  newLevel >= 4 &&

  !member.roles.cache.has(
    ACTIVE_DEVELOPER
  )

) {

  await member.roles.add(
    ACTIVE_DEVELOPER
  );

  const rewardEmbed =
    new EmbedBuilder()

      .setColor('#2ecc71')

      .setTitle(
        '💻 Active Developer Unlocked!'
      )

      .setDescription(

`🎉 ${member}

🔓 Role Unlocked:
<@&ACTIVE_DEVELOPER_ID>

📂 New Access:
<#1434955414100906154>

🔥 You are now an Active Developer.`

      );

  levelChannel.send({

    embeds: [rewardEmbed],
    files: [attachment]

  });

}

/* =========================
   ANIMATOR
========================= */

if (

  member.roles.cache.has(ANIMATOR_ROLE) &&

  newLevel >= 4 &&

  !member.roles.cache.has(
    ACTIVE_ANIMATOR
  )

) {

  await member.roles.add(
    ACTIVE_ANIMATOR
  );

  const rewardEmbed =
    new EmbedBuilder()

      .setColor('#5900ff')

      .setTitle(
        '🚀 Active Animator Unlocked!'
      )

      .setDescription(

`🎉 ${member}

🔓 Role Unlocked:
<@&ACTIVE_ANIMATOR_ID>

📂 New Access:
<#1502289576138641550>

🔥 You are now an Active Animator.`

      );

  levelChannel.send({

    embeds: [rewardEmbed],
    files: [attachment]

  });

}

  }

});

};
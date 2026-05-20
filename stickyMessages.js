const {
  EmbedBuilder
} = require('discord.js');

module.exports = (client) => {

  const STICKY_CHANNELS = {

'1501871825297342474': {
  title: '🎬 Showcase Edits',

  description:
`This channel is only for video showcases and completed editing work.

Allowed links include YouTube videos and Google Drive file links only. Folder links, portfolios, advertisements, or unrelated content are not allowed here.

Keep at least a 6-hour gap between showcases and focus on sharing polished work with constructive feedback.`
},

'1501872045187924008': {
  title: '🎨 Showcase Designs',

  description:
`Dedicated channel for design showcases including thumbnails, posters, branding, UI concepts, graphics, and other visual artwork.

Only image-based showcases are allowed. Videos, unrelated media, spam posting, or self-promotion should be avoided.

Focus on quality work and respectful feedback.`
},

'1501872466753228800': {
  title: '🖌️ Animation & Arts',

  description:
`Share animations, motion art, illustrations, artwork, and creative visual projects in this channel.

Both images and videos are allowed here, but avoid unfinished dumps, spam uploads, or unrelated content.

Respect every artist’s style and maintain a positive creative environment.`
},

'1433032745549955142': {
title: '📈 Buy & Sell Accounts',

description:
`This channel is only for buying and selling social media accounts related to YouTube, Instagram, and TikTok.

Every listing must clearly include:
• account niche/category
• audience/follower details
• monetization status
• price or expected range

A screenshot of the account dashboard/analytics is mandatory for every listing to improve transparency and reduce fake listings.

Keep all deals professional and trade carefully. Staff is not responsible for external transactions between users.`
},

'1501872159176527981': {
  title: '💻 Showcase Deploys',

  description:
`This channel is dedicated to deployed websites, apps, coding tools, SaaS projects, UI builds, and development showcases.

Supported platforms include Framer, Cloudflare, Vercel, Netlify, Render, GitHub, Replit, and CodePen.

Random links, self-promotion spam, or unrelated content are not allowed. Share functional public projects only and keep discussions professional and developer-focused.`
}


  };

  // STORE LAST STICKY IDS
  const stickyMessages = {};

  // MESSAGE COUNTS
  const messageCounts = {};

  client.on('messageCreate', async (message) => {

    try {

      if (message.author.bot) return;

      const sticky = STICKY_CHANNELS[message.channel.id];

      if (!sticky) return;

      // MESSAGE COUNT
      if (!messageCounts[message.channel.id]) {
        messageCounts[message.channel.id] = 0;
      }

      messageCounts[message.channel.id]++;

      // SEND AFTER 1 MESSAGE
      if (messageCounts[message.channel.id] < 1) return;

      // RESET
      messageCounts[message.channel.id] = 0;

      // DELETE OLD STICKY
      if (stickyMessages[message.channel.id]) {

        try {

          const oldMessage =
            await message.channel.messages.fetch(
              stickyMessages[message.channel.id]
            );

          if (oldMessage) {
            await oldMessage.delete();
          }

        } catch (err) {}

      }


// SEND STICKY EMBED
const sentSticky = await message.channel.send({

  embeds: [

    new EmbedBuilder()
      .setColor('#613a3a')
      .setTitle(sticky.title)
      .setDescription(sticky.description)
      .setFooter({
        text: '📌 Sticky Message'
      })

  ]

});


      // SAVE ID
      stickyMessages[message.channel.id] =
        sentSticky.id;

      console.log('Sticky sent');

    } catch (err) {

      console.log(err);

    }

  });

};
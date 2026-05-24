require('dotenv').config();

const { QuickDB } = require("quick.db");
const db = new QuickDB();

const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Events,
  MessageFlags
} = require('discord.js');

module.exports = (client) => {

client.once(Events.ClientReady, async () => {

  console.log(`Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch('1434535059020316797');

  const embed = new EmbedBuilder()
    .setTitle('Pickup A Role For Yourself [Only 1]')
    .setDescription('✧ Choose your role by clicking the button below to connect with like-minded members and get access to role-specific channels and updates.✧')
    .setImage('https://i.postimg.cc/ry5QJn2D/ef16e4e68b0d3cb81e6bb8a8c3258d7e-1.gif')
    .setColor('#d5d5d5');

  const row1 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('editor')
        .setLabel('🎬 Video Editor')
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId('designer')
        .setLabel('🎨 Designer')
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId('developer')
        .setLabel('💻 Developer')
        .setStyle(ButtonStyle.Success)
    );

  const row2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('animator')
        .setLabel('✨ Animator')
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId('client')
        .setLabel('💼 Client')
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId('creator')
        .setLabel('📸 Creator')
        .setStyle(ButtonStyle.Danger)
    );

  const row3 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('agency')
        .setLabel('🏢 Agency')
        .setStyle(ButtonStyle.Secondary)
    );

  const messages = await channel.messages.fetch({ limit: 10 });

  const existingMessage = messages.find(
    msg =>
      msg.author.id === client.user.id &&
      msg.embeds.length > 0 &&
      msg.embeds[0].title === 'Pickup A Role For Yourself [Only 1]'
  );

  if (!existingMessage) {
    await channel.send({
      embeds: [embed],
      components: [row1, row2, row3]
    });
  }

});

client.on(Events.InteractionCreate, async interaction => {
  try {

  if (!interaction.isButton()) return;
if (
  interaction.customId !== 'editor' &&
  interaction.customId !== 'designer' &&
  interaction.customId !== 'developer' &&
  interaction.customId !== 'animator' &&
  interaction.customId !== 'client' &&
  interaction.customId !== 'creator' &&
  interaction.customId !== 'agency'
) return;

const member = await interaction.guild.members.fetch(interaction.user.id);


const editorRole = interaction.guild.roles.cache.find(r => r.name === "Video Editor");
const designRole = interaction.guild.roles.cache.find(r => r.name === "Designer");
const developerRole = interaction.guild.roles.cache.find(r => r.name === "Developer");
const freelancerRole = interaction.guild.roles.cache.find(r => r.name === "Freelancer");
const animatorRole = interaction.guild.roles.cache.find(r => r.name === "Animator");
const clientRole = interaction.guild.roles.cache.find(r => r.name === "Client");
const creatorRole = interaction.guild.roles.cache.find(r => r.name === "Creator");
const agencyRole = interaction.guild.roles.cache.find(r => r.name === "Agency");
const requiredRoles = [
  editorRole,
  designRole,
  developerRole,
  freelancerRole,
  animatorRole,
  clientRole,
  creatorRole,
  agencyRole
];

if (requiredRoles.some(role => !role)) {
  return interaction.reply({
    content: '❌ One or more required roles are missing. Please contact staff.',
    flags: MessageFlags.Ephemeral
  });
}

  await interaction.deferReply({
  flags: MessageFlags.Ephemeral
});

if (
  interaction.customId === 'client' ||
  interaction.customId === 'creator' ||
  interaction.customId === 'agency'
) {

  const rolesToRemove = [
    editorRole,
    designRole,
    developerRole,
    animatorRole,
    freelancerRole,
    clientRole,
    creatorRole,
    agencyRole
  ].filter(Boolean);

  await member.roles.remove(rolesToRemove);

} else {

  const rolesToRemove = [
    editorRole,
    designRole,
    developerRole,
    animatorRole,
    freelancerRole,
    clientRole,
    creatorRole,
    agencyRole
  ].filter(Boolean);

  await member.roles.remove(rolesToRemove);

}

let roleName = '';

if (interaction.customId === 'editor') {
  await member.roles.add(editorRole);
  await member.roles.add(freelancerRole);
  roleName = 'Video Editor';
}

if (interaction.customId === 'designer') {
  await member.roles.add(designRole);
  await member.roles.add(freelancerRole);
  roleName = 'Designer';
}

if (interaction.customId === 'developer') {
  await member.roles.add(developerRole);
  await member.roles.add(freelancerRole);
  roleName = 'Developer';
}

if (interaction.customId === 'animator') {
  await member.roles.add(animatorRole);
  await member.roles.add(freelancerRole);
  roleName = 'Animator';
}

if (interaction.customId === 'client') {
  await member.roles.add(clientRole);
  roleName = 'Client';
}

if (interaction.customId === 'creator') {
  await member.roles.add(creatorRole);
  roleName = 'Creator';
}

if (interaction.customId === 'agency') {
  await member.roles.add(agencyRole);
  roleName = 'Agency';
}

const cooldownKey = `roleCooldown_${interaction.user.id}`;
await db.set(cooldownKey, Date.now());

await interaction.editReply({
  content: `✅ ${roleName} role added!`
});

} catch (err) {

  console.log(err);

}

});

};

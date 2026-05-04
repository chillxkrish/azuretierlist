const { 
  Client, 
  GatewayIntentBits, 
  SlashCommandBuilder, 
  REST, 
  Routes, 
  EmbedBuilder 
} = require('discord.js');

// ================== CONFIG ==================
const TOKEN = "MTUwMDkxMDU5OTY0MTUwMTcyOQ.GwHG2r.ZMCA1zFRgg3nQiYSRt0KSoN_n7i0IL3_-4jhPY";
const CLIENT_ID = "1500910599641501729";
const GUILD_ID = "1478009366492872745";
const TESTER_ROLE_ID = "1500849387579117651";
const RESULT_CHANNEL_ID = "1500906901888700587";

// ================== BOT ==================
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ================== COMMAND ==================
const commands = [
  new SlashCommandBuilder()
    .setName('result')
    .setDescription('Post PvP test result')

    .addUserOption(option =>
      option.setName('player')
        .setDescription('Player tested')
        .setRequired(true))

    .addStringOption(option =>
      option.setName('previous_tier')
        .setDescription('Previous tier')
        .setRequired(true)
        .addChoices(
          { name: 'LT5', value: 'LT5' },
          { name: 'HT5', value: 'HT5' },
          { name: 'LT4', value: 'LT4' },
          { name: 'HT4', value: 'HT4' },
          { name: 'LT3', value: 'LT3' },
          { name: 'HT3', value: 'HT3' },
          { name: 'LT2', value: 'LT2' },
          { name: 'HT2', value: 'HT2' },
          { name: 'LT1', value: 'LT1' },
          { name: 'HT1', value: 'HT1' }
        ))

    .addStringOption(option =>
      option.setName('new_tier')
        .setDescription('Tier earned')
        .setRequired(true)
        .addChoices(
          { name: 'LT5', value: 'LT5' },
          { name: 'HT5', value: 'HT5' },
          { name: 'LT4', value: 'LT4' },
          { name: 'HT4', value: 'HT4' },
          { name: 'LT3', value: 'LT3' },
          { name: 'HT3', value: 'HT3' },
          { name: 'LT2', value: 'LT2' },
          { name: 'HT2', value: 'HT2' },
          { name: 'LT1', value: 'LT1' },
          { name: 'HT1', value: 'HT1' }
        ))

    .addStringOption(option =>
      option.setName('ign')
        .setDescription('Minecraft IGN')
        .setRequired(true))

    .addStringOption(option =>
      option.setName('gamemode')
        .setDescription('Gamemode')
        .setRequired(true)
        .addChoices(
          { name: 'Sword', value: 'Sword' },
          { name: 'Axe', value: 'Axe' },
          { name: 'Diapot', value: 'Diapot' },
          { name: 'NethPot', value: 'NethPot' },
          { name: 'Mace', value: 'Mace' },
          { name: 'Crystal', value: 'Crystal' },
          { name: 'UHC', value: 'UHC' },
          { name: 'SMP', value: 'SMP' }
        ))
];

// ================== REGISTER ==================
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log("✅ Commands registered");
  } catch (err) {
    console.error(err);
  }
})();

// ================== READY ==================
client.on('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// ================== COMMAND HANDLER ==================
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'result') {

    const member = interaction.member;

    // 🔒 ROLE CHECK
    if (!member.roles.cache.has(TESTER_ROLE_ID)) {
      return interaction.reply({
        content: "❌ Only testers can use this command.",
        ephemeral: true
      });
    }

    const player = interaction.options.getUser('player');
    const prevTier = interaction.options.getString('previous_tier');
    const newTier = interaction.options.getString('new_tier');
    const ign = interaction.options.getString('ign');
    const gamemode = interaction.options.getString('gamemode');

    const embed = new EmbedBuilder()
      .setTitle(`${ign}'s Test Results`)
      .setColor('#2b2d31')
      .setThumbnail(player.displayAvatarURL())
      .addFields(
        { name: "Tester", value: interaction.user.toString() },
        { name: "Region", value: "AS" },
        { name: "IGN", value: ign },
        { name: "Previous Rank", value: prevTier },
        { name: "Tier Earned", value: newTier },
        { name: "Gamemode", value: gamemode }
      )
      .setTimestamp();

    const channel = interaction.guild.channels.cache.get(RESULT_CHANNEL_ID);

    if (!channel) {
      return interaction.reply({
        content: "❌ Result channel not found.",
        ephemeral: true
      });
    }

    // 📢 Send result to channel
    await channel.send({
      content: `${player}`, // ping player
      embeds: [embed]
    });

    // ✅ Reply to tester
    await interaction.reply({
      content: "✅ Result sent!",
      ephemeral: true
    });
  }
});

client.login(TOKEN);
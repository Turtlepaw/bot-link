const Discord = require("discord.js");
const jsh = require("discordjsh");
const Bot = require("../models/bot");
const { checkPermissions, errorMessage, Embed } = require("../utils");

const Config = module.exports = {
    name: "addbot",
    description: "Adds a bot to check on downtime.",
    /**
     * Executes the command.
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(interaction, client){
        await checkPermissions("ADMINISTRATOR", interaction);
        const bot = interaction.options.getMember("bot");

        if(!bot.user.bot) await errorMessage("This user is not a bot", interaction);

        await new Bot({
            guildID: interaction.guild.id,
            botID: bot.user.id,
            incidents: [],
            status: bot.presence,
            private: interaction.options.getBoolean("private")||false,
            botName: bot.user.username.toLowerCase(),
            userID: interaction.user.id
        }).save().catch(console.log);

        await interaction.reply({ embeds: [
            Embed(`<:bl_check:928102998721302539> | Added your bot!`)
        ]});
    }
}

module.exports.data = new jsh.commandBuilder()
.setName(Config.name)
.setDescription(Config.description)
.addUserOption(e => {
    return e.setName("bot")
    .setDescription(`The bot to add.`)
    .setRequired(true)
})
.addBooleanOption(e => e.setName("private").setDescription(`Weather the bot should show up in public bots.`));
const Discord = require("discord.js");
const jsh = require("discordjsh");
const Bot = require("../models/bot");
const { checkPermissions, errorMessage, Embed } = require("../utils");

const Config = module.exports = {
    name: "removebot",
    description: "Removes a bot from Bot Link.",
    /**
     * Executes the command.
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(interaction, client){
        await checkPermissions("ADMINISTRATOR", interaction);
        const bot = interaction.options.getMember("bot");

        if(!bot.user.bot) await errorMessage("This user is not a bot", interaction);

        await Bot.findOneAndDelete({
            botID: bot.id
        });

        await interaction.reply({ embeds: [
            Embed(`<:bl_check:928102998721302539> | Removed your bot!`)
        ]});
    }
}

module.exports.data = new jsh.commandBuilder()
.setName(Config.name)
.setDescription(Config.description)
.addUserOption(e => {
    return e.setName("bot")
    .setDescription(`The bot to remove.`)
    .setRequired(true)
});
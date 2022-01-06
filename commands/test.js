const Discord = require("discord.js");
const jsh = require("discordjsh");
const Bot = require("../models/bot");
const Guild = require("../models/guildSettings");
const { checkPermissions, errorMessage, statusEmbed, Embed } = require("../utils");

const Config = module.exports = {
    name: "test",
    description: "Test your status ping/embed.",
    /**
     * Executes the command.
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(interaction, client){
        const GuildSettings = await Guild.findOne({
            guildID: interaction.guild.id
        });

        await interaction.reply({
            embeds: [
                statusEmbed(interaction.member, null)
            ],
            content: GuildSettings?.pingRole || "\u200b",
            ephemeral: true
        });
    }
}

module.exports.data = new jsh.commandBuilder()
.setName(Config.name)
.setDescription(Config.description);
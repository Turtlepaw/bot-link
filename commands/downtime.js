const Discord = require("discord.js");
const jsh = require("discordjsh");
const Bot = require("../models/bot");
const Guild = require("../models/guildSettings");
const { checkPermissions, errorMessage, statusEmbed, Embed } = require("../utils");

const Config = module.exports = {
    name: "downtime",
    description: "Report some downtime on a bot.",
    /**
     * Executes the command.
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(interaction, client){
        await checkPermissions("ADMINISTRATOR", interaction);

        const bot = interaction.options.getMember("bot");
        const reason = interaction.options.getString("reason");

        const botD = await Bot.findOne({
            botID: bot.user.id,
            guildID: bot.guild.id
        });

        if(!botD || botD == null) return errorMessage("I could not find that bot.", interaction);

        botD.incidents.push({
            time: Date.now(),
            reason: reason || "None",
            botID: bot.id
        })
        botD.save().catch(console.log);

        const GuildSettings = await Guild.findOne({
            guildID: interaction.guild.id
        });

        const Channel = await interaction.guild.channels.fetch(GuildSettings.statusChannel);
        const mURL = await (await Channel.send({
            embeds: [
                statusEmbed(bot, reason)
            ],
            content: GuildSettings?.pingRole || "\u200b"
        })).url;

        await interaction.reply({
            embeds: [Embed(`<:bl_check:928102998721302539> | Reported downtime!`)],
            components: [
                {
                    type: 1,
                    components: [
                        new Discord.MessageButton()
                        .setEmoji(`<:link:928103524800274563>`)
                        .setStyle("LINK")
                        .setURL(mURL)
                        .setLabel("View")
                    ]
                }
            ]
        });
    }
}

module.exports.data = new jsh.commandBuilder()
.setName(Config.name)
.setDescription(Config.description)
.addUserOption(e => {
    return e.setName("bot")
    .setDescription(`The bot to report downtime on.`)
    .setRequired(true)
})
.addStringOption(e => {
    return e.setName("reason")
    .setDescription(`The reason for this downtime.`)
});
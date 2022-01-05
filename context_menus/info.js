const jsh = require("discordjsh");
const Discord = require("discord.js");
const Bot = require("../models/bot");
const { Color } = require("../config");

module.exports = {
    name: "Info / Downtime",
    data: new jsh.contextBuilder()
    .setType("USER")
    .setName("Info / Downtime"),
    /**
     * Executes the context menu.
     * @param {Discord.ContextMenuInteraction} interaction
     * @param {Discord.Client} client 
     */
    async execute(interaction, client){
        const bot = interaction.options.getMember("user");

        const botFind = await Bot.findOne({
            botID: bot.user.id
        });

        const BotUsr = await client.users.fetch(bot.id);
        let MGuild = bot;
        await interaction.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor(Color)
                .setAuthor({ name: BotUsr.username, iconURL: BotUsr.displayAvatarURL() })
                .setTitle(`Status for ${BotUsr.username}.`)
                .setDescription(`${BotUsr.username} is \`${MGuild.presence?.status || "Status unknown"}\`.`)
                .addField(`<:bl_idle:928358037104783380> Incidents:`, `${botFind.incidents.length > 0 ? botFind.incidents.map(e => `<:bl_idle:928358037104783380> ${e.reason || "No reason specified"}`).join("\n") : "No incidents recorded."}`)
                .addField(`<:insights:928103000017354752> Guilds:`, `${botFind?.guilds || "Guilds not tracked"}`)
            ],
            ephemeral: true
        });
    }
}
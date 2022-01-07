const Discord = require("discord.js");
const jsh = require("discordjsh");
const { Color } = require("../config");
const Bot = require("../models/bot");
const { checkPermissions, errorMessage, Embed } = require("../utils");

const Config = module.exports = {
    name: "stats",
    description: "Check a bots stats.",
    /**
     * Executes the command.
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(interaction, client) {
        const bot = interaction.options.getString("bot");

        const botFind = await Bot.findOne({
            botID: bot
        });

        const BotUsr = await client.users.fetch(bot);
        let MGuild;
        for(let guild of await (await client.guilds.fetch()).values()){
            guild = await guild.fetch();
            if(await (await guild.members.fetch(BotUsr.id)) != null){
                MGuild = await guild.members.fetch(BotUsr.id)
            }
        }
        await interaction.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor(Color)
                .setAuthor({ name: BotUsr.username, iconURL: BotUsr.displayAvatarURL() })
                .setTitle(`Status for ${BotUsr.username}.`)
                .setDescription(`${BotUsr.username} is \`${MGuild.presence?.status || "Status unknown"}\`.`)
                .addField(`<:bl_idle:928358037104783380> Incidents:`, `${botFind.incidents.length > 0 ? botFind.incidents.map(e => `<:bl_idle:928358037104783380> ${e.reason || "No reason specified"}`).join("\n") : "No incidents recorded."}`)
                .addField(`<:insights:928103000017354752> Guilds:`, `${botFind?.guilds || "Guilds not tracked"}`)
                .addField(`<:insights:928103000017354752> Users:`, `${botFind?.users || "Users not tracked"}`)
                .addField(`<:insights:928103000017354752> Uptime:`, `${botFind?.uptime || "Uptime not tracked"}`)
            ]
        });
    }
}

module.exports.data = new jsh.commandBuilder()
    .setName(Config.name)
    .setDescription(Config.description)
    .addStringOption(e => {
        return e.setName("bot")
        .setDescription(`The bot to get stats on.`)
        .setAutocomplete(true)
        .setRequired(true);
    });
const Discord = require("discord.js");
const jsh = require("discordjsh");
const { Color } = require("../config");
const Bot = require("../models/bot");
const Guild = require("../models/guildSettings");
const { checkPermissions, errorMessage, statusEmbed, Embed, helpMenu, categoryEmojis, fetchOwner } = require("../utils");

const Config = module.exports = {
    name: "help",
    description: "Get to know bot link.",
    /**
     * Executes the command.
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(interaction, client){
        const embed = new Discord.MessageEmbed()
        .setColor(Color)
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`${categoryEmojis.Slash_Command} Bot Link`)
        .setDescription(`Status pages for free`)
        .addField(`${categoryEmojis.Rule_Book} Getting Started`, `Start by adding your bot (\`/addbot\`) then you can see your bot in \`/guildbots admin_view: true\` you should see your bot there, great!\n\nNow you need to set up your guild, start by using \`/settings view\` you will see that you have no settings configured yet so use \`/settings status_channel\`.\nNow you can use \`/test\` to test your status channel!`)
        .addField(`${categoryEmojis.Crown} Owner:`, `**${fetchOwner(client).tag}**`)

        await interaction.reply({
            embeds: [
                embed
            ],
            ephemeral: true
        });
    }
}

module.exports.data = new jsh.commandBuilder()
.setName(Config.name)
.setDescription(Config.description);
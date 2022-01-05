const Discord = require("discord.js");
const jsh = require("discordjsh");
const { Color } = require("../config");
const Guild = require("../models/guildSettings");
const { checkPermissions, errorMessage, Embed } = require("../utils");

const Config = module.exports = {
    name: "settings",
    description: "Change your guilds settings.",
    /**
     * Executes the command.
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(interaction, client) {
        await checkPermissions("ADMINISTRATOR", interaction);

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "status_channel") {
            const channel = interaction.options.getChannel("channel");

            const GuildFind = await Guild.findOne({
                guildID: interaction.guild.id
            });
            let edit = false;
            if (GuildFind) {
                edit = true;

                GuildFind.statusChannel = channel.id
                GuildFind.save().catch(console.log);
            } else {
                await new Guild({
                    guildID: interaction.guild.id,
                    statusChannel: channel.id
                }).save().catch(console.log);
            }

            await interaction.reply({
                embeds: [Embed(`<:bl_check:928102998721302539> | ${edit ? "Edited" : "Created & Saved"} your guild settings. Test message sent!`)]
            });

            channel.send({
                embeds: [Embed(`<:cog:928102999191068702> | Test Message.`)]
            });
        } else if(subcommand === "view"){
            const settings = await Guild.findOne({
                guildID: interaction.guild.id
            });

            await interaction.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setColor(Color)
                    .setDescription(`**<:channel_followed:928102998528364574> Status Channel:** ${settings?.statusChannel != null ? `<#${settings.statusChannel}>` : "None"}`)
                ],
                ephemeral: true
            })
        }
    }
}

module.exports.data = new jsh.commandBuilder()
    .setName(Config.name)
    .setDescription(Config.description)
    .addSubcommand(s => {
        return s.setName("status_channel")
            .setDescription(`The channel for all status updates.`)
            .addChannelOption(e => e.setName("channel").setDescription(`The channel for the status updates.`).setRequired(true));
    })
    .addSubcommand(s => s.setName("view").setDescription("View your settings."));
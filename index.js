const Timenow = Date.now();
const Discord = require("discord.js");
const jsh = require("discordjsh");
const config = require("./config.json");
const { Color, website } = require("./config");
const util = require("./utils/index");
const mongoose = require("mongoose");

mongoose.connect(config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connecting', () => {
    console.log("Mongoose: Logging in!")
})

mongoose.connection.on('connected', () => {
    console.log("Mongoose: Logged in!")
})

mongoose.connection.on('disconnecting', () => {
    console.log("Mongoose: Logging out")
})

mongoose.connection.on('disconnected', () => {
    console.log("Mongoose: Logged out")
})

mongoose.connection.on('error', error => {
    console.log(error)
})

const ClientBuilder = new jsh.Client({
    token: config.token,
    clientID: config.clientID,
    config: {
        color: Color
    },
    testGuildID: config.guildID
}).setCommandsDir()
.setEventsDir()
.setContextDir();

const client = ClientBuilder.create({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_PRESENCES"],
    partials: ["CHANNEL", "GUILD_MEMBER", "USER"],
});

module.exports.client = {
    get: () => client
};
client.noPerm = (perm) => {
    return new MessageEmbed()
        .setDescription(`${client.botEmojis.flag_remove.show} You need the \`${perm}\` permission to do this!`)
        .setColor(require('./config.bot.json').colors.RED)
}

client.on("ready", async () => {
    const botSize = await (await require("./models/bot").find()).length;
    /** @type {Discord.TextChannel} */
    const channel = client.channels.cache.get("928099823947767848");
    const ThisGuildInvite = client.generateInvite({ scopes: ["bot", "applications.commands"], permissions: ["ADMINISTRATOR"], guild: config.guildID, disableGuildSelect: true })
    channel.send({
        embeds: [
            new Discord.MessageEmbed()
            .setColor(Color)
            .setTitle("<:bl_check:928102998721302539> Bot Started."),
            new Discord.MessageEmbed()
            .setColor(Color)
            .setDescription(`Started program in \`${util.msToDate(Math.round(Timenow - Date.now()))}\`.`),
            new Discord.MessageEmbed()
            .setColor(Color)
            .setDescription(`Logged in as \`${client.user.tag}\` (\`${client.user.id}\`).`),
            new Discord.MessageEmbed()
            .setDescription(`Generated Invite link. [Invite to this guild](${ThisGuildInvite}).`)
            .setColor(Color)
        ],
        components: [
            {
                type: 1,
                components: [
                    new Discord.MessageButton()
                    .setStyle("LINK")
                    .setEmoji("<:link:928103524800274563>")
                    .setLabel("Invite to this guild")
                    .setURL(ThisGuildInvite),
                    new Discord.MessageButton()
                    .setStyle("LINK")
                    .setEmoji("<:link:928103524800274563>")
                    .setLabel("Invite to another guild")
                    .setURL(client.generateInvite({ scopes: ["bot", "applications.commands"], permissions: ["ADMINISTRATOR"] }))
                ]
            }
        ]
    });

    client.user.setPresence({
        activities: [
            {
                name: website.replace("https://", ""),
                type: "PLAYING",
                url: website
            }
        ]
    });
    let listening = true;
    setInterval(() => {
        if(listening){
            listening = false
            client.user.setActivity(
                {
                    name: "downtime",
                    type: "LISTENING",
                    url: website
                }
            )
        } else {
            listening = true
            client.user.setActivity(
                {
                    name: `${botSize} bots`,
                    type: "WATCHING",
                    url: website
                }
            )
        }
    }, 5000);
})
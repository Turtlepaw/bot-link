const Discord = require("discord.js");
const jsh = require("discordjsh");
const { Color } = require("../config");
const Bot = require("../models/bot");
const du = require("discord.js-util");
const { checkPermissions, errorMessage, getEmoji } = require("../utils");

const Config = module.exports = {
    name: "guildbots",
    description: "Shows all the bots of the guild.",
    /**
     * Executes the command.
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(interaction, client){
        const bot = interaction.options.getMember("bot");
        const admin = interaction.options.getBoolean("admin_view");
        await interaction.deferReply({ ephemeral: admin == true ? true : false });
        const AllGuildBots = {
            admin: await Bot.find({
                guildID: interaction.guild.id
            }),
            normal: await Bot.find({
                guildID: interaction.guild.id,
                private: false
            })
        }
        if(admin == true){
            await checkPermissions("ADMINISTRATOR", interaction);

            const embeds = [];

            let i = 1;
            let i2 = 0;
        
            let text = "";
            let textLengths = []
            let pages = []
            let currentPage = "";
            let msgCount = 0;
            if (!AllGuildBots.admin || AllGuildBots.admin.length <= 0) return errorMessage("There are no bots to display here!", interaction);
            for (let botFind of AllGuildBots.admin) {
                const BotUsr = await client.users.fetch(botFind.botID);
                let MGuild;
                for(let guild of await (await client.guilds.fetch()).values()){
                    guild = await guild.fetch();
                    if(await (await guild.members.fetch(BotUsr.id)) != null){
                        MGuild = await guild.members.fetch(BotUsr.id)
                    }
                }
                let textToAdd = `${getEmoji(MGuild.presence)} **${BotUsr}**\n\n`
                currentPage += textToAdd;
                msgCount++;
                if (msgCount % 5 == 0) {
                    pages.push(currentPage)
                    currentPage = []
                }
            }
            if (currentPage.length > 0)
                pages.push(currentPage)

            for (const textt of pages) {
                embeds.push(new Discord.MessageEmbed().setColor(Color).setDescription(textt))
            }

            await new du.pages()
            .setPages(embeds)
            .setEmojis("<:leave:863464329633726464>", "<:join:863464329613672508>")
            .setInteraction(interaction)
            .send({ ephemeral: true });
        } else {
            const embeds = [];

            let i = 1;
            let i2 = 0;
        
            let text = "";
            let textLengths = []
            let pages = []
            let currentPage = "";
            let msgCount = 0;
            if (!AllGuildBots.normal || AllGuildBots.normal.length <= 0) return errorMessage("There are no bots to display here!", interaction);
            for (let botFind of AllGuildBots.normal) {
                const BotUsr = await client.users.fetch(botFind.botID);
                let MGuild;
                for(let guild of await (await client.guilds.fetch()).values()){
                    guild = await guild.fetch();
                    if(await (await guild.members.fetch(BotUsr.id)) != null){
                        MGuild = await guild.members.fetch(BotUsr.id)
                    }
                }
                let textToAdd = `${getEmoji(MGuild.presence)} **${BotUsr}**\n\n`
                currentPage += textToAdd;
                msgCount++;
                if (msgCount % 5 == 0) {
                    pages.push(currentPage)
                    currentPage = []
                }
            }
            if (currentPage.length > 0)
                pages.push(currentPage)

            for (const textt of pages) {
                embeds.push(new Discord.MessageEmbed().setColor(Color).setDescription(textt))
            }

            await new du.pages()
            .setPages(embeds)
            .setEmojis("<:leave:863464329633726464>", "<:join:863464329613672508>")
            .setInteraction(interaction)
            .setFilter(e => e.user.id === interaction.user.id)
            .send();
        }
    }
}

module.exports.data = new jsh.commandBuilder()
.setName(Config.name)
.setDescription(Config.description)
.addBooleanOption(e => {
    return e.setName("admin_view")
    .setDescription(`Requires admin to use this and shows private bots.`)
});
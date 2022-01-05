module.exports.msToDate = function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return (
        seconds == 60 ?
            (minutes + 1) + ":00" :
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    );
}

const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const { colors, color } = require('../config')
const { Routes } = require('discord-api-types/v9');

/**
 * Make text go from hi => Hi
 * @param {String} text 
 */
module.exports.standardizeText = (text) => {
    if(!text) throw new TypeError("Required arg text missing!")
    text = text.toString()
	let newtext = text.slice(1, text.length)
	let oldtext = text.slice(0, 1)
	let rettext = oldtext.toUpperCase() + newtext
	return `${rettext}`
}

module.exports.colors = {
    brandColors: {

    },
    discordColors: {
        embed: "#2F3136"
    }
}

module.exports.formatButtons = (buttons) => {
    if(!Array.isArray(buttons)) buttons = [buttons]
    const rows=[new MessageActionRow()];
    let row = 0;
    let btn = 0;
    for(const button of buttons){
        if(btn === 5){
            rows.push(new MessageActionRow())
            row++
        }
        if(row === 5){
            break
        }
        
        rows[row].addComponents(button)
        btn++
    }
    return rows
}
/**
 * Replys with an error.
 * @param {String} message The message to say.
 * @param {Discord.Interaction} interaction The interaction can be a component or a command.
 * @param {"REPLY" | "UPDATE"} replyType If it should reply or edit.
 * @param {Boolean} ephemeral If the interaction reply should be hidden
 */
module.exports.errorMessage = (message, interaction, replyType="REPLY", ephemeral=true) => {
    const text = this.categoryEmojis.Error + " | " + message
    if(interaction.isMessageComponent()){
        if(replyType === "REPLY"){
            interaction.reply({ content: text, ephemeral: ephemeral });
        } else if(replyType === "UPDATE"){
            interaction.update({ content: text });
        }
    } else if(interaction.isApplicationCommand()){
        if(replyType === "REPLY"){
            interaction.reply({ content: text, ephemeral: ephemeral });
        } else if(replyType === "UPDATE"){
            interaction.editReply({ content: text });
        }
    }
}

/**
 * Turns some text into an embed.
 * @param {String} txt 
 * @returns {Discord.MessageEmbed}
 */
module.exports.Embed = (txt) => {
    return new Discord.MessageEmbed()
    .setColor(require("../config").Color)
    .setDescription(txt);
}

/**
 * Creates a status embed on a user.
 * @param {Discord.GuildMember} usr 
 */
module.exports.statusEmbed = (usr, r) => {
    return new MessageEmbed()
    .setColor(this.getColor(usr.presence))
    .setAuthor(usr.user.username, usr.user.displayAvatarURL())
    .setDescription(r || `No Reason Specified`)
    .setFooter(usr.guild.name, usr.guild.iconURL())
    .setThumbnail(usr.user.displayAvatarURL())
    .setTitle(`${this.getEmoji(usr.presence)} Downtime on ${usr.user.username}`)
}

/**
 * Gets a Discord color from presence.
 * @param {Discord.Presence} presence 
 * @returns {Discord.ColorResolvable}
 */
module.exports.getColor = (presence={ status: "offline"}) => {
    if(!presence || presence == null) presence = { status: "offline"};
    if(presence.status == "dnd"){
        return "RED"
    } else if(presence.status == "invisible" || presence.status == "offline"){
        return "GREY"
    } else if(presence.status == "online"){
        return "GREEN"
    } else if(presence.status == "idle"){
        return "YELLOW"
    } else {
        return "DEFAULT"
    }
}

/**
 * Gets an emoji for the status.
 * @param {Discord.Presence} presence 
 */
module.exports.getEmoji = (presence={ status: "offline"}) => {
    if(!presence || presence == null) presence = { status: "offline"};
    if(presence.status == "dnd"){
        return this.categoryEmojis.DND
    } else if(presence.status == "invisible" || presence.status == "offline"){
        return this.categoryEmojis.Offline
    } else if(presence.status == "online"){
        return this.categoryEmojis.Online
    } else if(presence.status == "idle"){
        return this.categoryEmojis.Idle
    } else {
        return this.categoryEmojis.Online
    }
}

/**
 * Checks if a member has a permission if they don't the bot will reply/edit to the interaction.
 * @param {Discord.PermissionString} permission 
 * @param {Discord.CommandInteraction} interaction 
 */
module.exports.checkPermissions = async (permission, interaction) => {
    const hasPerms = interaction.member.permissions.has(permission);

    if(!hasPerms) {
        if(interaction.replied || interaction.deferred){
            await interaction.editReply({ embeds: [client.noPerm(permission)], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [client.noPerm(permission)], ephemeral: true });
        }

        throw new Error("User does not have the correct permissions.");
    }
}

module.exports.categoryEmojis = {
    "Bot": "<:bot_add:863464329738715156>",
    "Discord.js": "<:djs:895374013629599806>",
    "Emojis": "<:reaction_add:863474840726929449>",
    "Fun": "<a:atada:869705649846616104>",
    "Mod": "<:ban:863529097283240016>",
    "Misc": "<:channel_add:863464329755361350>",
    "Slash_Command": "<:slashCommand:872317151451705385>",
    "Rule_Book": "<:rules:890070276094713906>",
    "Pencil": "<:pencil:887514200614780939>",
    "Member_Add": "<:member_invited:887514198651830292>",
    "Error": "<:bl_xmark_2:928121782450401310>",
    "Idle": "<:bl_idle:928358037104783380>",
    "Online": "<:bl_online:928364456835174400>",
    "Offline": "<:bl_offline:928364456608661574>",
    "DND": "<:bl_dnd:928102999421747260>"
}

const menuButtons = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(`help`)
            .setLabel("Commands")
            .setStyle("SECONDARY")
            .setEmoji(this.categoryEmojis.Slash_Command),
        new MessageButton()
            .setCustomId(`tutorial`)
            .setLabel("Tutorial")
            .setStyle("SECONDARY")
            .setEmoji(this.categoryEmojis.Rule_Book)
    )
/**
 * @param {"HELP"|"TUTORIAL"} type 
 */
module.exports.getButton = (type) => {
    const menuButtonsv2 = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(`help`)
                .setLabel("Commands")
                .setStyle("SECONDARY")
                .setEmoji(this.categoryEmojis.Slash_Command),
            new MessageButton()
                .setCustomId(`tutorial`)
                .setLabel("Tutorial")
                .setStyle("SECONDARY")
                .setEmoji(this.categoryEmojis.Rule_Book),
            new MessageButton()
                .setURL(require('../index').client.get().generateInvite({ permissions: "ADMINISTRATOR", scopes: ["bot", "applications.commands"] }))
                .setLabel("Invite")
                .setStyle("LINK")
                .setEmoji(this.categoryEmojis.Member_Add)
        )
    if (type === "HELP") {
        menuButtonsv2.components[0].setDisabled(true)
    } else if (type === "TUTORIAL") {
        menuButtonsv2.components[1].setDisabled(true)
    }
    return menuButtonsv2
}
/**
 * @param {Discord.CommandInteraction} interaction 
 */
module.exports.awaitMenuButtons = async (interaction) => {
    /**
     * @type {Discord.Message}
     */
    const m = await interaction.fetchReply()

    const collector = m.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id });

    collector.on("collect", async i => {
        if (i.customId === "help") {
            this.helpMenu(i, { enabled: true, button: true })
        } else if (i.customId === "tutorial") {
            this.tutorialMenu(i, { enabled: true, button: true })
        }
    })
}

/**
 * @param {Discord.Client} client 
 * @returns {Discord.User}
 */
module.exports.fetchOwner = (client) => {
    const ownerID = require('../config.json').owners[0];
    const owner = client.users.cache.get(ownerID);

    return owner
}

module.exports.fetchCommandData = (command, client) => {
    const commandDescription = client.rawCommands.find(e => e.name === command) || client.rawGuildCommands.find(e => e.name === command)
    return commandDescription
}

module.exports.colorMenu = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu()
.setCustomId('colors')
.setMaxValues(1)
.setMinValues(1)
.setPlaceholder(`Select a color`)
.addOptions(
    {
        label: 'Black',
        value: 'DEFAULT',
    },
    {
        label: 'White',
        value: 'WHITE',
    },
    {
        label: 'Aqua',
        value: 'AQUA',
    },
    {
        label: 'Green',
        value: 'GREEN'
    },
    {
        label: 'Blue',
        value: 'BLUE',
    },
    {
        label: 'Yellow',
        value: 'YELLOW'
    },
    {
        label: 'Purple',
        value: 'PURPLE'
    },
    {
        label: 'Vivid Pink',
        value: 'LUMINOUS_VIVID_PINK'
    },
    {
        label: 'Fuchsia',
        value: 'FUCHSIA'
    },
    {
        label: 'Gold',
        value: 'GOLD'
    },
    {
        label: 'Orange',
        value: 'ORANGE'
    },
    {
        label: 'Red',
        value: 'RED'
    },
    {
        label: 'Grey',
        value: 'GREY'
    },
    {
        label: 'Darker Grey',
        value: 'DARKER_GREY'
    },
    {
        label: 'Navy',
        value: 'NAVY'
    },
    {
        label: "Blurple",
        value: "BLURPLE"
    }
))
/**
 * 
 * @param {Discord.CommandInteraction} interaction 
 * @param {Boolean} edit 
 */
module.exports.helpMenu = async (interaction, edit={enabled: false}) => {
    const command = interaction?.options?.getString("command");
    const { client } = interaction;

    /**
 * @param {String} command 
 */
    const fetchData = (command) => {
        const commandDescription = client.rawCommands.find(e => e.name === command) || client.rawGuildCommands.find(e => e.name === command)
        return commandDescription
    }
    if (command) {
        const commandData = client.commands.get(command.toLowerCase());
        if (!commandData) return interaction.reply({ content: `${client.botEmojis.failed} That's not a command!`, ephemeral: true })
        const embed = new MessageEmbed()
            .setColor(color)
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(`${this.categoryEmojis[commandData.c]} ${commandData.c} › ${commandData.name}`)
            .setDescription(`${fetchData(commandData.name).description}\n\n\`\`\`/${commandData.name} ${commandData.usage}\`\`\``)
        //client.addUse(embed)
        interaction.reply({ embeds: [embed] });
    } else {
        const rows = [
            /* < > Buttons.
            new MessageActionRow()
            .addComponents(

             ),*/
            new MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId('menu')
                        .setPlaceholder("Select a category")
                        .addOptions(
                            {
                                label: `Bot`,
                                description: "Bot Commands e.g. /ping",
                                value: `Bot`,
                                emoji: client.botEmojis.bot_add.id
                            },
                            {
                                label: `Discord.js`,
                                description: "Discord.js Commands e.g. /djs docs",
                                value: `Discord.js`,
                                emoji: "<:djs:895374013629599806>"
                            },
                            {
                                label: `Emojis`,
                                description: "Manage, view, and steal emojis!",
                                value: `Emojis`,
                                emoji: client.botEmojis.reaction_add.id
                            },
                            {
                                label: `Fun`,
                                description: "Fun Commands to do while your bored",
                                value: `Fun`,
                                emoji: client.botEmojis.atada.id
                            },
                            {
                                label: `Moderation`,
                                description: "Kick, ban, and warn members",
                                value: `Mod`,
                                emoji: client.botEmojis.ban.id
                            },
                            {
                                label: `Server`,
                                description: "Change your server settings.",
                                value: `Config`,
                                emoji: this.categoryEmojis.Pencil
                            },
                            {
                                label: `Everything Else`,
                                value: `Misc`,
                                description: "Everything else",
                                emoji: this.categoryEmojis.Misc
                            }
                        )
                ),
            this.getButton("HELP")
        ]
        const application = await client.application.fetch()
        /**
         * @param {String} command 
         */
        const fetchDescription = (command) => {
            const commandDescription = client.rawCommands.find(e => e.name === command)?.description || client.rawGuildCommands.find(e => e.name === command)?.description
            return commandDescription
        }

        const embed = new MessageEmbed()
            .setColor(color)
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(`${this.categoryEmojis.Slash_Command} Pepperbot Help`)
            .setDescription(`Pepperbot only replies to slash (\`/\`) commands!`)
            .addField(`${client.botEmojis.pepperbot} Useful Commands`, `>>> \`/emoji\` - ${fetchDescription("emoji")}\n\`/bookmark\` - ${fetchDescription("bookmark")}\n\`/info\` - ${fetchDescription('info')}`)
            .addField(`${client.botEmojis.premium} Owner:`, `**${this.fetchOwner(client).tag}**`)
        client.addUse(embed)
        if(edit?.enabled === true && edit?.button === true){
            await interaction.update({ embeds: [embed], components: rows }).catch(( )=>{ });
        } else if (edit?.enabled === false) {
            interaction.reply({ components: rows, embeds: [embed] });
        } else {
            interaction.editReply({ components: rows, embeds: [embed] });
        }

        await this.awaitMenuButtons(interaction)

        /**
         * @param {"Bot"|"Dev"|"Discord.js"|"Emojis"|"Fun"|"Misc"|"Mod"} category 
         */
        const fetchCommandCategory = (category) => {
            const embedd = new MessageEmbed()
                .setColor(color)
                .setTitle(`${this.categoryEmojis.Slash_Command} Pepperbot Help`)
                .setThumbnail(client.user.displayAvatarURL())
            // .setDescription(`Pepperbot only replies to slash (\`/\`) commands!`)

            const commands = client.commands.filter(e => e.c === category);

            let text = ""
            for (const command of commands.values()) {
                if (command?.subcommands) {
                    let commandText = ""
                    for (const subCommand of command?.subcommands) {
                        commandText += `[\`/${command.name} ${subCommand.name}${subCommand.usage ? ` ${subCommand.usage}` : ""}\`](https://pepperbot-development.github.io/pepperbot-docs/) - ${subCommand.description}\n`
                    }
                    embedd.addField(`\`/${command.name}\` - ${fetchDescription(command.name)}`, commandText)
                } else {
                    const description = fetchDescription(command.name)
                    text += `[\`/${command.name}${command.usage ? ` ${command.usage}` : ""}\`](https://pepperbot-development.github.io/pepperbot-docs/) - ${description}\n\n`
                }
            }
            embedd.setDescription(text)
            client.addUse(embedd)
            return embedd
        }
        /**
         * @type {Discord.Message}
         */
        const m = await interaction.fetchReply();

        const collector = m.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id });

        collector.on("collect", async i => {
            if (!i.isSelectMenu()) return
            if (i.customId === "menu") {
                const value = i.values[0];

                i.update({ embeds: [fetchCommandCategory(value)] }).catch(() => { });
            }
        })

        collector.on("end", async () => {
            rows[0].components[0].setDisabled(true)
            await interaction.editReply({ content: `${client.botEmojis.idle}`, components: rows });
        })
    }
}

/**
 * @param {Discord.CommandInteraction} interaction 
 * @param {Boolean} edit 
 */
module.exports.tutorialMenu = async (interaction, edit={enabled: false}, eph = false) => {
    const { client } = interaction;

    const tutorial_pages = [
        new MessageEmbed()
            .setColor(color)
            .setTitle(`${client.botEmojis.bookmark_add} Adding a bookmark`)
            .setDescription(`To add a bookmark right-click on a message and hover on \`Apps\` and click \`Bookmark Message\`.`)
            .setImage("https://us-east-1.tixte.net/uploads/turtlepaw.is-from.space/kuep7fygs9a.gif"),
            new MessageEmbed()
            .setColor(color)
            .setTitle(`${client.botEmojis.bookmark_add} Viewing your bookmarks`)
            .setDescription(`To view your bookmarks use \`/bookmarks view\` and an embed and buttons should appear, to change the page click the ${client.botEmojis.leave} button to go back and the ${client.botEmojis.join} to go foward`)
            .setImage("https://us-east-1.tixte.net/uploads/turtlepaw.is-from.space/kueqhl5zg9a.gif"),
    ]
    let i = 1;
    let i2 = 0
    const rows = [
        new MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId("<")
                    .setEmoji(client.botEmojis.leave)
                    .setStyle("SECONDARY"),
                new Discord.MessageButton()
                    .setCustomId("pagesdonttouch")
                    .setLabel(`${i} of ${tutorial_pages.length}`)
                    .setStyle("SECONDARY")
                    .setDisabled(true),
                new Discord.MessageButton()
                    .setCustomId(">")
                    .setEmoji(client.botEmojis.join)
                    .setStyle("SECONDARY")
            ),
        this.getButton("TUTORIAL")
    ]
    // if (tutorial_pages.length < 2) {
    //     rows[0].components[0].setDisabled(true)
    //     rows[0].components[2].setDisabled(true)
    // }
    if(edit?.enabled === true && edit?.button === true){
        await interaction.update({ embeds: [tutorial_pages[0]], components: rows }).catch(( )=>{ });
    } else if (edit?.enabled === true) {
        await interaction.editReply({ embeds: [tutorial_pages[0]], components: rows });
    } else {
        await interaction.reply({ embeds: [tutorial_pages[0]], components: rows, ephemeral: eph });
    }
    await this.awaitMenuButtons(interaction)

    /**
     * @type {Discord.Message}
     */
    const m = await interaction.fetchReply();

    const collector = m.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id })

    collector.on("collect", async i3 => {
        if (i3.customId === "<") {
            if (tutorial_pages.length === 1) {
                //...
            } else if (i2 === 0) {
                i2 = tutorial_pages.length - 1
                i = tutorial_pages.length
            } else {
                i2--
                i--
            }

            rows[0].components[1].setLabel(`${i} of ${tutorial_pages.length}`)
            i3.update({ embeds: [tutorial_pages[i2]], components: rows }).catch(( )=>{ });
        } else if (i3.customId === ">") {
            if (tutorial_pages.length === 1) {
                //...
            } else if (i2 + 1 === tutorial_pages.length) {
                i2 = 0
                i = 1
            } else {
                i2++
                i++
            }

            rows[0].components[1].setLabel(`${i} of ${tutorial_pages.length}`)
            i3.update({ embeds: [tutorial_pages[i2]], components: rows }).catch(( )=>{ });
        }
    })

    collector.on("end", async () => {
        rows[0].components[0].setDisabled(true)
        rows[0].components[2].setDisabled(true)
        await interaction.editReply({ content: `${client.botEmojis.idle}`, components: rows });
    })
}

module.exports.interactions = {
    /**
     * 
     * @param {String} id1 
     * @param {String} id2 
     * @returns {MessageActionRow}
     */
    yn_button: function (id1, id2) {
        return new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Yes")
                    .setStyle("SUCCESS")
                    .setCustomId(id1 || "yes"),
                new MessageButton()
                    .setLabel("No")
                    .setStyle("DANGER")
                    .setCustomId(id2 || "no")
            )
    },
    /**
     * 
     * @param {String} url 
     * @param {String} label 
     * @param {"ACTION_ROW"|"BUTTON"} type 
     * @returns {MessageActionRow | MessageButton}
     */
    url_button: function (url, type, label, emoji) {
        const button = new MessageButton()
            .setStyle("LINK")
            .setEmoji(emoji)
            .setLabel(label)
            .setURL(url)

        let r = null;
        if (type === "ACTION_ROW") {
            r = new MessageActionRow().addComponents(button)
        } else if (type === "BUTTON") {
            r = button
        }
        return button
    }
}
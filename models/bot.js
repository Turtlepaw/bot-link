const mongoose = require('mongoose');

const sSchema = new mongoose.Schema({
    //ID/Identification
    guildID: String,
    botID: String,
    userID: String,
    botName: String,
    authToken: String,
    //Stats
    guilds: Number,
    users: Number,
    uptime: Number,
    //Properties
    incidents: [Object],
    status: Object,
    private: Boolean
});

const sModel = module.exports = mongoose.model('bot', sSchema);
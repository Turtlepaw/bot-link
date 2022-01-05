const mongoose = require('mongoose');

const sSchema = new mongoose.Schema({
    guildID: String,
    botID: String,
    incidents: [Object],
    status: Object,
    private: Boolean,
    botName: String,
    guilds: String|Number
});

const sModel = module.exports = mongoose.model('bot', sSchema);
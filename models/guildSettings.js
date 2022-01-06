const mongoose = require('mongoose');

const sSchema = new mongoose.Schema({
    guildID: String,
    statusChannel: String,
    pingRole: String
});

const sModel = module.exports = mongoose.model('guild', sSchema);
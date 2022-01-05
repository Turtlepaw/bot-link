const mongoose = require('mongoose');

const sSchema = new mongoose.Schema({
    guildID: String,
    statusChannel: String
});

const sModel = module.exports = mongoose.model('guild', sSchema);
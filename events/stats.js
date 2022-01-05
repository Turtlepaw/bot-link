const jsh = require("discordjsh");
const Discord = require("discord.js");
const Bot = require("../models/bot");
const { standardizeText } = require("../utils/index");

module.exports = {
    name: jsh.Events.interactionCreate,
    /**
     * Executes the event.
     * @param {Discord.Client} client 
     * @param {Discord.Interaction} i 
     */
    async execute(i, client){
        if(!i.isAutocomplete()) return
        if(i.commandName == "stats"){
            let Finds = await Bot.find({
                private: false
            });
            const deviationMatching = (first, second, num) => {
                let count = 0;
                for(let i = 0; i < first.length; i++){
                   if(!second.includes(first[i])){
                      count++;
                   };
                   if(count > num){
                      return false;
                   };
                };
                return true;
             };
            Finds.filter(e => {
                if(deviationMatching(e.botName, i.options.getFocused(), 1)) return false
                return true
            })
            if(i.options.getFocused().length <= 0){
                const Finds2 = await Bot.find({
                    private: false
                });
                const FindR = [];
                for(const find of Finds2){
                    FindR.push({
                        name: `🏷️` + standardizeText(find.botName),
                        value: find.botID
                    });
                }
                await i.respond(FindR);
            } else {
                const FindR = [];
                for(const find of Finds){
                    FindR.push({
                        name: `🏷️` + standardizeText(find.botName),
                        value: find.botID
                    });
                }
                await i.respond(FindR);
            }
        }
    }
}
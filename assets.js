//@todo status command, displays stuff like looping


const {Guild} = require("./Guild");

let guildList = {}

function getGuild(id) {
    return guildList[id]
}

function createGuild(id, language) {
    guildList[id] = new Guild(language, id)
    return guildList[id]
}

function deleteGuild(id) {
    guildList[id] = undefined
}

module.exports = {getGuild, createGuild, deleteGuild}

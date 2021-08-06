module.exports = function(list: Creep[]) {
    for (const creep of list) {

        // Check flag exists
        if (!creep.memory.flag) {
            let flags = creep.room.find(FIND_FLAGS);
            creep.memory.flag = flags[Math.floor(Math.random() * flags.length)];
        }

        // Work
        if (creep.room.find(FIND_HOSTILE_CREEPS).length > 0) {
            let hostile = creep.room.find(FIND_HOSTILE_CREEPS)[0];
            if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
                creep.moveTo(hostile);
            }
        } else {
            if (creep.pos !== creep.memory.flag.pos) {
                creep.moveTo(creep.memory.flag.pos);
            }
        }
    }
};
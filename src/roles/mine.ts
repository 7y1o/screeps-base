module.exports = function(list: Creep[], spawn: StructureSpawn) {
    for (const creep of list) {
        // Check source
        if (!creep.memory.source) {
            let src = creep.room.find(FIND_SOURCES);
            creep.memory.source = src[Math.floor(Math.random() * src.length)];
        }

        // Update creep state
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.full = false;
        } else {
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                creep.memory.full = true;
            }
        }

        // Work
        if (creep.memory.full) {
            if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
        } else {
            let src = Game.getObjectById(creep.memory.source.id);
            if (!src) continue;

            if (creep.harvest(src) === ERR_NOT_IN_RANGE) {
                creep.moveTo(src);
            }
        }
    }
};
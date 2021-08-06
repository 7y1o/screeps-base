module.exports = function(list: Creep[], spawn: StructureSpawn) {
    for (const creep of list) {

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
            let constr = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
            if (!constr) continue;

            if (creep.build(constr) === ERR_NOT_IN_RANGE) {
                creep.moveTo(constr);
            }
        } else {
            if (creep.withdraw(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
        }
    }
};
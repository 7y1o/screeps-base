type UnitsGroups = {
    mine: Creep[],
    up: Creep[],
    safe: Creep[],
    build: Creep[]
};

interface CreepMemory {
    type: string,
    full?: boolean,
    source?: Source,
    flag?: Flag
}

module.exports = class UnitsController {
    /** Get units by groups */
    static get(): UnitsGroups {
        let groups: UnitsGroups = {
            mine: [],
            up: [],
            safe: [],
            build: []
        };

        for (const name in Game.creeps) {
            let creep = Game.creeps[name];

            if (!creep.my) continue;
            if (!creep.ticksToLive || creep.ticksToLive < 0) continue;

            groups[creep.memory.type as ('mine' | 'up' | 'safe' | 'build')].push(creep);
        }

        return groups;
    }
};
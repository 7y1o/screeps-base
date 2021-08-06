/// <reference types="screeps" />

const _ = require('lodash');

const UnitsController = require('./units');

const updateMine = require('../roles/mine');
const updateUp = require('../roles/up');
const updateSafe = require('../roles/safe');
const updateBuild = require('../roles/build');

type UnitsConfig = {
    mine: number,
    up: number,
    safe: number,
    build: number
}

function generateName(type: string, count: number): string {
    let name = [type, count].join('_');
    while (Game.creeps[name]) {
        count++;
        name = [type, count].join('_');
    }
    return name;
}

module.exports = class SpawnController {
    private readonly spawn: StructureSpawn;
    private readonly units: UnitsConfig;

    /** Init */
    constructor() {
        this.spawn = Object.keys(Game.spawns).map(i => Game.spawns[i]).filter(i => i.my)[0];
        this.units = new UnitsController({
            mine: 8,
            up: 8,
            safe: 4,
            build: 4
        });
    }

    /** Update */
    update(): void {
        let units = UnitsController.get();
        updateMine(units.mine, this.spawn);
        updateUp(units.up, this.spawn);
        updateSafe(units.safe);
        updateBuild(units.build, this.spawn);

        if (!this.spawn.spawning && this.spawn.store.getUsedCapacity(RESOURCE_ENERGY) >= 200) {
            let needed = _.filter([
                {type: 'mine', length: units.mine.length},
                {type: 'up', length: units.up.length},
                {type: 'safe', length: units.safe.length},
                {type: 'build', length: units.build.length}
            ], (i: {type: 'mine' | 'up' | 'safe' | 'build', length: number}) => i.length < this.units[i.type]);

            needed = _.minBy(needed, 'length') as {type: 'mine' | 'up' | 'safe' | 'build', length: number};

            console.log('Needs to create', needed.type, 'unit!');

            let res: number | string;
            let cap = this.spawn.store.getUsedCapacity(RESOURCE_ENERGY);
            switch (needed.type) {
                case 'mine':
                    res = this.spawnWorkUnit(needed.type, cap, needed.length);
                    break
                case 'up':
                    res = this.spawnWorkUnit(needed.type, cap, needed.length);
                    break
                case 'safe':
                    res = this.spawnSafeUnit(cap, needed.length);
                    break
                case 'build':
                    res = this.spawnWorkUnit(needed.type, cap, needed.length);
                    break

                default:
                    res = 'unknown type';
            }
            console.log('Spawn result:', res);
        }
    }

    /** Spawn safe unit */
    private spawnSafeUnit(cap: number, length: number): number {
        let parts: (MOVE | ATTACK | RANGED_ATTACK)[];

        if (cap >= 300) {
            parts = [RANGED_ATTACK, MOVE];
        } else if (cap >= 290) {
            parts = [ATTACK, ATTACK, ATTACK, MOVE];
        } else if (cap >= 210) {
            parts = [ATTACK, ATTACK, MOVE];
        } else {
            parts = [ATTACK, MOVE]
        }

        let flag = this.spawn.room.find(FIND_FLAGS);
        return this.spawn.spawnCreep(
            parts,
            generateName(_.capitalize('Safe'), length),
            {
                memory: {
                    type: 'safe',
                    flag: flag[Math.floor(Math.random() * flag.length)]
                }
            }
        );
    }

    /** Spawn miner, upgrade or builder unit */
    private spawnWorkUnit(type: string, cap: number, length: number): number {
        let parts: (WORK | CARRY | MOVE | ATTACK)[];

        if (cap >= 300) {
            parts = [WORK, WORK, CARRY, MOVE];
        } else {
            parts = [WORK, CARRY, MOVE];
        }

        return this.spawn.spawnCreep(
            parts,
            generateName(_.capitalize(type), length),
            {
                memory: {
                    type: type,
                    full: false
                }
            }
        )
    }
};
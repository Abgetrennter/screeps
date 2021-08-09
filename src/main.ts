import './room.prototype';
import './modules/建筑缓存';
import './creep.prototype';
import {config} from "./begin.balance";
import {source} from './init';
import {ErrorMapper} from './modules/errorMapper';
import {roleBuilder} from './role.builder';
import {roleCarrier} from './role.carrier';
import {roleHarvester} from './role.harvester';
import {roleRepairer} from './role.repairer';
import {roleUpgrader} from './role.upgrader';
import {roleDestroyer} from "./role.destroyer";
import {roleRangecarry} from "@/role.rangecarry";
import {roleAttacker} from "@/roleAttacker";

source();

/*
function count_screeps() {
  Memory.c_screeps =
      {'harvester' : 0, 'upgrader' : 0, 'builder' = 0, 'carrier' = 0};
  for (let name in Game.creeps) {
    let role = Game.creeps[name].memory.role;
    Memory.c_screeps[role] += 1;
  }
}
*/
function tower() {
    let towers = Game.spawns['Spawn1'].room.find<StructureTower>(FIND_STRUCTURES, {
        filter:
            (structure) => {
                return (structure.structureType === STRUCTURE_TOWER);
            }
    });
    if (towers) {
        for (let tower_name in towers) {
            let tower = towers[tower_name];
            let DamagedStructure = tower.room.find(
                FIND_STRUCTURES,
                {
                    filter: (structure) => (structure.hits < structure.hitsMax && structure.hits < 1500)
                        || (structure.structureType == STRUCTURE_CONTAINER && structure.hits < 200000)
                });
            if (DamagedStructure.length) {
                DamagedStructure.sort((a, b) => a.hits - b.hits);
                tower.repair(DamagedStructure[0]);
            }

            let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            }
        }
    }
}

export const loop = ErrorMapper.wrapLoop(() => {
    tower();
    for (let room in Game.rooms) {
        config(Game.rooms[room]);
    }

    // beginBalance.run();
    // get_structure(STRUCTURE_CONTAINER);
    // get_source()
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            // console.log(1);
            roleHarvester(creep);
        }
        if (creep.memory.role === 'upgrader') {
            roleUpgrader(creep);
        }
        if (creep.memory.role === 'builder') {
            roleBuilder(creep);
        }
        if (creep.memory.role === 'repairer') {
            roleRepairer(creep);
        }
        if (creep.memory.role === 'carrier') {
            // console.log('123');
            roleCarrier(creep);
        }
        if (creep.memory.role === 'destroyer'){
            roleDestroyer(creep);
        }
        if (creep.memory.role=== 'rangecarry'){
            roleRangecarry(creep);
        }
        if (creep.memory.role=== 'attacker'){
            roleAttacker(creep);
        }
    }
})
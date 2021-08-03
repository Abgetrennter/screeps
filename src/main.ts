import './creep.prototype';
import {config} from "./begin.balance";
import {source} from './init';
import { ErrorMapper } from './modules/errorMapper';
import {roleBuilder} from './role.builder';
import {roleCarrier} from './role.carrier';
import {roleHarvester} from './role.harvester';
import {roleRepairer} from './role.repairer';
import {roleUpgrader} from './role.upgrader';

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
            let tower=towers[tower_name];
            let closestDamagedStructure = tower.pos.findClosestByRange(
                FIND_STRUCTURES,
                {filter: (structure) => (structure.hits < structure.hitsMax&&structure.hits<3000)});
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
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
    config();
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
    }
})

import {config} from "./begin.balance";
import {source} from './init';
import {errorMapper} from './modules/errorMapper'
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

export const loop = errorMapper(() => {
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
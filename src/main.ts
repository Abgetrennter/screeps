
import {config} from "./begin.balance";
import {errorMapper} from './modules/errorMapper'
import {roleBuilder} from './role.builder';
import {roleHarvester} from './role.harvester';
import {roleRepairer} from './role.repairer';
import {roleUpgrader} from './role.upgrader';


export const loop = errorMapper(() => {
    config();
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
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
    }
})
import '@/prototype/room';
import '@/modules/建筑缓存';
import '@/prototype/creep';
import {prepare, process} from "@/modules/FindWay_OtherPlayerCode";
import {config} from "@/begin.balance";
import {ErrorMapper} from '@/modules/errorMapper';
import {builder} from '@/role/builder';
import {carrier} from '@/role/carrier';
import {harvester} from '@/role/harvester';
import {repairer} from '@/role/repairer';
import {upgrader} from '@/role/upgrader';
import {claimer} from "@/role/claimer";
import {tester} from "@/role/tester";
import {remotebuilder} from "@/role/remotebuilder";

//source();

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
for (let room in Game.rooms) {
    Game.rooms[room].source_count;
}


function tower(room: Room) {
    let towers: StructureTower[] = room.tower;
    if (towers.length > 0) {
        for (let tower_name in towers) {
            let tower = towers[tower_name];
            let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
                continue;
            }
            let DamagedStructure = tower.room.find<AnyStructure>(
                FIND_STRUCTURES,
                {
                    filter: (structure) => (structure.hits < structure.hitsMax && structure.hits < 4000
                        && structure.structureType !== STRUCTURE_WALL)
                });
            if (DamagedStructure.length) {
                DamagedStructure.sort((a, b) => a.hits - b.hits);
                tower.repair(DamagedStructure[0]);
            }
        }
    }
}

//
export const loop = ErrorMapper.wrapLoop(() => {
    prepare();
    for (let room in Game.rooms) {
        config(Game.rooms[room]);
        tower(Game.rooms[room]);
    }

    // beginBalance.run();
    // get_structure(STRUCTURE_CONTAINER);
    // get_source()
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        //creep.say('DA☆ZE');
        switch (creep.memory.role) {
            case 'harvester': {
                harvester(creep);
                break;
            }
            case 'upgrader': {
                upgrader(creep);
                break;
            }
            case 'builder': {
                builder(creep);
                break;
            }
            case 'repairer': {
                repairer(creep);
                break;
            }
            case 'carrier': {
                carrier(creep);
                break;
            }
            case 'tester': {
                tester(creep);
                break;
            }

            case 'claimer': {
                claimer(creep);
                break;
            }

            case 'remotebuilder': {
                remotebuilder(creep);
            }
        }
    }
    process();
})
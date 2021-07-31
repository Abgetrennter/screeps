export const roleRepairer = function (creep) {
    if (creep.memory.Working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.Working = false;
    }
    if (!creep.memory.Working && creep.store.getFreeCapacity() === 0) {
        creep.memory.Working = true;
    }

    if (creep.memory.Working) {
        let targets:AnyStructure[] = creep.room.find(
            FIND_STRUCTURES, {filter: object => object.hits < object.hitsMax})
        targets.sort((a, b) => a.hits - b.hits);
        // targets.sort((a, b) => a.hits - b.hits);
        if (targets.length) {
            if (creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    } else {
        if (creep.withdraw(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};
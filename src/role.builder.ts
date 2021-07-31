export const roleBuilder = function (creep: Creep) {

    if (creep.memory.Working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.Working = false;
    }
    if (!creep.memory.Working && creep.store.getFreeCapacity() === 0) {
        creep.memory.Working = true;
    }

    if (creep.memory.Working) {
        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        // targets.sort((a, b) => (a.process - b.process))
        if (targets.length) {
            if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }else{
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller,
                    {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    } else {
        if (creep.withdraw(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};

export const roleUpgrader = function (creep:Creep) {
    if (creep.memory.Working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.Working = false;
    }
    if (!creep.memory.Working && creep.store.getFreeCapacity() === 0) {
        creep.memory.Working = true;
    }

    if (creep.memory.Working) {
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller,
                {visualizePathStyle: {stroke: '#ffffff'}});
        }
    } else {

        // @ts-ignore

    if (creep.withdraw(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE ) {
            creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};

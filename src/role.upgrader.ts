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
        let sources = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType === STRUCTURE_CONTAINER ||
                        structure.structureType === STRUCTURE_SPAWN) &&
                    structure.store[RESOURCE_ENERGY] > 0);
            }
        });
        // @ts-ignore
        sources.sort((a, b) => (-a.store[RESOURCE_ENERGY] + b.store[RESOURCE_ENERGY]));

        if (creep.withdraw(sources[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE &&
            creep.transfer(sources[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};

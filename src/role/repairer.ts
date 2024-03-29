export const repairer = function (creep) {
    if (creep.memory.Working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.Working = false;
    }
    if (!creep.memory.Working && creep.store.getFreeCapacity() === 0) {
        creep.memory.Working = true;
    }

    if (creep.memory.Working) {
        let targets: AnyStructure[] = creep.room.find(
            FIND_STRUCTURES, {
                filter: object =>
                    ((object.hits < object.hitsMax
                        && (object.structureType !== STRUCTURE_WALL)
                        || (object.structureType == STRUCTURE_WALL && object.hits < 100000)))
            })
        targets.sort((a, b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
        if (targets.length) {
            if (creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
                creep.goTo(targets[0]);
            }
        }
    } else {
        let sources: AnyStructure[] = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER ||
                        structure.structureType === STRUCTURE_STORAGE ||
                        structure.structureType === STRUCTURE_SPAWN
                    ) &&
                    structure.store[RESOURCE_ENERGY] > 0;
            }
        });
        if (creep.withdraw(sources[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.goTo(sources[0]);
        }
    }
};

export const roleCarrier = function (creep) {
    if (creep.store.getFreeCapacity() > 0) {
        // console.log('123');
        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER &&
                    structure.store[RESOURCE_ENERGY] > 0);
            }
        });
        if (targets.length > 0) {
            targets.sort((a, b) =>
                (b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]));
            let flag = creep.withdraw(targets[0], RESOURCE_ENERGY);
            // console.log(flag);
            if (flag === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    } else {
        let targetss = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        if (targetss.length > 0) {

            if (creep.transfer(targetss[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targetss[0],
                    {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};
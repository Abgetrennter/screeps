function get_source(creep: Creep) {
    let targets;
    targets = creep.room.find(FIND_DROPPED_RESOURCES);
    if (targets.length > 0) {
        // @ts-ignore
        targets.sort((a, b) => (b.amount - a.amount));
    } else {
        let temp=[];
        targets = temp.concat(creep.room.find(FIND_TOMBSTONES), creep.room.find(FIND_RUINS));
        if (targets.length > 0) {
            targets.sort((a, b) => (a.ticksToDecay - b.ticksToDecay));
        } else {
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_CONTAINER &&
                        structure.store[RESOURCE_ENERGY] > 0);
                }
            });
            if (targets.length > 0) {
                targets.sort((a, b) => (b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]));
            } else {
                targets = null;
            }
        }

    }
    creep.memory.source = targets[0].id;
    return targets[0];
}

function get_target(creep: Creep) {
    let targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_EXTENSION ||
                    structure.structureType === STRUCTURE_SPAWN) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (targets.length) {
        // @ts-ignore
        targets.sort((a, b) => (a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]));
        creep.memory.target = targets[0].id;
    } else {
        creep.memory.target = null;
    }
    return targets[0];
}

export const roleCarrier = function (creep: Creep) {
    if (creep.store.getFreeCapacity() > 0) {
        // console.log('123');
        let target;
        if (creep.memory.target === null) {
            target = get_source(creep);
        } else {
            target = Game.getObjectById(creep.memory.target);
        }
        let flag: number;
        // @ts-ignore
        if (typeof target == Resource) {
            flag = creep.pickup(target);
        } else {
            flag = creep.withdraw(target, RESOURCE_ENERGY);
        }

        // console.log(flag);
        if (flag === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        } else if (flag === OK) {
            creep.memory.source = null;
        }
    } else {
        let target;
        if (creep.memory.target === null) {
            target = get_target(creep);
        } else {
            target = Game.getObjectById(creep.memory.target);
        }
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target,
                {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};
function get_resource(creep: Creep) {
    let targets = creep.room.find(FIND_DROPPED_RESOURCES);
    if (targets.length > 0) {
        targets.sort((a, b) => (b.amount - a.amount));
        return targets[0];
    } else {
        return null;
    }
}

function get_ruin(creep: Creep) {
    let temp = [];
    let targets = temp.concat(creep.room.find(FIND_TOMBSTONES), creep.room.find(FIND_RUINS));
    if (targets.length > 0) {
        targets.sort((a, b) => (a.ticksToDecay - b.ticksToDecay));
        return targets[0];
    } else {
        return null;
    }
}

function get_SourceStructures(creep: Creep): AnyStoreStructure {
    let sources = creep.room.find<StructureContainer>(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER &&
                structure.store[RESOURCE_ENERGY] > 0);
        }
    });

    if (sources.length > 0) {
        // @ts-ignore
        sources.sort((a, b) => (b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]));

        creep.memory.source = sources[0].id;
        return sources[0];
    } else {
        return null;
    }
}

function get_source(creep: Creep) {
    let target;
    target = get_SourceStructures(creep)


    return target;
}

function get_target(creep: Creep) {
    let targets = creep.room.find<AnyStoreStructure>(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_EXTENSION ||
                    structure.structureType === STRUCTURE_SPAWN ) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (targets.length) {
        // @ts-ignore
        targets.sort((a, b) => (a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]));
    } else {
        targets = creep.room.find<AnyStoreStructure>(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_TOWER ) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });

    }creep.memory.target = targets[0].id;
    return targets[0];
}

export const roleCarrier = function (creep: Creep) {

    if (creep.store.getFreeCapacity() > 0) {
        // console.log('123');
        let source;
        if (!creep.memory.source) {
            source = get_source(creep);
        } else {
            source = Game.getObjectById(creep.memory.source as Id<AnyStructure>);
        }


        let flag: number;
        flag = creep.withdraw(source, RESOURCE_ENERGY);

        //console.log(flag);
        if (flag === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
        } else if (flag === OK) {
            creep.memory.source = null;
        }
    } else {
        let target;
        if (!creep.memory.target) {
            target = get_target(creep);
        } else {
            target = Game.getObjectById(creep.memory.target as Id<StructureSpawn>);
        }
        let flag: number;
        flag = creep.transfer(target, RESOURCE_ENERGY);
        if (flag === ERR_NOT_IN_RANGE) {
            creep.moveTo(target,
                {visualizePathStyle: {stroke: '#ffffff'}});
        } else if (flag === OK) {
            creep.memory.target = null;

        }
    }
};
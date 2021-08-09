function get_source(creep) {
    let sources = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.structureType === STRUCTURE_CONTAINER ||
                    structure.structureType === STRUCTURE_SPAWN) &&
                structure.store[RESOURCE_ENERGY] > 0);
        }
    });
    if (sources.length) {
        sources.sort((a, b) => (-a.store[RESOURCE_ENERGY] + b.store[RESOURCE_ENERGY]));
        creep.memory.source = sources[0].id;
    } else {
        //
    }
}

export const roleUpgrader = function (creep: Creep) {
    if (creep.goDie()) return;
    //creep.say("123");
    if (creep.memory.Working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.Working = false;
        get_source(creep);
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

        let source: StructureContainer | STRUCTURESPAWN = Game.getObjectById(creep.memory.source as Id<AnyStoreStructure>);

        if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
};

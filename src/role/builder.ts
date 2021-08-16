function get_targets(creep: Creep) {
    let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length) {
        //@ts-ignore
        targets.sort((a, b) => (a.process - b.process));
        creep.memory.target = targets[0].id;
    } else {
        creep.memory.target = null;
    }

}

function build(creep: Creep) {
    let target = Game.getObjectById(creep.memory.target as Id<ConstructionSite>);
    if (!target) {
        //get_targets(creep);
        return;
    }
    let flag = creep.build(target);
    if (flag === ERR_NOT_IN_RANGE) {
        creep.goTo(target);
    }
    //creep.say(flag);
}

function upgrader(creep: Creep) {
    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.goTo(creep.room.controller);
    }
}

function get_source(creep: Creep) {
    let num=creep.store.getFreeCapacity();
    let sources = creep.pos.findClosestByRange<AnyStoreStructure>(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.structureType === STRUCTURE_CONTAINER ||
                    structure.structureType === STRUCTURE_SPAWN||
                    structure.structureType===STRUCTURE_STORAGE) &&
                structure.store[RESOURCE_ENERGY] > num );
        }
    });
    if (!sources) {
        creep.memory.source = null;
        return;
    }
    creep.memory.source = sources.id;
}

export const builder = function (creep: Creep) {
    if (creep.goDie()) return;
    //creep.say(String(123));
    if (creep.memory.Working && creep.store[RESOURCE_ENERGY] === 0) {
        //creep.say(String(123));
        creep.memory.Working = false;
        get_source(creep);
    } else if (!creep.memory.Working && creep.store.getFreeCapacity() === 0) {
        //creep.say(String(124));
        creep.memory.Working = true;
        get_targets(creep);
    }

    if (creep.memory.Working) {
        if (Game.time % 5 === 0) {
            get_targets(creep);
        }
        if (!!creep.memory.target) {
            //creep.say(String(123));
            build(creep);
        } else {
            //creep.say(String(1234));
            upgrader(creep);
        }
    } else {

        let source = Game.getObjectById(creep.memory.source as Id<AnyStoreStructure>);
        if (!source || Game.time % 8 === 0) {
            get_source(creep);
            source = Game.getObjectById(creep.memory.source as Id<AnyStoreStructure>);
            if (!source) return;
        }
        //sources.sort((a, b) => (-a.store[RESOURCE_ENERGY] + b.store[RESOURCE_ENERGY]))
        if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.goTo(source);
        }
    }
};

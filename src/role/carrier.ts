/**n 种状态,
 * init/default 初始化,
 * search 搜索资源,
 * pickup 拾取掉落的资源,
 * trans 从容器中提取资源,
 * carry 送到spawn ex 塔中,
 * die 要死了丢掉资源,
 */
enum state {
    Source,
    Pickup,
    Trans,
    Carry,
    Die,
    Init
}


function init(creep: Creep): void {
    if (creep.ticksToLive < 20) {
        creep.memory.condition = state.Die;
    } else if (creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.condition = state.Source;
    } else {
        creep.memory.condition = state.Carry;
    }
}


/*function get_ruin(creep: Creep) {
    let temp = [];
    let targets = temp.concat(creep.room.find(FIND_TOMBSTONES), creep.room.find(FIND_RUINS));
    if (targets.length > 0) {
        targets.sort((a, b) => (a.ticksToDecay - b.ticksToDecay));
        return targets[0];
    } else {
        return null;
    }
}*/

function get_resource(creep: Creep): Resource {
    let targets = creep.room.find<FIND_DROPPED_RESOURCES>(FIND_DROPPED_RESOURCES);
    if (targets.length > 0) {
        targets.sort((a, b) => (b.amount - a.amount));
        creep.say('resource');
        return targets[0];
    } else {
        return null;
    }
}

function get_SourceStructures(creep: Creep): AnyStoreStructure {
    let sources = creep.pos.findClosestByRange<StructureContainer>(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.structureType === STRUCTURE_CONTAINER) &&
                structure.store[RESOURCE_ENERGY] > 200);
        }
    });

    /*if (sources.length > 0) {
        // @ts-ignore
        sources.sort((a, b) => (b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]));
    */
    if (sources) {
        creep.say('container');
        return sources;
    } else {
        /*if (Game.rooms.E22S59.storage.store[RESOURCE_ENERGY]>0){
            return Game.rooms.E22S59.storage;
        }*/
        creep.say('hold on');
        return null;
    }
}

function get_link(creep: Creep): StructureLink {
    let link = creep.room.spawn[0].pos.findClosestByRange(FIND_STRUCTURES,
        {filter: (s) => (s.structureType == STRUCTURE_LINK && s.store.getFreeCapacity(RESOURCE_ENERGY) == 0)});
    if (link) {
        return link;
    } else {
        return null;
    }
}

function get_source(creep: Creep): void {
    if (Game.time % 10 == 0) {
        let resource = get_resource(creep);
        if (!!resource) {
            creep.memory.condition = state.Pickup;
            //console.log(flag);
            creep.memory.source = resource.id;
            do_pick(creep);
            return;
        }
    }
    //
    //if (!resource) {
    let source: any = get_link(creep);
    if (!source) {
        source = get_SourceStructures(creep);
    }
    if (!source) {
        creep.memory.condition = state.Source;
        return;
    } else {
        creep.memory.condition = state.Trans;
        creep.memory.source = source.id;
        do_source(creep);
    }/*

    } else {

    }*/
}

function do_source(creep: Creep) {
    let target = Game.getObjectById(creep.memory.source as Id<AnyStoreStructure>);
    let flag = creep.withdraw(target, RESOURCE_ENERGY);
    //console.log(flag);
    if (flag === ERR_NOT_IN_RANGE) {
        creep.room.visual.circle(target.pos, {fill: 'transparent', radius: 0.55, stroke: 'green'});
        creep.goTo(target);
        return;
    }
}

function do_pick(creep: Creep) {
    let target = Game.getObjectById(creep.memory.source as Id<Resource>);
    if (!target){
        creep.memory.condition=state.Source;
        return;
    }
    let flag = creep.pickup(target);
    //console.log(flag);
    creep.memory.source = target.id;
    if (flag === ERR_NOT_IN_RANGE) {
        creep.room.visual.circle(target.pos, {fill: 'transparent', radius: 0.55, stroke: 'yellow'});
        creep.goTo(target);
        return;
    }

}

function get_target(creep: Creep): AnyStoreStructure {
    let target = creep.room.tower.sort((a, b) => (a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]))[0];
    if (!target || target.store.getUsedCapacity(RESOURCE_ENERGY) > 800) {
        target = creep.pos.findClosestByRange<AnyStoreStructure>(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN)
                    &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
            }
        });
        if (!target) {
            target = creep.room.storage;
            /*if (!target) {
                target=Game.rooms.E22S59.storage;
            }*/
        }

    }
    //creep.memory.target = target[0].id;
    return target;
}

function do_carry(creep: Creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        creep.memory.condition = state.Source;
    }
    let target = get_target(creep);
    if (!target) return;
    let flag: number;
    flag = creep.transfer(target, RESOURCE_ENERGY);
    if (flag === ERR_NOT_IN_RANGE) {
        creep.goTo(target);
    } else { //if (flag === OK)
        //creep.memory.target = null;

    }
}


export const carrier = function (creep: Creep) {
    switch (creep.memory.condition) {
        case state.Source: {
            get_source(creep);
            break;
        }
        case state.Pickup: {
            do_pick(creep);
            break;
        }
        case state.Trans: {
            if (Game.time % 10 == 0) {
                get_source(creep)
            } else {
                do_source(creep);
            }
            break;
        }

        case state.Carry: {
            do_carry(creep);
            break;
        }
        case state.Die: {
            creep.goDie();
            break;
        }
        case state.Init:
        default: {
            init(creep);
        }
    }
    if (creep.store.getFreeCapacity() === 0) creep.memory.condition = state.Carry;
    if (creep.ticksToLive < 20) {
        creep.memory.condition = state.Die;
    }

};
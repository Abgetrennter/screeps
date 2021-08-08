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


function init(creep: Creep) :void{
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
    let sources = creep.room.container;
    sources.sort((a,b)=>(-a.store[RESOURCE_ENERGY]+b.store[RESOURCE_ENERGY]));

    /*if (sources.length > 0) {
        // @ts-ignore
        sources.sort((a, b) => (b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]));
    */
    if (sources[0].store[RESOURCE_ENERGY]>0) {
        creep.say('container');
        return sources[0];
    } else {
        creep.say('hold on');
        return null;
    }
}

function do_source(creep: Creep):void {
    let resource = get_resource(creep);
    if (!resource) {
        let source = get_SourceStructures(creep);
        if (!source) {
            creep.memory.condition = state.Source;
            return;
        } else {
            creep.memory.condition = state.Trans;
            let flag = creep.withdraw(source, RESOURCE_ENERGY);
            //console.log(flag);
            if (flag === ERR_NOT_IN_RANGE) {
                creep.room.visual.circle(source.pos,{fill: 'transparent', radius: 0.55, stroke: 'green'});
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
                return;
            }
        }
    } else {
        creep.memory.condition = state.Pickup;
        let flag = creep.pickup(resource);
        //console.log(flag);
        if (flag === ERR_NOT_IN_RANGE) {
            creep.room.visual.circle(resource.pos,{fill: 'transparent', radius: 0.55, stroke: 'yellow'});
            creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffffff'}});
            return;
        }
    }

    if (creep.store.getFreeCapacity()===0) creep.memory.condition= state.Carry;
}

function get_target(creep: Creep) :AnyStoreStructure{
    let target = creep.room.tower.sort((a,b)=>(a.store[RESOURCE_ENERGY]-b.store(RESOURCE_ENERGY)))[0];
    if (!target||target.store.getFreeCapacity(RESOURCE_ENERGY)===0) {
        target = creep.pos.findClosestByPath<AnyStoreStructure>(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN)
                    &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
            }
        });
        if (!target) {
            target = creep.room.storage;
            if (!target){
                return ;
            }
        }

    }
    //creep.memory.target = target[0].id;
    return target;
}

function do_carry(creep:Creep){
    let target=get_target(creep);
    if (!target) return;

    let flag: number;
    flag = creep.transfer(target, RESOURCE_ENERGY);
    if (flag === ERR_NOT_IN_RANGE) {
        creep.moveTo(target,
            {visualizePathStyle: {stroke: '#ffffff'}});
    } else { //if (flag === OK)
        //creep.memory.target = null;
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY)===0){
            creep.memory.condition=state.Source;
        }
    }
}

function to_die(creep: Creep): void {
    if (creep.store.getUsedCapacity() === 0) {
        return;
    } else {
        creep.drop(RESOURCE_ENERGY);
        return;
    }
}


export const roleCarrier = function (creep: Creep) {
    switch (creep.memory.condition) {
        case state.Source:
        case state.Pickup:
        case state.Trans: {
            do_source(creep);
            break;
        }

        case state.Carry: {
            do_carry(creep);
            break;
        }
        case state.Die: {
            to_die(creep);
            break;
        }
        case state.Init:
        default: {
            init(creep);
        }
    }
    if (creep.ticksToLive < 20) {
        creep.memory.condition = state.Die;
    }

};
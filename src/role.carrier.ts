function init(creep: Creep){
    if (creep.ticksToLive){}
}

function get_resource(creep: Creep) {
    let targets = creep.room.find<FIND_DROPPED_RESOURCES>(FIND_DROPPED_RESOURCES);
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
    let sources = creep.pos.findClosestByPath<StructureContainer>(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER &&
                structure.store[RESOURCE_ENERGY] > 0
                && structure.id != creep.memory.target);
        }
    });

    /*if (sources.length > 0) {
        // @ts-ignore
        sources.sort((a, b) => (b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]));
    */
    if (sources) {
        creep.memory.source = sources.id;
        return sources;
    } else {
        return null;
    }
}

function get_source(creep: Creep) {
    let target:any=get_resource(creep);
    if (!target)    target = get_SourceStructures(creep);

    return target;
}

function get_target(creep: Creep) {
    let targets = creep.room.find<AnyStoreStructure>(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.structureType === STRUCTURE_EXTENSION ||
                structure.structureType === STRUCTURE_SPAWN)
                &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
        }
    });
    if (targets.length) {
        // @ts-ignore
        //targets.sort((a, b) => (a.store.getFreeCapacity() - b.store.getFreeCapacity()));
    } else {
        targets = creep.room.find<AnyStoreStructure>(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (targets.length){
            targets=creep.room.find<AnyStoreStructure>(FIND_STRUCTURES,{
                filter:(structure)=>{
                    return(structure.structureType === STRUCTURE_CONTAINER &&
                        structure.id != creep.memory.source&&structure.store.getFreeCapacity(RESOURCE_ENERGY)>0);
                }
            });

        }

    }
    if (!targets[0]) {
        return null;
    }
    creep.memory.target = targets[0].id;
    return targets[0];
}

function to_die(creep:Creep): void{
    if (creep.store.getUsedCapacity()===0){
        return;
    }
    else{
        creep.drop(RESOURCE_ENERGY);
        return;
    }
}
/**n 种状态,
 * 0/default 初始化
 * 1 拾取掉落的资源
 * 2 从容器中提取资源
 * 3 送到spawn ex 塔中
 * 4 要死了丢掉资源
 */


export const roleCarrier = function (creep: Creep) {
    /*switch (creep.memory.condition) {
        case 1:{
            do_pickup();
            break;
        }
        case 2:{
            do_trans();
            break;
        }
        case 3:{
            do_casrry();
            break;
        }
        case 4:{
            to_die(creep);
            break;
        }
        default:{
            init();
        }
    }*/
    if (creep.store[RESOURCE_ENERGY] === 0) {
        // console.log('123');
        /*let source=Game.getObjectById(creep.memory.source as Id<AnyStructure>);;

        if (!source) {
            source = get_source(creep);
            if (!source)return;
        }*/
        let source = get_source(creep);
        let flag: number;
        flag = creep.withdraw(source, RESOURCE_ENERGY);

        //console.log(flag);
        if (flag === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
        } else if (flag === OK) {
            //creep.memory.source = null;
        } else {
            get_source(creep);
        }
    } else {
        let target = get_target(creep);
        if (!target) return;
        //creep.room.visual.circle(target.pos,{fill: 'transparent', radius: 0.55, stroke: 'red'});
        /*if (!creep.memory.target) {
            target = get_target(creep);
            if (!target){
                return;
            }
        } else {
            target = Game.getObjectById(creep.memory.target as Id<StructureSpawn>);
        }*/
        let flag: number;
        flag = creep.transfer(target, RESOURCE_ENERGY);
        if (flag === ERR_NOT_IN_RANGE) {
            creep.moveTo(target,
                {visualizePathStyle: {stroke: '#ffffff'}});
        } else if (flag === OK) {
            //creep.memory.target = null;
        } else {
            get_target(creep);
        }
    }
};
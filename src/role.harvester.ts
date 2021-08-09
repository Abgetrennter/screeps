import {size_for_source} from "@/begin.balance";


function tower(creep:Creep):boolean {
    let targets = creep.room.tower;
    if (targets.length===0)return false;
    //targets.sort((a, b) => a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY));
    if (targets[0].store.getUsedCapacity(RESOURCE_ENERGY)>500)return false;
    creep.memory.target=targets[0].id;
    return true;
}

function spAex(creep:Creep) :boolean{
    let targets = creep.room.extension.concat(Game.spawns['Spawn1'].room.spawn).sort((a, b) => a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY));
    if (targets[0].getFreeCapacity(RESOURCE_ENERGY)===0){
        return false;
    }
    else {
        creep.memory.target=targets[0].id;
        return true;
    }
}

function container(creep:Creep):boolean{
    let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (!target) return false;
    creep.memory.target=target.id;
    return true;
}

function get_target(creep) {
    let flag1=tower(creep);
    let flag2;
    let flag3;
    let count = _.filter(Game.creeps, (creep) => creep.memory.role === 'carrier').length;
    //if (target === null&&count==0) {
    if (flag1 && count === 0) {
        flag2=spAex(creep);
    } else{
        flag3=container(creep);
    }
    if (!(flag1||flag2||flag3) ){
        //console.log(creep.room.storage)
        if (creep.room.storage.length){
            creep.memory.target = creep.room.storage.id;
        }
    }
    return;
}

function init_source(creep) {
    let target: string;
    for (let i in Memory.source) {

        if (Memory.source[i] < size_for_source) {
            Memory.source[i] += 1;
            target = i;
            creep.source = Game.getObjectById(target as Id<Source>);
            break;
        }
    }
    /*        if (!!creep.source){
                //@ts-ignore

                if (creep.harvest(creep.source)===ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.source,
                        {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }else{
                init_source(creep);
            }*/
}

export const roleHarvester = function (creep: Creep) {
    /*
     *假定harvest有属性target 为列表,包含 source 和 target 两个变量
     *这样就不用每次去找了
     *刚开始还得是送货上门
     *但是说可以把绑定的进行更换.
    **/
    if (creep.goDie()) return;
    if (creep.store.getFreeCapacity() > 0) {
        //init_source(creep);
        const source = Game.getObjectById(creep.memory.source as Id<Source>);
        if (creep.harvest(source) ===
            ERR_NOT_IN_RANGE) {
            creep.room.visual.circle(source.pos, {fill: 'transparent', radius: 0.55, stroke: 'blue'});
            creep.moveTo(source,
                {visualizePathStyle: {stroke: '#ffaa00'}});
            /*if (flag===ERR_NO_PATH){
                            for (let i in Memory.source) {
                                if (i!=creep.memory.source){
                                    creep.memory.source=i;
                                }
                            }
                        }*/
        }
    } else {
        let target = Game.getObjectById(creep.memory.target as Id<any>);
        //get_target(creep);
        get_target(creep);
        /*if (Game.time % 10 || !target) {
            get_target(creep);
            target = Game.getObjectById(creep.memory.target as Id<any>);
        }*/
        //let target=Game.spawns['Spawn1'];
        // @ts-ignore
        /*if (target.hits<150000){

            creep.repair(target);
            return;
        }*/
        let flag = creep.transfer(target, RESOURCE_ENERGY);
        if (flag === ERR_NOT_IN_RANGE) {
            creep.room.visual.circle(target.pos, {fill: 'transparent', radius: 0.55, stroke: 'red'});
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        } else if (flag === OK) {

        } else {
            get_target(creep);
        }
    }
};
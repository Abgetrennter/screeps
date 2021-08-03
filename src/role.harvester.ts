import {size_for_source} from "@/begin.balance";

function get_target(creep) {
    let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    let count=_.filter(Game.creeps, (creep) => creep.memory.role === 'carrier').length;
    //if (target === null&&count==0) {
    if(!count||!target){
        target = Game.spawns['Spawn1'];
    }
    creep.memory.target=target.id;
}

function init_source(creep){
    let target:string;
    for (let i in Memory.source) {

        if (Memory.source[i] < size_for_source) {
            Memory.source[i]+=1;
            target = i;
            creep.source=Game.getObjectById(target as Id<Source>);
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
    if (creep.store.getFreeCapacity() > 0) {

        if (creep.harvest(Game.getObjectById(creep.memory.source as Id<Source>)) ===
            ERR_NOT_IN_RANGE) {
            let flag=creep.moveTo(Game.getObjectById(creep.memory.source as Id<Source>),
                {visualizePathStyle: {stroke: '#ffaa00'}});
            if (flag===ERR_NO_PATH){
                creep.memory.role='builder';
            }
        }
    } else {
        let target=Game.getObjectById(creep.memory.target as Id<any>);
        //get_target(creep);
        //get_target(creep);
        if (Game.time%300||!target){
            get_target(creep);
        }
        //let target=Game.spawns['Spawn1'];
        // @ts-ignore
        if (target.hits<210000){
            creep.repair(target);
            return;
        }
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            // @ts-ignore
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};
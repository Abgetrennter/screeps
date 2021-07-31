export const roleHarvester = function (creep: Creep) {
    /*
     *假定harvest有属性target 为列表,包含 source 和 target 两个变量
     *这样就不用每次去找了
     *刚开始还得是送货上门
     *但是说可以把绑定的进行更换.
    **/
    if (creep.store.getFreeCapacity() > 0) {
        let source = Game.getObjectById(creep.memory.source);
        if (creep.harvest(source) ===ERR_NOT_IN_RANGE) {
            creep.moveTo(source,{visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            // @ts-ignore
            creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};
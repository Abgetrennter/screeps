function get_target(creep) {
    let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (target === null) {
        target = Game.spawns['Spawn1'].id;
    }
    creep.memory.target=target;
}

export const roleHarvester = function (creep: Creep) {
    /*
     *假定harvest有属性target 为列表,包含 source 和 target 两个变量
     *这样就不用每次去找了
     *刚开始还得是送货上门
     *但是说可以把绑定的进行更换.
    **/
    if (creep.store.getFreeCapacity() > 0) {
        //let sources = creep.room.find(FIND_SOURCES);
        // console.log(sources[0].pos.x)
        //sources.sort((a, b) => -b.pos.x + a.pos.x);
        //
        // let i = cr;
        // console.log(sources[1] == Game.getObjectById(creep.memory.source));
        if (creep.harvest(Game.getObjectById(creep.memory.source)) ===
            ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(creep.memory.source),
                {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        let target=Game.getObjectById(creep.memory.target);
        if (Game.time%300||target===null){
            get_target(creep);
        }
        // @ts-ignore
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            // @ts-ignore
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};
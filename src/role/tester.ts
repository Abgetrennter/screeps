export const tester = function (creep: Creep) {
    /*if (creep.room.name == 'E22S59') {
        creep.goTo(Game.getObjectById('5bbcae2d9099fc012e63885e' as Id<Source>));*/
    if (creep.room.name=='E22S59'){
        creep.goTo(Game.flags['test'].pos);
    } else {
        if (creep.memory.Working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.Working = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.Working && creep.store.getFreeCapacity() == 0) {
            creep.memory.Working = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.Working) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.goTo(
                    creep.room.controller);
            }
        } else {
            let sources=creep.room.source;
            if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.goTo(sources[1]);
            }
        }
    }
}
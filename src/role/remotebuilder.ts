export const remotebuilder= function (creep: Creep) {
    /*if (creep.room.name == 'E22S59') {
        creep.goTo(Game.getObjectById('5bbcae2d9099fc012e63885e' as Id<Source>));*/
        if (creep.memory.Working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.Working = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.Working && creep.store.getFreeCapacity() == 0) {
            creep.memory.Working = true;
            creep.say('⚡ worker');
        }

        if (creep.memory.Working) {
            //if (creep.room.name=='W8N3'){
            //    creep.goTo(Game.rooms['W8N2'].controller);
            if (creep.room.name=='E22S59'){
                creep.goTo(Game.flags['build'].pos);
            }else{
                /*if (creep.pos.x>47){
                    creep.goTo(Game.flags['build'].pos);
                }*/
                let target=creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (!!target){
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.goTo(target);
                    }
                }else{
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.goTo(creep.room.controller);
                    }
                }
            }
        } else {
            //let sources=Game.rooms.W8N3.storage;
            let sources=Game.rooms['E22S59'].storage;
            if (creep.withdraw(sources, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.goTo(sources);
            }
        }
}
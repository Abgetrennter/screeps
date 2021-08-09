export const roleRangecarry = function (creep: Creep) {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        let target = Game.spawns['Spawn1'].room.storage;
        console.log(target);
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }

    } else {
        let flag = creep.moveTo(Game.getObjectById('5cf4291bdcb6240fe1832f1a'));
        if (creep.room.name === 'E21S59') {

            let targets = creep.room.find<FIND_DROPPED_RESOURCES>(FIND_DROPPED_RESOURCES);
            if (targets.length > 0) {
                targets.sort((a, b) => (b.amount - a.amount));
                creep.say('resource');
                if (creep.pickup(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                return
            }
        }

    }
}
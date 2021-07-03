module.exports = {
  /** @param {Creep} creep **/
  run : function(creep) {
    if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.repairing = false;
    }
    if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
      creep.memory.repairing = true;
    }

    if (creep.memory.repairing) {
      var targets = creep.room.find(
          FIND_STRUCTURES, {filter : object => object.hits < object.hitsMax})
      targets.sort((a, b) => a.hits - b.hits);
      if (targets.length) {
        if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {visualizePathStyle : {stroke : '#ffffff'}});
        }
      }
    } else {
      var sources = creep.room.find(FIND_STRUCTURES, {
        filter : (structure) => {
          return (structure.structureType == STRUCTURE_CONTAINER ||
                  structure.structureType == STRUCTURE_STORAGE) &&
                 structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle : {stroke : '#ffaa00'}});
      }
    }
  }
};
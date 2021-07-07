
let roleBuilder = {

  /** @param {Creep} creep **/
  run : function(creep) {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
    }

    if (creep.memory.building) {
      let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      // targets.sort((a, b) => (a.process - b.process))
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {visualizePathStyle : {stroke : '#ffffff'}});
        }
      }
    } else {
      let sources = creep.room.find(FIND_STRUCTURES, {
        filter : (structure) => {
          return ((structure.structureType == STRUCTURE_CONTAINER ||
                   structure.structureType == STRUCTURE_SPAWN) &&
                  structure.store[RESOURCE_ENERGY] > 0);
        }
      });
      sources.sort((a, b) =>
                       (-a.store[RESOURCE_ENERGY] + b.store[RESOURCE_ENERGY]))
      if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE &&
          creep.transfer(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle : {stroke : '#ffaa00'}});
      }
    }
  }
};

module.exports = roleBuilder;
let roleHarvester = {

  /** @param {Creep} creep **/
  /*
  假定harvest有属性target 为列表,包含 source 和 target 两个变量
  这样就不用每次去找了
  */
  run : function(creep) {
    if (creep.store.getFreeCapacity() > 0) {
      let sources = creep.room.find(FIND_SOURCES);
      // console.log(sources[0].pos.x)
      sources.sort((a, b) => -b.pos.x + a.pos.x);
      //
      // let i = cr;
      // console.log(sources[1] == Game.getObjectById(creep.memory.source));
      if (creep.harvest(Game.getObjectById(creep.memory.source)) ==
          ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.getObjectById(creep.memory.source),
                     {visualizePathStyle : {stroke : '#ffaa00'}});
      }
    } else {
      let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter : (structure) => {
          return (structure.structureType == STRUCTURE_CONTAINER) &&
                 structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });
      if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle : {stroke : '#ffffff'}});
      }
    }
  }
};
module.exports = roleHarvester;
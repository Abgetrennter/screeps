module.exports = {
  run : function() {
    //回收内存
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
      }
    }

    if (Game.spawns['Spawn1'].Spawning != null) {
      // console.log('can\'t')
      return; //检测创造screep是否可行
    }
    var roles = {
      'harvester' : [ 3, [ WORK, CARRY, MOVE ] ],
      'upgrader' : [ 1, [ WORK, CARRY, MOVE ] ],
      'builder' : [ 2, [ WORK, CARRY, MOVE ] ]
    }; //配置文件

    //优先满足采集
    var worker1 =
        _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if (worker1.length < roles['harvester']) {
      var newName = 'harvester' + Game.time % 100;
      Game.spawns['Spawn1'].spawnCreep(roles['harvester'][1], newName,
                                       {memory : {role : 'harvester'}});
      return;
    }

    var worker2 =
        _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    if (worker2.length < roles['builder']) {
      var newName = 'builder' + Game.time % 100;
      Game.spawns['Spawn1'].spawnCreep(roles['builder'][1], newName,
                                       {memory : {role : 'builder'}});
      return;
    }

    var worker3 =
        _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    if (worker3.length < roles['upgrader']) {
      var newName = 'upgrader' + Game.time % 100;
      Game.spawns['Spawn1'].spawnCreep(roles['upgrader'][1], newName,
                                       {memory : {role : 'upgrader'}});
      return;
    }
  }
}
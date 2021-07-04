module.exports = {
  run : function() {
    //回收内存
    for (let name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
      }
    }

    if (Game.spawns['Spawn1'].Spawning != null) {
      // console.log('can\'t')
      return; //检测创造screep是否可行
    }
    let roles = {
      'harvester' :
          [ 3, [ WORK, WORK, WORK, CARRY, CARRY, MOVE, CARRY, MOVE ] ],
      'upgrader' : [ 3, [ WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE ] ],
      'builder' : [ 2, [ WORK, WORK, CARRY, CARRY, MOVE, MOVE ] ],
      'repairer' : [ 2, [ WORK, WORK, CARRY, MOVE, MOVE, MOVE ] ],
      'carrier' : [ 2, [ WORK, CARRY, MOVE, CARRY, MOVE, MOVE ] ]
    }; //配置文件

    //优先满足采集
    {
      let worker =
          _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
      if (worker.length < roles['harvester'][0]) {
        let newName = 'harvester' + Game.time % 100;
        Game.spawns['Spawn1'].spawnCreep(roles['harvester'][1], newName,
                                         {memory : {role : 'harvester'}});
        return;
      }
    }

    {
      let worker =
          _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
      if (worker.length < roles['builder'][0]) {
        let newName = 'builder' + Game.time % 100;
        Game.spawns['Spawn1'].spawnCreep(roles['builder'][1], newName,
                                         {memory : {role : 'builder'}});
        return;
      }
    }

    {
      let worker =
          _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
      if (worker.length < roles['upgrader'][0]) {
        let newName = 'upgrader' + Game.time % 100;
        Game.spawns['Spawn1'].spawnCreep(roles['upgrader'][1], newName,
                                         {memory : {role : 'upgrader'}});
        return;
      }
    }

    {
      let worker =
          _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
      if (worker.length < roles['repairer'][0]) {
        let newName = 'repairer' + Game.time % 100;
        Game.spawns['Spawn1'].spawnCreep(
            roles['repairer'][1], newName,
            {memory : {role : 'repairer', repairing : false}});
        return;
      }
    }

    {
      let worker5 =
          _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
      if (worker4.length < roles['carrier'][0]) {
        let newName = 'carrier' + Game.time % 100;
        Game.spawns['Spawn1'].spawnCreep(roles['carrier'][1], newName,
                                         {memory : {role : 'carrier'}});
        return;
      }
    }
  }
}
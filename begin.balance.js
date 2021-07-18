function gc() {
  let targets = Game.spawns['Spawn1'].room.find(FIND_TOMBSTONES);
  // console.log(targets)
  for (let i in targets) {
    let creep = targets[i].creep
    if (creep.role == 'harvester') {
      Memory.source[creep.memory.source] -= 1;
    }
    // console.log(targets[i].creep.name);
    delete Memory.creeps[targets[i].creep.name];
  }
}
const roles = {
  'harvester' : [ 3, [ WORK, CARRY, MOVE ] ],
  'upgrader' : [ 2, [ WORK, CARRY, MOVE ] ],
  'builder' : [ 2, [ WORK, CARRY, MOVE ] ],
  'repairer' : [ 1, [ WORK, CARRY, MOVE, MOVE ] ],
  'carrier' : [ 1, [ WORK, CARRY, MOVE ] ]
}; //配置文件
module.exports = {
  run : function() {
    //回收内存
    gc();

    //优先满足采集
    if (_.filter(Game.creeps, (creep) => creep.memory.role == 'harvester')
            .length < roles['harvester'][0]) {
      let newName = 'harvester' + Game.time % 100;
      let target;
      for (let i in Memory.source) {
        if (Memory.source[i] < 2) {
          target = i;
          break;
        }
      }

      flag = Game.spawns['Spawn1'].spawnCreep(
          roles['harvester'][1], newName,
          {memory : {role : 'harvester', source : target}});
      if (flag == OK) {
        Memory.source[target] += 1;
      }

      return;
    }

    {
      let worker =
          _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
      if (worker.length < roles['carrier'][0]) {
        let newName = 'carrier' + Game.time % 100;
        Game.spawns['Spawn1'].spawnCreep(roles['carrier'][1], newName,
                                         {memory : {role : 'carrier'}});
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
  }
}
const roles = {
  'harvester' : [ 3, [ WORK, CARRY, MOVE ] ],
  'upgrader' : [ 2, [ WORK, CARRY, MOVE ] ],
  'builder' : [ 2, [ WORK, CARRY, MOVE ] ],
  'repairer' : [ 0, [ WORK, CARRY, MOVE, MOVE ] ],
  'carrier' : [ 0, [ WORK, CARRY, MOVE ] ]
}; //配置文件

module.exports = {
  run : function() {
    /*if (Game.time % 8 != 0) {
      return;
    }*/

    //回收内存

    {
      for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
          let creep = Memory.creeps[name];
          if (creep.role == 'harvester') {
            Memory.source[creep.memory.source] -= 1;
          }
          // console.log(targets[i].creep.name);
          delete Memory.creeps[name];
        }
      }
    }
    /* 考虑这样一种情况,如果是发展期,我们需要增加其数量.那么补全
     * 缺失的东西这种想法就不是很好用,所以需要和预定的数目比较
     * 这种想法.但是之后可能还要引入队列的想法,对生成的数目进行排序
     */

    //优先满足采集
    {
      let worker =
          _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
      if (worker.length < roles['harvester'][0]) {
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
    }

    {
      // carrier 在运送的时候也应该绑定相关的CONTAINER
      // 但是初始的时候是没有container的所以也不需要carrier
      let worker =
          _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
      if (worker.length < roles['carrier'][0]) {
        let newName = 'carrier' + Game.time % 100;
        let target;
        for (let i in Memory[STRUCTURE_CONTAINER]) {
          if (Memory.source[i] < 2) {
            target = i;
            break;
          }
        }

        Game.spawns['Spawn1'].spawnCreep(
            roles['carrier'][1], newName,
            {memory : {role : 'carrier', container : target}});
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

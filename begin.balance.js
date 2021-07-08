function gc() {
  let targets = Game.spawns['Spawn1'].room.find(FIND_TOMBSTONES);
  // console.log(targets)
  if (targets.length == 0) {
    return;
  } else {
    for (let i in targets) {
      let creep = targets[i].creep
      Memory.c_screeps[creep.memory.role] -= 1;
      if (creep.role == 'harvester') {
        Memory.source[creep.memory.source] -= 1;
      }
      // console.log(targets[i].creep.name);
      delete Memory.creeps[targets[i].creep.name];
    }
  }
}

function new_harvester(newName, roles) {
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
  return flag;
}

function new_carrier(newName, roles) {
  let flag = Game.spawns['Spawn1'].spawnCreep(roles['carrier'][1], newName,
                                              {memory : {role : 'carrier'}});
  return flag;
}

function new_builder(newName, roles) {
  let flag = Game.spawns['Spawn1'].spawnCreep(roles['builder'][1], newName,
                                              {memory : {role : 'builder'}});
  return flag;
}

function new_upgrader(newName, roles) {
  let flag = Game.spawns['Spawn1'].spawnCreep(roles['upgrader'][1], newName,
                                              {memory : {role : 'upgrader'}});
  return flag;
}

function new_repairer(newName, roles) {
  let flag = Game.spawns['Spawn1'].spawnCreep(roles['repairer'][1], newName,
                                              {memory : {role : 'repairer'}});
  return flag;
}

function plus_number() {
  if (Game.roos['Spawn1'].spawning) {
    return;
  }
  const roles = {
    'harvester' : [ 3, [ WORK, CARRY, MOVE ] ],
    'upgrader' : [ 2, [ WORK, CARRY, MOVE ] ],
    'builder' : [ 2, [ WORK, CARRY, MOVE ] ],
    'repairer' : [ 1, [ WORK, CARRY, MOVE, MOVE ] ],
    'carrier' : [ 1, [ WORK, CARRY, MOVE ] ]
  }; //配置文件
  let newName = 'harvester' + Game.time % 100;

  if (roles['harvester'] - Memory.c_screeps['harvester'] != 0) {
    if (new_harvester(newName, roles) == OK) {
      Memory.c_screeps['harvester'] += 1;
    }
    return;
  }

  if (roles['carrier'] - Memory.c_screeps['carrier'] != 0) {
    if (new_carrier(newName, roles) == OK) {
      Memory.c_screeps['carrier'] += 1;
    }
    return;
  }

  if (roles['upgrader'] - Memory.c_screeps['upgrader'] != 0) {
    if (new_upgrader(newName, roles) == OK) {
      Memory.c_screeps['upgrader'] += 1;
    }
    return;
  }

  if (roles['builder'] - Memory.c_screeps['builder'] != 0) {
    if (new_builder(newName, roles) == OK) {
      Memory.c_screeps['builder'] += 1;
    }
    return;
  }

  if (roles['repairer'] - Memory.c_screeps['repairer'] != 0) {
    if (new_repairer(newName, roles) == OK) {
      Memory.c_screeps['repairer'] += 1;
    }
    return;
  }
}

module.exports = {
  run : function() {
    gc();
    plus_number();
  }
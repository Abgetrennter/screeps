function gc() {
  let targets = Game.spawns['Spawn1'].room.find(FIND_TOMBSTONES);
  // console.log(targets)
  if (targets.length == 0) {
    return;
  } else {
    for (let i in targets) {
      let creep = targets[i].creep;
      if (!creep) {
        return;
      }
      console.log(creep.memory.role);
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
  // console.log(123);
  if (Game.spawns['Spawn1'].spawning) {
    return;
  }
  const roles = {
    'harvester' : [ 4, [ WORK, CARRY, MOVE ] ],
    'upgrader' : [ 2, [ WORK, CARRY, MOVE ] ],
    'builder' : [ 2, [ WORK, CARRY, MOVE ] ],
    'repairer' : [ 1, [ WORK, CARRY, MOVE ] ],
    'carrier' : [ 1, [ WORK, CARRY, MOVE ] ]
  }; //配置文件
  let newName = Game.time % 100;
  console.log(roles['harvester'][0], Memory.c_screeps['harvester'])
  if ((roles['harvester'][0] > Memory.c_screeps['harvester'])) {
    newName = 'harvester' + newName;
    if (new_harvester(newName, roles) == OK) {
      Memory.c_screeps['harvester'] += 1;
    }
    return;
  }

  if (roles['carrier'][0] > Memory.c_screeps['carrier']) {
    newName = 'carrier' + newName;
    if (new_carrier(newName, roles) == OK) {
      Memory.c_screeps['carrier'] += 1;
    }
    return;
  }

  if (roles['upgrader'][0] > Memory.c_screeps['upgrader']) {
    newName = 'upgrader' + newName;
    if (new_upgrader(newName, roles) == OK) {
      Memory.c_screeps['upgrader'] += 1;
    }
    return;
  }

  if (roles['builder'][0] > Memory.c_screeps['builder']) {
    newName = 'builder' + newName;
    if (new_builder(newName, roles) == OK) {
      Memory.c_screeps['builder'] += 1;
    }
    return;
  }

  if (roles['repairer'] > Memory.c_screeps['repairer']) {
    newName = 'repairer' + newName;
    if (new_repairer(newName, roles) == OK) {
      Memory.c_screeps['repairer'] += 1;
    }
    return;
  }
}

module.exports = {
  run : function() {
    // console.log(123);
    gc();
    plus_number();
  }
}
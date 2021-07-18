let roleHarvester = require('role.harvester')
let roleUpgrader = require('role.upgrader')
let roleBuilder = require('role.builder')
let roleRepairer = require('role.repairer')
let beginBalance = require('begin.balance')
let roleCarrier = require('role.carrier')
function tower() {
  let tower = Game.getObjectById('TOWER_ID')
  if (tower) {
    let closestDamagedStructure = tower.pos.findClosestByRange(
        FIND_STRUCTURES,
        {filter : (structure) => structure.hits < structure.hitsMax})
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure)
    }

    let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
    if (closestHostile) {
      tower.attack(closestHostile)
    }
  }
}

function get_structure(structure_name) {
  let targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
    filter :
        (structure) => { return (structure.structureType == structure_name); }
  });
  Memory[structure_name] = {};
  // console.log(Memory.structure_name)
  for (let i in targets) {
    Memory[structure_name][targets[i].id] = 0;
  }
}

function get_source() {
  let targets = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
  Memory.source = {};
  // console.log(Memory.source)
  for (let i in targets) {
    Memory.source[targets[i].id] = 0;
  }

  let workers =
      _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
  for (let i in workers) {
    let creep = Game.creeps[i];
    Memory.source[creep.memory.source] += 1;
  }
  return;
}

/*
function count_screeps() {
  Memory.c_screeps =
      {'harvester' : 0, 'upgrader' : 0, 'builder' = 0, 'carrier' = 0};
  for (let name in Game.creeps) {
    let role = Game.creeps[name].memory.role;
    Memory.c_screeps[role] += 1;
  }
}
*/
module.exports.loop = function() {
  beginBalance.run();
  get_structure(STRUCTURE_CONTAINER);
  // get_source()
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    if (creep.memory.role == 'harvester') {
      // console.log(1);
      roleHarvester.run(creep);
    }
    if (creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    }
    if (creep.memory.role == 'repairer') {
      roleRepairer.run(creep);
    }
    if (creep.memory.role == 'carrier') {
      // console.log('123');
      roleCarrier.run(creep);
    }
  }
}
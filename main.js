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

function get_source() {
  Memory.source = {};

  for (let name in Game.creeps) {
    if (Game.creeps[name].memory.role == 'harvester') {
      if (Game.creeps[name].memory.source in Memory.source) {
        Memory.source[Game.creeps[name].memory.source] += 1;
      } else {
        Memory.source[Game.creeps[name].memory.source] = 1;
      }
    }
  }
}

function count_screeps() {
  Memory.c_screeps = {};
  let temp = [ 'harvester', 'repairer', 'builder', 'carrier', 'upgrader' ];
  for (let i in temp) {
    Memory.c_screeps[temp[i]] = 0;
  }
  for (let name in Game.creeps) {
    if (Game.creeps[name].memory.role in Memory.c_screeps) {
      Memory.c_screeps[Game.creeps[name].memory.role] += 1;
    } else {
      Memory.c_screeps[Game.creeps[name].memory.role] = 1;
    }
  }
}

module.exports.loop = function() {
  // count_screeps();
  beginBalance.run()
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
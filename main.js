var roleHarvester = require('role.harvester')
var roleUpgrader = require('role.upgrader')
var roleBuilder = require('role.builder')
var roleRepairer = require('role.repairer')
var beginBalance = require('begin.balance')
var roleCarrier = require('role.carrier')
function tower() {
  var tower = Game.getObjectById('TOWER_ID')
  if (tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(
        FIND_STRUCTURES,
        {filter : (structure) => structure.hits < structure.hitsMax})
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure)
    }

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
    if (closestHostile) {
      tower.attack(closestHostile)
    }
  }
}

module.exports.loop = function() {
  beginBalance.run()

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == 'harvester') {
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
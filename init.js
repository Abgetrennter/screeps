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

function get_container() {
  get_structure(STRUCTURE_CONTAINER);
  let workers =
      _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
  for (let i in workers) {
    let creep = Game.creeps[i];
    Memory[STRUCTURE_CONTAINER][creep.memory.source] += 1;
  }
  return;
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

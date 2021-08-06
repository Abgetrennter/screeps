export const source = function () {
    let targets = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
    Memory.source = {};
    // console.log(Memory.source)
    for (let i in targets) {
        Memory.source[targets[i].id] = 0;
    }

    let workers =
        _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    for (let i in workers) {
        let creep = workers[i];
        if (!creep.memory.source) {
            continue;
        }
        Memory.source[creep.memory.source] += 1;
    }

}

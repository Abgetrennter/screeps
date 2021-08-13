/*export const source = function () {
    let targets = [];
    for (let name in Game.rooms) {
        //console.log(Game.rooms[name].source);
        targets=targets.concat(Game.rooms[name].source);
    }
    Memory.source = {};
    //console.log(targets);
    for (let i in targets) {
        Memory.source[targets[i].id] = 0;
    }

    let workers =
        _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    for (let i in workers) {
        let creep = workers[i];
        if (!creep.memory.source ||! (creep.memory.source in Memory.source)) {
            continue;
        }
        Memory.source[creep.memory.source] += 1;
    }

}*/

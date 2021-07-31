let roles = {
    'harvester': {body: [WORK, CARRY, MOVE,MOVE]},
    'upgrader': {body: [WORK, CARRY, MOVE,MOVE]},
    'builder': {body: [WORK, CARRY, MOVE,MOVE]},
    'repairer': {body: [WORK, CARRY, MOVE,MOVE]},
    'carrier': {body: [WORK, CARRY, MOVE]}
}; //配置文件

function gc() {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}

function new_harvest(): boolean {
    let worker =
        _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    let targets = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
    let num = targets.length * 4;
    if (worker.length < num) {
        let newName = 'harvester' + Game.time % 100;
        let target;
        let source = {};
        // console.log(Memory.source)
        for (let i in targets) {
            source[targets[i].id] = 0;
        }
        for (let i in worker) {
            source[worker[i].memory.source] += 1;
        }
        for (let i in source) {
            if (source[i] < 4) {
                target = i;
                break;
            }
        }
        // @ts-ignore
        let flag = Game.spawns['Spawn1'].spawnCreep(roles['harvester']['body'], newName,
            {memory: {role: 'harvester', source: target}});
        console.log(newName, flag);
        return true;
    }
    return false;
}

export const config = function () {
    if (Game.time % 19 != 0) {
      return;
    }

    gc();

    if (new_harvest()) return;
    {
        let worker =
            _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
        const count:number=3;
        if (worker.length < count) {
            let newName = 'builder' + Game.time % 100;
            // @ts-ignore
            Game.spawns['Spawn1'].spawnCreep(roles['builder']['body'], newName,
                {memory: {role: 'builder'}});
            return;
        }
    }
    {
        let worker =
            _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
        const count :number=3;
        if (worker.length < count) {
            let newName = 'upgrader' + Game.time % 100;
            // @ts-ignore
            Game.spawns['Spawn1'].spawnCreep(roles['upgrader']['body'], newName,
                {memory: {role: 'upgrader'}});
            return;
        }
    }




    {
        let worker =
            _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer');
        if (worker.length < 1) {
            let newName = 'repairer' + Game.time % 100;
            // @ts-ignore
            Game.spawns['Spawn1'].spawnCreep(roles['repairer']['body'], newName,
                {memory: {role: 'repairer', Working: false}});
        }
    }
}

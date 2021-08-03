let roles = {
    'harvester': {count: 6, body: [WORK, CARRY, MOVE, MOVE]},
    'upgrader': {count: 1, body: [WORK, CARRY, MOVE, MOVE]},
    'builder': {count:2, body: [WORK, CARRY, CARRY, MOVE]},
    'repairer': {count: 1, body: [WORK, CARRY, MOVE, MOVE]},
    'carrier': {count: 0, body: [CARRY,MOVE,CARRY,MOVE]}
}; //配置文件

function gc() {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            let creep = Memory.creeps[name];
            if (creep.role === 'harvester') {
                if (Memory.source[creep.source] > 0) Memory.source[creep.source] -= 1;
            }
            // console.log(targets[i].creep.name);
            delete Memory.creeps[name];
        }
    }
}

export const size_for_source = 2;


export const config = function () {
    if (Game.time % 19 != 0) {
        return;
    }

    //回收内存
    gc();

    /* 考虑这样一种情况,如果是发展期,我们需要增加其数量.那么补全
     * 缺失的东西这种想法就不是很好用,所以需要和预定的数目比较
     * 这种想法.但是之后可能还要引入队列的想法,对生成的数目进行排序
     */
    {
        //优先满足采集
        // @ts-ignore
        let count = _.size(Memory.source) * size_for_source;
        let worker =
            _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
        if (worker.length < count) {
            let newName = 'harvester' + Game.time % 100;
            let target;
            for (let i in Memory.source) {
                if (Memory.source[i] < size_for_source) {
                    target = i;
                    break;
                }
            }

            // @ts-ignore
            let flag = Game.spawns['Spawn1'].spawnCreep(roles['harvester']['body'], newName,
                {memory: {role: 'harvester', source: target}});
            if (flag === OK) {
                Memory.source[target] += 1;
            }

            return;
        }
    }

    {
        // carrier 在运送的时候也应该绑定相关的CONTAINER
        // 但是初始的时候是没有container的所以也不需要carrier
        let count = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
            filter:
                (structure) => {
                    return (structure.structureType === STRUCTURE_CONTAINER);
                }
        }).length;
        let worker =
            _.filter(Game.creeps, (creep) => creep.memory.role === 'carrier');
        if (worker.length < count *1.5) {
            let newName = 'carrier' + Game.time % 100;

            // @ts-ignore
            Game.spawns['Spawn1'].spawnCreep(roles['carrier']['body'], newName,
                {memory: {role: 'carrier', Working: true}});
            return;
        }
    }

    {
        let worker =
            _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
        if (worker.length < roles['builder']['count']) {
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
        if (worker.length < roles['upgrader']['count']) {
            let newName = 'upgrader' + Game.time % 100;
            // @ts-ignore
            Game.spawns['Spawn1'].spawnCreep(roles['upgrader']['body'], newName,
                {memory: {role: 'upgrader', Working: true}});
            return;
        }
    }

    {
        let worker =
            _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer');
        if (worker.length < roles['repairer']['count']) {
            let newName = 'repairer' + Game.time % 100;
            // @ts-ignore
            Game.spawns['Spawn1'].spawnCreep(roles['repairer']['body'], newName,
                {memory: {role: 'repairer', Working: true}});
        }
    }
}

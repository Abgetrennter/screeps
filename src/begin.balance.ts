
let roles = {
    'harvester': {count: 6, body: [WORK, CARRY, MOVE, MOVE]},
    'upgrader': {count: 1, body: [WORK, CARRY, MOVE, MOVE]},
    'builder': {count: 1, body: [WORK, CARRY, CARRY, MOVE]},
    'repairer': {count: 0, body: [WORK, CARRY, MOVE, MOVE]},
    'carrier': {count: 0, body: [CARRY, MOVE, CARRY, MOVE]}
}; //配置文件

function radio_work_parts(room: Room, energy: number = 0): BodyPartConstant[] {
    let times: number;
    let parts: BodyPartConstant[] = [];
    if (energy) {
        times = Math.floor(energy / 300);
    } else {
        times = Math.floor(room.energyAvailable / 300);
    }
    if (times > 3) times = 3;
    for (let i = 0; i < times; i++) {
        parts.push(WORK);
        parts.push(WORK);
    }
    for (let i = 0; i < times; i++) {
        parts.push(CARRY);
    }
    for (let i = 0; i < times; i++) {
        parts.push(MOVE);
    }
    return parts;
}

function radio_carry_parts(room: Room, energy: number = 0): BodyPartConstant[] {
    let times: number;
    let parts: BodyPartConstant[] = [];
    if (energy) {
        times = Math.floor(energy / 100);
    } else {
        times = Math.floor(room.energyAvailable / 100);
    }
    if (times > 3) times = 3;
    for (let i = 0; i < times; i++) {
        parts.push(CARRY);
    }
    for (let i = 0; i < times; i++) {
        parts.push(MOVE);
    }
    return parts;
}

function gc(): void {
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

export let size_for_source = 2;

function new_harvester(parts: BodyPartConstant[],room:Room): boolean {

    let count = room.source.length * size_for_source;
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


        let flag = Game.spawns['Spawn1'].spawnCreep(parts, newName,
            {memory: {role: 'harvester', source: target}});
        if (flag === OK) {
            Memory.source[target] += 1;
            return true;
        }
    }
    return false;
}

function new_carrier(): boolean {
    let count = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
        filter:
            (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER);
            }
    }).length;
    let worker =
        _.filter(Game.creeps, (creep) => creep.memory.role === 'carrier');
    if (worker.length < count + 1) {
        let newName = 'carrier' + Game.time % 100;
        let parts = radio_carry_parts(Game.spawns['Spawn1'].room);

        Game.spawns['Spawn1'].spawnCreep(parts, newName,
            {memory: {role: 'carrier', Working: true}});
        return true;
    }
    return false;
}

function all_available_energy(room: Room): number {
    let ava = room.energyAvailable;
    /*
    let con=room.find<StructureContainer>(FIND_STRUCTURES, {filter: (s)=>(s.structureType===STRUCTURE_CONTAINER)});
    for (let i in con) {
        ava+=con[i].store.getUsedCapacity(RESOURCE_ENERGY);
    }

    let str=room.find<StructureStorage>(FIND_STRUCTURES, {filter: (s)=>(s.structureType===STRUCTURE_STORAGE)});
    for (let i in str) {
        ava+=str[i].store.getUsedCapacity(RESOURCE_ENERGY);
    }*/
    let all = room.mass_stores
    for (let i = 0; i < all.length; i++) {
        //console.log(all[i]);
        //@ts-ignore
        ava += all[i].store.getUsedCapacity(RESOURCE_ENERGY);
    }
    return ava;
}

export const config = function (room: Room) {
    if (Game.time % 57 != 0) {
        return;
    }

    //回收内存
    gc();

    if (all_available_energy(room) < 350) {
        roles['builder']['count'] = 0;
        roles['upgrader']['count'] = 0;
        size_for_source = 3;
    } else {
        roles['builder']['count'] = 3;
        roles['upgrader']['count'] = 2;
        size_for_source = 3 - room.container.length;
    }


    let parts = radio_work_parts(room);
    if (!parts) {
        return;
    }
    /* 考虑这样一种情况,如果是发展期,我们需要增加其数量.那么补全
     * 缺失的东西这种想法就不是很好用,所以需要和预定的数目比较
     * 这种想法.但是之后可能还要引入队列的想法,对生成的数目进行排序
     */

    if (new_harvester(parts,room)) return;

    if (new_carrier()) return;

    {
        let worker =
            _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
        if (worker.length < roles['builder']['count']) {
            let newName = 'builder' + Game.time % 100;
            // @ts-ignore
            Game.spawns['Spawn1'].spawnCreep(parts, newName,
                {memory: {role: 'builder', Working: true}});
            return;
        }
    }

    {
        let worker =
            _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
        if (worker.length < roles['upgrader']['count']) {
            let newName = 'upgrader' + Game.time % 100;
            // @ts-ignore
            Game.spawns['Spawn1'].spawnCreep(parts, newName,
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

import {condition} from'@/role/harvester'
/*function simple_new(role, room, count) {
    let worker =
        _.filter(Game.creeps, (creep) => creep.memory.role === role);
    if (worker.length < count) {
        let newName = role + Game.time % 100;

        room.spawn[0].spawnCreep([WORK,WORK,CARRY, CARRY,MOVE,MOVE, MOVE, MOVE], newName,
            {memory: {role: role}});
        return true;
    }
    return false;
}*/


function radio_work_parts(room: Room, n: number): BodyPartConstant[] {
    let times: number;
    let parts: BodyPartConstant[] = [];

    times = Math.floor(room.energyAvailable / 300);
    if (times > n) times = n;
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
            if (Memory.creeps[name].role === 'harvester') {
                let creepMemory:CreepMemory=Memory.creeps[name];
                let room=Game.rooms[creepMemory.room];
                room.source_count[creepMemory.source] -= 1;
                if (room.source_count[creepMemory.source] < 0) room.source_count[creepMemory.source] = 0;
            }
// console.log(targets[i].creep.name);
            delete Memory.creeps[name];
        }
    }
}


function new_harvester(parts: BodyPartConstant[], room: Room): boolean {

    let count = room.source.length * room.size_for_source;
    let worker = room.role_count('harvester');
    if (worker < count) {
        let newName = room.name+'harvester' + Game.time % 100;
        let flag = room.spawn[0].spawnCreep(parts, newName,
            {memory: {role: 'harvester', condition: condition.Init,room:room.name}});
        if (flag === OK) {
            return true;
        }
    }
    return false;
}

function new_carrier(room: Room): boolean {
    let count = room.find<StructureContainer>(FIND_STRUCTURES, {
        filter:
            (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER);
            }
    }).length;
    let worker = room.role_count('carrier');
    if (worker < count *2) {
        let newName = 'carrier' + Game.time % 100;
        let parts = radio_carry_parts(room);

        room.spawn[0].spawnCreep(parts, newName,
            {memory: {role: 'carrier', Working: true}});
        return true;
    }
    return false;
}

function new_builder(room: Room, parts: BodyPartConstant[]): boolean {
    let worker = room.role_count('builder');
    if (worker < 2) {
        let newName = 'builder' + Game.time % 100;
        room.spawn[0].spawnCreep(parts, newName,
            {memory: {role: 'builder', Working: true}});
        return true;
    }
    return false;
}

function new_upgrader(room: Room, parts: BodyPartConstant[]): boolean {
    let worker = room.role_count('upgrader');
    let count = 4;
    if (room.controller.level<4){
        count=4;
    }
    if (worker < count) {
        let newName = 'upgrader' + Game.time % 100;
        room.spawn[0].spawnCreep(parts, newName,
            {memory: {role: 'upgrader', Working: true}});
        return true;
    }
    return false;
}

function new_repairer(room: Room) {
    let worker = room.role_count('repairer');
    if (worker < 1) {
        let newName = 'repairer' + Game.time % 100;
        room.spawn[0].spawnCreep([WORK, WORK, CARRY, MOVE,MOVE,MOVE], newName,
            {memory: {role: 'repairer', Working: true}});
        return true;
    }
    return false;
}

export const config = function (room: Room) {
    if (room.spawn.length === 0) {
        return;
    }
    if (Game.time % 47 != 0) {
        return;
    }

    //回收内存
    gc();
    //let flag = false;
    // @ts-ignore
    let count = _.sum(Game.creeps, (creep) => (creep.room.name === room.name));
    if (room.energyAvailable < 300 && count < 5) {
        room.size_for_source = 1;
        //flag = true;
    } else {
        room.size_for_source = 3 - room.container.length;
    }


    let parts = radio_work_parts(room, 3);
    /* 考虑这样一种情况,如果是发展期,我们需要增加其数量.那么补全
     * 缺失的东西这种想法就不是很好用,所以需要和预定的数目比较
     * 这种想法.但是之后可能还要引入队列的想法,对生成的数目进行排序
     */
    if (new_harvester(radio_work_parts(room, 3), room)) return;


    if (new_carrier(room)) return;

    if (new_builder(room, parts)) return;

    if (new_upgrader(room, parts)) return;

    if (new_repairer(room)) return;
    /*if (room.controller.level > 3 && !flag) {
        if (simple_new('tester', room, 1)) return;
        if (simple_new('remotebuilder', room, 3)) return;
    }*/

}

enum condition {
    Source,
    Select,
    Build_Container,
    Repair_Container,
    Carry,
    Die,
    Init
}

function tower(creep: Creep): boolean {
    let targets = creep.room.tower.sort((a, b) => (a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]));
    if (targets.length === 0) return false;
    if (targets[0].store.getUsedCapacity(RESOURCE_ENERGY) > 500) return false;
    creep.memory.target = targets[0].id;
    return true;
}

function spAex(creep: Creep): boolean {
    let targets = creep.room.extension.concat(creep.room.spawn).sort((a, b) => a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY));
    if (targets[0].getFreeCapacity(RESOURCE_ENERGY) === 0) {
        return false;
    } else {
        creep.memory.target = targets[0].id;
        return true;
    }
}

function container(creep: Creep): boolean {
    let target = creep.pos.findInRange(FIND_STRUCTURES, 8, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (!target || target.length == 0) return false;
    creep.memory.target = target[0].id;
    return true;
}

function get_target(creep) {
    let flag1 = tower(creep);
    let flag2;
    let flag3;
    let count = _.filter(Game.creeps, (creep) => creep.memory.role === 'carrier').length;
    //if (target === null&&count==0) {
    if (flag1 && count === 0) {
        flag2 = spAex(creep);
    } else {
        flag3 = container(creep);
    }
    if (!(flag1 || flag2 || flag3)) {
        //console.log(creep.room.storage)
        if (creep.room.storage) {
            creep.memory.target = creep.room.storage.id;
        }
    }
    return;
}

function do_carry(creep:Creep){
    if (!creep.memory.target||Game.time%10==0){
        get_target(creep);
    }
    let target=Game.getObjectById(creep.memory.target as Id<AnyStoreStructure>);
    let flag = creep.transfer(target, RESOURCE_ENERGY);
    if (flag === ERR_NOT_IN_RANGE) {
        creep.room.visual.circle(target.pos, {fill: 'transparent', radius: 0.55, stroke: 'red'});
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});}
    else {
        creep.memory.condition=condition.Source;
        creep.memory.target=null;
    }
}

function do_init(creep:Creep) {
    if (!creep.memory.source) {
        for (let i in creep.room.source_count) {
            if (creep.room.source_count[i] < creep.room.size_for_source) {
                creep.room.source_count[i] += 1;
                creep.memory.source = i;
                break;
            }
        }
        if (!creep.memory.source) {
            creep.memory.source = creep.room.source[0];
        }
    }
}

function do_source(creep: Creep) {
    const source = Game.getObjectById(creep.memory.source as Id<Source>);
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.room.visual.circle(source.pos, {fill: 'transparent', radius: 0.55, stroke: 'blue'});
        creep.moveTo(source,
            {visualizePathStyle: {stroke: '#ffaa00'}});
    }
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        creep.memory.condition = condition.Select;
        select(creep);
    }
}

function put_container(px: number, py: number, name: string): boolean {
    let flag = false;
    for (let x = px - 1; x < px + 1; x++) {
        for (let y = py - 1; y < py + 1; y++) {
            const n = new RoomPosition(x, y, name);
            let num = n.look().length;
            if (num == 0 && n.createConstructionSite(STRUCTURE_CONTAINER) === OK) {
                flag = true;
                break;
            }
        }
        if (flag == true) break;
    }
    return flag;
}

function select(creep: Creep): void {
    let sou = Game.getObjectById(creep.memory.source as Id<Source>);
    let con = sou.pos.findInRange<StructureContainer>(FIND_STRUCTURES,
        2, {filter: (s) => (s.structureType === STRUCTURE_CONTAINER)});
    if (con.length == 0) {
        let cons = sou.pos.findInRange(FIND_CONSTRUCTION_SITES, 2,
            {filter: (s) => (s.structureType == STRUCTURE_CONTAINER)});
        if (cons.length == 0) {
            if (put_container(sou.pos.x - 1, sou.pos.y - 1, creep.room.name)) {
                creep.memory.condition = condition.Build_Container;
            } else {
                creep.memory.condition = condition.Carry;
            }
        } else {
            creep.memory.target = cons[0].id;
            creep.memory.condition = condition.Build_Container;
        }
    } else {
        if (con[0].hits < 100000) {
            creep.memory.target = con[0].id;
            creep.memory.condition = condition.Repair_Container;
        } else {
            creep.memory.condition = condition.Carry;
        }
    }
}

function build_container(creep: Creep) {
    if (!creep.memory.target) {
        let cons = Game.getObjectById(creep.memory.source as Id<Source>).pos.findInRange(
            FIND_CONSTRUCTION_SITES, 2, {
                filter: (s) =>
                    (s.structureType == STRUCTURE_CONTAINER)
            });
        if (cons.length == 0) {
            creep.memory.condition = condition.Select;
            return;
        } else {
            creep.memory.target = cons[0].id;
        }
    }
    const target = Game.getObjectById(creep.memory.target as Id<ConstructionSite>);
    creep.build(target);
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.target=null;
        creep.memory.condition=condition.Source;
    }
}

function repair_container(creep:Creep) {
    if (!creep.memory.target) {
        let cons = Game.getObjectById(creep.memory.source as Id<Source>).pos.findInRange(
            FIND_STRUCTURES, 2, {
                filter: (s) =>
                    (s.structureType == STRUCTURE_CONTAINER)
            });
        if (cons.length == 0) {
            creep.memory.condition = condition.Select;
            return;
        } else {
            creep.memory.target = cons[0].id;
        }
    }
    const target = Game.getObjectById(creep.memory.target as Id<StructureContainer>);
    creep.repair(target);
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.target=null;
        creep.memory.condition=condition.Source;
    }
}

export const harvester = function (creep: Creep) {
    /*
     *假定harvest有属性target 为列表,包含 source 和 target 两个变量
     *这样就不用每次去找了
     *刚开始还得是送货上门
     *但是说可以把绑定的进行更换.
    **/

    switch (creep.memory.condition) {
        case condition.Source: {
            do_source(creep);
            break;
        }
        case condition.Select: {
            select(creep);
            break;
        }
        case condition.Carry: {
            do_carry(creep);
            break;
        }
        case condition.Build_Container: {
            build_container(creep);
            break;
        }
        case condition.Repair_Container: {
            repair_container(creep);
            break;
        }
        case condition.Die: {
            creep.goDie();
            break;
        }
        case condition.Init:
        default: {
            do_init(creep);
        }
    }
};
export enum condition {
    Source,
    Select,
    Build_Container,
    Repair_Container,
    Carry,
    Die,
    Init
}

/*
function tower(creep: Creep): boolean {
    let targets = creep.room.tower.sort((a, b) => (a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]));
    if (targets.length === 0) return false;
    if (targets[0].store.getUsedCapacity(RESOURCE_ENERGY) > 500) return false;
    creep.memory.target = targets[0].id;
    return true;
}
*/
function spAex(creep: Creep): boolean {
    let target = creep.pos.findClosestByRange<AnyStoreStructure>(FIND_STRUCTURES, {
        filter: (s) => (s.structureType == STRUCTURE_EXTENSION
            && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
    });
    if (!target) {
        let targets = creep.room.find<AnyStoreStructure>(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_SPAWN
                && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
        })
        if (targets.length > 0) {
            target = targets[0];
        }
    }

    if (!target) {
        return false;
    } else {
        creep.memory.target = target.id;
        return true;
    }
}

function container(creep: Creep): boolean {
    let target = creep.pos.findInRange(FIND_STRUCTURES, 4, {
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
    if (container(creep)) {
        return;
    }
    if (spAex(creep)) {
        return;
    }
    let i = creep.pos.findInRange(FIND_STRUCTURES, 4, {filter: (s) => (s.structureType == STRUCTURE_LINK)});
    if (!i) {
        return;
    } else {
        creep.memory.target = i.id;
    }

}

function do_carry(creep: Creep) {
    get_target(creep);
    let target = Game.getObjectById(creep.memory.target as Id<AnyStoreStructure>);
    let flag = creep.transfer(target, RESOURCE_ENERGY);
    if (flag === ERR_NOT_IN_RANGE) {
        creep.room.visual.circle(target.pos, {fill: 'transparent', radius: 0.55, stroke: 'red'});
        creep.goTo(target);
    } else {
        if (flag == ERR_FULL && target.structureType == STRUCTURE_LINK) {
            let i = creep.room.spawn[0].pos.findClosestByRange<StructureLink>
            (FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_LINK)});
            target.transferEnergy(i);
        }
        creep.memory.condition = condition.Source;
        creep.memory.target = null;
    }
}

function do_init(creep: Creep) {
    if (!creep.memory.source) {
        for (let i in creep.room.source_count) {
            if (creep.room.source_count[i] < creep.room.size_for_source) {
                creep.room.source_count[i] += 1;
                creep.memory.source = i;
                break;
            }
        }
        if (!creep.memory.source) {
            creep.memory.source = creep.room.source[0].id;
            creep.room.source_count[creep.memory.source] += 1;
        }
    } else {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.condition = condition.Select;
        } else {
            creep.memory.condition = condition.Source;
        }
    }
}

function do_source(creep: Creep) {
    const source = Game.getObjectById(creep.memory.source as Id<Source>);
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.room.visual.circle(source.pos, {fill: 'transparent', radius: 0.55, stroke: 'blue'});
        let i = source.pos.findClosestByRange<StructureContainer>(FIND_STRUCTURES,
            {filter: (s) => (s.structureType == STRUCTURE_CONTAINER)})
        creep.goTo(i, 0);
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
    let flag = creep.build(target);
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0 || flag == ERR_INVALID_TARGET) {
        creep.memory.target = null;
        creep.memory.condition = condition.Source;
    }
}

function repair_container(creep: Creep) {
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
    if (creep.repair(target) === ERR_NOT_IN_RANGE) {
        creep.goTo(target, 0);
    }
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.target = null;
        creep.memory.condition = condition.Source;
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
    if (creep.goDie()) creep.memory.condition = condition.Die;
};
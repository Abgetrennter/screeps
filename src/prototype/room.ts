import {state} from '@/role/carrier'

Room.prototype.role_count = function (role) {
    // @ts-ignore
    return _.sum(Game.creeps, (creep) =>
        (creep.memory.role === role && creep.room.name === this.name));
}

Room.prototype.init_source = function () {
    let sc = {};
    for (let name in this.source) {
        let source: Source = this.source[name];
        let link: Id<StructureLink>;
        let container: Id<StructureContainer>;
        let lc = source.pos.findInRange<StructureLink>(FIND_STRUCTURES, 3,
            {filter: (s) => (s.structureType === STRUCTURE_LINK)});
        let cc = source.pos.findInRange<StructureContainer>(FIND_STRUCTURES, 3,
            {filter: (s) => (s.structureType === STRUCTURE_CONTAINER)});
        if (lc.length > 0) {
            link = lc[0].id;
        } else {
            link = null;
        }
        if (cc.length > 0) {
            container = cc[0].id;
        } else {
            container = null;
        }
        sc[source.id] = {'count': 0, 'link': link, 'container': container};
    }
    let workers = _.filter(Game.creeps, (creep) =>
        (creep.memory.role === 'harvester' && creep.room.name === this.name));
    for (let i in workers) {
        let source = workers[i].memory.source;
        if (!source || !(source in sc)) {
            continue;
        }
        sc[source]['count'] += 1;
    }
    return sc;
}


Object.defineProperty(Room.prototype, 'my_source', {
        get: function () {
            if (!this._sc) {
                if (!this.memory.sc) {
                    this.memory.sc = this.init_source();
                }
                this._sc = this.memory.sc;
            }
            return this._sc;
        },
        enumerable: false,
        configurable: true,
    }
)


Object.defineProperty(Room.prototype, 'size_for_source', {
    get: function () {
        if (!this._ss) {
            if (!this.memory.ss) {
                this.memory.ss = 1;
            }
            this._ss = this.memory.ss;
        }
        return this._ss;
    },
    set: function (value) {
        this._ss = value;
        this.memory.ss = value;
    },
    enumerable: false,
    configurable: true,
});
Object.defineProperty(Room.prototype, 'carrier_source', {
    get: function () {
        if (!this._cc) {
            let cc = {}
            let work = _.filter(Game.creeps, (creep) =>
                (creep.memory.role === 'carrier' &&
                    creep.room.name === this.name &&
                    creep.memory.condition === state.Trans));
            for (let i in work) {
                if (work[i].memory.condition === state.Trans) {
                    let cm = work[i].memory;
                    if (cm && cm.source in cc) {
                        cc[cm.source] += 1;
                    }
                }
            }
            this._cc = cc;
        }
        return this._cc;
    },
    enumerable: false,
    configurable: true
});
Room.prototype.get_container = function () {
    for (let i in this.carrier_source) {
        if (this.carrier_source[i] < 2) {
            this.carrier_source[i] += 1;
            return i;
        }
    }
}

/*function count_creep(name) {
    let roles={};
    //创建一个角色数的集合
    for (const creep in Game.creeps) {
        if (Game.creeps[creep].room.name === name ){
            const role=Game.creeps[creep].memory.role;
            if (role in roles){
                roles[role]+=1;
            }else{
                roles[role]=1;
            }
        }
    }
    return roles;
}
*/

/*

*/
/*
Object.defineProperty(Room.prototype, 'get_container', {
    get: function () {
        if (!this.ava) {
            if (!this.memory.ava) {
                let ava = this.energyAvailable;

                let con = this.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_CONTAINER)});
                for (let i in con) {
                    ava += con[i].store.getUsedCapacity(RESOURCE_ENERGY);
                }

                let str = this.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_STORAGE)});
                for (let i in str) {
                    ava += str[i].store.getUsedCapacity(RESOURCE_ENERGY);
                }
                this.memory.ava = ava;
            }
            this.ava = this.memory.ava;
        }
        return this.ava;
    },
    set: function (delta) {
        this.ava += delta;
        this.memory.ava = this.ava;
    },
    enumerable: false,
    configurable: true
});*/
import {state} from '@/role/carrier'

Room.prototype.role_count = function (role) {
    // @ts-ignore
    return _.sum(Game.creeps, (creep) =>
        (creep.memory.role === role && creep.room.name === this.name));
}

Object.defineProperty(Room.prototype, 'source_count', {
    get: function () {
        if (!this._sc) {
            if (!this.memory.sc){
                let sc = {};
                for (let name in this.source) {
                    sc[this.source[name].id] = 0;
                }
                let workers = _.filter(Game.creeps, (creep) =>
                    (creep.memory.role === 'harvester' && creep.room.name === this.name));
                for (let i in workers) {
                    let source = workers[i].memory.source;
                    if (!source|| !(source in sc)) {
                        continue;
                    }
                    sc[source] += 1;
                }
                this.memory.sc = sc;
            }
            this._sc = this.memory.sc;
        }
        return this._sc;
    },
    enumerable: false,
    configurable: true,
});

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
            if (!this.memory.cc) {
                let cc = {}
                for (let i in this.mass_stores) {
                    cc[this.mass_stores[i].id] = 0;
                }
                let work = _.filter(Game.creeps, (creep) =>
                    (creep.memory.role === 'harvester' &&
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
                this.memory.cc = cc
            }
            this._cc = this.memory.cc;
        }
        return this._cc;
    },
    enumerable: false,
    configurable: true
});
Room.prototype.get_container = function () {
    for (let i in this.carrier_source) {
        if (this.carrier_source[i]<2){
            this.carrier_source[i]+=1;
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
Room.prototype.role_count = function (role) {
    return _.sum(Game.creeps, (creep) =>
        (creep.memory.role === role && creep.room.name === this.name));
}

Object.defineProperty(Room.prototype, 'source_count', {
    get: function () {
        if (!this._sc) {
            let sc = {};
            for (let name in this.source) {
                sc[this.source[name].id] = 0;
            }
            let workers = _.filter(Game.creeps, (creep) =>
                (creep.memory.role === 'harvester' && creep.room.name === this.name));
            for (let i in workers) {
                let creep = workers[i];
                if (!creep.memory.source || !(creep.memory.source in sc)) {
                    continue;
                }
                sc[creep.memory.source] += 1;
            }
            if (!this.memory.sc) {
                this.memory.sc = sc;
            } else {
                delete this.memory.sc;
                this.memory.sc = sc;
            }
            this._sc = sc;
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



Object.defineProperty(Room.prototype,'roles',{
    get:function (){
        if (!this._roles){
            if (!this.memory.roles){
                this.memory.roles=count_creep(this.name);
            }
            this._roles=this.memory.roles;
        }
        return this._roles;
    },
    enumerable: false,
    configurable: true
})
*/

/*Object.defineProperty(Room.prototype, 'AvailableEnergy', {
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
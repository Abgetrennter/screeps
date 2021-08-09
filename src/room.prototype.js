function count_creep(name) {
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
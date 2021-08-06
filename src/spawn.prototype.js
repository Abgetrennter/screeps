Object.defineProperty(Room.prototype, 'AvailableEnergy', {
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
});
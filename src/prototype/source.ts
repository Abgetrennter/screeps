
Object.defineProperty(StructureContainer.prototype, 'memory', {
    configurable: true,
    get: function() {
        if(_.isUndefined(Memory.ContainerMemory)) {
            Memory.ContainerMemory = {};
        }
        if(!_.isObject(Memory.ContainerMemory)) {
            return undefined;
        }
        return Memory.ContainerMemory[this.id] =
            Memory.ContainerMemory[this.id] || {};
    },
    set: function(value) {
        if(_.isUndefined(Memory.ContainerMemory)) {
            Memory.ContainerMemory = {};
        }
        if(!_.isObject(Memory.ContainerMemory)) {
            throw new Error('Could not set Source memory');
        }
        Memory.ContainerMemory[this.id] = value;
    }
});

Object.defineProperty(StructureContainer.prototype, 'source', {
    configurable: true,
    get: function() {
        if (_.isUndefined(this._source)){
            if(_.isUndefined(this.memory.source)) {
                this.memory.source=this.pos.inRangeTo(this.room.storage.pos,4);
            }
            this._isin=this.memory.source
        }
        return this._source;
    },
    set: function(value) {
        this._isin=value;
        this.memory.source = value;
    }
});
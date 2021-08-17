/*Object.defineProperty(StructureLink.prototype, 'isin', {
    get: function () {
        if (!this._in) {

            this._in = (this.pos.findInRange(FIND_Structure_LINKS,4));
        }
        return this._Full;
    },
    enumerable: false,
    configurable: true
});*/

Object.defineProperty(StructureLink.prototype, 'memory', {
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
            throw new Error('Could not set STRUCTURE_LINK memory');
        }
        Memory.ContainerMemory[this.id] = value;
    }
});

Object.defineProperty(StructureLink.prototype, 'isin', {
    configurable: true,
    get: function() {
        if (_.isUndefined(this._isin)){
            if(_.isUndefined(this.memory._isin)) {
                this.memory.isin=this.pos.inRangeTo(this.room.storage.pos,4);
            }
            this._isin=this.memory._isin
        }
        return this._isin;
    },
    set: function(value:boolean) {
        this._isin=value;
        this.memory._isin = value;
    }
});
Creep.prototype.goDie = function () {
    if (this.ticksToLive < 20 && this.ticksToLive > 10) {
        this.moveTo(this.room.spawn[0]);
        return true;
    } else if (this.ticksToLive === 10) {
        this.drop(RESOURCE_ENERGY);

    } else if (this.ticksToLive < 10) {
        this.say("A~W~S~L");
        return true;
    } else if (this.ticksToLive === 1) {
        if (this.memory.role === 'harvester') {
            this.room.source_count[this.memory.source] -= 1;
            if (this.room.source_count[this.memory.source] < 0) this.room.source_count[this.memory.source] = 0;
        }
        delete Memory.creeps[this.name];
    } else {
        return false;
    }
}


Object.defineProperty(Creep.prototype, 'Source', {
    get: function () {
        // 如果 room 对象内部没有保存该值
        if (!this._source) {
            // 如果房间内存中没有保存该值
            if (!this.memory.source) {
                // 查找 source 并将它们的 id 保存到内存里，
                // **不要** 保存整个 source 对象
                this.say('no source');
                return null;
            }
            // 从内存中获取它们的 id 并找到对应的 source 对象，然后保存在 room 对象内部
            this._source = this.memory.source;
        }
        // 返回内部保存的 source 对象
        return Game.getObjectById(this._source);
    },
    set: function (newValue) {
        // 当数据保存在内存中时，你会希望在修改 room 上的 source 时
        // 也会自动修改内存中保存的 id 数据
        this.memory.source = newValue;
        this._source = newValue;
    },
    enumerable: false,
    configurable: true
});
Object.defineProperty(Creep.prototype, 'Target', {
    get: function () {
        // 如果 room 对象内部没有保存该值
        if (!this._target) {
            // 如果房间内存中没有保存该值
            if (!this.memory.target) {
                // 查找 source 并将它们的 id 保存到内存里，
                // **不要** 保存整个 source 对象
                this.say('no target');
                return null;
            }
            // 从内存中获取它们的 id 并找到对应的 source 对象，然后保存在 room 对象内部
            this._target = this.memory.target;
        }
        // 返回内部保存的 source 对象
        return Game.getObjectById(this._target);
    },
    set: function (newValue) {
        // 当数据保存在内存中时，你会希望在修改 room 上的 source 时
        // 也会自动修改内存中保存的 id 数据
        this.memory.source = newValue;
        this._target = newValue;
    },
    enumerable: false,
    configurable: true
});
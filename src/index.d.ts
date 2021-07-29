interface CreepMemory {
    /**
     * 该 creep 的角色
     */
    role: string,
    source?:Id<Source>,
    target?:Id<object>,
    Working?:boolean,
}
interface Memory {
    /**
     * 储存的东西
     */
    container:object,
    source:object,
}
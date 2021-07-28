interface CreepMemory {
    /**
     * 该 creep 的角色
     */
    role: string,
    source:Id<Source>,
    container:Id<StructureContainer>,
    Working:boolean,
}
interface Memory {
    /**
     * 储存的东西
     */
    container:object,
    source:object,
}
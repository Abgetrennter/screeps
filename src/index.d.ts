interface CreepMemory {
    /**
     * 该 creep 的角色
     */
    role: string,
    source?:string,
    target?:string,
    Working?:boolean,
    condition:number,
}
interface Memory {
    /**
     * 储存的东西
     */
    container?:My_memory_structure,
    source:My_memory_structure,
}
interface My_memory_structure {
    [key: string]: number,
}

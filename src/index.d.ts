interface CreepMemory {
    /**
     * 该 creep 的角色
     */
    role: string,
    source?: string,
    target?: string,
    Working?: boolean,
    condition?: number,
    room?:string,
}

interface Memory {
    /**
     * 储存的东西
     */
    container?: object,
    source: object,
    error_times:number,
}

/*
interface My_memory_structure {
    [key: string]: number,
}
*/




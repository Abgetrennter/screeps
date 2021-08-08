interface CreepMemory {
    /**
     * 该 creep 的角色
     */
    role: string,
    source?:string,
    target?:string,
    Working?:boolean,
    condition?:number,
}
interface RoomMemory {
    ava:number,
}

interface Memory {
    /**
     * 储存的东西
     */
    container?:object,
    source:object,
}
/*
interface My_memory_structure {
    [key: string]: number,
}
*/
interface Creep{
    goDie():boolean,
    Source:Id<any>,
}
interface StructureSpawn{
    AvailableEnergy():void,
}
interface Room{
    [key:string]:any,
}
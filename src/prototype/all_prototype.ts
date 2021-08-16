interface Creep {
    Source: Id<any>,
    goDie(): boolean,
}
 interface Creep{
       //获取、设置本 tick 内 creep 是否允许被对穿 (true 就不对穿)
     posLock: boolean,
       /*将 creep 移动到目标，使用精确寻路 (推荐本房间内移动时使用)
        *   @param target 要去的目标
        *   @param range 到达目标的范围
        *   @returns 是否已经在目标范围内*/
         goTo(target: RoomPosition | { pos: RoomPosition }, range?: number): boolean,
       /*将 creep 移动到房间，使用模糊寻路 (推荐跨房间移动使用)
        *  @param room 要去的房间
        *   @returns 是否在目标房间内
        */
        goToRoom(room: string): boolean;
 }

interface RoomMemory{
    roles:object,
}

interface StructureSpawn {
    AvailableEnergy(): void,
}

interface Room {
    role_count(key:string):number,
    source:Source[],
    container:StructureContainer[],
    mass_stores:AnyStoreStructure[],
    source_count:object,
    [key: string]: any,
}

interface StructureLink {
    full:boolean;
}
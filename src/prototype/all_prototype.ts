interface Creep {
    Source: Id<any>,

    goDie(): boolean,
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
/*
interface StructureLink {
    full:boolean;
}*/
export const linker = function (creep:Creep) {
  if (!creep.memory.source){
    let i =creep.room.storage.pos.findInRange(FIND_STRUCTURES,3,
        {filter:(s)=>(s.structureType===STRUCTURE_LINK)});
    if (i.length>0){
      creep.memory.source=i[0].id;
    }else{
      return;
    }
  }
  if (creep.store[RESOURCE_ENERGY]==0){
    let link=Game.getObjectById(creep.memory.source as Id<StructureLink>);
    if (link.store[RESOURCE_ENERGY]>0){
      let flag=creep.withdraw(link,RESOURCE_ENERGY);
      if (flag==ERR_NOT_IN_RANGE){
        creep.goTo(link);
      }
    }
  }else{
    let target;
    if (creep.room.spawn[0].store.getFreeCapacity(RESOURCE_ENERGY)>0){
      target=creep.room.spawn[0]
    }else{
      target=creep.room.storage;
    }
    let flag=creep.transfer(target,RESOURCE_ENERGY);
    if (flag==ERR_NOT_IN_RANGE){
      creep.goTo(target);
    }
  }
}
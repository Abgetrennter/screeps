export const destroyer=function (creep:Creep) {
    let target=Game.getObjectById(creep.memory.target as Id<AnyStructure>);
    if (creep.dismantle(target) === ERR_NOT_IN_RANGE){
        creep.moveTo(target);
        creep.room.visual.circle(target.pos,{fill: 'transparent', radius: 0.8, stroke: 'red'});
    }else{
        creep.drop(RESOURCE_ENERGY);
    }
    //creep.move(LEFT);
}
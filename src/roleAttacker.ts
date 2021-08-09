export const roleAttacker=function (creep:Creep) {
    let target=Game.getObjectById(creep.memory.target as Id<AnyStructure>);
    if (creep.attack(target) === ERR_NOT_IN_RANGE){
        creep.moveTo(target);
        creep.room.visual.circle(target.pos,{fill: 'transparent', radius: 0.8, stroke: 'red'});
    }
    //creep.move(LEFT);
}
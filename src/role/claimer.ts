export const claimer = function (creep: Creep) {
    /*if ((creep.pos.x!==38||creep.pos.y!=49)&&creep.room.name=='E22S59'){
      creep.goTo(38,49);
      return;
    }
    else if (creep.room.name=='E22S59'){
      creep.move(BOTTOM);
    }else if(creep.room.name=='E22S60' &&(creep.pos.x!=0||creep.pos.y!=19)){
      creep.goTo(0,19);
    }else if (creep.room.name=='E22S60'){
      creep.move(LEFT);
    }else if (creep.room.name=='E21S60'){
      if (creep.pos.x!=26||creep.pos.y!=0){
        creep.goTo(26,0);
      }else{
        creep.move(TOP);
      }
    }else if (creep.room.name=='E21S59'){
      let target=Game.rooms['E21S59'].controller;
      //console.log(target);
      let flag=creep.claimController(target);
      if (flag===ERR_NOT_IN_RANGE){
        creep.goTo(target);
      }
    }*/
    if (creep.room.name == 'W8N3') {
        if (!creep.pos.isEqualTo(22, 49)) {
            let i=new RoomPosition(22,49,'W8N3');
            creep.goTo(i);
        } else {
            creep.move(BOTTOM);
        }
    } else {
        if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.goTo(creep.room.controller);
        }
    }
    /*
   // @ts-ignore
   creep.say(flag);*/
}
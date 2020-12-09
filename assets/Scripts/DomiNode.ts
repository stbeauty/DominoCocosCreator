// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Domino from "./Domino";
import Tools from "./Tools";

const {ccclass, property} = cc._decorator;

export default class DomiNode {

    Position: cc.Vec3 = cc.Vec3.ZERO;
    TOP:boolean = true;
    BOT:boolean = true;
    LEFT:boolean = true;
    RIGHT:boolean = true;
    ID:string = "";

    isRoot : boolean = false;

    neighbors:DomiNode[] = [];

    CheckMatch(domi:Domino) : boolean{
        var pos = Tools.WorldPos(domi.node);
        if ((domi.ID[0] == this.ID || domi.ID[1] == this.ID) && cc.Vec3.distance(this.Position, pos) < 150)
            if (this.TOP || this.BOT || this.LEFT || this.RIGHT){
                if (this.RIGHT && pos.x >= this.Position.x -35)
                    return true;
                    if (this.LEFT && pos.x < this.Position.x +35)
                    return true;
            }
        return false;
    }

    Disable(){
        this.TOP = false;
        this.BOT = false;
        this.LEFT = false;
        this.RIGHT = false;
    }

    MakeFriends(node: DomiNode){
        this.neighbors.push(node);
        node.neighbors.push(this);
    }
}

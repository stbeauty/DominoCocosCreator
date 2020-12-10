// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Direction } from "./Direction";
import Domino from "./Domino";
import DominoDesk from "./DominoDesk";
import Tools from "./Tools";

const {ccclass, property} = cc._decorator;

export default class DomiNode {

    Position: cc.Vec3 = cc.Vec3.ZERO;
    TOP:boolean = true;
    BOT:boolean = true;
    LEFT:boolean = true;
    RIGHT:boolean = true;
    ID:string = "";
    RootDirection:Direction = Direction.LEFT;
    Desk: DominoDesk = null;

    isRoot : boolean = false;
    isDouble :boolean = false;
    isActive : boolean = true;

    neighbors:DomiNode[] = [];

    CheckMatch(domi:Domino) : boolean{
        var pos = Tools.WorldPos(domi.node);
        if ((domi.ID[0] == this.ID || domi.ID[1] == this.ID) && cc.Vec3.distance(this.Position, pos) < 150)
            if (this.TOP || this.BOT || this.LEFT || this.RIGHT){
                return true;
            }
        return false;
    }

    Disable(){
        if (this.isRoot == false){
        this.TOP = false;
        this.BOT = false;
        this.LEFT = false;
        this.RIGHT = false;
        this.isActive = false;
        } else {
            this.neighbors.forEach(node => {
                switch (node.RootDirection){
                    case Direction.TOP:
                        this.BOT = false;
                        break;
                        case Direction.BOT:
                        this.TOP = false;
                        break;
                        case Direction.RIGHT:
                        this.LEFT = false;
                        break;
                        case Direction.LEFT:
                        this.RIGHT = false;
                        break;
                }
            })
        }
    }

    MakeFriends(node: DomiNode){
        this.neighbors.push(node);
        node.neighbors.push(this);
    }
}

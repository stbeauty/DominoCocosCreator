// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AlignmentInfo from "./AlignmentInfo";
import { Direction } from "./Direction";
import Domino from "./Domino";
import DominoDesk from "./DominoDesk";
import Tools from "./Tools";

const {ccclass, property} = cc._decorator;


export default class DomiNode extends cc.Node {

    //Position: cc.Vec3 = cc.Vec3.ZERO;

    ID:string = "";
    RootDirection:Direction = Direction.LEFT;
    Desk: DominoDesk = null;

    isActive : boolean = true;

    alignNode:AlignmentInfo[] = [];

    static TOP(noside:boolean, tagID:boolean = false) : DomiNode{
        var domi = new DomiNode;
        domi.RootDirection = Direction.BOT;

        domi.alignNode.push(new AlignmentInfo(true, Direction.TOP, domi,tagID));
        domi.alignNode.push(new AlignmentInfo(false, Direction.TOP, domi,tagID).convertForDouble());
        if (noside == false){
        domi.alignNode.push(new AlignmentInfo(false, Direction.LEFT, domi,tagID));
        domi.alignNode.push(new AlignmentInfo(false, Direction.LEFT_TOP, domi,tagID));
        
        domi.alignNode.push(new AlignmentInfo(false, Direction.TOP_RIGHT, domi,tagID));
        domi.alignNode.push(new AlignmentInfo(false, Direction.RIGHT, domi,tagID));
        }

        return domi;
    }
    static BOT(noside:boolean,tagID:boolean = false) : DomiNode{
        var domi = new DomiNode;
        domi.RootDirection = Direction.TOP;
        domi.alignNode.push(new AlignmentInfo(true, Direction.BOT, domi,tagID));
        domi.alignNode.push(new AlignmentInfo(false, Direction.BOT, domi,tagID).convertForDouble());

        if (noside == false){
        domi.alignNode.push(new AlignmentInfo(false, Direction.RIGHT, domi,tagID));
        domi.alignNode.push(new AlignmentInfo(false, Direction.RIGHT_BOT, domi,tagID));
        
        domi.alignNode.push(new AlignmentInfo(false, Direction.BOT_LEFT, domi,tagID));

        domi.alignNode.push(new AlignmentInfo(false, Direction.LEFT, domi,tagID));
        }

        return domi;
    }
    static LEFT(noside:boolean,tagID:boolean = false) : DomiNode{
        var domi = new DomiNode;
        domi.RootDirection = Direction.RIGHT;

        domi.alignNode.push(new AlignmentInfo(false, Direction.LEFT, domi,tagID));
        domi.alignNode.push(new AlignmentInfo(true, Direction.LEFT, domi,tagID).convertForDouble());

        if (noside == false){
        domi.alignNode.push(new AlignmentInfo(true, Direction.BOT, domi,tagID));
        domi.alignNode.push(new AlignmentInfo(true, Direction.BOT_LEFT, domi,tagID));
        
        domi.alignNode.push(new AlignmentInfo(true, Direction.LEFT_TOP, domi,tagID));

        domi.alignNode.push(new AlignmentInfo(true, Direction.TOP, domi,tagID));
        }
        return domi;
    }
    static RIGHT(noside:boolean,tagID:boolean = false) : DomiNode{
        var domi = new DomiNode;
        domi.RootDirection = Direction.LEFT;

        domi.alignNode.push(new AlignmentInfo(false, Direction.RIGHT, domi,tagID));
        domi.alignNode.push(new AlignmentInfo(true, Direction.RIGHT, domi,tagID).convertForDouble());

        if (noside == false){
        domi.alignNode.push(new AlignmentInfo(true, Direction.TOP, domi,tagID));
        domi.alignNode.push(new AlignmentInfo(true, Direction.TOP_RIGHT, domi,tagID));
        
        domi.alignNode.push(new AlignmentInfo(true, Direction.RIGHT_BOT, domi,tagID));

        domi.alignNode.push(new AlignmentInfo(true, Direction.BOT, domi,tagID));
        }
        return domi;
    }
    static CENTER_LANSCAPE(tagID:boolean = false) : DomiNode{
        var domi = new DomiNode;
        domi.RootDirection = Direction.CENTER;
        domi.alignNode.push(new AlignmentInfo(true, Direction.TOP, domi,tagID));
        domi.alignNode.push(new AlignmentInfo(true, Direction.BOT, domi,tagID));
        return domi;
    }

    rotate(angle:number){
        if (angle == 90){
            switch (this.RootDirection){
                case Direction.TOP:
                    this.RootDirection = Direction.RIGHT;
                    break;
                    case Direction.RIGHT:
                        this.RootDirection = Direction.BOT;
                    break;
                    case Direction.BOT:
                        this.RootDirection = Direction.LEFT;
                    break;
                    case Direction.LEFT:
                        this.RootDirection = Direction.TOP;
                    break;
            }

        } else if (angle == -90){
            switch (this.RootDirection){
                case Direction.TOP:
                    this.RootDirection = Direction.LEFT;
                    break;
                    case Direction.RIGHT:
                        this.RootDirection = Direction.TOP;
                    break;
                    case Direction.BOT:
                        this.RootDirection = Direction.RIGHT;
                    break;
                    case Direction.LEFT:
                        this.RootDirection = Direction.BOT;
                    break;
            }
        } else if (Math.abs(angle) == 180){
            switch (this.RootDirection){
                case Direction.TOP:
                    this.RootDirection = Direction.BOT;
                    break;
                    case Direction.RIGHT:
                        this.RootDirection = Direction.LEFT;
                    break;
                    case Direction.BOT:
                        this.RootDirection = Direction.TOP;
                    break;
                    case Direction.LEFT:
                        this.RootDirection = Direction.RIGHT;
                    break;
            }
        }

        this.alignNode.forEach( align => align.rotate(angle));

    }

}

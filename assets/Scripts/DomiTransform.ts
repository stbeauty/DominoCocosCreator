// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Domino from "./Domino";
import DomiNode from "./DomiNode";
import Tools from "./Tools";
import { Direction } from "./Direction";

const { ccclass, property } = cc._decorator;

export default class DomiTransform {
    RootNode: DomiNode = null;
    Position: cc.Vec3 = cc.Vec3.ZERO;
    Angle: number = 0;
    Direction: Direction = null;
    Valid: boolean = false;
    ID: string = "";


    constructor(domi: Domino, node: DomiNode) {
        this.Build(domi, node);
    }

    isPortrait(): boolean {
        if (Math.abs(this.Angle) == 90)
            return true;
        return false;
    }

    GenerateNode(): DomiNode {
        var node = this.RootNode;
        var newnode = new DomiNode;
        if (this.ID[0] == this.RootNode.ID)
            newnode.ID = this.ID[1];
        else
            newnode.ID = this.ID[0];

        if (this.ID[0] == this.ID[1]) {
            newnode.isDouble = true;

            switch (node.RootDirection) {
                case Direction.BOT:
                    newnode.BOT = false;
                    node.neighbors.forEach(n => { n.BOT = false });
                    break;
                case Direction.TOP:
                    newnode.TOP = false;
                    node.neighbors.forEach(n => { n.TOP = false });
                    break;
                case Direction.LEFT:
                    newnode.LEFT = false;
                    newnode.Position = this.Position.add(cc.v3(-35, 0, 0));
                    break;
                case Direction.RIGHT:
                    newnode.RIGHT = false;
                    newnode.Position = this.Position.add(cc.v3(35, 0, 0));
                    break;
            }
            newnode.Position = this.Position;
            newnode.RootDirection = this.RootNode.RootDirection;
        } else {

            switch (this.Direction) {
                case Direction.TOP:

                    newnode.BOT = false;
                    node.neighbors.forEach(n => {if (!n.isRoot) n.TOP = false });
                    newnode.Position = this.Position.add(cc.v3(0, 35, 0));
                    break;
                case Direction.TOP_RIGHT:

                    newnode.BOT = false;
                    newnode.LEFT = false;
                    node.neighbors.forEach(n => { if (!n.isRoot) n.TOP = false });
                    if (this.isPortrait())
                        newnode.Position = this.Position.add(cc.v3(0, 35, 0));
                    else
                        newnode.Position = this.Position.add(cc.v3(35, 0, 0));
                    break;
                case Direction.RIGHT:
                    newnode.LEFT = false;
                    newnode.Position = this.Position.add(cc.v3(35, 0, 0));
                    break;
                case Direction.RIGHT_BOT:
                    newnode.TOP = false;
                    newnode.LEFT = false;
                    node.neighbors.forEach(n => { if (!n.isRoot) n.BOT = false });
                    if (this.isPortrait())
                        newnode.Position = this.Position.add(cc.v3(0, -35, 0));
                    else
                        newnode.Position = this.Position.add(cc.v3(35, 0, 0));
                    break;
                case Direction.BOT:
                    newnode.TOP = false;
                    node.neighbors.forEach(n => { if (!n.isRoot) n.BOT = false });
                    newnode.Position = this.Position.add(cc.v3(0, -35, 0));
                    break;
                case Direction.BOT_LEFT:
                    newnode.TOP = false;
                    newnode.RIGHT = false;
                    node.neighbors.forEach(n => { if (!n.isRoot) n.BOT = false });
                    if (this.isPortrait())
                        newnode.Position = this.Position.add(cc.v3(0, -35, 0));
                    else
                        newnode.Position = this.Position.add(cc.v3(-35, 0, 0));
                    break;
                case Direction.LEFT:
                    newnode.RIGHT = false;
                    newnode.Position = this.Position.add(cc.v3(-35, 0, 0));
                    break;
                case Direction.LEFT_TOP:
                    newnode.RIGHT = false;
                    newnode.BOT = false;
                    node.neighbors.forEach(n => {if (!n.isRoot) n.TOP = false });
                    if (this.isPortrait())
                        newnode.Position = this.Position.add(cc.v3(0, 35, 0));
                    else
                        newnode.Position = this.Position.add(cc.v3(-35, 0, 0));
                    break;

            }
            if (this.isPortrait()) {
                switch (this.Direction) {
                    case Direction.BOT:
                    case Direction.BOT_LEFT:
                    case Direction.RIGHT_BOT:
                        newnode.RootDirection = Direction.TOP;
                        break;
                    case Direction.TOP:
                    case Direction.TOP_RIGHT:
                    case Direction.LEFT_TOP:
                        newnode.RootDirection = Direction.BOT;
                        break;
                }
            } else {
                switch (this.Direction) {
                    case Direction.LEFT:
                    case Direction.LEFT_TOP:
                    case Direction.BOT_LEFT:
                        newnode.RootDirection = Direction.RIGHT;
                        break;
                    case Direction.RIGHT_BOT:
                    case Direction.TOP_RIGHT:
                    case Direction.TOP_RIGHT:
                        newnode.RootDirection = Direction.LEFT;
                        break;
                }
            }
        }

        

        node.MakeFriends(newnode);
        node.Disable();

        return newnode;
    }

    Build(domi: Domino, node: DomiNode) {
        this.RootNode = node;
        this.ID = domi.ID;

        var pos = Tools.WorldPos(domi.node);
        this.Direction = this.findDirection(node.Position, pos);
        //console.log(this.Direction.toString);
        if (this.ID[0] == this.ID[1]) {
            switch (node.RootDirection) {
                case Direction.BOT:
                    this.setLanscape();
                    this.definePosition(0, 2);
                    break;
                case Direction.TOP:
                    this.setLanscape();
                    this.definePosition(0, -2);
                    break;
                case Direction.LEFT:
                    this.setPortrait();
                    this.definePosition(2, 0);
                    break;
                case Direction.RIGHT:
                    this.setPortrait();
                    this.definePosition(-2, 0);
                    break;
            }
        } else {

            switch (this.Direction) {
                case Direction.TOP:
                    if (node.TOP) {
                        this.setPortrait();
                        if (node.isDouble == false || (node.isDouble && (node.RootDirection == Direction.BOT|| node.isRoot)))
                        this.definePosition(0, 3);
                        else
                        this.definePosition(0, 4);
                        
                    }
                    break;
                case Direction.TOP_RIGHT:
                    if (node.isDouble) break;
                    if (node.TOP && node.RootDirection == Direction.BOT) {
                        this.setLanscape();
                        this.definePosition(1, 2);
                    }
                    if (node.RIGHT && node.RootDirection == Direction.LEFT) {
                        this.setPortrait();
                        this.definePosition(2, 1);
                    }
                    break;
                case Direction.RIGHT:
                    if (node.RIGHT) {
                        this.setLanscape();
                        if (node.isDouble == false|| (node.isDouble && (node.RootDirection == Direction.LEFT|| node.isRoot)))
                        this.definePosition(3, 0);
                        else
                        this.definePosition(4, 0);
                        
                    }
                    break;
                case Direction.RIGHT_BOT:
                    if (node.isDouble) break;
                    if (node.RIGHT && node.RootDirection == Direction.LEFT) {
                        this.setPortrait(false);
                        this.definePosition(2, -1);
                    }
                    if (node.BOT && node.RootDirection == Direction.TOP) {
                        this.setLanscape();
                        this.definePosition(1, -2)
                    }
                    break;
                case Direction.BOT:
                    if (node.BOT) {
                        this.setPortrait(false);
                        if (node.isDouble == false|| (node.isDouble && (node.RootDirection == Direction.TOP|| node.isRoot)))
                        this.definePosition(0, -3);
                        else
                        this.definePosition(0, -4);
                        
                    }
                    break;
                case Direction.BOT_LEFT:
                    if (node.isDouble) break;
                    if (node.LEFT && node.RootDirection == Direction.RIGHT) {
                        this.setPortrait(false);
                        this.definePosition(-2, -1);
                    }
                    if (node.BOT && node.RootDirection == Direction.TOP) {
                        this.setLanscape(true);
                        this.definePosition(-1, -2)
                    }
                    break;
                case Direction.LEFT:
                    if (node.LEFT) {
                        this.setLanscape(true);
                        if (node.isDouble == false|| (node.isDouble && (node.RootDirection == Direction.RIGHT|| node.isRoot)))
                        this.definePosition(-3, 0);
                        else
                        this.definePosition(-4, 0);
                    }
                    break;
                case Direction.LEFT_TOP:
                    //console.log(node);
                    if (node.isDouble) break;
                    if (node.TOP && node.RootDirection == Direction.BOT) {
                        this.setLanscape(true);
                        this.definePosition(-1, 2);
                    }
                    if (node.LEFT && node.RootDirection == Direction.RIGHT) {
                        this.setPortrait();
                        this.definePosition(-2, 1);
                    }
                    break;

            }
        }
    }

    validate() {

        if (this.Valid == false)
            return;

        if (this.isPortrait()) {
            switch (this.Direction) {
                case Direction.BOT:
                case Direction.BOT_LEFT:
                case Direction.RIGHT_BOT: {
                    var topleft = cc.v3(this.Position.x - 70 * 2.5, this.Position.y);
                    var botright = cc.v3(this.Position.x + 70 * 2.5, this.Position.y - 70 * 3);
                    this.Valid = this.RootNode.Desk.validate(topleft, botright, this.Position);
                    break;
                }
                case Direction.TOP:
                case Direction.TOP_RIGHT:
                case Direction.LEFT_TOP: {
                    var topleft = cc.v3(this.Position.x - 70 * 2.5, this.Position.y + 70 * 3);
                    var botright = cc.v3(this.Position.x + 70 * 2.5, this.Position.y);
                    this.Valid = this.RootNode.Desk.validate(topleft, botright, this.Position);
                    break;
                }
            }
        } else {
            switch (this.Direction) {
                case Direction.LEFT:
                case Direction.LEFT_TOP:
                case Direction.BOT_LEFT: {
                    var topleft = cc.v3(this.Position.x - 70 * 3, this.Position.y + 70 * 2.5);
                    var botright = cc.v3(this.Position.x, this.Position.y - 70 * 2.5);
                    this.Valid = this.RootNode.Desk.validate(topleft, botright, this.Position);
                    break;
                }
                case Direction.RIGHT_BOT:
                case Direction.TOP_RIGHT:
                case Direction.RIGHT: {
                    var topleft = cc.v3(this.Position.x, this.Position.y + 70 * 2.5);
                    var botright = cc.v3(this.Position.x + 70 * 3, this.Position.y - 70 * 2.5);
                    this.Valid = this.RootNode.Desk.validate(topleft, botright, this.Position);
                    break;
                }
            }
        }
    }

    definePosition(xParam: number, yParam: number) {

        this.Position = this.RootNode.Position.add(cc.v3(35 * xParam, 35 * yParam));
        if (this.ID[0] != this.ID[1]) {
            this.validate();
        }
    }


    setPortrait(leftAtBot: boolean = true) {
        var clockwise = -1;
        var reverse = 1;
        if (leftAtBot == false)
            reverse = -1;



        if (this.ID[0] == this.RootNode.ID)
            this.Angle = -clockwise * 90 * reverse;
        else
            this.Angle = clockwise * 90 * reverse;

        this.Valid = true;
    }

    setLanscape(reverse: boolean = false) {
        var param1 = 0;
        var param2 = 180;

        if (reverse) {
            param1 = 180;
            param2 = 0;
        }


        if (this.ID[0] == this.RootNode.ID)
            this.Angle = param1;
        else
            this.Angle = param2;


        this.Valid = true;
    }


    findDirection(root: cc.Vec3, target: cc.Vec3): Direction {
        if (target.x > root.x - 35 && target.x < root.x + 35) {
            if (target.y > root.y)
                return Direction.TOP;
            else
                return Direction.BOT;
        }

        if (target.y > root.y - 35 && target.y < root.y + 35) {
            if (target.x > root.x)
                return Direction.RIGHT;
            else
                return Direction.LEFT;
        }

        if (target.x > root.x) {
            if (target.y > root.y)
                return Direction.TOP_RIGHT;
            else
                return Direction.RIGHT_BOT;
        } else {
            if (target.y > root.y)
                return Direction.LEFT_TOP;
            else
                return Direction.BOT_LEFT;
        }


    }

}

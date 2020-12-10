// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Domino from "./Domino";
import DomiNode from "./DomiNode";
import Tools from "./Tools";
import DomiTransform from "./DomiTransform";
import { Direction } from "./Direction";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DominoDesk extends cc.Component {

    @property(cc.Prefab)
    DominoPrefab: cc.Prefab = null;

    DW: number = 138;
    DH: number = 70;

    TopPos: cc.Vec3 = cc.v3(0, this.DW / 4, 0);
    RightPos: cc.Vec3 = cc.v3(this.DW / 4, 0, 0);
    LeftPos: cc.Vec3 = cc.v3(-this.DW / 4, 0, 0);
    BotPos: cc.Vec3 = cc.v3(0, -this.DW / 4, 0);
    // LIFE-CYCLE CALLBACKS:

    DominoList: DomiNode[] = [];
    // onLoad () {}

    start() {

    }

    Instantiate(transform: DomiTransform): Domino {

        var domi = cc.instantiate(this.DominoPrefab).getComponent(Domino);
        domi.node.setParent(this.node);
        domi.node.position = this.node.convertToNodeSpaceAR(transform.Position);
        domi.setDomino(transform.ID);
        domi.node.angle = transform.Angle;

        return domi;
    }

    checkCanPlace(curDomi: Domino): DomiNode {
        var r: DomiNode = null;
        if (this.DominoList.length == 0) {
            var node = new DomiNode();
            node.isRoot = true;
            return node;
        } else {

            this.DominoList.forEach(node => {
                if (node.CheckMatch(curDomi)) {
                    r = node;
                }
            });
        }
        return r;
    }

    validate (topleft:cc.Vec3, botright:cc.Vec3, target: cc.Vec3) : boolean{

        for (var i = 0; i < this.DominoList.length; i++){
            var node = this.DominoList[i];
            if (node.Position.x < botright.x && node.Position.x > topleft.x && node.Position.y < topleft.y && node.Position.y > botright.y){
                if (Math.abs(node.Position.x - target.x) < 75 || Math.abs(node.Position.y - target.y) < 75)
                return false;

                if (node.Position.x < target.x && node.RootDirection == Direction.RIGHT && node.Position.y > target.y - 35 && node.Position.y < target.y +35)
                return false;
                if (node.Position.x > target.x && node.RootDirection == Direction.LEFT&& node.Position.y > target.y - 35 && node.Position.y < target.y +35)
                return false;
                if (node.Position.y < target.y && node.RootDirection == Direction.TOP&& node.Position.x > target.x - 35 && node.Position.x < target.x +35)
                return false;
                if (node.Position.y > target.y && node.RootDirection == Direction.BOT&& node.Position.x > target.x - 35 && node.Position.x < target.x +35)
                return false;

                
            }
        }

        return true;

    }

    
    placeRoot(ID:string){

        var domi = cc.instantiate(this.DominoPrefab).getComponent(Domino);
        domi.node.setParent(this.node);
        domi.setDomino(ID);
        //domi.node.angle = 90;


        

        if (domi.ID[0] == domi.ID[1]) {
            var dnodeC = new DomiNode();
            dnodeC.ID = domi.ID[0];
            dnodeC.Position = Tools.WorldPos(domi.node);
            dnodeC.Desk = this;
            dnodeC.isDouble = true;
            dnodeC.isRoot = true;
            this.DominoList.push(dnodeC);


        } else {

            // Left
        var dnodeL = new DomiNode();
        dnodeL.ID = domi.ID[0];
        dnodeL.RIGHT = false;
        dnodeL.Position = Tools.WorldPos(domi.node).add(this.LeftPos);
        dnodeL.RootDirection = Direction.RIGHT;
        dnodeL.Desk = this;
        this.DominoList.push(dnodeL);
        // Right
        var dnodeR = new DomiNode();
        dnodeR.ID = domi.ID[1];
        dnodeR.LEFT = false;
        dnodeR.Position = Tools.WorldPos(domi.node).add(this.RightPos);
        dnodeR.RootDirection = Direction.LEFT;
        dnodeR.Desk = this;
        this.DominoList.push(dnodeR);

            dnodeL.MakeFriends(dnodeR);
        }
    }

    place(transform:DomiTransform) {
        
        this.Instantiate(transform);
        var node = transform.GenerateNode();
        node.Desk = this;
        this.DominoList.push(node);
        
    }

    // update (dt) {}
}

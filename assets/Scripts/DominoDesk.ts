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
import AlignmentInfo from "./AlignmentInfo";

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

    LogicList: DomiNode[] = [];

    targetAlignPos:cc.Vec3 = cc.Vec3.ZERO;
    targetAlignScale:number = 1;

    // onLoad () {}

    start() {

    }

    Instantiate(ID: string, alignID: number): Domino {

        var domi = cc.instantiate(this.DominoPrefab).getComponent(Domino);
        domi.node.setParent(this.node);

        var pos = cc.Vec3.ZERO;
        var alignment: AlignmentInfo = null;
        var domiNode: DomiNode = null;
        var isRoot: boolean = (alignID == -1);

        if (alignID > -1) {
            this.LogicList.forEach(node => {
                node.alignNode.forEach(align => {
                    if (align.ID == alignID) {
                        pos = this.node.convertToNodeSpaceAR(Tools.WorldPos(align));
                        alignment = align;
                        domiNode = node;
                    }
                });
            });

        }
        domi.node.position = pos;
        domi.setupDomino(ID, isRoot);

        if (alignment) {
            alignment.isActive = false;
            domi.rotate(Domino.findAngle(ID, alignment));
        }

        if (domiNode) {
            if (domiNode.RootDirection != Direction.CENTER)
                domiNode.isActive = false;

            if (ID[0] != ID[1]) {
                domi.logicNode.forEach(node => {
                    if (node.ID == domiNode.ID)
                        node.isActive = false;
                });
            } else {
                if (isRoot == false) {
                    var dist0 = cc.Vec3.distance(Tools.WorldPos(domiNode), Tools.WorldPos(domi.logicNode[0].alignNode[0]));
                    var dist1 = cc.Vec3.distance(Tools.WorldPos(domiNode), Tools.WorldPos(domi.logicNode[0].alignNode[1]));
                    if (dist0 < dist1)
                        domi.logicNode[0].alignNode[0].isActive = false;
                    else
                        domi.logicNode[0].alignNode[1].isActive = false;
                }
            }
        }

        

        domi.logicNode.forEach(node => this.LogicList.push(node));
        domi.node.opacity = 0;

        return domi;
    }

    // checkCanPlace(curDomi: Domino): DomiNode {
    //     var r: DomiNode = null;
    //     if (this.DominoList.length == 0) {
    //         var node = new DomiNode();
    //         node.isRoot = true;
    //         return node;
    //     } else {

    //         this.DominoList.forEach(node => {
    //             if (node.CheckMatch(curDomi)) {
    //                 r = node;
    //             }
    //         });
    //     }
    //     return r;
    // }

    // validate (topleft:cc.Vec3, botright:cc.Vec3, target: cc.Vec3) : boolean{

    //     for (var i = 0; i < this.DominoList.length; i++){
    //         var node = this.DominoList[i];
    //         if (node.Pos().x < botright.x && node.Pos().x > topleft.x && node.Pos().y < topleft.y && node.Pos().y > botright.y){
    //             if (Math.abs(node.Pos().x - target.x) < 75 || Math.abs(node.Pos().y - target.y) < 75)
    //             return false;

    //             if (node.Pos().x < target.x && node.RootDirection == Direction.RIGHT && node.Pos().y > target.y - 35 && node.Pos().y < target.y +35)
    //             return false;
    //             if (node.Pos().x > target.x && node.RootDirection == Direction.LEFT&& node.Pos().y > target.y - 35 && node.Pos().y < target.y +35)
    //             return false;
    //             if (node.Pos().y < target.y && node.RootDirection == Direction.TOP&& node.Pos().x > target.x - 35 && node.Pos().x < target.x +35)
    //             return false;
    //             if (node.Pos().y > target.y && node.RootDirection == Direction.BOT&& node.Pos().x > target.x - 35 && node.Pos().x < target.x +35)
    //             return false;


    //         }
    //     }

    //     return true;

    // }

    getClosestAlignment(ID: string, worldPos: cc.Vec3): AlignmentInfo {
        if (this.LogicList.length == 0)
            return null;

        var result: AlignmentInfo = null;
        var closest: number = 999999;

        this.LogicList.forEach(node => {
            if (node.isActive && (node.ID == ID[0] || node.ID == ID[1]) && cc.Vec3.distance(worldPos, Tools.WorldPos(node)) < 130) {

                node.alignNode.forEach(align => {

                    if (align.isForDouble && (ID[0] != ID[1]))
                        return;

                    if (align.isActive) {
                        var pos = Tools.WorldPos(align);
                        if (cc.Vec3.distance(worldPos, pos) < closest) {
                            closest = cc.Vec3.distance(worldPos, pos);
                            result = align;
                        }
                    }
                });
            }
        });

        return result;
    }

    findAlignWithID(ID:number) : AlignmentInfo{
        var result: AlignmentInfo = null;

        this.LogicList.forEach(node => {
            if (result == null)
            node.alignNode.forEach(align => {
                if (align.ID == ID)
                    result = align;
            })
        })

        return result;
    }

    prepareRealign(){
        var top:number = -99999;
        var bot:number = 99999;
        var left:number = 99999;
        var right:number = -99999;

        this.LogicList.forEach(node => {
            var pos = this.node.parent.convertToNodeSpaceAR(Tools.WorldPos(node));
            if (pos.x > right) right = pos.x;
            if (pos.x < left) left = pos.x;

            if (pos.y > top) top = pos.y;
            if (pos.y < bot) bot = pos.y;
        });

        this.targetAlignPos.x = - (left + right) / 2;
        this.targetAlignPos.y = - (top + bot) / 2;

        
        

        if (top > 250 || bot < -250 || left < -450 || right > 450){
            this.targetAlignScale -= 0.1;
        }
    }

    realign(){
        //this.prepareRealign();
        this.node.runAction(cc.scaleTo(0.1, this.targetAlignScale));
        this.node.runAction(cc.moveBy(0.1, cc.v2(this.targetAlignPos.x,this.targetAlignPos.y) ));
    }

    // update (dt) {}
}

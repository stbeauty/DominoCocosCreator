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
import GameManager from "./GameManager";

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

    clear(){
        this.node.removeAllChildren();
        this.LogicList = [];
        this.node.position = cc.Vec3.ZERO;
        this.node.scale = 1;
        this.targetAlignPos = cc.Vec3.ZERO;
        this.targetAlignScale = 1;
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
        if (ID[0] == ID[1]){
            GameManager.Instance().doublePlaced = true;
        }

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
                if (domi.logicNode.length == 2){
                    var pos1 = Tools.WorldPos(domi.logicNode[0]);
                    var pos2 = Tools.WorldPos(domi.logicNode[1]);
                    var pos0 = Tools.WorldPos(domiNode);
                    if (cc.Vec3.distance(pos1,pos0) < cc.Vec3.distance(pos2, pos0))
                    domi.logicNode[0].isActive = false;
                    else
                    domi.logicNode[1].isActive = false;
                }
            }
        }

        

        domi.logicNode.forEach(node => this.LogicList.push(node));
        domi.node.opacity = 0;

        //this.disableBadAlign();

        return domi;
    }

    findActiveID() : string[]{
        var result:string[] = [];
        this.LogicList.forEach(node =>{
            if (node.isActive && node.RootDirection != Direction.CENTER)
                result.push(node.ID);
        })

        return result;
    }

    disableBadAlign(){
        var root = Tools.WorldPos(this.node);

        this.LogicList.forEach(node => {
            
            node.alignNode.forEach (align => {
                if (align.isActive){
                    var c = Tools.WorldPos(align);
                    this.LogicList.forEach(node2 =>{
                        if (node2.Domino != node.Domino)
                            {
                                var pos = Tools.WorldPos(node2);
                                if (cc.Vec3.distance(pos, c) <= 105)
                                    align.isActive = false;
                            }
                    });

                        c = this.node.parent.convertToNodeSpaceAR(c);
                    if (this.node.scale <= 0.8)
                        if ((align.isPortrait && (c.y < -250 || c.y > 250)) || (align.isPortrait == false && (c.x < -666 || c.x > 666)))
                        align.isActive = false;

                    
                }
            })
        })
    }

    calculateScore():number{
        var point:number = 0;
        this.LogicList.forEach(node => {
            if (node.isActive && node.RootDirection != Direction.CENTER){
                point += Number(node.ID);
            }
        })

        return point;
    }


    getClosestAlignment(ID: string, worldPos: cc.Vec3): AlignmentInfo {
        if (this.LogicList.length == 0)
            return null;

            this.disableBadAlign();

        var result: AlignmentInfo = null;
        var closest: number = 999999;

        this.LogicList.forEach(node => {
            if (node.isActive && (node.ID == ID[0] || node.ID == ID[1]) && cc.Vec3.distance(worldPos, Tools.WorldPos(node)) < 130) {

                node.alignNode.forEach(align => {

                    if (ID[0] == ID[1]){
                        if (GameManager.Instance().doublePlaced){
                            if (align.isStraight){
                                result = align;
                            }
                        } else {
                            if (align.isForDouble){
                                result = align;
                            }
                        }
                        return;
                    }

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

        
        

        if ((top - bot > 300) || (right - left > 800)){
            if (this.targetAlignScale > 0.8)
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

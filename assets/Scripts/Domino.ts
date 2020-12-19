// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AlignmentInfo from "./AlignmentInfo";
import { Direction } from "./Direction";
import DominoButton from "./DominoButton";
import DomiNode from "./DomiNode";
import GameManager from "./GameManager";
import Tools from "./Tools";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Domino extends cc.Component {


    @property (cc.Sprite)
    Shadow:cc.Sprite = null;

    ID:string;
    startedPosition: cc.Vec3;

    rootDomi:Domino = null;
    avaiID:string = "";
    // onLoad () {}

    rootBtn:DominoButton = null;

    logicNode:DomiNode[] = [];
    isRoot:boolean = false;

    onLoad(){
        this.hideAll();
    }

    hideAll(){
        this.node.children.forEach(node=> node.active = false);
    }

    start () {
       
    }

    static findAngle(ID: string, alignment: AlignmentInfo) {
        var node: DomiNode = alignment.Root;
        if (alignment.isPortrait) {
            if (ID[0] == node.ID) {
                if (Tools.WorldPos(alignment).y > Tools.WorldPos(node).y)
                    return 90;
                    else
                    return -90;
            } else {
                if (Tools.WorldPos(alignment).y > Tools.WorldPos(node).y)
                return -90;
                else
                return 90;
            }

        } else {
            if (ID[0] == node.ID) {
                if (Tools.WorldPos(alignment).x > Tools.WorldPos(node).x)
                    return 0;
                    else
                    return 180;
            } else {
                if (Tools.WorldPos(alignment).x > Tools.WorldPos(node).x)
                return 180;
                else
                return 0;
            }
        }
    }

    rotate(angle:number){
        
        this.node.angle = angle;
        if (angle == 0)
            return;

            // This only work for first rotating ever
        this.logicNode.forEach(node => node.rotate(angle));
    }

    setSprite(id:string){
        this.ID = id;
        
        this.node.getComponentsInChildren(cc.Sprite).forEach(sprite => {
           if (sprite.spriteFrame.name == id) 
           sprite.node.active = true;
           else
           sprite.node.active = false;
        });
    }

    setupDomino(id:string, isRoot:boolean){
        this.setSprite(id);
        this.isRoot = isRoot;
        this.logicNode = [];

        //var isRootDouble: boolean = isRoot && id[0] == id[1];

        
        var node = DomiNode.LEFT(isRoot, true);
        node.parent = this.node;
        node.x = -35;
        node.ID = id[0];
        node.Domino = this;
        this.logicNode.push(node);

        node = DomiNode.RIGHT(isRoot, true);
        node.parent = this.node;
        node.x = 35;
        node.ID = id[1];
        node.Domino = this;
        this.logicNode.push(node);
        

        if (id[0] == id[1] && GameManager.Instance().doublePlaced == false){
            var node = DomiNode.CENTER_LANSCAPE(true);
            node.parent = this.node;
            node.ID = id[1];
            node.Domino = this;
            this.logicNode.push(node);

        }

        if (isRoot && id[0] == id[1])
            this.rotate(-90);

    }


    liftUp(){
        this.node.active = true;
        this.Shadow.node.active = true;
        this.Shadow.node.runAction(cc.sequence(cc.moveBy(0.1, cc.v2(-10,-10)), cc.callFunc(()=>{})));
        this.node.runAction(cc.scaleBy(0.1, 1.1));
    }

    placeDown(dest:cc.Vec3, scale:number, point:number, callback:Function){
        this.Shadow.node.runAction(cc.sequence(cc.moveBy(0.1, cc.v2(10,10)), cc.callFunc(()=>{
            this.Shadow.node.active = false;
            this.node.active = false;
            if (callback != null){
                callback();
                if (this.rootBtn!=null){
                    this.rootBtn.setScore(point);
                }
            }

            
        })));

        var d = this.node.parent.convertToNodeSpaceAR(dest);
        this.node.runAction(cc.moveTo(0.1, d.x, d.y));

        this.node.runAction(cc.scaleTo(scale,1));
    }

    returnToOriginal(){
        this.placeDown(this.startedPosition,1,0, null);
        this.rootBtn.BlackSprite.node.active = false;
    }

    // update (dt) {}
}

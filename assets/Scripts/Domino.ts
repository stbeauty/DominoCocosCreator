// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DominoButton from "./DominoButton";

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

    start () {

    }



    setDomino(id:string){
        this.ID = id;
        this.node.getComponentsInChildren(cc.Sprite).forEach(sprite => {
           if (sprite.spriteFrame.name == id) 
           sprite.node.active = true;
           else
           sprite.node.active = false;
        });
    }

    liftUp(){
        this.node.active = true;
        this.Shadow.node.active = true;
        this.Shadow.node.runAction(cc.sequence(cc.moveBy(0.1, cc.v2(-10,-10)), cc.callFunc(()=>{})));
        this.node.runAction(cc.scaleBy(0.1, 1.1));
    }

    placeDown(dest:cc.Vec3, callback:Function){
        this.Shadow.node.runAction(cc.sequence(cc.moveBy(0.1, cc.v2(10,10)), cc.callFunc(()=>{
            this.Shadow.node.active = false;
            this.node.active = false;
            if (callback != null){
                callback();
                if (this.rootBtn!=null){
                    //this.rootBtn.draw();
                    this.rootBtn.BlackSprite.node.active = true;
                }
            }

            
        })));

        var d = this.node.parent.convertToNodeSpaceAR(dest);
        this.node.runAction(cc.moveTo(0.1, d.x, d.y));

        this.node.runAction(cc.scaleTo(0.1,1));
    }

    returnToOriginal(){
        this.placeDown(this.startedPosition, null);
    }

    // update (dt) {}
}

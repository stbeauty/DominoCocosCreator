// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import RoundController from "./RoundController";
import Domino from "./Domino";
import Tools from "./Tools";

const {ccclass, property} = cc._decorator;

enum DominoBtnState{
    BLANK,
    BLACK,
    DOMINO
}

@ccclass
export default class DominoButton extends cc.Button {

    @property(RoundController)
    RoundControl: RoundController;

    @property(Domino)
    Domino:Domino;

    @property(cc.Sprite)
    BlackSprite: cc.Sprite;

    @property(cc.Sprite)
    BlankSprite: cc.Sprite;

    state: DominoBtnState = DominoBtnState.BLANK;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on('touchstart', this.onTouchStart, this);
    
        this.node.on('touchmove', this.onTouchMove, this);
    
        this.node.on('touchend', this.onTouchEnd, this);

        this.node.on('touchcancel', this.onTouchCancel, this);
    }

    onTouchStart(touch, event){
        this.RoundControl.PlayerDomino.setDomino(this.Domino.ID);
        this.RoundControl.PlayerDomino.startedPosition = Tools.WorldPos(this.node);
        this.RoundControl.PlayerDomino.rootBtn = this;
        this.RoundControl.onTouchStart(touch,event);
        
        this.BlackSprite.node.active = true;
    }

    onTouchMove(touch, event){
        this.RoundControl.onTouchMove(touch,event);
    }

    onTouchEnd(touch, event){
        this.RoundControl.onTouchEnd(touch,event);
        this.BlackSprite.node.active = false;
    }

    onTouchCancel(touch, event){
        this.RoundControl.onTouchEnd(touch,event);
        this.BlackSprite.node.active = false;
    }

    start () {
        this.draw();

       
    }

    draw(){
        this.Domino.setDomino(this.RoundControl.drawDonimo());
        this.BlackSprite.node.active = false;
        this.BlankSprite.node.active = false;
    }

    // update (dt) {}
}

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



@ccclass
export default class DominoButton extends cc.Button {

    //@property(RoundController)
    RoundControl: RoundController;

    @property(Domino)
    Domino:Domino;

    @property(cc.Sprite)
    BlackSprite: cc.Sprite;

    @property(cc.Sprite)
    BlankSprite: cc.Sprite;

    isPlayed:boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on('touchstart', this.onTouchStart, this);
    
        this.node.on('touchmove', this.onTouchMove, this);
    
        this.node.on('touchend', this.onTouchEnd, this);

        this.node.on('touchcancel', this.onTouchCancel, this);
    }

    onTouchStart(touch, event){
        if (this.RoundControl.isPlayerTurn == false)
            return;
        if (this.isPlayed)
            return;

        this.RoundControl.PlayerDomino.setSprite(this.Domino.ID);
        this.RoundControl.PlayerDomino.startedPosition = Tools.WorldPos(this.node);
        this.RoundControl.PlayerDomino.rootBtn = this;
        this.RoundControl.onTouchStart(touch,event);
        
        this.BlackSprite.node.active = true;
    }

    onTouchMove(touch, event){
        if (this.RoundControl.isPlayerTurn == false)
        return;
        if (this.isPlayed)
            return;
        this.RoundControl.onTouchMove(touch,event);
    }

    onTouchEnd(touch, event){
        if (this.RoundControl.isPlayerTurn == false)
        return;
        if (this.isPlayed)
            return;
        this.RoundControl.onTouchEnd(touch,event);
        this.BlackSprite.node.active = false;
    }

    onTouchCancel(touch, event){
        if (this.RoundControl.isPlayerTurn == false)
        return;
        if (this.isPlayed)
            return;
        this.RoundControl.onTouchEnd(touch,event);
        this.BlackSprite.node.active = false;
    }

    start () {
        //this.draw();

       
    }

    setDomino(id:string){
        this.Domino.setSprite(id);
        this.BlackSprite.node.active = false;
        this.BlankSprite.node.active = false;
    }

    testDraw(){
        if (this.RoundControl.isTesting)
        {
            this.setDomino(this.RoundControl.drawDonimo());
        }
    }

    // update (dt) {}
}

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

    @property(cc.Node)
    YellowNode: cc.Node = null;

    @property(cc.RichText)
    PointTxt:cc.RichText = null;

    isPlayed:boolean = false;

    touchInitiated:boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on('touchstart', this.onTouchStart, this);
    
        this.node.on('touchmove', this.onTouchMove, this);
    
        this.node.on('touchend', this.onTouchEnd, this);

        this.node.on('touchcancel', this.onTouchCancel, this);
    }

    checkTouchCondition():boolean{
        if (this.RoundControl == null)
        return false;
    if (this.RoundControl.isPlayerTurn == false)
        return false;
    if (this.isPlayed)
        return false;

        return true;
    }

    onTouchStart(touch, event){
       if (this.checkTouchCondition() == false)
        return;
        this.touchInitiated = true;
        this.RoundControl.PlayerDomino.setSprite(this.Domino.ID);
        this.RoundControl.PlayerDomino.startedPosition = Tools.WorldPos(this.node);
        this.RoundControl.PlayerDomino.rootBtn = this;
        this.RoundControl.onTouchStart(touch,event);
        
        this.BlackSprite.node.active = true;
    }

    onTouchMove(touch, event){
        if (this.checkTouchCondition() == false)
        return;

        if (this.touchInitiated == false)
            return;
        this.RoundControl.onTouchMove(touch,event);
    }

    onTouchEnd(touch, event){
        if (this.checkTouchCondition() == false)
        return;
        if (this.touchInitiated == false)
            return;
        this.RoundControl.onTouchEnd(touch,event);
        this.BlackSprite.node.active = false;
        this.touchInitiated = false;
    }

    onTouchCancel(touch, event){
        if (this.checkTouchCondition() == false)
        return;
        if (this.touchInitiated == false)
            return;
        this.RoundControl.onTouchEnd(touch,event);
        this.BlackSprite.node.active = false;
        this.touchInitiated = false;
    }

    start () {
        //this.draw();

       
    }

    putBlank(){
        this.BlackSprite.node.active = false;
        this.BlankSprite.node.active = true;
        this.YellowNode.active = false;
    }

    setScore(score: number){
        this.isPlayed = true;
        if (score <= 0){
            this.BlackSprite.node.active = true;
        } else {
            this.YellowNode.active = true;
            this.PointTxt.string = "<outline color=white width=2><b>"+score+"</b></outline>";
        }

    }

    setDomino(id:string){
        this.Domino.setSprite(id);
        this.BlackSprite.node.active = false;
        this.BlankSprite.node.active = false;
        this.YellowNode.active = false;
    }

    reset(){
        this.Domino.hideAll();
        this.BlackSprite.node.active = false;
        this.BlankSprite.node.active = true;
        this.YellowNode.active = false;
        this.isPlayed = false;
    }

    testDraw(){
        if (this.RoundControl.isTesting)
        {
            this.setDomino(this.RoundControl.drawDonimo());
        }
    }

    // update (dt) {}
}

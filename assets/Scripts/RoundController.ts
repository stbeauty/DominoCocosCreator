// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Domino from "./Domino";

@ccclass
export default class RoundController extends cc.Component {

    @property
    Deck: string[] = [];

    @property (Domino)
    PlayerDomino: Domino;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initDeck();

        // this.node.on('touchstart', this.onTouchStart, this);
    
        // this.node.on('touchmove', this.onTouchMove, this);
    
        // this.node.on('touchend', this.onTouchEnd, this);

    }

    onTouchStart(touch, event){
        this.PlayerDomino.node.active = true;

        this.PlayerDomino.node.position  = this.node.convertToNodeSpaceAR(touch.getLocation());

    }

    onTouchMove(touch, event){
        this.PlayerDomino.node.position  = this.node.convertToNodeSpaceAR(touch.getLocation());
    }

    onTouchEnd(touch, event){
        this.PlayerDomino.node.active = false;
    }

    initDeck() {
        this.Deck = [];
        this.Deck.push("00","10","20","30","40","50","60","11","21","31","41","51","61","22","32","42","52","62","33","43","53","63","44","54","64","55","65","66");
    }

    drawDonimo():string{
        if (this.Deck.length <= 0)
            return "";
        var chosenIdx = Math.floor(Math.random() * (this.Deck.length - 1));
        var chosenDo = this.Deck[chosenIdx];
        this.Deck.splice(chosenIdx,1);
        return chosenDo;
    }

    start () {
        this.PlayerDomino.node.active = false;
        //this.PlayerDomino.node.position.x 
    }

    // update (dt) {}
}

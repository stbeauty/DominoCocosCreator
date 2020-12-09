// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Domino from "./Domino";
import DominoDesk from "./DominoDesk";
import NodePosition from "./NodePosition";
import Tools from "./Tools";


@ccclass
export default class RoundController extends cc.Component {
    @property(DominoDesk)
    Desk: DominoDesk = null;

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
        this.PlayerDomino.liftUp();
    }

    onTouchMove(touch, event){
        this.PlayerDomino.node.position  = this.node.convertToNodeSpaceAR(touch.getLocation());

        var domi = this.Desk.checkCanPlace(this.PlayerDomino);

        

        
        if (domi != null && domi.isRoot==false){
            this.PlayerDomino.node.opacity = 255;
            var rotate = -1;
            if (domi.ID == this.PlayerDomino.ID[1])
                rotate = 1;
            var pos = Tools.WorldPos(this.PlayerDomino.node);
            if (pos.y < domi.Position.y - 35 && domi.BOT){
                
                this.PlayerDomino.node.angle = rotate*90;
            } else if (pos.y > domi.Position.y + 35 && domi.TOP){
                this.PlayerDomino.node.angle = -90*rotate;
            } else {
                if ((rotate > 0 && domi.RIGHT) || (rotate < 0 && domi.LEFT))
                this.PlayerDomino.node.angle = 180;
                else
                this.PlayerDomino.node.angle = 0;
            }
        } else {
            this.PlayerDomino.node.angle = 0;
            this.PlayerDomino.node.opacity = 128;
        }

    }

    onTouchEnd(touch, event){

        var domi = this.Desk.checkCanPlace(this.PlayerDomino);

        if (domi == null){
            this.PlayerDomino.returnToOriginal();
        }
        else if (domi.isRoot){

            this.PlayerDomino.placeDown(Tools.WorldPos(this.Desk.node), ()=>{
                this.Desk.place(this.PlayerDomino, domi, new NodePosition);
            });
            
        
        } else {
            var pos = this.Desk.findAbsolutePos(this.PlayerDomino, domi);
            this.PlayerDomino.placeDown(pos.Position, ()=>{
                this.Desk.place(this.PlayerDomino, domi,pos);
            });
        }

        
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

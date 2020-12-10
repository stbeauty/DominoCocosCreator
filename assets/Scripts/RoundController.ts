// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import Domino from "./Domino";
import DominoButton from "./DominoButton";
import DominoDesk from "./DominoDesk";
import DomiTransform from "./DomiTransform";
import GameAI from "./GameAI";
import { RoundState } from "./RoundState";
import Tools from "./Tools";


@ccclass
export default class RoundController extends cc.Component {
    @property(DominoDesk)
    Desk: DominoDesk = null;

    @property
    Deck: string[] = [];

    @property(Domino)
    PlayerDomino: Domino;

    //@property(Player)
    //Player: Player;
    @property({ type: [DominoButton] })
    DomiButtons: DominoButton[] = [];

    @property(cc.ProgressBar)
    PlayerCountDown: cc.ProgressBar = null;
    @property(cc.ProgressBar)
    LeftCountDown: cc.ProgressBar = null;
    @property(cc.ProgressBar)
    TopCountDown: cc.ProgressBar = null;
    @property(cc.ProgressBar)
    RightCountDown: cc.ProgressBar = null;

    CurrentCountDown: cc.ProgressBar = null;



    // LIFE-CYCLE CALLBACKS:

    LeftAI: GameAI = null;
    TopAI: GameAI = null;
    RightAI: GameAI = null;
    CurrentAI: GameAI = null;
    isPlayerTurn = false;


    @property(cc.RichText)
    statusTxt: cc.RichText = null;

    state: RoundState = RoundState.STAND_BY;
    TIMEINTERVAL: number = 10;

    countDown: number = 2;
    AITime: number = 0;

    onLoad() {
        this.initDeck();

        this.DomiButtons.forEach(btn => btn.RoundControl = this);

        this.LeftAI = new GameAI();
        this.LeftAI.RoundControl = this;

        this.TopAI = new GameAI();
        this.TopAI.RoundControl = this;

        this.RightAI = new GameAI();
        this.RightAI.RoundControl = this;


        
    }

    onTouchStart(touch, event) {
        this.PlayerDomino.node.active = true;

        this.PlayerDomino.node.position = this.node.convertToNodeSpaceAR(touch.getLocation());
        this.PlayerDomino.liftUp();
    }

    onTouchMove(touch, event) {
        this.PlayerDomino.node.position = this.node.convertToNodeSpaceAR(touch.getLocation());

        var node = this.Desk.checkCanPlace(this.PlayerDomino);

        if (node != null) {
            if (node.isRoot == false) {
                var transform = new DomiTransform(this.PlayerDomino, node);
                if (transform.Valid) {
                    this.PlayerDomino.node.opacity = 255;
                    this.PlayerDomino.node.angle = transform.Angle;
                } else {
                    this.PlayerDomino.node.angle = 0;
                    this.PlayerDomino.node.opacity = 128;
                }
            } else this.PlayerDomino.node.opacity = 255;
        } else {
            this.PlayerDomino.node.angle = 0;
            this.PlayerDomino.node.opacity = 128;
        }



    }

    onTouchEnd(touch, event) {

        var node = this.Desk.checkCanPlace(this.PlayerDomino);
        console.log(node);

        if (node == null) {
            this.PlayerDomino.returnToOriginal();
        }
        else if (node.isRoot) {

            this.PlayerDomino.placeDown(Tools.WorldPos(this.Desk.node), () => {
                this.Desk.placeRoot(this.PlayerDomino.ID);
                this.nextTurn();
            });


        } else {

            var transform = new DomiTransform(this.PlayerDomino, node);
            if (transform.Valid) {

                this.PlayerDomino.placeDown(transform.Position, () => {
                    this.Desk.place(transform);
                    this.nextTurn();
                });

                
            } else
                this.PlayerDomino.returnToOriginal();
        }


    }

    initDeck() {
        this.Deck = [];
        this.Deck.push("00", "10", "20", "30", "40", "50", "60", "11", "21", "31", "41", "51", "61", "22", "32", "42", "52", "62", "33", "43", "53", "63", "44", "54", "64", "55", "65", "66");
    }

    drawDonimo(): string {
        if (this.Deck.length <= 0)
            return "";
        var chosenIdx = Math.floor(Math.random() * (this.Deck.length - 1));
        var chosenDo = this.Deck[chosenIdx];
        this.Deck.splice(chosenIdx, 1);
        return chosenDo;
    }

    start() {
        this.PlayerDomino.node.active = false;
        this.statusTxt.string = "Preparing...";
        this.state = RoundState.STAND_BY;

        this.LeftCountDown.progress = 0;
        this.TopCountDown.progress = 0;
        this.RightCountDown.progress = 0;
        this.PlayerCountDown.progress = 0;
    }

    nextTurn() {

        this.CurrentCountDown.progress = 0;



        if (this.isPlayerTurn) {
            this.isPlayerTurn = false;
            this.CurrentCountDown = this.LeftCountDown;
            this.CurrentAI = this.LeftAI;

        } else if (this.CurrentAI == this.LeftAI) {
            this.CurrentCountDown = this.TopCountDown;
            this.CurrentAI = this.TopAI;
        } else if (this.CurrentAI == this.TopAI) {
            this.CurrentCountDown = this.RightCountDown;
            this.CurrentAI = this.RightAI;
        } else if (this.CurrentAI == this.RightAI) {
            this.CurrentCountDown = this.PlayerCountDown;
            this.CurrentAI = null;
            this.isPlayerTurn = true;
        }

        if (this.isPlayerTurn == false)
            this.AITime = Math.floor(Math.random() * 3) + 2;
        this.CurrentCountDown.progress = 1;
        this.countDown = this.TIMEINTERVAL;

    }

    update(dt) {
        this.countDown -= dt;

        if (this.state == RoundState.PLAYING) {
            if (this.isPlayerTurn && this.countDown <= 0){
                this.nextTurn();
            } else {
            this.AITime -= dt;
            this.CurrentCountDown.progress = (this.countDown / this.TIMEINTERVAL);

            if (this.isPlayerTurn == false && this.AITime <= 0) {
                this.CurrentAI.MakeMove();
                this.nextTurn();
            }
        }
        return;

        }

        if (this.countDown <= 0) {
            switch (this.state) {
                case RoundState.STAND_BY: {
                    this.state = RoundState.SHUFFLE;
                    this.statusTxt.string = "Shuffling...(animation later)";
                    this.countDown = 1;
                    break;
                }
                case RoundState.SHUFFLE: {
                    this.state = RoundState.DEAL;
                    this.statusTxt.string = "Dealing...(animation later)";
                    this.countDown = 1;

                    for (var i = 0; i < 7; i++) {
                        this.LeftAI.deck.push(this.drawDonimo());
                        this.RightAI.deck.push(this.drawDonimo());
                        this.TopAI.deck.push(this.drawDonimo());
                        this.DomiButtons[i].setDomino();

                    }
                    break;
                }
                case RoundState.DEAL: {
                    this.state = RoundState.READY;
                    this.statusTxt.string = "Your turn first, ready..";
                    this.countDown = 1;
                    break;
                }
                case RoundState.READY: {
                    this.state = RoundState.PLAYING;
                    this.statusTxt.string = "";
                    this.countDown = this.TIMEINTERVAL;
                    this.isPlayerTurn = true;
                    this.CurrentCountDown = this.PlayerCountDown;
                    this.CurrentCountDown.progress = 1.0;
                    break;
                }
                // case RoundState.PLAYING: {
                //     break;
                // }
                case RoundState.END: {
                    break;
                }
            }
        }
    }
}

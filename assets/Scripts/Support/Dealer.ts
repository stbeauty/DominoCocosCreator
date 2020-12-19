// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Direction } from "../Direction";
import DominoButton from "../DominoButton";
import RoundController from "../RoundController";
import ToggleDomi from "./ToggleDomi";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Dealer extends cc.Component {

    @property(cc.Prefab)
    DomiBackPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    DomiTogglePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    DomiButtonPrefab: cc.Prefab = null;

    BackList: cc.Node[] = [];
    AnchorList: cc.Vec2[] = [];

    @property(cc.Node)
    SelectDomi: cc.Node = null;
    @property(cc.Node)
    SelectBlank: cc.Node = null;

    RoundCtrl: RoundController = null;

    toggleCount: number = 0;

    wasSelected: boolean = false;
    alreadyDraw: Direction = Direction.CENTER;


    width = 1100;
    height = 550;
    top: number = this.height / 2;
    bot: number = -this.height / 2;
    left: number = -this.width / 2;
    right: number = this.width / 2;

    init() {
        for (var i = 0; i < 28; i++) {
            var back = cc.instantiate(this.DomiBackPrefab);
            back.parent = this.node;
            back.active = false;
            this.BackList.push(back);

            var toggle = cc.instantiate(this.DomiTogglePrefab);
            toggle.parent = this.SelectDomi;

            var blank = cc.instantiate(this.DomiButtonPrefab);
            blank.parent = this.SelectBlank;

        }

        var w05 = 0.5 * this.width / 7;
        var h05 = 0.5 * this.height / 7;

        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 7; j++)
                this.AnchorList.push(cc.v2(this.left + j * this.width / 7 + w05, this.bot + i * this.height / 4 + h05));
        
    }

    turnOnCardSelect(isBlank:boolean) {
        this.reset();
        this.wasSelected = true;
        if (isBlank)
        this.SelectBlank.active = true;
        else
        this.SelectDomi.active = true;
        
        

    }

    returnCardDeck() {
        var deck: string[] = [];
        this.SelectDomi.getComponentsInChildren(ToggleDomi).forEach(btn => {
            if (btn.isToggled)
                deck.push(btn.Domi.ID);
        });

        this.RoundCtrl.receiveCardDeck(deck);
    }

    reset() {
        this.wasSelected = false;
        this.alreadyDraw = Direction.CENTER;
        this.toggleCount = 0;
        var deck: string[] = [];
        deck.push("00", "10", "20", "30", "40", "50", "60", "11", "21", "31", "41", "51", "61", "22", "32", "42", "52", "62", "33", "43", "53", "63", "44", "54", "64", "55", "65", "66");
        var idx = 0;
            
        this.SelectDomi.getComponentsInChildren(ToggleDomi).forEach(btn => {
            btn.Domi.setSprite(deck[idx]);
            btn.node.position = cc.v3(this.AnchorList[idx]);
            idx++;
            btn.setToggle(false);
        });

        idx = 0;

        this.SelectBlank.getComponentsInChildren(DominoButton).forEach(btn => {
            btn.node.position = cc.v3(this.AnchorList[idx]);
            btn.putBlank();
            idx++;
        });
    }

    StartShuffling(callback: Function, tileNumb:number = 28) {
        var randomList: cc.Vec2[] = [];
        this.AnchorList.forEach(vec => randomList.push(vec));


        var handsPos: cc.Vec2[] = [];// [cc.v2(-2000, 0), cc.v2(2000, 0), cc.v2(0, 1000), cc.v2(0, -1000)];
        if (this.alreadyDraw != Direction.LEFT)
            handsPos.push(cc.v2(-2000, 0));
            if (this.alreadyDraw != Direction.TOP)
            handsPos.push(cc.v2(0, 1000));
            if (this.alreadyDraw != Direction.RIGHT)
            handsPos.push(cc.v2(2000, 0));
            //if (this.alreadyDraw == Direction.CENTER)
            handsPos.push(cc.v2(0, -1000));
        
            if (this.wasSelected)
                tileNumb = 21;

        for (var i = 0; i < tileNumb; i++) {
            var back = this.BackList[i];
            back.active = true;

            back.position = cc.v3(this.AnchorList[i]);
            back.y = 2000;

            var step1 = cc.v2(this.AnchorList[i]);
            step1.x = step1.x * 2 / 3 + Math.floor(Math.random() * 40) - 20;
            step1.y = step1.y * 2 / 3 + Math.floor(Math.random() * 40) - 20;

            var ridx = Math.floor(Math.random() * randomList.length);
            var step2 = randomList[ridx];
            randomList.splice(ridx, 1);

            back.scaleX = Math.floor(Math.random() * 2) == 0 ? -1 : 1;


            var step3 = handsPos[Math.floor(i / 7)];

            var delay = Math.floor(Math.random() * 12);

            if (i == tileNumb-1)
                back.runAction(cc.sequence(cc.delayTime(delay * 0.05), cc.moveTo(0.6, step1), cc.delayTime(0.5 + 0.55 - delay * 0.05), cc.moveTo(0.2, step2), cc.delayTime(1 + Math.floor(i / 7)), cc.moveTo(0.5, step3), cc.callFunc(callback)));
            else
                back.runAction(cc.sequence(cc.delayTime(delay * 0.05), cc.moveTo(0.6, step1), cc.delayTime(0.5 + 0.55 - delay * 0.05), cc.moveTo(0.2, step2), cc.delayTime(1 + Math.floor(i / 7)), cc.moveTo(0.5, step3)));

        }
    }

    EndSelecting(direction:Direction){
        var target:cc.Vec2 = cc.v2(-2000, 0);
        switch (direction){
            case Direction.RIGHT:
                target = cc.v2(2000, 0);
                break;
                case Direction.TOP:
                    target = cc.v2(0, 1000)
                break;
        }
        this.alreadyDraw = direction;


        var tracked: number[] = [];
        for (var i = 0; i < 7; i++) {
            var bool = true;
            var ridx = 0;
            while (bool) {
                ridx = Math.floor(Math.random() * 28);
                var found = false;
                for (var j = 0; j < tracked.length; j++)
                    if (tracked[j] == ridx)
                        found = true;
                if (found == false) {
                    tracked.push(ridx);
                    bool = false;
                }
            }

            this.SelectBlank.children[ridx].runAction(cc.moveTo(0.5, target));
        }

        this.node.runAction(cc.sequence(cc.delayTime(0.6), cc.callFunc(()=>{
            this.SelectBlank.active = false;
        })))
    }

    AnimateGetTiles(callback: Function){
        this.SelectDomi.getComponentsInChildren(ToggleDomi).forEach(btn => {
            if (btn.isToggled){
                btn.node.runAction(cc.moveTo(0.5, cc.v2(0, -1000)));
            }
        })

        this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(callback), cc.callFunc(()=> this.SelectDomi.active = false)));
    }


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.init();
    }

    start() {

        this.SelectDomi.getComponentsInChildren(ToggleDomi).forEach(btn => {
            btn.node.on("click", () => {
                if (this.toggleCount == 7)
                    return;
                btn.toggle();
                if (btn.isToggled)
                    this.toggleCount++;
                else this.toggleCount--;

                if (this.toggleCount >= 7) {
                    this.returnCardDeck();
                    //this.AnimateGetTiles();
                }
            })
        })

        this.SelectDomi.active = false;
        this.SelectBlank.active = false;

        //this.turnOnCardSelect(true);
        //this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(()=> {this.EndSelecting(Direction.LEFT)})));
    }

    // update (dt) {}
}

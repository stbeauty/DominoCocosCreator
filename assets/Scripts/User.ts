// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Domino from "./Domino";
import SyncLogic from "./Network/SyncLogic";
import HouseControl from "./Support/HouseControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class User extends cc.Component {

    @property(cc.Node)
    UIJoinedBar: cc.Node = null;
    @property(cc.Node)
    UIPlayingStatusNode: cc.Node = null;
    @property(cc.Node)
    UIHandNode: cc.Node = null;
    @property(cc.Node)
    UIHouses: cc.Node = null;

    @property(cc.RichText)
    UIJoinedName:cc.RichText = null;
    @property(cc.RichText)
    UIPlayingName:cc.RichText = null;

    @property(cc.ProgressBar)
    UICountDown: cc.ProgressBar = null;

    @property(HouseControl)
    Houses: HouseControl = null;

    @property([Domino])
    HandDominoes: Domino[] = [];

    netActor: Photon.LoadBalancing.Actor = null;

    countdown:number = 0;

    isMinimized:boolean = false;

    sync:SyncLogic = new SyncLogic();
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.closeHand();
    }

    start () {
        //this.reset("");
    }

    update (dt) {
        if (this.countdown > 0){
            this.countdown -= dt;
            this.UICountDown.progress = this.countdown / 10;
        }
    }

    showHand(){
        if (this.HandDominoes.length > 0){
            var idx = 0;
            for (var i = 0; i < 7; i++)
                if (this.sync.played[i] == false)
                    {
                        this.HandDominoes[idx].setSprite(this.sync.dominoes[i]);
                        idx++;
                    }
        }
    }

    closeHand(){
        this.HandDominoes.forEach (domi => domi.hideAll());

    }

    /////
    reset(name:string){
        this.UIJoinedBar.active = true;
        this.UIPlayingStatusNode.active = false;
        this.UIHandNode.active = false;
        this.UIHouses.active = false;
        this.UIJoinedName.string = "<outline color=black width=2><b>"+ name +"</b></outline>";
        this.UIPlayingName.string = this.UIJoinedName.string;
        this.UICountDown.progress = 0;
    }

    parsePack(pack:string[]){
        console.log("parsePack");
        
        this.UIJoinedBar.active = false;
        this.UIPlayingStatusNode.active = true;
        this.UIHandNode.active = true;
        this.UIHouses.active = true;


    }

    stopCountDown(){
        this.countdown = 0;
        this.UICountDown.progress = 0;
    }

    startCountDown(cd:number){
        this.countdown = cd;
        this.UICountDown.progress = 1;
    }
}

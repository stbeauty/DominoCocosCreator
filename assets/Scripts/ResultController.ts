// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "./GameManager";
import RoundController from "./RoundController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ResultController extends cc.Component {

    @property(cc.Node)
    NormalWinNode: cc.Node = null;

    @property(cc.Node)
    LoseNode: cc.Node = null;

    @property(cc.Node)
    FinalWinNode: cc.Node = null;

    @property(cc.Node)
    InfoNode: cc.Node = null;

    @property(cc.Node)
    GoodByeNode: cc.Node = null;

    @property(cc.Node)
    LeaderboardNode: cc.Node = null;

    @property(cc.Button)
    NormalWinEnter:cc.Button = null;

    @property(cc.Button)
    LoseLoggout:cc.Button = null;

    @property(cc.Button)
    FinalWinEnter:cc.Button = null;

    @property(cc.Button)
    LeaderBoardBack:cc.Button = null;

    @property(cc.Button)
    LeaderBoardOpen:cc.Button = null;

    @property(cc.Button)
    InfoEnter:cc.Button = null;

    @property(cc.Label)
    NormalWinLabel:cc.Label = null;

    @property(cc.Label)
    FinalWinLabel:cc.Label = null;

    RoundCtrl:RoundController = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.hideAll();
        this.NormalWinEnter.node.on("click", () => {
            this.RoundCtrl.startLoading();
        });
        this.FinalWinEnter.node.on("click", () => {
            this.FinalWinNode.active = false;
            this.InfoNode.active = true;
        });
        this.LeaderBoardBack.node.on("click", () => {
            this.LeaderboardNode.active = false;
            this.FinalWinNode.active = true;
        });
        this.LeaderBoardOpen.node.on("click", () => {
            this.LeaderboardNode.active = true;
            this.FinalWinNode.active = false;
        });
        this.InfoEnter.node.on("click", () => {
            this.InfoNode.active = false;
            this.GoodByeNode.active = true;
        });

        this.NormalWinLabel.string = GameManager.Instance().Net.myActor().name;
        this.FinalWinLabel.string = GameManager.Instance().Net.myActor().name;
    }

    start () {
        

    }

    hideAll(){
        this.NormalWinNode.active = false;
        this.LoseNode.active = false;
        this.FinalWinNode.active = false;
        this.InfoNode.active = false;
        this.GoodByeNode.active = false;
        this.LeaderboardNode.active = false;
    }

    showNormalWin(){
        this.hideAll();
        this.NormalWinNode.active = true;
    }

    showLose(){
        this.hideAll();
        this.LoseNode.active = true;
    }

    showFinalWin(){
        this.hideAll();
        this.FinalWinNode.active = true;
    }

    // update (dt) {}
}

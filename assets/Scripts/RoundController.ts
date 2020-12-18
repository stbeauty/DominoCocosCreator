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
import GameManager from "./GameManager";
import PlayInfo from "./Network/PlayInfo";
import RoundResultInfo from "./Network/RoundResultInfo";
import StartInfo from "./Network/StartInfo";
import SyncLogic from "./Network/SyncLogic";
import Player from "./Player";
import ResultController from "./ResultController";
import { RoundState } from "./RoundState";
import Dealer from "./Support/Dealer";
import Tools from "./Tools";
import User from "./User";

enum EventCode {
    START,
    DOMINO_PACK,
    TURN,
    PLAY,
    ROUND_END,
}
@ccclass
export default class RoundController extends cc.Component {
    isTesting: boolean = false;

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

    @property(User)
    LeftPlayer: User = null;
    @property(User)
    TopPlayer: User = null;
    @property(User)
    RightPlayer: User = null;
    @property(Player)
    Player: Player = null;

    @property(cc.Node)
    LoadingNode: cc.Node = null;

    @property(ResultController)
    ResultCtrl: ResultController = null;

    OtherPlayers: User[] = [];
    PlayingPlayers: User[] = [];


    @property(cc.Button)
    ManualStart: cc.Button = null;
    @property(cc.Button)
    NextRoundBtn: cc.Button = null;

    @property(cc.Button)
    FakeWin: cc.Button = null;
    @property(cc.Button)
    FakeLose: cc.Button = null;

    @property(Dealer)
    DomiDealer: Dealer = null;

    Net: PhotonClient = null;

    isHost: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    @property(cc.RichText)
    statusTxt: cc.RichText = null;

    state: RoundState = RoundState.STAND_BY;
    TIMEINTERVAL: number = 10;

    currentPlayer: number = 0;
    countDown: number = 0;

    fakeLoading: number = 0;
    fakeWintime: number = 0;

    isPlayerTurn: boolean = false;


    onLoad() {
        this.initDeck();

        this.DomiButtons.forEach(btn => btn.RoundControl = this);

        this.Net = GameManager.Instance().Net;

        this.OtherPlayers.push(this.LeftPlayer);
        this.OtherPlayers.push(this.TopPlayer);
        this.OtherPlayers.push(this.RightPlayer);

        this.OtherPlayers.forEach(player => player.node.active = false);
    }

    onTouchStart(touch, event) {
        this.PlayerDomino.node.active = true;

        this.PlayerDomino.node.position = this.node.convertToNodeSpaceAR(touch.getLocation());
        this.PlayerDomino.liftUp();
    }

    onTouchMove(touch, event) {
        this.PlayerDomino.node.position = this.node.convertToNodeSpaceAR(touch.getLocation());

        var align = this.Desk.getClosestAlignment(this.PlayerDomino.ID, touch.getLocation());

        this.PlayerDomino.node.opacity = 255;
        if (align)
            this.PlayerDomino.rotate(Domino.findAngle(this.PlayerDomino.ID, align));
        else {
            if (this.Desk.LogicList.length > 0)
                this.PlayerDomino.node.opacity = 128;
        }

    }

    onTouchEnd(touch, event) {

        if (this.isPlayerTurn) {
            var align = this.Desk.getClosestAlignment(this.PlayerDomino.ID, touch.getLocation());

            if (align) {
                var playInfo: PlayInfo = new PlayInfo();
                playInfo.alignID = align.ID;
                playInfo.dominoID = this.PlayerDomino.ID;

                //this.Net.raiseEvent(EventCode.PLAY, playInfo);

                this.onlPlay(playInfo, this.Net.myActor().actorNr);

            } else {

                if (this.Desk.LogicList.length == 0) {

                    var playInfo: PlayInfo = new PlayInfo();

                    playInfo.dominoID = this.PlayerDomino.ID;

                   // this.Net.raiseEvent(EventCode.PLAY, playInfo);

                    this.onlPlay(playInfo, this.Net.myActor().actorNr);

                } else {
                    this.PlayerDomino.returnToOriginal();
                }
            }
        } else
            this.PlayerDomino.returnToOriginal();
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

        this.ManualStart.node.on('click', () => {

            if (this.isTesting) {
                this.isPlayerTurn = true;
                this.DomiButtons.forEach(btn => btn.setDomino(this.drawDonimo()));
                this.Player.parsePack(null);
                return;
            }
            this.ManualStart.node.active = false;

            this.Net.myRoom().setIsOpen(false);
            

            this.prepareAndStart();

        });

        this.NextRoundBtn.node.active = false;

        this.NextRoundBtn.node.on('click', () =>{
            this.NextRoundBtn.node.active = false;
            this.prepareAndStart();
        })

        this.PlayerDomino.node.active = false;
        this.statusTxt.string = "<outline color=black width=4><b>Waiting other players...</b></outline>";
        this.state = RoundState.STAND_BY;

        console.log(this.Net.myActor().name);

        this.Player.reset(this.Net.myActor().name);
        this.Player.netActor = this.Net.myActor();
        this.updatePlayerCount();

        this.Net.onActorJoin = () => {
            this.updatePlayerCount();
        }
        this.Net.onActorLeave = () => {
            this.updatePlayerCount();
        }

        this.onEventSetup();

        this.ResultCtrl.RoundCtrl = this;

        this.FakeWin.node.on("click", () => {
            this.fakeWintime++;
            this.ResultCtrl.node.active = true;
            if (this.fakeWintime <= 1)
                this.ResultCtrl.showNormalWin();
            else
                this.ResultCtrl.showFinalWin();
        })


        this.FakeLose.node.on("click", () => {
            this.ResultCtrl.node.active = true;
            this.ResultCtrl.showLose();
        })

        this.ResultCtrl.node.active = false;
        this.startLoading();

    }

    prepareAndStart(){
        
        this.Net.raiseEvent(EventCode.START);
            this.onlStart();
        
            this.initDeck();
        
        var pack1: string[] = [];
        var pack2: string[] = [];
        var pack3: string[] = [];
        var pack4: string[] = [];
        for (var i = 0; i < 7; i++) {
            pack1.push(this.drawDonimo());
            pack2.push(this.drawDonimo());
            pack3.push(this.drawDonimo());
            pack4.push(this.drawDonimo());
        }

        var startInfo = new StartInfo();
            startInfo.actor = this.Player.netActor.actorNr;
            startInfo.dominoes = pack1;
            this.Net.raiseEvent(EventCode.DOMINO_PACK, startInfo);
            this.onlDominoPack(startInfo);


        if (this.LeftPlayer.netActor) {
            startInfo = new StartInfo();
            startInfo.actor = this.LeftPlayer.netActor.actorNr;
            startInfo.dominoes = pack2;
            this.Net.raiseEvent(EventCode.DOMINO_PACK, startInfo);
            this.onlDominoPack(startInfo);

        }
        if (this.TopPlayer.netActor) {
            startInfo = new StartInfo();
            startInfo.actor = this.TopPlayer.netActor.actorNr;
            startInfo.dominoes = pack3;
            this.Net.raiseEvent(EventCode.DOMINO_PACK, startInfo);
            this.onlDominoPack(startInfo);
        }
        if (this.RightPlayer.netActor) {
            startInfo = new StartInfo();
            startInfo.actor = this.RightPlayer.netActor.actorNr;
            startInfo.dominoes = pack4;
            this.Net.raiseEvent(EventCode.DOMINO_PACK, startInfo);
            this.onlDominoPack(startInfo);
        }


        

    }

    onlStart() {
        this.state = RoundState.SHUFFLE;

        // Reseting things
        this.Desk.clear();
        this.PlayingPlayers = [];
        this.DomiButtons.forEach(button => button.reset());
        
        GameManager.Instance().resetGame();
        this.isPlayerTurn = false;
        // ------------------------------
        
        this.statusTxt.node.active = false;

        this.PlayingPlayers.push(this.Player);
        if (this.LeftPlayer.netActor)
            this.PlayingPlayers.push(this.LeftPlayer);
        if (this.TopPlayer.netActor)
            this.PlayingPlayers.push(this.TopPlayer);
        if (this.RightPlayer.netActor)
            this.PlayingPlayers.push(this.RightPlayer);

        this.PlayingPlayers.forEach (player => {
            player.closeHand();
        });
    }

    onlDominoPack(info:StartInfo) {
        //this.statusTxt.string = "<outline color=black width=4><b>Waiting other players...</b></outline>";
        this.statusTxt.node.active = false;
        this.state = RoundState.DEAL;

        this.PlayingPlayers.forEach (player => {
            if (player.netActor.actorNr == info.actor){
                player.sync.setDominoes(info.dominoes);
            }
        })

        if (info.actor == this.Player.netActor.actorNr){
            this.countDown = 12;
            this.DomiDealer.StartShuffling(()=>{
                this.parseDominoPack(info.dominoes);
            })
        }
                    

        
    }

    onlTurn(actor: number) {
        this.state = RoundState.PLAYING;
        this.statusTxt.node.active = false;

        this.isPlayerTurn = actor == this.Net.myActor().actorNr;
        this.PlayingPlayers.forEach(player => player.stopCountDown());

        if (this.isPlayerTurn) {

            this.Player.startCountDown(10);
        }
        else {
            this.OtherPlayers.forEach(player => { if (player.netActor && player.netActor.actorNr == actor) player.startCountDown(10) });
            if (this.PlayerDomino.node.active && this.isHost == false)
                this.PlayerDomino.returnToOriginal();
        }
    }

    onlPlay(playInfo: PlayInfo, actor: number) {
        var domi = this.Desk.Instantiate(playInfo.dominoID, playInfo.alignID);
        if (this.isPlayerTurn){
            var score = this.Desk.calculateScore();

            if (this.Player.sync.points == 0 && score == 10){

            } else if (this.Player.sync.points > 0 && score % 5 == 0){

            } else
                score = 0;
            
                playInfo.points = score;
                this.Net.raiseEvent(EventCode.PLAY, playInfo);
        }



        var align = this.Desk.findAlignWithID(playInfo.alignID);

        if (actor != this.Net.myActor().actorNr) {

            domi.node.opacity = 255;
            this.Desk.prepareRealign();
            this.Desk.realign();
        } else {

            this.Desk.prepareRealign();
            this.PlayerDomino.placeDown(align?Tools.WorldPos(align).add(this.Desk.targetAlignPos):Tools.WorldPos(this.Desk.node), this.Desk.targetAlignScale, playInfo.points, () => {
                domi.node.opacity = 255;
                

            });

            this.Desk.realign();
        }

        this.PlayingPlayers.forEach (player => {
            if (player.netActor.actorNr == actor){
                player.sync.points += playInfo.points;
                player.Houses.SetScore(player.sync.points);
                player.sync.play(playInfo.dominoID);
            }
        });


        if (this.isHost) {
            if (this.checkEndRound()){
                this.callEndRound();
            } else
                this.nextPlayerTurn();
        }
    }

    onlRoundEnd(info:RoundResultInfo){
        this.PlayingPlayers.forEach(player => {
            player.stopCountDown();
            player.showHand();
            if (player.netActor.actorNr == info.winActor){
                player.sync.points += info.winPoint;
                player.Houses.SetScore(player.sync.points);
            }
        });
        this.state = RoundState.END;
        if (this.isHost)
            this.NextRoundBtn.node.active = true;
    }

    onEventSetup() {
        this.Net.onEvent = (code, content, actorNR) => {
            console.log(code.toString());

            switch (code) {
                case EventCode.START:
                    this.onlStart();
                    break;
                case EventCode.DOMINO_PACK:
                    this.onlDominoPack(content);
                    break;

                case EventCode.TURN:
                    this.onlTurn(content)
                    break;
                case EventCode.PLAY:
                    this.onlPlay(content, actorNR);
                    break;
                    case EventCode.ROUND_END:
                        console.log(content);
                        
                        this.onlRoundEnd(content);
                        break;
            }
        };
    }

    parseDominoPack(pack: string[]) {
        this.Player.parsePack(null);

        this.OtherPlayers.forEach(player => {
            if (player.netActor != null) player.parsePack(null);
        });

        for (var i = 0; i < pack.length; i++)
            this.DomiButtons[i].setDomino(pack[i]);
    }

    updatePlayerCount() {
        if (this.isTesting) {
            this.ManualStart.node.active = true;
            return;
        }
        this.isHost = (this.Net.myRoomMasterActorNr() == this.Net.myActor().actorNr);
        this.ManualStart.node.active = (this.Net.myRoomActorCount() > 1 && this.isHost && this.state == RoundState.STAND_BY);
        if (this.Net.myRoomActorCount() > 1)
            this.updatePlayerPosition();
    }

    updatePlayerPosition() {
        console.log("UpdatePlayerPosition");

        if (this.state != RoundState.STAND_BY)
            return;

        var players: Photon.LoadBalancing.Actor[] = this.Net.myRoomActorsArray();
        //var m:Photon.LoadBalancing.Actor[]

        if (players.length == 1)
            return;


        var sortedPlayers: Photon.LoadBalancing.Actor[] = players.sort((obj1, obj2) => {
            if (obj1.actorNr < obj2.actorNr) {
                return 1;
            }

            if (obj1.actorNr > obj2.actorNr) {
                return -1;
            }

            return 0;
        });


        var anchorIdx = 0;
        for (var i = 0; i < sortedPlayers.length; i++) {
            if (sortedPlayers[i].actorNr == this.Net.myActor().actorNr) {

                anchorIdx = i;
                break;
            }
        }


        this.LeftPlayer.node.active = false;
        this.LeftPlayer.netActor = null;
        this.TopPlayer.node.active = false;
        this.TopPlayer.netActor = null;
        this.RightPlayer.node.active = false;
        this.RightPlayer.netActor = null;

        anchorIdx++; if (anchorIdx >= sortedPlayers.length) anchorIdx = 0;

        if (sortedPlayers.length == 2) {

            this.TopPlayer.node.active = true;
            this.TopPlayer.reset(sortedPlayers[anchorIdx].name);
            this.TopPlayer.netActor = sortedPlayers[anchorIdx];
            return;
        } else {
            this.LeftPlayer.node.active = true;
            this.LeftPlayer.reset(sortedPlayers[anchorIdx].name);
            this.LeftPlayer.netActor = sortedPlayers[anchorIdx];
            if (players.length >= 3) {

                anchorIdx++; if (anchorIdx >= sortedPlayers.length) anchorIdx = 0;
                this.TopPlayer.node.active = true;
                this.TopPlayer.reset(sortedPlayers[anchorIdx].name);
                this.TopPlayer.netActor = sortedPlayers[anchorIdx];
            }

            if (players.length >= 4) {

                anchorIdx++; if (anchorIdx >= sortedPlayers.length) anchorIdx = 0;
                this.RightPlayer.node.active = true;
                this.RightPlayer.reset(sortedPlayers[anchorIdx].name);
                this.RightPlayer.netActor = sortedPlayers[anchorIdx];
            }
        }
    }

    startLoading() {
        this.ResultCtrl.node.active = false;
        this.LoadingNode.active = true;
        this.fakeLoading = 3;
    }


    update(dt) {
        if (this.state == RoundState.PLAYING) {
            if (this.isHost) {
                if (this.countDown > 0) {
                    this.countDown -= dt;
                    if (this.countDown <= 0) {
                        this.nextPlayerTurn();
                        this.countDown = 10;
                    }
                }
            }
        } else if (this.state == RoundState.DEAL) {
            if (this.countDown > 0) {
                this.countDown -= dt;
                if (this.countDown <= 0) {
                    if (this.isHost) {
                        this.Net.raiseEvent(EventCode.TURN, this.Net.myActor().actorNr);
                        this.currentPlayer = this.Net.myActor().actorNr;
                        this.countDown = 10;
                        this.onlTurn(this.currentPlayer);
                    }
                    
                } else if (this.countDown <= 1) {
                    this.statusTxt.string = "<outline color=black width=4><b>GO!</b></outline>";
                }
                else if (this.countDown <= 4) {
                    this.statusTxt.string = "<outline color=black width=4><b>" + Math.floor(this.countDown) + "</b></outline>";
                } else if (this.countDown <= 5) {
                    if (this.statusTxt.node.active == false) {
                        this.statusTxt.node.active = true;
                        this.statusTxt.string = "<outline color=black width=4><b>READY!</b></outline>";
                    }
                }
            }
        }


        if (this.LoadingNode.active) {
            if (this.fakeLoading <= 0) {
                this.LoadingNode.active = false;
            }
            if (this.fakeLoading > 0)
                this.fakeLoading -= dt;
        }
    }

    nextPlayerTurn() {
        if (this.countDown <= 0 && this.PlayerDomino.node.active)
            this.PlayerDomino.returnToOriginal();
        this.countDown = 0;

        for (var i = 0; i < this.PlayingPlayers.length; i++)
            if (this.currentPlayer == this.PlayingPlayers[i].netActor.actorNr)
                break;

        i++;
        if (i >= this.PlayingPlayers.length)
            i = 0;

        var next = this.PlayingPlayers[i];

        this.countDown = 10;
        next.startCountDown(10);
        this.currentPlayer = next.netActor.actorNr;
        this.Net.raiseEvent(EventCode.TURN, this.currentPlayer);
        this.onlTurn(this.currentPlayer);
    }

    checkEndRound() : boolean{

        console.log("CheckEdnRound");
        for (var i = 0; i < this.PlayingPlayers.length; i++)
            if (this.PlayingPlayers[i].sync.isFinished())
                return true;

        var activeID = this.Desk.findActiveID();
        console.log(activeID);
        

        for (var i = 0; i < this.PlayingPlayers.length; i++)
            if (this.PlayingPlayers[i].sync.canStillPlay(activeID))
                return false;

        return true;
    }

    callEndRound(){
        this.PlayingPlayers.forEach(player => {
            player.sync.calculatePoints();
        })

        var idx = 0;
        var lowest = this.PlayingPlayers[0].sync.endGamePoints;

        for (var i = 1; i < this.PlayingPlayers.length; i++)
            if (this.PlayingPlayers[i].sync.endGamePoints < lowest){
                idx = i;
                lowest = this.PlayingPlayers[i].sync.endGamePoints;
            }

        var winPoints = 0;
        for (var i = 0; i < this.PlayingPlayers.length; i++)
            if (i != idx){
                winPoints += this.PlayingPlayers[i].sync.endGamePoints;
            }

        var roundResult = new RoundResultInfo();
        roundResult.winActor = this.PlayingPlayers[idx].netActor.actorNr;
        roundResult.winPoint = Math.floor(winPoints / 5) * 5;

        if (winPoints % 5 > 2)
            roundResult.winPoint += 5;

        this.Net.raiseEvent(EventCode.ROUND_END, roundResult);
        this.onlRoundEnd(roundResult);

    }

}

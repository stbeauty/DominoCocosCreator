// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import { Direction } from "./Direction";
import Domino from "./Domino";
import DominoButton from "./DominoButton";
import DominoDesk from "./DominoDesk";
import GameManager from "./GameManager";
import PlayInfo from "./Network/PlayInfo";
import RoundResultInfo from "./Network/RoundResultInfo";
import StartInfo from "./Network/StartInfo";
import Player from "./Player";
import ResultController from "./ResultController";
import { RoundState } from "./RoundState";
import Dealer from "./Support/Dealer";
import Tools from "./Tools";
import User from "./User";

enum EventCode {
    START,
    SELECTTING,
    SUBMIT_PACK,
    DOMINO_PACK,
    TURN,
    PLAY,
    ROUND_END,
    GAME_END,
    CHANGE_HOST,
    RESUME_BROWSER,
    PREPARING_NEXT_ROUND,
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
    LastWinner: User = null;

    @property(cc.Button)
    ManualStart: cc.Button = null;

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

    currentPlayer: number = 0;
    countDown: number = 0;

    fakeLoading: number = 0;
    fakeWintime: number = 0;

    isPlayerTurn: boolean = false;

    GameInitiated: boolean = false;



    onLoad() {
        this.initDeck();

        this.DomiButtons.forEach(btn => btn.RoundControl = this);

        this.Net = GameManager.Instance().Net;

        this.OtherPlayers.push(this.LeftPlayer);
        this.OtherPlayers.push(this.TopPlayer);
        this.OtherPlayers.push(this.RightPlayer);

        this.OtherPlayers.forEach(player => player.node.active = false);
        this.DomiDealer.RoundCtrl = this;
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

    removeDeck(deck: string[]) {
        deck.forEach(ID => {
            for (var i = 0; i < this.Deck.length; i++)
                if (ID == this.Deck[i]) {
                    this.Deck.splice(i, 1);
                    return;
                }
        })
    }

    start() {

        cc.game.pause = () => {
            if (this.isHost){
                for (var i = 0; i < this.PlayingPlayers.length; i++)
                    if (this.PlayingPlayers[i].netActor != null && this.PlayingPlayers[i].netActor.actorNr != this.Player.netActor.actorNr && this.PlayingPlayers[i].isMinimized == false){
                        this.Net.raiseEvent(EventCode.CHANGE_HOST, this.PlayingPlayers[i].netActor.actorNr);
                        this.onlChangeHost( this.PlayingPlayers[i].netActor.actorNr, -1)
                        return;
                    }
            }
        };
        cc.game.resume =() =>{
            this.Net.raiseEvent(EventCode.RESUME_BROWSER);
        }

        cc.game.setFrameRate(50);

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

    receiveCardDeck(deck: string[]) {
        this.Net.raiseEvent(EventCode.SUBMIT_PACK, deck);
        this.onlDeckSubmit(this.Player.netActor.actorNr, deck);
    }

    prepareAndStart() {

        this.Net.raiseEvent(EventCode.START);
        this.onlStart();

        this.initDeck();

        if (this.LastWinner != null) {
            this.Net.raiseEvent(EventCode.SELECTTING, this.LastWinner.netActor.actorNr);
            this.onlSelecting(this.LastWinner.netActor.actorNr);

            return;
        }
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
        this.GameInitiated = true;
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

        this.PlayingPlayers.forEach(player => {
            player.closeHand();
        });
    }

    onlChangeHost(host: number, inactive:number) {
        this.isHost = (host == this.Player.netActor.actorNr);
        this.PlayingPlayers.forEach (player => {
            if (player.netActor.actorNr == inactive)
                player.isMinimized = true;
        })
    }

    onlDominoPack(info: StartInfo) {
        //this.statusTxt.string = "<outline color=black width=4><b>Waiting other players...</b></outline>";
        this.statusTxt.node.active = false;
        this.state = RoundState.DEAL;

        this.PlayingPlayers.forEach(player => {
            if (player.netActor.actorNr == info.actor) {
                player.sync.setDominoes(info.dominoes);
            }
        })

        if (info.actor == this.Player.netActor.actorNr) {
            this.countDown = 12;
            this.DomiDealer.StartShuffling(() => {
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

            this.Player.startCountDown(GameManager.TURNTIME);

            if (this.Desk.LogicList.length > 0)
                if (this.Player.sync.canStillPlay(this.Desk.findActiveID()) == false) {
                    // Skip turn
                    this.Net.raiseEvent(EventCode.PLAY, null);
                    this.onlPlay(null, this.Player.netActor.actorNr);
                }
        }
        else {
            this.OtherPlayers.forEach(player => { if (player.netActor && player.netActor.actorNr == actor) player.startCountDown(GameManager.TURNTIME) });
            if (this.PlayerDomino.node.active && this.isHost == false)
                this.PlayerDomino.returnToOriginal();
        }
    }

    onlPlay(playInfo: PlayInfo, actor: number) {

        if (playInfo == null) {
            // Skip turn
            if (this.isHost) {
                this.nextPlayerTurn();
            }
            return;
        }
        var domi = this.Desk.Instantiate(playInfo.dominoID, playInfo.alignID);
        if (this.isPlayerTurn) {
            var score = this.Desk.calculateScore();

            if (this.Player.sync.points == 0 && score == 10) {

            } else if (this.Player.sync.points > 0 && score % 5 == 0) {

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
            this.PlayerDomino.placeDown(align ? Tools.WorldPos(align).add(this.Desk.targetAlignPos) : Tools.WorldPos(this.Desk.node), this.Desk.targetAlignScale, playInfo.points, () => {
                domi.node.opacity = 255;


            });

            this.Desk.realign();
        }

        this.updateScore(actor, playInfo.points);


        this.PlayingPlayers.forEach(player => {
            if (player.netActor.actorNr == actor) {
                player.sync.play(playInfo.dominoID);
            }
        });


        if (this.isHost) {
            if (this.checkEndRound()) {
                this.callEndRound();
            } else
                this.nextPlayerTurn();
        }
    }

    updateScore(nr: number, points: number) {
        this.PlayingPlayers.forEach(player => {

            if (player.netActor.actorNr == nr) {
                player.sync.points += points;
                player.Houses.SetScore(player.sync.points);

                if (this.isHost) {
                    if (player.sync.points >= 300) {
                        this.Net.raiseEvent(EventCode.GAME_END, nr);
                        this.onlGameEnd(nr);
                    }
                }
            }
        });


    }

    onlGameEnd(winner: number) {
        this.ResultCtrl.node.active = true;
        if (winner == this.Player.netActor.actorNr)
            this.ResultCtrl.showFinalWin();
        else
            this.ResultCtrl.showLose();
        this.state = RoundState.FINISH;
    }

    onlRoundEnd(info: RoundResultInfo) {

        this.updateScore(info.winActor, info.winPoint);
        this.PlayingPlayers.forEach(player => {
            player.stopCountDown();
            player.showHand();

            if (player.netActor.actorNr == info.winActor) {
                if (info.winActor == this.Player.netActor.actorNr) {
                    GameManager.Instance().statusBar.Show("You won this round and earned " + info.winPoint + " points");
                } else {
                    GameManager.Instance().statusBar.Show(player.netActor.name + " won this round and earned " + info.winPoint + " points");
                }
            }
        });
        if (info.winActor < 0) {
            GameManager.Instance().statusBar.Show("Nobody won this round, reshuffling...");
        }
        this.state = RoundState.END;
        if (this.isHost){
            //this.NextRoundBtn.node.active = true;
            this.Net.raiseEvent(EventCode.PREPARING_NEXT_ROUND);
            this.onlPrepareNextRound();
        }
    }

    onlPrepareNextRound(){
        this.state = RoundState.PREPARING_NEXT_ROUND;
        this.countDown = 5;
        this.statusTxt.node.active = true;
        this.statusTxt.string = this.statusTxt.string = "<outline color=black width=4><b>Next hand in 5</b></outline>";
    }

    onlSelecting(actor: number) {
        this.DomiDealer.turnOnCardSelect(actor != this.Player.netActor.actorNr);
        this.PlayingPlayers.forEach(player => {
            if (player.netActor.actorNr == actor) {
                if (actor == this.Player.netActor.actorNr) {
                    GameManager.Instance().statusBar.Show("Please select 7 dominoes for your hand");
                } else {
                    GameManager.Instance().statusBar.Show("Please wait for " + player.netActor.name + " to choose his dominoes");
                }
            }
        });
    }



    onlDeckSubmit(actor: number, deck: string[]) {

        if (actor == this.Player.netActor.actorNr) {
            this.DomiDealer.AnimateGetTiles(() => {
                this.parseDominoPack(deck);
            })

        } else {
            var direction: Direction = Direction.TOP;
            if (this.LeftPlayer.netActor && this.LeftPlayer.netActor.actorNr == actor)
                direction = Direction.LEFT;
            if (this.RightPlayer.netActor && this.RightPlayer.netActor.actorNr == actor)
                direction = Direction.RIGHT;

            this.DomiDealer.EndSelecting(direction);

        }

        if (this.isHost) {
            this.removeDeck(deck);
            var pack1: string[] = deck;
            var packs: string[][] = [];
            packs.push([]);
            packs.push([]);
            packs.push([]);
            for (var i = 0; i < 7; i++) {
                packs[0].push(this.drawDonimo());
                packs[1].push(this.drawDonimo());
                packs[2].push(this.drawDonimo());
            }

            var startInfo = new StartInfo();
            startInfo.actor = actor;
            startInfo.dominoes = pack1;
            this.Net.raiseEvent(EventCode.DOMINO_PACK, startInfo);
            this.onlDominoPack(startInfo);

            var packIDX = 0;
            this.PlayingPlayers.forEach(player => {
                if (player.netActor && player.netActor.actorNr == actor)
                    return;
                startInfo = new StartInfo();
                startInfo.actor = player.netActor.actorNr;
                startInfo.dominoes = packs[packIDX];
                this.Net.raiseEvent(EventCode.DOMINO_PACK, startInfo);
                this.onlDominoPack(startInfo);
                packIDX++;
            });

        }
    }

    onEventSetup() {
        this.Net.onEvent = (code, content, actorNR) => {
            console.log(code.toString());

            switch (code) {
                case EventCode.START:
                    this.onlStart();
                    break;
                case EventCode.SELECTTING:
                    this.onlSelecting(content);
                    break;
                case EventCode.SUBMIT_PACK:
                    this.onlDeckSubmit(actorNR, content);
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
                case EventCode.GAME_END:
                    this.onlGameEnd(content);
                    break;
                    case EventCode.CHANGE_HOST:
                        this.onlChangeHost(content, actorNR);
                        break;
                        case EventCode.RESUME_BROWSER:{
                            this.PlayingPlayers.forEach(player => {
                                if (player.netActor.actorNr == actorNR)
                                    player.isMinimized = false;
                            })
                            break;
                        }
                        case EventCode.PREPARING_NEXT_ROUND:
                            this.onlPrepareNextRound();
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
        this.fakeLoading = 1;
    }

    findPlayerWithDomino(ID: string): User {
        var result: User = null;

        this.PlayingPlayers.forEach(player => {
            player.sync.dominoes.forEach(domi => {
                if (domi == ID)
                    result = player;
            })
        })

        return result;
    }


    update(dt) {
        if (this.state == RoundState.PLAYING) {
            if (this.isHost) {
                if (this.countDown > 0) {
                    this.countDown -= dt;
                    if (this.countDown <= 0) {
                        this.nextPlayerTurn();
                        this.countDown = GameManager.TURNTIME;
                    }
                }
            }
        } else if (this.state == RoundState.DEAL) {
            if (this.countDown > 0) {
                this.countDown -= dt;
                if (this.countDown <= 0) {
                    if (this.isHost) {
                        var NR = 0;
                        if (this.LastWinner != null)
                            NR = this.LastWinner.netActor.actorNr;
                        else {
                            NR = this.Player.netActor.actorNr;
                            var idx = 6;
                            var first: User = null;
                            while (first == null && idx >= 0) {
                                first = this.findPlayerWithDomino("" + idx + "" + idx);
                                idx--;
                            }
                            if (first != null)
                                NR = first.netActor.actorNr;
                        }



                        this.Net.raiseEvent(EventCode.TURN, NR);
                        this.currentPlayer = NR;
                        this.countDown = GameManager.TURNTIME;
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
        } else if (this.state == RoundState.PREPARING_NEXT_ROUND){
            this.countDown -= dt;
            if (this.countDown > 0)
                this.statusTxt.string = this.statusTxt.string = "<outline color=black width=4><b>Next hand in "+ Math.floor(this.countDown) + "</b></outline>";
                else {
                    this.statusTxt.node.active = false;
                    if (this.isHost){
                        this.prepareAndStart();
                    }
                }
        }


        if (this.LoadingNode.active) {
            if (this.fakeLoading <= 0) {
                this.LoadingNode.active = false;
                GameManager.Instance().ShowOKPopup("Caution!", "Please keep your browser opened and your game active during the game session", null);
            }
            if (this.fakeLoading > 0)
                this.fakeLoading -= dt;
        }

        if (this.GameInitiated) {
            if (GameManager.Instance().gameTime > 0)
                GameManager.Instance().gameTime -= dt;
            if (GameManager.Instance().gameTime < 0) {
                GameManager.Instance().gameTime = 0;

                if (this.isHost) {
                    var winner: User = this.Player;
                    this.PlayingPlayers.forEach(player => {
                        if (player.sync.points > winner.sync.points)
                            winner = player;
                    });
                    this.Net.raiseEvent(EventCode.GAME_END, winner.netActor.actorNr);
                    this.onlGameEnd(winner.netActor.actorNr);
                }
            }
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

        this.countDown = GameManager.TURNTIME;
        next.startCountDown(GameManager.TURNTIME);
        this.currentPlayer = next.netActor.actorNr;
        this.Net.raiseEvent(EventCode.TURN, this.currentPlayer);
        this.onlTurn(this.currentPlayer);
    }

    checkEndRound(): boolean {

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

    callEndRound() {
        this.PlayingPlayers.forEach(player => {
            player.sync.calculatePoints();
        })

        var idx = 0;
        var lowest = this.PlayingPlayers[0].sync.endGamePoints;

        for (var i = 1; i < this.PlayingPlayers.length; i++)
            if (this.PlayingPlayers[i].sync.endGamePoints < lowest) {
                idx = i;
                lowest = this.PlayingPlayers[i].sync.endGamePoints;
            }

        var winPoints = 0;
        var roundResult = new RoundResultInfo();
        roundResult.winActor = -1;

        this.LastWinner = this.PlayingPlayers[idx];

        if (this.LastWinner.sync.points > 0) {
            for (var i = 0; i < this.PlayingPlayers.length; i++)
                if (i != idx) {
                    winPoints += this.PlayingPlayers[i].sync.endGamePoints;
                }


            roundResult.winActor = this.PlayingPlayers[idx].netActor.actorNr;
            roundResult.winPoint = Math.floor(winPoints / 5) * 5;

            if (winPoints % 5 > 2)
                roundResult.winPoint += 5;
        } else {
            this.LastWinner = null;
        }

        this.Net.raiseEvent(EventCode.ROUND_END, roundResult);
        this.onlRoundEnd(roundResult);

    }



}

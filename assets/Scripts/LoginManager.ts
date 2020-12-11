// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "./GameManager";


const {ccclass, property} = cc._decorator;

enum LoginState{
    IDLE,
    LOGGED_IN,
    JOINED_IN,
}
@ccclass
export default class LoginManager extends cc.Component {

    @property(cc.Sprite)
    logo: cc.Sprite = null;

    @property(cc.Node)
    LoginNode: cc.Node = null;

    @property(cc.Node)
    MainMenuNode: cc.Node = null;

    @property(cc.Button)
    LoginBtn: cc.Button = null;

    @property(cc.Button)
    PlayBtn: cc.Button = null;

    state:LoginState = LoginState.IDLE;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.LoginNode.active = false;
        this.MainMenuNode.active = false;

        this.logo.node.active = true;
        this.logo.node.opacity = 0;
        this.logo.node.runAction(cc.sequence(cc.fadeIn(1.0), cc.delayTime(1.0), cc.fadeOut(1.0), cc.callFunc(
            ()=>{
                
                this.LoginNode.active = true;
                this.logo.node.active = false;
                this.LoginNode.opacity = 0;
                this.LoginNode.runAction(cc.fadeIn(1.0));
            }
        )));

            //var Game:GameManager = new GameManager();
            //Game.Connect();
            //var photon = new PhotonClient();
            //photon.connectToRegionMaster("EU");

        this.LoginBtn.node.on('click',()=>{

             //if (GameManager.Instance().Net.IsLogginPressed())
              //   return;

                 GameManager.Instance().Net.myActor().setName("ABC");

            // NetClient.DConnect;
            
            GameManager.Instance().Net.DConnect();

            
        });

        this.PlayBtn.node.on('click', ()=>{
            if (GameManager.Instance().Net.availableRooms.length > 0)
            GameManager.Instance().Net.joinRandomRoom();
                else
                GameManager.Instance().Net.createRoom(GameManager.Instance().Net.myActor().name);
        });
    }

    update (dt) {
        switch (this.state){
            case LoginState.IDLE:
                if (GameManager.Instance().Net.isInLobby()){
                    this.LoginNode.active = false;
                    this.MainMenuNode.active = true;
                    this.state = LoginState.LOGGED_IN;
                }
                break;
                case LoginState.LOGGED_IN:
                    if (GameManager.Instance().Net.isJoinedToRoom()){
                        cc.director.loadScene("Main");
                        this.state = LoginState.JOINED_IN;
                    }
                break;
        }

    }
}

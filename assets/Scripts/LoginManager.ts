// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameAPI from "./GameAPI";
import GameManager from "./GameManager";


const { ccclass, property } = cc._decorator;

enum LoginState {
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

    // HELP 
    @property(cc.Button)
    HelpBtn: cc.Button = null;
    @property(cc.Button)
    HelpBackBtn: cc.Button = null;
    @property(cc.Button)
    Append1Btn: cc.Button = null;
    @property(cc.Button)
    Append2Btn: cc.Button = null;
    @property(cc.Button)
    AppendiceBtn: cc.Button = null;
    @property(cc.Node)
    HelpNode: cc.Node = null;
    @property(cc.Node)
    AppendiceNode: cc.Node = null;
    @property(cc.Node)
    RulesNode: cc.Node = null;
    @property(cc.Node)
    Append1Node: cc.Node = null;
    @property(cc.Node)
    Append2Node: cc.Node = null;
    @property(cc.Label)
    Append1Label:cc.Label = null;
    @property(cc.Label)
    Append2Label:cc.Label = null;
    //---- END HELP

    // SETTING
    @property(cc.Button)
    SettingBtn: cc.Button = null;
    @property(cc.Button)
    SettingBackBtn: cc.Button = null;
    @property(cc.Button)
    PrivacyBtn: cc.Button = null;
    @property(cc.Button)
    SoundBtn: cc.Button = null;
    @property(cc.Node)
    SoundOnNode: cc.Node = null;
    @property(cc.Node)
    SoundOffNode: cc.Node = null;
    @property(cc.Node)
    SettingNode: cc.Node = null;
    // --- END SETTING

    state: LoginState = LoginState.IDLE;

    @property(cc.EditBox)
    PlayerName: cc.EditBox = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    async start() {

        // var content:any = {};
        // content.name = "Domino";
        // content.plateform = "HTML5";
        // content.android_bundleId = null;
        // content.Ios_bundleId = null;
        // var response = await GameManager.Request(GameAPI.GAME_DETAIL, content);
        // console.log(response);
        

        this.LoginNode.active = false;
        this.MainMenuNode.active = false;
        this.HelpNode.active = false;

        this.logo.node.active = true;
        this.logo.node.opacity = 0;
        this.logo.node.runAction(cc.sequence(cc.fadeIn(1.0), cc.delayTime(1.0), cc.fadeOut(1.0), cc.callFunc(
            () => {

                this.LoginNode.active = true;
                this.logo.node.active = false;
                this.LoginNode.opacity = 0;
                this.LoginNode.runAction(cc.fadeIn(1.0));
            }
        )));
        
        // Help
        this.HelpBackBtn.node.on('click', () => {
            if (this.RulesNode.active == true) {
                this.MainMenuNode.active = true;
                this.HelpNode.active = false;
            } else {
                this.RulesNode.active = true;
                this.AppendiceNode.active = false;
            }

            
        });
        this.HelpBtn.node.on('click', () => {
            this.MainMenuNode.active = false;
            this.HelpNode.active = true;
        });
        this.AppendiceBtn.node.on('click', () => {
            this.RulesNode.active = false;
            this.AppendiceNode.active = true;
        });
        this.Append1Btn.node.on('click', () => {
            this.Append1Node.active = true;
            this.Append2Node.active = false;
            this.Append1Label.enableUnderline = true;
            this.Append2Label.enableUnderline = false;
        });
        this.Append2Btn.node.on('click', () => {
            this.Append1Node.active = false;
            this.Append2Node.active = true;
            this.Append1Label.enableUnderline = false;
            this.Append2Label.enableUnderline = true;
        });
        // -- EndHelp

        // Setting
        this.SoundOnNode.active = GameManager.Instance().soundOn;
            this.SoundOffNode.active = !GameManager.Instance().soundOn;
            
        this.SettingBackBtn.node.on('click', () => {
            this.MainMenuNode.active = true;
            this.SettingNode.active = false;
        });
        this.SettingBtn.node.on('click', () => {
            this.MainMenuNode.active = false;
            this.SettingNode.active = true;
        });
        this.PrivacyBtn.node.on('click', () => {
            // To implement later
        });
        this.SoundBtn.node.on('click', () => {
            GameManager.Instance().soundOn = !GameManager.Instance().soundOn;
            this.SoundOnNode.active = GameManager.Instance().soundOn;
            this.SoundOffNode.active = !GameManager.Instance().soundOn;
        });

        // -- Setting End
        


        this.LoginBtn.node.on('click', () => {

            //if (GameManager.Instance().Net.IsLogginPressed())
            //   return;
            if (this.PlayerName.string == "") {
                var name = "Player" + Math.floor(Math.random() * 1000);
                GameManager.Instance().Net.myActor().setName(name);
            } else
                GameManager.Instance().Net.myActor().setName(this.PlayerName.string);

            // NetClient.DConnect;

            GameManager.Instance().Net.connectToRegionMaster("EU");

            //GameManager.Instance().statusBar.Show("This is nothing");

        });

        this.PlayBtn.node.on('click', () => {
            GameManager.Instance().JoinOrCreateRoom();
            cc.director.loadScene("Main");
            this.state = LoginState.JOINED_IN;
        });
    }

    update(dt) {
        switch (this.state) {
            case LoginState.IDLE:
                if (GameManager.Instance().Net.isInLobby()) {
                    this.LoginNode.active = false;
                    this.MainMenuNode.active = true;
                    this.state = LoginState.LOGGED_IN;
                }
                break;
            case LoginState.LOGGED_IN:
                if (GameManager.Instance().Net.isJoinedToRoom()) {
                    
                }
                break;
        }

    }
}

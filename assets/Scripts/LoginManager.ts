// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

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

        this.LoginBtn.node.on('click',()=>{
            this.LoginNode.active = false;
            this.MainMenuNode.active = true;
        });

        this.PlayBtn.node.on('click', ()=>{
            cc.director.loadScene("Main");
        });
    }

    // update (dt) {}
}

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "../GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StatusBar extends cc.Component {

    @property(cc.Label)
    Content: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        GameManager.Instance().statusBar = this;
        this.node.active = false;
    }

    Show(content: string){
        this.Content.string = content;
        this.node.active = true;
        this.node.opacity = 0;

        this.node.stopAllActions();
        this.node.runAction(cc.sequence(cc.fadeIn(0.5), cc.delayTime(5), cc.fadeOut(0.5), cc.callFunc(()=> this.node.active=false)));

    }

    start () {

    }

    // update (dt) {}
}

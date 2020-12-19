// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "../GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameTime extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt) {
        var time = GameManager.Instance().gameTime;
        var h = Math.floor(time / 60);
        var m = Math.floor(time % 60);

        var min:string = "";
        if (m < 10)
            min = "0";

        this.label.string = "" + h + ":" + min + m;
    }
}

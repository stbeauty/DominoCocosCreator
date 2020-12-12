// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DominoButton from "./DominoButton";
import User from "./User";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends User {

    @property({ type: [DominoButton] })
    DomiButtons: DominoButton[] = [];
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        //this.reset("");
    }

    // update (dt) {}
}

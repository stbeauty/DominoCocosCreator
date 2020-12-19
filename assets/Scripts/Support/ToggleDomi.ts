// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Domino from "../Domino";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ToggleDomi extends cc.Button {

    @property(cc.Node)
    Outline: cc.Node = null;

    @property(Domino)
    Domi:Domino = null;

    isToggled:boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.Outline.active = false;

    }

    start () {
        
    }

    toggle(){
        console.log("Toggle");
        
        this.isToggled = !this.isToggled;
        this.Outline.active = this.isToggled;
    }

    setToggle(toggle: boolean){
        this.isToggled = toggle;
        this.Outline.active = toggle;
    }

    // update (dt) {}
}

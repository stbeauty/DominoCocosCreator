// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import House from "./House";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HouseControl extends cc.Component {

    @property([House])
    Houses: House[] = [];

    SetScore(score:number){
        if (score <= 0){
            this.Houses.forEach(house => house.Disable());
            return;
        }
        
        var h = 50;
        for (var i = 0; i < this.Houses.length; i++){
            if (score <= h)
                {
                    this.Houses[i].Show(score);
                    return;
                } else {
                    this.Houses[i].Show(h);
                    h += 50;
                }
        }
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.SetScore(0);
    }

    // update (dt) {}
}

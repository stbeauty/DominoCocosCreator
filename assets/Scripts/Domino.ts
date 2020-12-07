// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Domino extends cc.Component {

    ID:string;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    setDomino(id:string){
        this.ID = id;
        this.node.getComponentsInChildren(cc.Sprite).forEach(sprite => {
           if (sprite.spriteFrame.name == id) 
           sprite.node.active = true;
           else
           sprite.node.active = false;
        });
    }

    // update (dt) {}
}

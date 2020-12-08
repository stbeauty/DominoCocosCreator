// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Domino from "./Domino";
import DominoInfo from "./DominoInfo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DominoDesk extends cc.Component {

    @property(cc.Prefab)
    DominoPrefab: cc.Prefab = null;

    
    // LIFE-CYCLE CALLBACKS:

    DominoList:Domino[] = [];
    // onLoad () {}

    start () {

    }

    place(id:string, Pos:cc.Vec3) : boolean{
        if (this.DominoList.length == 0){
            var domi = cc.instantiate(this.DominoPrefab).getComponent(Domino);
            domi.node.setParent(this.node);
            domi.node.position = this.node.convertToNodeSpaceAR(Pos);
            domi.setDomino(id);

            this.DominoList.push(domi);
            return true;
        }
        return false;
    }

    checkCanPlace(curDomi:Domino) : Domino {

        if (this.DominoList.length == 0){
            return curDomi;
        } else {
            var pos = this.node.convertToNodeSpaceAR(curDomi.node.parent.convertToWorldSpaceAR(curDomi.node.position));
            this.DominoList.forEach(domi => {
                if((domi.avaiID == curDomi.ID[0] || domi.avaiID == curDomi.ID[1]) && (cc.Vec3.distance(pos, domi.node.position) < 200))
                    return domi;
            });
        }
        return null;
    }

    // update (dt) {}
}

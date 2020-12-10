// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Domino from "./Domino";
import DomiTransform from "./DomiTransform";
import RoundController from "./RoundController";

const {ccclass, property} = cc._decorator;

export default class GameAI  {

    deck:string[] = [];

    RoundControl:RoundController = null;

    MakeMove(){
        if (this.deck.length == 0)
        return;

        var nodes = this.RoundControl.Desk.DominoList;

        if (nodes.length == 0){
            this.RoundControl.Desk.placeRoot(this.deck[0]);
            this.deck.splice(0,1);
            return;
        }

        for (var i = 0;i < nodes.length; i++){
            var node = nodes[i];
            if (node.isActive){
                for (var j = 0;j < this.deck.length; j++)
                if (this.deck[j][0] == node.ID || this.deck[j][1] == node.ID){
                    var domi = this.RoundControl.PlayerDomino;
                    domi.ID = this.deck[j];
                    this.deck.splice(j,1);

                    var rx = Math.floor(Math.random() * (4)) - 2;
                    var ry = Math.floor(Math.random() * (4)) - 2;

                    domi.node.position = this.RoundControl.node.convertToNodeSpaceAR(node.Position.add(cc.v3(rx,ry,0)));

                    var transform = new DomiTransform(domi, node);

                    if (transform.Valid)
                        this.RoundControl.Desk.place(transform);

                    return;
                }
            }
        }
    }


}

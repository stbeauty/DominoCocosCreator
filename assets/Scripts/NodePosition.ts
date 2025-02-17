// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { NodeAlignment } from "./NodeAlignment";



const {ccclass, property} = cc._decorator;



export default class NodePosition  {
    Position: cc.Vec3 = cc.Vec3.ZERO;
    Align: NodeAlignment = NodeAlignment.LEFT_LANSCAPE;
}

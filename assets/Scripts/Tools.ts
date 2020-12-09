// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

export default class Tools {

    static WorldPos(node:cc.Node) : cc.Vec3 {
        if (node == null)
            return cc.Vec3.ZERO;

        return node.parent.convertToWorldSpaceAR(node.position);
    }
}

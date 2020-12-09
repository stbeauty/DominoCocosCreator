// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Domino from "./Domino";
import DomiNode from "./DomiNode";
import { NodeAlignment } from "./NodeAlignment";
import NodePosition from "./NodePosition";
import Tools from "./Tools";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DominoDesk extends cc.Component {

    @property(cc.Prefab)
    DominoPrefab: cc.Prefab = null;

    DW: number = 138;
    DH: number = 70;

    TopPos: cc.Vec3 = cc.v3(0, this.DW / 4, 0);
    RightPos: cc.Vec3 = cc.v3(this.DW / 4, 0, 0);
    LeftPos: cc.Vec3 = cc.v3(-this.DW / 4, 0, 0);
    BotPos: cc.Vec3 = cc.v3(0, -this.DW / 4, 0);
    // LIFE-CYCLE CALLBACKS:

    DominoList: DomiNode[] = [];
    // onLoad () {}

    start() {

    }

    Instantiate(curDomi: Domino, Pos: cc.Vec3): Domino {

        var domi = cc.instantiate(this.DominoPrefab).getComponent(Domino);
        domi.node.setParent(this.node);
        domi.node.position = this.node.convertToNodeSpaceAR(Pos);
        domi.setDomino(curDomi.ID);
        domi.node.angle = curDomi.node.angle;

        return domi;
    }

    checkCanPlace(curDomi: Domino): DomiNode {
        var r: DomiNode = null;
        if (this.DominoList.length == 0) {
            var node = new DomiNode();
            node.isRoot = true;
            return node;
        } else {

            this.DominoList.forEach(node => {
                if (node.CheckMatch(curDomi)) {
                    r = node;
                }
            });
        }
        return r;
    }

    findAbsolutePos(curDomi: Domino, node: DomiNode): NodePosition {
        var pos = Tools.WorldPos(curDomi.node);
        var re = new NodePosition;

        
        if (node.RIGHT && node.LEFT == false) {
            if (node.TOP && node.BOT) {
                if (pos.x > node.Position.x && pos.y < node.Position.y + 35 && pos.y > node.Position.y - 35) {
                    re.Position.y = node.Position.y;
                    re.Position.x = node.Position.x + this.DW * 0.75;
                    re.Align = NodeAlignment.RIGHT_LANSCAPE;
                    return re;
                }

                if (pos.y > node.Position.y + 35) {
                    if (pos.x <= node.Position.x + 35) {
                        re.Position.y = node.Position.y + this.DW * 0.75;
                        re.Position.x = node.Position.x;
                        re.Align = NodeAlignment.RIGHT_TOP_FULL;
                    }
                    else {
                        re.Position.y = node.Position.y + 35;
                        re.Position.x = node.Position.x + 35 + this.DW / 4;
                        re.Align = NodeAlignment.RIGHT_TOP_HALF;
                    }

                    return re;

                }

                if (pos.y < node.Position.y - 35) {
                    if (pos.x <= node.Position.x + 35) {
                        re.Position.y = node.Position.y - this.DW * 0.75;
                        re.Position.x = node.Position.x;
                        re.Align = NodeAlignment.RIGHT_BOT_FULL;
                    }
                    else {
                        re.Position.y = node.Position.y - 35;
                        re.Position.x = node.Position.x + 35 + this.DW / 4;
                        re.Align = NodeAlignment.RIGHT_BOT_HALF;
                    }

                    return re;
                }
            } else {
                if (node.TOP) {
                    if (pos.x >= node.Position.x + 35) {
                        if (pos.y < node.Position.y + 35) {
                            re.Position.y = node.Position.y+ this.DW * 0.75;
                            re.Position.x = node.Position.x ;
                            re.Align = NodeAlignment.TOP_RIGHT_FULL;
                        } else {
                            re.Position.y = node.Position.y + 35 ;
                            re.Position.x = node.Position.x + 35+ this.DW / 4;
                            re.Align = NodeAlignment.TOP_RIGHT_HALF;
                        }
                    } else {
                        re.Position.y = node.Position.y + this.DW * 0.75;
                        re.Position.x = node.Position.x;
                        re.Align = NodeAlignment.TOP_RIGHT_POTRAIT;
                    }
                } else {
                    if (pos.x >= node.Position.x + 35) {
                        if (pos.y > node.Position.y - 35) {
                            re.Position.y = node.Position.y - this.DW * 0.75;
                            re.Position.x = node.Position.x;
                            re.Align = NodeAlignment.BOT_RIGHT_FULL;
                        } else {
                            re.Position.y = node.Position.y - 35 - this.DW / 4;
                            re.Position.x = node.Position.x + 35;
                            re.Align = NodeAlignment.BOT_RIGHT_HALF;
                        }
                    } else {
                        re.Position.y = node.Position.y - this.DW * 0.75;
                        re.Position.x = node.Position.x;
                        re.Align = NodeAlignment.BOT_RIGHT_POTRAIT;
                    }
                }
                return re;
            }
        }

        if (node.LEFT && node.RIGHT == false) {
            if (node.TOP && node.BOT) {
            if (pos.x < node.Position.x && pos.y < node.Position.y + 35 && pos.y > node.Position.y - 35) {
                re.Position.y = node.Position.y;
                re.Position.x = node.Position.x - this.DW * 0.75;
                re.Align = NodeAlignment.LEFT_LANSCAPE;
                return re;

            }

            if (pos.y > node.Position.y + 35) {
                if (pos.x >= node.Position.x - 35) {
                    re.Position.y = node.Position.y + this.DW * 0.75;
                    re.Position.x = node.Position.x;
                    re.Align = NodeAlignment.LEFT_TOP_FULL;

                }
                else {
                    re.Position.y = node.Position.y + 35;
                    re.Position.x = node.Position.x - 35 - this.DW / 4;
                    re.Align = NodeAlignment.LEFT_TOP_HALF;
                }
                return re;
            }

            if (pos.y < node.Position.y - 35) {
                if (pos.x >= node.Position.x - 35) {
                    re.Position.y = node.Position.y - this.DW * 0.75;
                    re.Position.x = node.Position.x;
                    re.Align = NodeAlignment.LEFT_BOT_FULL;
                }
                else {
                    re.Position.y = node.Position.y - 35;
                    re.Position.x = node.Position.x - 35 - this.DW / 4;
                    re.Align = NodeAlignment.LEFT_BOT_HALF;
                }
                return re;
            }
        } else {
            if (node.TOP) {
                if (pos.x <= node.Position.x - 35) {
                    if (pos.y < node.Position.y + 35) {
                        re.Position.y = node.Position.y + this.DW * 0.75;
                        re.Position.x = node.Position.x ;
                        re.Align = NodeAlignment.TOP_LEFT_FULL;
                    } else {
                        re.Position.y = node.Position.y + 35 + this.DW / 4;
                        re.Position.x = node.Position.x - 35;
                        re.Align = NodeAlignment.TOP_LEFT_HALF;
                    }
                } else {
                    re.Position.y = node.Position.y + this.DW * 0.75;
                    re.Position.x = node.Position.x;
                    re.Align = NodeAlignment.TOP_LEFT_POTRAIT;
                }
            } else {
                if (pos.x <= node.Position.x - 35) {
                    if (pos.y > node.Position.y - 35) {
                        re.Position.y = node.Position.y- this.DW * 0.75;
                        re.Position.x = node.Position.x ;
                        re.Align = NodeAlignment.BOT_LEFT_FULL;
                    } else {
                        re.Position.y = node.Position.y - 35 - this.DW / 4;
                        re.Position.x = node.Position.x - 35;
                        re.Align = NodeAlignment.BOT_LEFT_HALF;
                    }
                } else {
                    re.Position.y = node.Position.y - this.DW * 0.75;
                    re.Position.x = node.Position.x;
                    re.Align = NodeAlignment.BOT_LEFT_POTRAIT;
                }
            }
            return re;
        }
        }

    }

    place(curDomi: Domino, node: DomiNode, align: NodePosition) {
        var pos = Tools.WorldPos(curDomi.node);

        var domi: Domino = null;
        if (node.isRoot) {
            domi = this.Instantiate(curDomi, Tools.WorldPos(this.node));



            // Left
            var dnodeL = new DomiNode();
            dnodeL.ID = domi.ID[0];
            dnodeL.RIGHT = false;
            dnodeL.Position = Tools.WorldPos(domi.node).add(this.LeftPos);
            this.DominoList.push(dnodeL);
            // Right
            var dnodeR = new DomiNode();
            dnodeR.ID = domi.ID[1];
            dnodeR.LEFT = false;
            dnodeR.Position = Tools.WorldPos(domi.node).add(this.RightPos);
            this.DominoList.push(dnodeR);

            if (domi.ID[0] == domi.ID[1]) {
                var dnodeC = new DomiNode();
                dnodeC.ID = domi.ID[0];
                dnodeC.LEFT = false;
                dnodeC.RIGHT = false;
                dnodeC.Position = Tools.WorldPos(domi.node);
                this.DominoList.push(dnodeC);

                dnodeC.MakeFriends(dnodeL);
                dnodeC.MakeFriends(dnodeR);

            } else {
                dnodeL.MakeFriends(dnodeR);
            }
        } else {
            var dnode = new DomiNode();
            if (node.ID == curDomi.ID[0])
                dnode.ID = curDomi.ID[1];
            else
                dnode.ID = curDomi.ID[0];
            this.DominoList.push(dnode);
            this.Instantiate(curDomi, align.Position);
            
            console.log(align.Align);
            
            switch (align.Align) {
                case NodeAlignment.RIGHT_TOP_FULL:
                case NodeAlignment.RIGHT_TOP_HALF:
                    node.neighbors.forEach(n => { n.TOP = false });
                    dnode.BOT = false;
                    dnode.LEFT = false;
                    dnode.Position = align.Position.add(this.TopPos);
                    break;
                case NodeAlignment.RIGHT_LANSCAPE:
                    dnode.LEFT = false;
                    dnode.Position = align.Position.add(this.RightPos);
                    break;
                case NodeAlignment.RIGHT_BOT_HALF:
                case NodeAlignment.RIGHT_BOT_FULL:
                    node.neighbors.forEach(n => { n.BOT = false });
                    dnode.TOP = false;
                    dnode.LEFT = false;
                    dnode.Position = align.Position.add(this.BotPos);
                    break;

                case NodeAlignment.LEFT_TOP_FULL:
                case NodeAlignment.LEFT_TOP_HALF:
                    node.neighbors.forEach(n => { n.TOP = false });
                    dnode.BOT = false;
                    dnode.RIGHT = false;
                    dnode.Position = align.Position.add(this.TopPos);
                    break;
                case NodeAlignment.LEFT_LANSCAPE:
                    dnode.RIGHT = false;
                    dnode.Position = align.Position.add(this.LeftPos);
                    break;
                case NodeAlignment.LEFT_BOT_HALF:
                case NodeAlignment.LEFT_BOT_FULL:
                    node.neighbors.forEach(n => { n.BOT = false });
                    dnode.TOP = false;
                    dnode.RIGHT = false;
                    dnode.Position = align.Position.add(this.BotPos);
                    break;

                case NodeAlignment.BOT_RIGHT_FULL:
                case NodeAlignment.BOT_RIGHT_HALF:
                    node.neighbors.forEach(n => { n.RIGHT = false });
                    dnode.TOP = false;
                    dnode.LEFT = false;
                    dnode.Position = align.Position.add(this.RightPos);
                    break;
                case NodeAlignment.BOT_LEFT_POTRAIT:
                    dnode.TOP = false;
                    dnode.RIGHT = false;
                    dnode.Position = align.Position.add(this.BotPos);
                    break;
                    case NodeAlignment.BOT_RIGHT_POTRAIT:
                    dnode.TOP = false;
                    dnode.LEFT = false;
                    dnode.Position = align.Position.add(this.BotPos);
                    break;
                case NodeAlignment.BOT_LEFT_FULL:
                case NodeAlignment.BOT_LEFT_HALF:
                    node.neighbors.forEach(n => { n.LEFT = false });
                    dnode.TOP = false;
                    dnode.RIGHT = false;
                    dnode.Position = align.Position.add(this.LeftPos);
                    break;

                case NodeAlignment.TOP_RIGHT_FULL:
                case NodeAlignment.TOP_RIGHT_HALF:
                    node.neighbors.forEach(n => { n.RIGHT = false });
                    dnode.BOT = false;
                    dnode.LEFT = false;
                    dnode.Position = align.Position.add(this.RightPos);
                    break;
                case NodeAlignment.TOP_LEFT_POTRAIT:
                    dnode.BOT = false;
                    dnode.RIGHT = false;
                    dnode.Position = align.Position.add(this.TopPos);
                    break;
                    case NodeAlignment.TOP_RIGHT_POTRAIT:
                    dnode.BOT = false;
                    dnode.LEFT= false;
                    dnode.Position = align.Position.add(this.TopPos);
                    break;
                case NodeAlignment.TOP_LEFT_FULL:
                case NodeAlignment.TOP_LEFT_HALF:
                    node.neighbors.forEach(n => { n.LEFT = false });
                    dnode.BOT = false;
                    dnode.RIGHT = false;
                    dnode.Position = align.Position.add(this.LeftPos);
                    break;
            }
            node.MakeFriends(dnode);
            node.Disable();
        }
    }

    // update (dt) {}
}

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Direction } from "./Direction";
import DomiNode from "./DomiNode";
import GameManager from "./GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AlignmentInfo extends cc.Node {

    isPortrait: boolean = false;
    isActive: boolean = true;
    isForDouble: boolean = false;
    ID:number = 0;
    Root:DomiNode = null;

    convertForDouble():AlignmentInfo{
        this.isForDouble = true;
        if (this.x == -105) this.x = -70;
        if (this.x == 105) this.x = 70;
        if (this.y == -105) this.y = -70;
        if (this.y == 105) this.y = 70;

        return this;
    }

    constructor(isPortrait: boolean, direction: Direction, parent: DomiNode, tagID:boolean = false) {
        super();
        this.isPortrait = isPortrait;
        this.parent = parent;
        this.Root = parent;
        if (tagID){
            this.ID = GameManager.Instance().alignID;
            GameManager.Instance().alignID++;
        }

        switch (direction) {
            case Direction.TOP:
                this.y = 105;
                break;
            case Direction.TOP_RIGHT:
                if (isPortrait){
                    this.x = 70;
                    this.y = 35;
                } else {
                    this.x = 35;
                    this.y = 70;
                }
                break;
            case Direction.RIGHT:
                this.x = 105;
                break;
            case Direction.RIGHT_BOT:
                if (isPortrait){
                    this.x = 70;
                    this.y = -35;
                } else {
                    this.x = 35;
                    this.y = -70;
                }
                break;
            case Direction.BOT:
                this.y = -105;
                break;
            case Direction.BOT_LEFT:
                if (isPortrait){
                    this.x = -70;
                    this.y = -35;
                } else {
                    this.x = -35;
                    this.y = -70;
                }
                break;
            case Direction.LEFT:
                this.x = -105;
                break;
            case Direction.LEFT_TOP:
                if (isPortrait){
                    this.x = -70;
                    this.y = 35;
                } else {
                    this.x = -35;
                    this.y = 70;
                }
                break;
        }
    }

    rotate(angle: number){
        if (Math.abs(angle) == 90)
            this.isPortrait = !this.isPortrait;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}
}

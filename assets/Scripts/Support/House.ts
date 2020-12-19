// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class House extends cc.Component {

    @property(cc.Node)
    YellowNode: cc.Node = null;

    @property(cc.Node)
    GreyNode: cc.Node = null;

    @property(cc.RichText)
    Score: cc.RichText = null;

    Disable(){
        this.YellowNode.active = false;
        this.GreyNode.active = true;
        this.Score.node.active = false;
    }

    Show(score:number){
        this.YellowNode.active = true;
        this.GreyNode.active = false;
        this.Score.node.active = true;

        if (score > 0)
        this.Score.string = "<outline color=white width=2><b>"+score+"</b></outline>";
        else
        this.Score.string = "";
    }


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}

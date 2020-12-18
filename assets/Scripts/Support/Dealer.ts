// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Dealer extends cc.Component {

    @property (cc.Prefab)
    DomiBackPrefab: cc.Prefab = null;

    BackList: cc.Node[] = [];
    AnchorList: cc.Vec2[] = [];


    width = 1100;
    height = 550;
    top: number = this.height / 2;
    bot: number = -this.height / 2;
    left: number = -this.width / 2;
    right: number = this.width / 2;

    init (){
        for (var i = 0; i < 28; i++){
            var back = cc.instantiate(this.DomiBackPrefab);
            back.parent = this.node;
            back.active = false;
            this.BackList.push(back);
        }

        var w05 = 0.5*this.width/7;
        var h05 = 0.5*this.height/7;

        for (var i = 0; i < 4; i ++)
            for (var  j = 0; j < 7; j++)
                this.AnchorList.push (cc.v2(this.left + j*this.width/7 + w05, this.bot + i*this.height / 4 + h05));
    }

    StartShuffling(callback:Function){
        var randomList: cc.Vec2[] = [];
        this.AnchorList.forEach (vec => randomList.push(vec));


        var handsPos: cc.Vec2[] = [cc.v2(-2000,0), cc.v2(2000,0), cc.v2(0,1000), cc.v2(0, -1000) ];

        for (var i = 0; i < 28; i++){
            var back = this.BackList[i];
            back.active = true;

            back.position = cc.v3(this.AnchorList[i]);
            back.y = 2000;

            var step1 = cc.v2(this.AnchorList[i]);
            step1.x = step1.x*2/3 + Math.floor(Math.random()* 40) - 20;
            step1.y = step1.y*2/3 + Math.floor(Math.random()* 40) - 20;

            var ridx = Math.floor(Math.random() * randomList.length);
            var step2 = randomList[ridx];
            randomList.splice(ridx,1);

            back.scaleX = Math.floor(Math.random() * 2) == 0? -1: 1;

            
            var step3 = handsPos[Math.floor(i/7)];

            var delay = Math.floor(Math.random()*12);

            if (i==27)
                back.runAction(cc.sequence(cc.delayTime(delay*0.05), cc.moveTo(0.6, step1), cc.delayTime(0.5+0.55 - delay*0.05), cc.moveTo(0.2, step2), cc.delayTime(1+Math.floor(i/7)), cc.moveTo(0.5, step3),cc.callFunc(callback)));
                else
                back.runAction(cc.sequence(cc.delayTime(delay*0.05), cc.moveTo(0.6, step1), cc.delayTime(0.5+0.55 - delay*0.05), cc.moveTo(0.2, step2), cc.delayTime(1+Math.floor(i/7)), cc.moveTo(0.5, step3)));

        }
    }


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();
    }

    start () {
        //this.StartShuffling();
    }

    // update (dt) {}
}

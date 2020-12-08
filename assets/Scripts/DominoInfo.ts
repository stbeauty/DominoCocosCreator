

const {ccclass, property} = cc._decorator;

export default class DominoInfo {
    DW:number  = 138;
    DH:number  = 74;


    LeftPos:cc.Vec2 = cc.Vec2.ZERO;
    RightPos:cc.Vec2 = cc.Vec2.ZERO;
    Position: cc.Vec3 = cc.Vec3.ZERO;
    Rotation: number = 0;
    CanPlace: boolean = false;

    getNodePos() : cc.Vec3{
        var r = new cc.Vec3;

        r.x = (this.LeftPos.x + this.RightPos.x) * this.DH / 2;
        r.y = ((this.LeftPos.y + this.RightPos.y)/ 2 - 0.5) * this.DH ;

        return r;
    }
}

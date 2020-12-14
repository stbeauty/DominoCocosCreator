// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TextToggle extends cc.Button {

    @property(cc.Sprite)
    DefaultSprite: cc.Sprite = null;

    @property(cc.Sprite)
    ToggledSprite: cc.Sprite = null;

    isToggled:boolean = false;

    @property(cc.Label)
    Text:cc.Label = null;

    @property(cc.Color)
    TextDefaultColor:cc.Color = null;

    @property(cc.Color)
    TextToggledColor:cc.Color = null;

    @property([TextToggle])
    GroupToggle:TextToggle[] = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.toggle(false);

        this.node.on("click", () => {
            this.toggle(!this.isToggled);
            this.GroupToggle.forEach(btn => btn.toggle(false));
        })
    }

    toggle(value:boolean){
        this.isToggled = value;
        if (value){
            this.ToggledSprite.node.active = true;
            this.DefaultSprite.node.active = false;
            this.Text.node.color = this.TextToggledColor;
        } else {
            this.ToggledSprite.node.active = false;
            this.DefaultSprite.node.active = true;
            this.Text.node.color = this.TextDefaultColor;
        }
    }

    // update (dt) {}
}

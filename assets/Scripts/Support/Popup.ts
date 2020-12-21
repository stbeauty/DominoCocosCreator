// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { PopupType } from "../Enum/PopupType";
import GameManager from "../GameManager";

const {ccclass, property} = cc._decorator;



@ccclass
export default class Popup extends cc.Component {

    @property(cc.Label)
    Title: cc.Label = null;
    @property(cc.Label)
    Content: cc.Label = null;

    @property(cc.Node)
    OKGroup: cc.Node = null;
    @property(cc.Node)
    YesNoGroup: cc.Node = null;

    @property(cc.Button)
    OKBtn: cc.Button = null;
    @property(cc.Button)
    YesBtn: cc.Button = null;
    @property(cc.Button)
    NoBtn: cc.Button = null;

    OKCallback: Function;
    YesCallback: Function;
    NoCallback: Function;

    Type:PopupType = PopupType.OK;

    onLoad(){
        this.OKBtn.node.on("click", ()=>{
            if (this.OKCallback){
                this.OKCallback();
                
            }
            this.node.active = false;
        });
        this.YesBtn.node.on("click", ()=>{
            if (this.YesCallback){
                this.YesCallback();
                
            }
            this.node.active = false;
        });
        this.NoBtn.node.on("click", ()=>{
            if (this.NoCallback){
                this.NoCallback();
                
            }
            this.node.active = false;
        });
        this.node.active = false;
        this.YesNoGroup.active = false;

        GameManager.Instance().popup = this;
    }

    setup(title:string, content:string, type:PopupType, OKfunc:Function, Yesfunc:Function, Nofunc:Function){
        this.Title.string = title;
        this.Content.string = content;
        this.Type = type;
        this.OKCallback = OKfunc;
        this.YesCallback = Yesfunc;
        this.NoCallback = Nofunc;

        switch (type){
            case PopupType.OK:
                this.YesNoGroup.active = false;
                this.OKGroup.active = true;
                break;
                case PopupType.YESNO:
                this.YesNoGroup.active = true;
                this.OKGroup.active = false;
                break;
        }
    }
}

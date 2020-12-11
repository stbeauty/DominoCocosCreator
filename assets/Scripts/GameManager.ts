// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


export default class GameManager {

   static _instance:GameManager = null;

   static Instance() : GameManager{
        if (this._instance == null)
        this._instance = new GameManager();
        return this._instance;
   }

   Net = null;

constructor(){

    this.Net = new PhotonClient();
    
//var aa=NetClient;
    //this.photonClient.game = this;
}


}

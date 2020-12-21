// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AppSettings from "./AppSettings";
import { PopupType } from "./Enum/PopupType";
import Popup from "./Support/Popup";
import StatusBar from "./Support/StatusBar";

export default class GameManager{

    static _instance: GameManager = null;

    soundOn:boolean = true;
    alignID: number = 0;
    doublePlaced:boolean = false;

    gameTime: number = 1800;

    popup: Popup = null;
    statusBar: StatusBar = null;

    static Instance(): GameManager {
        if (this._instance == null)
            this._instance = new GameManager();
        return this._instance;
    }

    resetGame(){
        this.alignID = 0;
        this.doublePlaced = false;
    }

    Net: PhotonClient = null;

    constructor() {

        this.Net = new PhotonClient();

        this.Net.onStateChange = (state) => {
            var name = PhotonClient.StateToName(state);
            console.log(name);
        }

        this.Net.onError = (errorCode: number, errorMsg: string) => { console.log("onError"); };
        this.Net.onOperationResponse = (errorCode: number, errorMsg: string, code: number, content: any) => {
            console.log("onOperationResponse " + errorCode + " " + errorMsg);
            switch (errorCode) {
                //case Constants.ErrorCode.NoRandomMatchFound:
                case MyPhoton.LoadBalancing.Constants.ErrorCode.NoRandomMatchFound:
                    this.Net.createRoom(this.Net.myActor().name, {isVisible:true, maxPlayers:4} );
                    break;
            }
        };
        this.Net.onEvent = (code: number, content: any, actorNr: number) => { console.log("onEvent"); };
        this.Net.onRoomList = (rooms) => { console.log("onRoomList"); };
        this.Net.onRoomListUpdate = (rooms, roomsUpdated, roomsAdded, roomsRemoved) => { console.log("onRoomListUpdate"); };
        this.Net.onMyRoomPropertiesChange = () => { console.log("onMyRoomPropertiesChange"); };
        this.Net.onActorPropertiesChange = (actor) => { console.log("onActorPropertiesChange"); };
        this.Net.onJoinRoom = (createdByMe: boolean) => { 
            console.log("onJoinRoom");
            //this.Net.myRoomActors();
         };
        this.Net.onActorJoin = (actor) => { console.log("onActorJoin"); };
        this.Net.onActorLeave = (actor, cleanup: boolean) => { console.log("onActorLeave"); };
        this.Net.onActorSuspend = (actor) => { console.log("onActorSuspend"); };
        this.Net.onFindFriendsResult = (errorCode: number, errorMsg: string, friends: any) => { console.log("onFindFriendsResult"); };
        this.Net.onLobbyStats = (errorCode: number, errorMsg: string, lobbies: any[]) => { console.log("onLobbyStats"); };
        this.Net.onAppStats = (errorCode: number, errorMsg: string, stats: any) => { console.log("onAppStats"); };
        this.Net.onGetRegionsResult = (errorCode: number, errorMsg: string, regions: {}) => { console.log("onGetRegionsResult"); };
        this.Net.onWebRpcResult = (errorCode: number, message: string, uriPath: string, resultCode: number, data: any) => { console.log("onWebRpcResult"); };

    }

    IsLogginPressed() {
        switch (this.Net.state) {
            case MyPhoton.LoadBalancing.LoadBalancingClient.State.Disconnected:
            case MyPhoton.LoadBalancing.LoadBalancingClient.State.Error:
            case MyPhoton.LoadBalancing.LoadBalancingClient.State.Uninitialized:
                return false;

            default:
                return true;
        }
    };

    ShowOKPopup(title:string, content:string, callback:Function){
        this.popup.setup(title, content, PopupType.OK, callback, null, null);
        this.popup.node.active = true;
    }

    ShowYesNoPopup(title:string, content:string, YesCallback:Function, NoCallback:Function){
        this.popup.setup(title, content, PopupType.YESNO, null, YesCallback, NoCallback);
        this.popup.node.active = true;
    }

    JoinOrCreateRoom() {
        // if (this.Net.myActor().name == "h")
        // this.Net.createRoom("test");
        // else
        // this.Net.joinRoom("test");

        this.Net.joinRandomRoom();

    }

    public static async Request(api:string, content:any) : Promise<any>{
        const response = await fetch(AppSettings.BASE_URL + api, {
            method: 'POST',
            body: JSON.stringify(content),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} });

            

            if (response.body !== null) {
                var strBody = await response.text();
                const asJSON = JSON.parse(strBody);  // implicitly 'any', make sure to verify type on runtime.

                return asJSON;
              }
            
              return null;
    }

}

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


export default class GameManager {

    static _instance: GameManager = null;

    soundOn:boolean = true;
    alignID: number = 0;

    static Instance(): GameManager {
        if (this._instance == null)
            this._instance = new GameManager();
        return this._instance;
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

    JoinOrCreateRoom() {
        // if (this.Net.myActor().name == "h")
        // this.Net.createRoom("test");
        // else
        // this.Net.joinRoom("test");

        this.Net.joinRandomRoom();

    }

    // onError(errorCode: number, errorMsg: string) =>{ console.log("");};
    //     onOperationResponse(errorCode: number, errorMsg: string, code: number, content: any) =>{ console.log("");};
    //     onEvent(code: number, content: any, actorNr: number)  =>{ console.log("");};
    //     onRoomList(rooms: RoomInfo[])  =>{ console.log("");};
    //     onRoomListUpdate(rooms: RoomInfo[], roomsUpdated: RoomInfo[], roomsAdded: RoomInfo[], roomsRemoved: RoomInfo[])  =>{ console.log("");};
    //     onMyRoomPropertiesChange() =>{ console.log("");};
    //     onActorPropertiesChange(actor: Actor) =>{ console.log("");};
    //     onJoinRoom(createdByMe: boolean) =>{ console.log("");};
    //     onActorJoin(actor: Actor) =>{ console.log("");};
    //     onActorLeave(actor: Actor, cleanup: boolean) =>{ console.log("");};
    //     onActorSuspend(actor: Actor) =>{ console.log("");};
    //     onFindFriendsResult(errorCode: number, errorMsg: string, friends: any) =>{ console.log("");};
    //     onLobbyStats(errorCode: number, errorMsg: string, lobbies: any[]) =>{ console.log("");};
    //     onAppStats(errorCode: number, errorMsg: string, stats: any) =>{ console.log("");};
    //     onGetRegionsResult(errorCode: number, errorMsg: string, regions: {}) =>{ console.log("");};
    //     onWebRpcResult(errorCode: number, message: string, uriPath: string, resultCode: number, data: any) =>{ console.log("");};

}

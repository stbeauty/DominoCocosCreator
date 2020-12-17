// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


export default class SyncLogic  {

    dominoes:string[] = [];
    played:boolean[] = [];
    points:number = 0;

    endGamePoints:number = 0;

    setDominoes(domi:string[]){
        this.dominoes = domi;
        this.played = [];
        for (var i = 0; i < 7; i++)
            this.played.push(false);
    }

    play(id:string){
        for (var i = 0; i < 7; i++)
            if (this.dominoes[i] == id)
                this.played[i] = true;
    }

    canStillPlay(requireID:string[]) : boolean{
        for (var i =0; i < requireID.length; i++)
            for (var j = 0;j < 7; j++)
                if (this.played[j] == false && (this.dominoes[j][0] == requireID[i] || this.dominoes[j][1] == requireID[i]) )
                    return true;

        return false;
    }

    isFinished() : boolean{
        console.log(this.played);
        
        for (var j = 0;j < 7; j++)
        if (this.played[j] == false)
            return false;

            return true;
    }

    calculatePoints():number{
        var result = 0;
        for (var j = 0;j < 7; j++)
        if (this.played[j] == false)
            {
                result += Number(this.dominoes[j][0]);
                result += Number(this.dominoes[j][1]);
            }

        this.endGamePoints = result;

        return result;
    }
}

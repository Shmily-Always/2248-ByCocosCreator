import { _decorator, Component, Node, error, find, game } from 'cc';
import { GameMain } from '../GameMain';
import gameInitManager from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('AddDiamondManager')
export class AddDiamondManager {

    diamond:number=0;
    
    subDiamond(number:number){  //钻石数量的计算
        if(!number || number>600){
            error("number值不得为0或大于600");
            return false;
        }
        let currentDiamond=this.getDiamond();
        this.diamond=(currentDiamond+number)<0?0:(currentDiamond+number); //如果初始金钱+加的钱没有300，就返回初始值
        gameInitManager.getLocalDataManager().setDiamondDataToLocalData(this.diamond);
        return true;
    }

    isDiamondEnough(number:number){  //最右边加号的计算
        let currentDiamond=this.getDiamond();
        if(currentDiamond<number){
            // let node=find("Canvas/GameMain");
            // let gameConrtol=node.getComponent(GameMain);
            // gameConrtol.showShopLayer();
            return false;
        }
        return true;
    }

    getDiamond(){
        return this.diamond=gameInitManager.getLocalDataManager().getDiamondDataByLocalData();
    }

}

var diamondManager=null;
export var getAddDiamondManagerInstance=function(){
    if(!diamondManager){
        diamondManager=new AddDiamondManager();
    }
    return diamondManager;
}



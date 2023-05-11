import { _decorator, Component, find, Node } from 'cc';
import { layerControler } from '../Controler/layerControler';
import gameInitManager from '../Manager/GameManager';
import { GameMain } from '../GameMain';
import { blockControler } from '../Controler/blockControler';
const { ccclass, property } = _decorator;

@ccclass('treasureLayer')
export class treasureLayer extends layerControler {
    // start() {

    // }

    // update(deltaTime: number) {
        
    // }
    onClickSure(){
        gameInitManager.getDiamondManager().subDiamond(1);
        let node=find("Canvas/GameMain");
        let controlNode=node.getComponent(GameMain);
        this.onClickClose();
        controlNode.showAddDiamondInUnlockLayer(1);
    }

    onClickClose(){
        super.onClickCloseButton();
        gameInitManager.getLocalDataManager().setClearNumToLocalData(0);
        gameInitManager.getLocalDataManager().setHaveTreasure(0);
        gameInitManager.getLocalDataManager().setTreasurePos(0,0);
        let blockContainer=find("Canvas/GameMain/blockContainer");  
        let controlBlockContainer=blockContainer.getComponent(blockControler);
        controlBlockContainer.notTresure=true;
    }
}



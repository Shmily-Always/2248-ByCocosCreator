import { _decorator, Component, Node, Label, find } from 'cc';
import { layerControler } from '../Controler/layerControler';
import gameInitManager from '../Manager/GameManager';
import { MenuMain } from '../MenuMain';
const { ccclass, property } = _decorator;

@ccclass('playerLayer')
export class playerLayer extends layerControler {
    @property(Label)  //分数
    label_score:Label|null=null;

    @property(Label)  //钻石
    label_diamond:Label|null=null;

    showLayerPlayer(){
        super.showLayer();
        let number=Number(gameInitManager.getLocalDataManager().getMaxScoreByLocalData());
        this.label_score.string=number?gameInitManager.getGameMainDataManager().specialValue(number):"0";
        this.label_diamond.string=gameInitManager.getGameMainDataManager().specialValue(gameInitManager.getDiamondManager().getDiamond())
    }

}



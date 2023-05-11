import { _decorator, Component, Node, find, Prefab } from 'cc';
import { blockSetting } from '../blockSetting';
import { blockControler } from '../Controler/blockControler';
import { layerControler } from '../Controler/layerControler';
import gameInitManager from '../Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('deleteMinBlockLayer')
export class deleteMinBlockLayer extends layerControler {
    
    @property(Node)
    nowBlock:Node=null;
    @property(Node)
    nexPrefab:Node=null;

    minValue:number=1;  //最小值

    refreshValue(){
        let maxValue=gameInitManager.getGameMainDataManager().getCurrentMaxValue();
        if(maxValue>=9  && maxValue<13){
            this.minValue=Math.floor((maxValue-9)/2+1);
        }else if(maxValue>=13 && maxValue<16){
            this.minValue=Math.floor((maxValue-10)/2+1);
        }else if(maxValue>=16){
            this.minValue=maxValue-12;
        }
        /*现在消除的方块配置*/
        let colorNow=gameInitManager.getGameMainDataManager().getBlockColor(this.minValue-1);
        let nowBlockControler=this.nowBlock.getComponent(blockSetting);
        nowBlockControler.CreateBigBlock();
        nowBlockControler.initBlock(-1,-1,this.minValue-1,colorNow);

        /*下个要被消除的方块配置*/
        let colorNext=gameInitManager.getGameMainDataManager().getBlockColor(this.minValue);
        let nextBlockControler=this.nexPrefab.getComponent(blockSetting);
        nextBlockControler.createNowBlock();
        nextBlockControler.initBlock(-1,-1,this.minValue,colorNext);
    }

    onClickOKButton(){
        super.onClickCloseButton();
        let node=find("Canvas/GameMain/blockContainer");
        let controlNode=node.getComponent(blockControler);
        controlNode.destroyAllMinBlock();
    }
}



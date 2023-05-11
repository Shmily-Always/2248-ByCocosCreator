import { _decorator, Component, find, Node, Vec2 } from 'cc';
import { layerControler } from '../Controler/layerControler';
import gameInitManager from '../Manager/GameManager';
import { GameMain } from '../GameMain';
import { blockControler } from '../Controler/blockControler';
import { blockSetting } from '../blockSetting';
import AdManager from '../../Extend/Ad/Platforms/AdManager';
import { AdLogUtil } from '../../Extend/Ad/Util/AdLogUtil';
import { my2DArray } from '../Common/my2DArray';
import { rewardType } from '../Common/Enum';
const { ccclass, property } = _decorator;

@ccclass('passLayer')
export class passLayer extends layerControler {

    // start() {

    // }

    // update(deltaTime: number) {
        
    // }

    @property(Node)
    nextBlock :Node=null;  
    @property(Node)
    nowBlock: Node=null;

    refreshValue(){
        let maxValue=gameInitManager.getGameMainDataManager().getCurrentMaxValue();  //获取当前最大值（小方块）
        //小方块配置
        let colorNow=gameInitManager.getGameMainDataManager().getBlockColor(maxValue);  
        let controlNowBlock=this.nextBlock.getComponent(blockSetting);
        // controlNowBlock.createNowBlock();
        controlNowBlock.initBlock(-1,-1,maxValue,colorNow);
        //大方块配置
        let colorNext=gameInitManager.getGameMainDataManager().getBlockColor(maxValue+1);
        let controlNextBlock=this.nowBlock.getComponent(blockSetting);
        // controlNextBlock.CreateNextBlock();
        controlNextBlock.initBlock(-1,-1,maxValue+1,colorNext);  
        controlNextBlock.setCrownInMax(true);  

    }

    onClickClose(){
        super.onClickCloseButton();

        let gameMainNode=find("Canvas/GameMain");  
        let controlGameMainNode=gameMainNode.getComponent(GameMain);

        let blockContainer=find("Canvas/GameMain/blockContainer");  
        let controlBlockContainer=blockContainer.getComponent(blockControler);

        gameInitManager.getGameMainDataManager().totalScore=0;    //计数归零

        let totalScore=(controlBlockContainer.getTotalNumberBlock()).toString();   //重新判断下一关条件

        gameInitManager.getLocalDataManager().setNowScoreToLocalData("0");   //现有积分计数清零
        controlGameMainNode.setNowScore(Number(gameInitManager.getLocalDataManager().getNowScoreByLocalData()));

        gameInitManager.getLocalDataManager().setTotalScoreToLocalData(totalScore);
        controlGameMainNode.setTotalScore(totalScore);

        let level=Number(controlGameMainNode.label_level.string);    //变更关卡数
        gameInitManager.getLocalDataManager().setLevelToLocalData((level+1).toString());
        controlGameMainNode.label_level.string=(gameInitManager.getLocalDataManager().getLevelByLocalData()).toString();
    }


    onClickReward(){    
        gameInitManager.getAdManager().setRewardType(rewardType.pass);
        this.scheduleOnce(()=>{
            gameInitManager.getAdManager().onReward(this.node);
        },0.3);
    }
}



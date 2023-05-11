import { _decorator, Component, Node, Vec2, Label, Button, game, find, UIOpacity, tween } from 'cc';
import { blockSetting } from '../blockSetting';
import { clearEffect, rewardType } from '../Common/Enum';
// import { clearEffect, lastInterface } from '../Common/Enum';
import { my2DArray } from '../Common/my2DArray';
import { blockControler } from '../Controler/blockControler';
import { layerControler } from '../Controler/layerControler';
import { GameMain } from '../GameMain';
import gameInitManager from '../Manager/GameManager';
import AdsIdConfig, { EPlatform } from '../../Extend/Ad/Platforms/AdsIdConfig';
import AdManager from '../../Extend/Ad/Platforms/AdManager';
const { ccclass, property } = _decorator;

@ccclass('doubleLayer')
export class doubleLayer extends layerControler {

    @property(Node)
    nextBlock :Node=null;  
    @property(Node)
    nowBlock: Node=null;

    @property(Button)
    rewardVideoLabel :Button=null;
    @property(Label)
    buyLabel:Label=null;

    beenTouchedNode:Vec2 | null=null; //合成的位置，翻倍的位置

    needDiamond=250;  //初始钻石数

    beforeMaxValue=0;  //记录上一次最大值

    // showDelay(){
    //     let opacity=this.node.getChildByName("Top").getChildByName("close").getComponent(UIOpacity);
    //     this.scheduleOnce(()=>{
    //         tween(opacity)
    //             .to(0.1,{opacity:0})
    //             .delay(0.1)
    //             .to(1,{opacity:255})
    //             .start();
    //     },1.5);
    // }
    
    refreshValue(beenTouchedNode:Vec2){
        this.beenTouchedNode=beenTouchedNode;
        let maxValue=gameInitManager.getGameMainDataManager().getCurrentMaxValue();  //获取当前最大值（小方块）
        //小方块配置
        // if(this.beforeMaxValue==0){
        //     this.beforeMaxValue=maxValue;  //第一轮值
        //     gameInitManager.getLocalDataManager().setBeforeMaxValueToLocalData(this.beforeMaxValue);
        // }
        let colorNow=gameInitManager.getGameMainDataManager().getBlockColor(maxValue);  
        let controlNowBlock=this.nextBlock.getComponent(blockSetting);
        controlNowBlock.createNowBlock();
        controlNowBlock.initBlock(-1,-1,maxValue,colorNow);
        //大方块配置
        let colorNext=gameInitManager.getGameMainDataManager().getBlockColor(maxValue+1);
        let controlNextBlock=this.nowBlock.getComponent(blockSetting);
        controlNextBlock.CreateNextBlock();
        controlNextBlock.initBlock(-1,-1,maxValue+1,colorNext);  
        controlNextBlock.setCrownInMax(true);  

        //钻石数配置
        
        // let beforeMaxValue=Number(gameInitManager.getLocalDataManager().getBeforeMaxValueByLocalData());
        // console.log(`before is ${this.beforeMaxValue},now is ${maxValue}`);
        // if(beforeMaxValue<maxValue){
        let curLevel=maxValue-9;
            this.needDiamond+=10*curLevel;  //升一级所要的钻石+10
            // console.log("curLevel is ",curLevel);
            // console.log("needDianond ",this.needDiamond);
            this.buyLabel.string=this.needDiamond.toString();
            // this.beforeMaxValue=maxValue;   //往后每一轮值
            // gameInitManager.getLocalDataManager().setBeforeMaxValueToLocalData(this.beforeMaxValue);
            // console.log(`setBefore is ${beforeMaxValue}`);
        // }
        
    }
    
    onClickBuyButton(){
        if(AdsIdConfig.platform==EPlatform.TikTok){
            AdManager.getInstance().hideBanner();
        }
        let curMaxValue=gameInitManager.getGameMainDataManager().getMaxValue();
        // console.log(`curMaxValue is ${curMaxValue},beforeMaxValue is ${this.beforeMaxValue}`);
        
        // if(this.buyLabel.string==needDiamond.toString() && curMaxValue==this.beforeMaxValue){  //当初始值为250时
            if(gameInitManager.getDiamondManager().isDiamondEnough(this.needDiamond)){
            gameInitManager.getDiamondManager().subDiamond(-this.needDiamond);
            // console.log(`currentDiamond is ${gameInitManager.getLocalDataManager().getDiamondDataByLocalData()}`);
            //计算钻石的+-
            let gameMainNode=find("Canvas/GameMain");   //主控
            let controlGameMainNode=gameMainNode.getComponent(GameMain);

            let block=gameInitManager.getGameMainDataManager().blockNodeList.getValue(this.beenTouchedNode.y,this.beenTouchedNode.x);
            let controlBlock=block.getComponent(blockSetting);
            let color=gameInitManager.getGameMainDataManager().getBlockColor(curMaxValue+1);
            controlBlock.showDoubleAnimation(this.beenTouchedNode.x,this.beenTouchedNode.y,curMaxValue+1,color);
            // gameInitManager.getGameMainDataManager().blockDataList.setValue(this.beenTouchedNode.y,this.beenTouchedNode.x,curMaxValue+1);
            gameInitManager.getGameMainDataManager().blockDataList.setValue(this.beenTouchedNode.y,this.beenTouchedNode.x,curMaxValue+1);
            let newBlock=gameInitManager.getGameMainDataManager().blockDataList.getValue(this.beenTouchedNode.y,this.beenTouchedNode.x);
            let blockDataList:my2DArray=gameInitManager.getGameMainDataManager().blockDataList;
            gameInitManager.getLocalDataManager().setBlockDataToLocalData(blockDataList);

            gameInitManager.getGameMainDataManager().initMaxBlock();  //更改MAX标志所在处

            if(newBlock>9){  //512以上弹出过关
                let gameMainNode=find("Canvas/GameMain");   //主控
                let controlGameMainNode=gameMainNode.getComponent(GameMain);
                controlGameMainNode.showUnlockLayer(newBlock);
            }

            // let blcokNode=find("Canvas/GameMain/blockContainer");
            // let controlBlockNode=blcokNode.getComponent(blockControler);
            // controlBlockNode.canShowDoubleLayer=true;   //可展示状态为true
            
            this.scheduleOnce(()=> {
                controlGameMainNode.showAddDiamondAnimation();  
                
            },(clearEffect.actionTime)/8);
            
            }else{

                let node=find("Canvas/GameMain");
                let controlNode=node.getComponent(GameMain);
                
                // this.scheduleOnce(()=>{
                // controlNode.showShopLayer();
                // controlNode.notEnoughAlert();
                controlNode.showNotEnough();
                // },1);
                // gameInitManager.getGameMainDataManager().lastInterface=lastInterface.doubleLayer;
            }
            this.onClickClose();
            this.needDiamond=250;  //置初始值
    }

    onClickClose(){
        super.onClickCloseButton();
        // if(AdsIdConfig.platform==EPlatform.VIVO){
        //     let opacity=this.node.getChildByName("Top").getChildByName("close").getComponent(UIOpacity);
        //     opacity.opacity=0;
        // }
    }

    onClickVideoButton(){
        gameInitManager.getAdManager().setRewardType(rewardType.changeBlock);
        this.scheduleOnce(()=>{
            gameInitManager.getAdManager().onReward(this.node);
        },0.3);
    }
    
}



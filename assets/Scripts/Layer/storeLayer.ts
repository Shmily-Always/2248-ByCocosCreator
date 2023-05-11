import { _decorator, Component, Node, Label, find, Button } from 'cc';
import { addMoney, propType, rewardLayer, rewardType } from '../Common/Enum';
import { layerControler } from '../Controler/layerControler';
import { GameMain } from '../GameMain';
import gameInitManager from '../Manager/GameManager';
import { MenuMain } from '../MenuMain';
const { ccclass, property } = _decorator;

@ccclass('storeLayer')
export class storeLayer extends layerControler {

    @property(Label)
    label_hammer:Label|null=null;   //锤子

    @property(Label)
    label_exchange:Label|null=null;  //交换

    @property(Label)
    label_refresh:Label|null=null;  //刷新

    @property(Button)
    button_addDiamond:Button=null;  //加钻石

    @property(Node)
    button_hammer_enough:Node=null;  //enough时show
    @property(Node)
    button_hammer_notEnough:Node=null;  //notEnough

    @property(Node)
    button_exchange_enough:Node=null;
    @property(Node)
    button_exchange_notEnough:Node=null;

    @property(Node)
    button_refresh_enough:Node=null;
    @property(Node)
    button_refresh_notEnough:Node=null;

    isDiamondEnough(){
        let bool=gameInitManager.getDiamondManager().isDiamondEnough(100)?true:false;
        if(bool){
            this.button_exchange_enough.active=true;
            this.button_hammer_enough.active=true;
            this.button_refresh_enough.active=true;
            this.button_exchange_notEnough.active=false;
            this.button_hammer_notEnough.active=false;
            this.button_refresh_notEnough.active=false;
        }else{
            this.button_exchange_enough.active=false;
            this.button_hammer_enough.active=false;
            this.button_refresh_enough.active=false;
            this.button_exchange_notEnough.active=true;
            this.button_hammer_notEnough.active=true;
            this.button_refresh_notEnough.active=true;   //金币不足时显示金币不足按钮，hide掉原来的按钮
        }
    }
    onClickHammerButton(){
        gameInitManager.getSoundManager().playSound("adddiamond");
        // if(gameInitManager.getDiamondManager().isDiamondEnough(gameInitManager.getLocalDataManager().getDiamondByItemName("delete"))){
        if(gameInitManager.getDiamondManager().isDiamondEnough(100)){
            // gameInitManager.getDiamondManager().subDiamond(-gameInitManager.getLocalDataManager().getDiamondByItemName("delete"));
            gameInitManager.getDiamondManager().subDiamond(-100);
            // gameInitManager.getLocalDataManager().setDiamondByItemName("delete");
            gameInitManager.getLocalDataManager().setTimesByItemName("deleteTimes",true);
            let node=find("Canvas/GameMain");
            let nodeMainMenu=find("Canvas/MainMenu");
            if(node){
                let controlnode=node.getComponent(GameMain);
                controlnode.setDiamondLabel();            
                controlnode.isPropEnough(propType.hammer);
                controlnode.setLabelTimes("deleteTimes",gameInitManager.getLocalDataManager().getTimesByItemName("deleteTimes"));        
            }
            if(nodeMainMenu){
                let controlMainMenuNode=nodeMainMenu.getComponent(MenuMain);
                controlMainMenuNode.setDiamondLabel();
            }
            this.scheduleOnce(()=>{
                this.isDiamondEnough();
            },0.1);  //0.1秒去判断一下够不够金币
        }
    }

    onClickExchangeButton(){
        gameInitManager.getSoundManager().playSound("adddiamond");
        // if(gameInitManager.getDiamondManager().isDiamondEnough(gameInitManager.getLocalDataManager().getDiamondByItemName("exchange"))){
        if(gameInitManager.getDiamondManager().isDiamondEnough(100)){
            // gameInitManager.getDiamondManager().subDiamond(-gameInitManager.getLocalDataManager().getDiamondByItemName("exchange"));
            gameInitManager.getDiamondManager().subDiamond(-100);
            // gameInitManager.getLocalDataManager().setDiamondByItemName("exchange");
            gameInitManager.getLocalDataManager().setTimesByItemName("exchangeTimes",true);
            let node=find("Canvas/GameMain");
            let nodeMainMenu=find("Canvas/MainMenu");
            if(node){
                let controlnode=node.getComponent(GameMain);
                controlnode.setDiamondLabel();    
                controlnode.isPropEnough(propType.exchange);        
                controlnode.setLabelTimes("exchangeTimes",gameInitManager.getLocalDataManager().getTimesByItemName("exchangeTimes"));        
            }
            if(nodeMainMenu){
                let controlMainMenuNode=nodeMainMenu.getComponent(MenuMain);
                controlMainMenuNode.setDiamondLabel();
            }
            this.scheduleOnce(()=>{
                this.isDiamondEnough();
            },0.1);
        }
    }

    onClickRefreshButton(){
        gameInitManager.getSoundManager().playSound("adddiamond");
        // if(gameInitManager.getDiamondManager().isDiamondEnough(gameInitManager.getLocalDataManager().getDiamondByItemName("refresh"))){
        //     gameInitManager.getDiamondManager().subDiamond(-gameInitManager.getLocalDataManager().getDiamondByItemName("refresh"));
        if(gameInitManager.getDiamondManager().isDiamondEnough(100)){
            gameInitManager.getDiamondManager().subDiamond(-100);
            // gameInitManager.getLocalDataManager().setDiamondByItemName("refresh");
            gameInitManager.getLocalDataManager().setTimesByItemName("refreshTimes",true);
            let node=find("Canvas/GameMain");
            let nodeMainMenu=find("Canvas/MainMenu");
            if(node){
                let controlnode=node.getComponent(GameMain);
                controlnode.setDiamondLabel();            
                controlnode.isPropEnough(propType.refresh);
                controlnode.setLabelTimes("refreshTimes",gameInitManager.getLocalDataManager().getTimesByItemName("refreshTimes"));        
            }
            if(nodeMainMenu){
                let controlMainMenuNode=nodeMainMenu.getComponent(MenuMain);
                controlMainMenuNode.setDiamondLabel();
            }
            this.scheduleOnce(()=>{
                this.isDiamondEnough();
            },0.1);
        }
    }

    onClickBuyButton(){
        gameInitManager.getAdManager().setRewardType(rewardType.addDiamond);
        gameInitManager.getAdManager().setAddLayerType(addMoney.storeLayer);
        //TODO：广告判断未做
        let node=find("Canvas/GameMain");
        let nodeMainMenu=find("Canvas/MainMenu");
            if(node){
                gameInitManager.getAdManager().setRewardLayer(rewardLayer.mainGame);
                let controlnode=node.getComponent(GameMain);
                controlnode.setDiamondLabel();            
                this.scheduleOnce(()=>{
                    gameInitManager.getAdManager().onReward(this.node);
                },0.5);      

            }
            if(nodeMainMenu){
                gameInitManager.getAdManager().setRewardLayer(rewardLayer.mainMenu);
                let controlMainMenuNode=nodeMainMenu.getComponent(MenuMain);
                controlMainMenuNode.setDiamondLabel();
                this.scheduleOnce(()=>{
                    gameInitManager.getAdManager().onReward(this.node);
                    this.isDiamondEnough();
                },0.5);
            }
    }
}



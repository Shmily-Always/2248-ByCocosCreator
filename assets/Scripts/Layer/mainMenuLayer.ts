import { _decorator, Component, Node, find, sys, game, director, Widget } from 'cc';
import { layerControler } from '../Controler/layerControler';
import { GameMain } from '../GameMain';
import gameInitManager from '../Manager/GameManager';
import AdManager from '../../Extend/Ad/Platforms/AdManager';
import AdsIdConfig, { EPlatform } from '../../Extend/Ad/Platforms/AdsIdConfig';
// import AdManager from '../../resources/Extend/Ad/Platforms/AdManager';
const { ccclass, property } = _decorator;

@ccclass('mainMenuLayer')
export class mainMenuLayer extends layerControler {

    beenOpenVoice:boolean=true; //开启声音
    beenOpenVibrate:boolean=true;  //开启震动

    // @property(Node)
    // voiceNode:Node=null;

    // @property(Node)
    // vibrateNode:Node=null;

    @property(Node)
    voiceNoNode:Node=null;

    @property(Node)
    vibrateNoNode:Node=null;
    
    refreshValue(){
        this.beenOpenVibrate=gameInitManager.getLocalDataManager().getOpenVibrateByLocalData()?true:false;
        this.beenOpenVoice=gameInitManager.getLocalDataManager().getOpenSoundByLocalData()?true:false;
        this.showButtonState();
        gameInitManager.getSoundManager().setIsOpenSound(this.beenOpenVoice);
        gameInitManager.getVibrateManager().setIsOpenVibrate(this.beenOpenVibrate);
    }
    
    showButtonState(){
        // this.voiceNode.active=this.beenOpenVoice;
        // this.vibrateNode.active=this.beenOpenVibrate;
        if(AdsIdConfig.platform==EPlatform.HUAWEI){
            let button_exit=this.node.getChildByName("Mid").getChildByName("button_exit");
            let button_stop=this.node.getChildByName("Mid").getChildByName("button_stop");
            console.log(button_exit);
            console.log(button_stop);
            button_stop.getComponent(Widget).top=145;
            console.log(button_exit.getPosition());
            console.log(button_stop.getPosition());
            button_exit.active=true;
        }
        this.voiceNoNode.active = !this.beenOpenVoice;
        this.vibrateNoNode.active = !this.beenOpenVibrate;
    }

    onClickMainMenu(){
        if(AdsIdConfig.platform==EPlatform.TikTok){
            AdManager.getInstance().showBanner();
            AdManager.getInstance().stopRecordScreen();
            let node=find("Canvas/GameMain");
            let controlNode=node.getComponent(GameMain);
            controlNode.gameTime=0;
            controlNode.inPlayGame=false;
        }else if(AdsIdConfig.platform==EPlatform.VIVO){
            AdManager.getInstance().hideBanner();
            AdManager.getInstance().showBanner();
        }
        
        director.loadScene("MainMenu");
    }

    onClickSound(){
        this.beenOpenVoice=!this.beenOpenVoice;
        gameInitManager.getSoundManager().setIsOpenSound(this.beenOpenVoice);
        this.setLocalData();
        this.showButtonState();
        gameInitManager.getSoundManager().playSound("button");
    }   

    onClickVibrate(){
        this.beenOpenVibrate=!this.beenOpenVibrate;
        gameInitManager.getVibrateManager().setIsOpenVibrate(this.beenOpenVibrate);
        this.setLocalData();
        this.showButtonState();
        gameInitManager.getVibrateManager().vibrate();  
    }

    setLocalData(){
        gameInitManager.getLocalDataManager().setMenuDataToLocalData(this.beenOpenVoice,this.beenOpenVibrate);
    }

    onClickClothes(){
        let node=find("Canvas/GameMain");
        let controlNode=node.getComponent(GameMain);
        controlNode.showClothesLayer();
        this.onClickCloseButton();
    }

    onClickExit(){
        // //测试用清数据
        let gameNode=find("Canvas/GameMain");
        let controlNode=gameNode.getComponent(GameMain);
        gameInitManager.getLocalDataManager().removeAllLocalData();
        controlNode.setScoreLabel(0);
        controlNode.setHighScoreLabel(0);
        controlNode.setTotalScore(gameInitManager.getLocalDataManager().getTotalScoreByLocalData());
        controlNode.setNowScore(Number(gameInitManager.getLocalDataManager().getNowScoreByLocalData()));
        controlNode.getLevel();
        controlNode.setDiamondLabel();
        controlNode.setLabelTimes("deleteTimes", 1);
        controlNode.setLabelTimes("exchangeTimes", 1);
        controlNode.setLabelTimes("refreshTimes", 1);

        gameInitManager.getGameMainDataManager().setSumScore(-1);
        gameInitManager.getGameMainDataManager().initBlockData();
        gameInitManager.getGameMainDataManager().RecoveryAllBlockNode();
        gameInitManager.getGameMainDataManager().CreateBlock();
        // sys.localStorage.setItem("refresh","100");
        // sys.localStorage.setItem("delete","100");
        // sys.localStorage.setItem("exchange","100");
        gameInitManager.getTipsManager().create('已清除数据!准备退出游戏......',this.node);
        this.scheduleOnce(()=>{
            game.end();
            //TODO:华为退出游戏
            // AdManager.getInstance().exitApplication();
        },5)
        // this.onClickCloseButton();

        // 退出游戏，不需要加这个按钮
        // game.end();


        
        

    }
}



import { _decorator, Component, Node, find } from 'cc';
import { layerControler } from '../Controler/layerControler';
import gameInitManager from '../Manager/GameManager';
import { MenuMain } from '../MenuMain';
const { ccclass, property } = _decorator;

@ccclass('settingLayer')
export class settingLayer extends layerControler {
    beenOpenVoice:boolean=true; //开启声音
    beenOpenVibrate:boolean=true;  //开启震动

    @property(Node)
    voice:Node=null;

    @property(Node)
    vibrate:Node=null;

    refreshValue(){
        this.beenOpenVibrate=gameInitManager.getLocalDataManager().getOpenVibrateByLocalData()?true:false;
        this.beenOpenVoice=gameInitManager.getLocalDataManager().getOpenSoundByLocalData()?true:false;
        this.showButtonState();
        gameInitManager.getSoundManager().setIsOpenSound(this.beenOpenVoice);
        gameInitManager.getVibrateManager().setIsOpenVibrate(this.beenOpenVibrate);
    }

    showButtonState(){
        this.voice.active=this.beenOpenVoice;
        this.vibrate.active=this.beenOpenVibrate;
    }

    onClickSound(){
        this.beenOpenVoice=!this.beenOpenVoice;
        gameInitManager.getSoundManager().setIsOpenSound(this.beenOpenVoice);
        this.setLocalData()
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

    onClickIntroduce(){
        this.onClickCloseButton();
        let node=find("Canvas/MainMenu");
        let controlNode=node.getComponent(MenuMain);
        controlNode.showGuildLayer();
    }
}



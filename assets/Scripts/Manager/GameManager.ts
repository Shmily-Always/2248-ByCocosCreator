import { _decorator, Component, Node } from 'cc';
import { AddDiamondManager, getAddDiamondManagerInstance } from './AddDiamondManager';
import { BgManager, getBgManagerInstance } from './BgManager';
import { GameMainDataManager, getGameMainDataManagerInstance } from './GameMainDataManager';
import { GetLocalDataMgrInstance, LocalDataManager } from './LocalDataManager';
import { getAdManagerInstance, RewardManager } from './RewardManager';
import { getSoundManagerInstance, SoundManager } from './SoundManager';
import { getVibrateManagerInstance, VibrateManager } from './VibrateManager';
import { getTipsManagerInstance, TipsManager } from './TipsManager';


const { ccclass, property } = _decorator;

@ccclass('GameManager')
class GameManager {
    
    gameDataManager:GameMainDataManager;
    localDataManager:LocalDataManager;
    diamondManager:AddDiamondManager;
    adManager:RewardManager;
    soundManager:SoundManager;
    vibrateManager:VibrateManager;
    bgManager:BgManager;
    tipsManager:TipsManager;

    initManager(){
        this.bgManager=getBgManagerInstance();
        this.adManager=getAdManagerInstance();
        this.gameDataManager=getGameMainDataManagerInstance();
        this.diamondManager=getAddDiamondManagerInstance();
        this.localDataManager=GetLocalDataMgrInstance();
        this.soundManager=getSoundManagerInstance();
        this.vibrateManager=getVibrateManagerInstance();
        this.tipsManager=getTipsManagerInstance();
    }

    getBgManager(){
        return this.bgManager;
    }

    getSoundManager(){
        return this.soundManager;
    }
    getAdManager(){
        return this.adManager;
    }
    getLocalDataManager() {
        return this.localDataManager;
    }
    getGameMainDataManager(){
        return this.gameDataManager;
    }
    getDiamondManager(){
        return this.diamondManager;
    }
    getVibrateManager(){
        return this.vibrateManager;
    }

    getTipsManager(){
        return this.tipsManager;
    }
}

var gameInitManager =new GameManager();
export default gameInitManager;
// window["gameInitManager"]=gameInitManager;



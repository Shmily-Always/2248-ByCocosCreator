import { _decorator, Component, Node, Label, Button, Prefab, instantiate, TextAsset, warn, UIOpacity, AudioSource, director, Widget } from 'cc';
import { blockSetting } from './blockSetting';
import { colorData } from './Common/Enum';
import tools from './Common/Tools';
import { guildLayer } from './Layer/guildLayer';
import { playerLayer } from './Layer/playerLayer';
import { rankingLayer } from './Layer/rankingLayer';
import { registLayer } from './Layer/registLayer';
import { settingLayer } from './Layer/settingLayer';
import { storeLayer } from './Layer/storeLayer';
import gameInitManager from './Manager/GameManager';
import AdManager from '../Extend/Ad/Platforms/AdManager';
import AdsIdConfig, { EPlatform } from '../Extend/Ad/Platforms/AdsIdConfig';
import { AdLogUtil } from '../Extend/Ad/Util/AdLogUtil';
// import { TipsManager } from './Manager/TipsManager';
// import AdManager from '../resources/Extend/Ad/Platforms/AdManager';
// import AdsIdConfig, { EPlatform } from '../resources/Extend/Ad/Platforms/AdsIdConfig';
const { ccclass, property } = _decorator;

@ccclass('MenuMain')
export class MenuMain extends Component {

    @property(Node)
    sumBlockMain: Node = null;     //看看正中间块有没有用


    @property(Label)
    label_currentHighScore: Label | null = null;  //最右侧的最高分

    @property(Label)
    label_currentDiamond: Label | null = null;  //钻石数量

    @property(Button)   //钻石旁+号
    diamondAddButton: Button = null;

    @property(Prefab)   //商店(点击钻石的add，三个按钮无次数时)
    storeLayerPrefab: Prefab = null;
    storeLayer: Node;

    @property(Prefab)  //玩家信息
    playerLayerPrefab: Prefab = null;
    playerLayer: Node;

    @property(Prefab)  //签到
    registLayerPrefab: Prefab = null;
    registLayer: Node;

    @property(Prefab)  //设置
    settingLayerPrefab: Prefab = null;
    settingLayer: Node;

    @property(Prefab)  //排名
    rankingLayerPrefab: Prefab = null;
    rankingLayer: Node;

    @property(Prefab)  //新手引导
    guildLayerPrefab: Prefab = null;
    guildLayer: Node;

    @property(AudioSource)
    _audioSource: AudioSource = null;   //不显示

    onLoad() {
        const audioSource = this.node.getComponent(AudioSource);  //需要在load的时候就预加载声音
        this._audioSource = audioSource;
        gameInitManager.initManager();
        this.initColorData();
        this.getRankingData();
        gameInitManager.getSoundManager().getSound(this._audioSource);
        gameInitManager.getLocalDataManager().setFirstStartTime(Date.parse(new Date().toString()));
    }

    start() {
        director.preloadScene("MainGame", function () {
            console.log("next scene is preloaded!");
        })
        // console.log("ad_data is ",AdsIdConfig.adConfig);

        if (AdsIdConfig.platform == EPlatform.OPPO) {
            // console.log("this.node ",this.node);
            this.node.getChildByName("gameTop").getChildByName("moreGame").active = true;
            this.node.getChildByName("gameTop").getChildByName("addToDesktop").active = true;
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            this.node.getChildByName("gameTop").getChildByName("addToDesktop").active = true;
            AdManager.getInstance().showNavigateBoxPortal();
            // }else if(AdsIdConfig.platform==EPlatform.Platform4399){
            //     this.node.getChildByName("gameTop").getChildByName("addToDesktop").active=true;
        } else if (AdsIdConfig.platform == EPlatform.TikTok) {
            let skillBox = this.node.getChildByName("gameBottom").getChildByName("Skill");
            skillBox.getComponent(Widget).top = 0;
        }else if(AdsIdConfig.platform==EPlatform.HUAWEI){
            this.node.getChildByName("gameTop").getChildByName("addToDesktop").active = true;
        }

        this.setHighScoreLabel(Number(gameInitManager.getLocalDataManager().getMaxScoreByLocalData()));
        this.setDiamondLabel();

        gameInitManager.getLocalDataManager().getTimesByItemName("deleteTimes");
        gameInitManager.getLocalDataManager().getTimesByItemName("exchangeTimes");
        gameInitManager.getLocalDataManager().getTimesByItemName("refreshTimes");

        if (gameInitManager.getLocalDataManager().getNotSign()) {
            gameInitManager.getLocalDataManager().setSigningDay(1);
        }
        //设置可签到状态
        if (gameInitManager.getLocalDataManager().getSigningDate() != new Date().getDate()) {  //当日期不等的时候就可以签到了
            gameInitManager.getLocalDataManager().setIsCanSigning(1);
        } else {
            gameInitManager.getLocalDataManager().setIsCanSigning(0);
        }

        this.settingLayer = instantiate(this.settingLayerPrefab);
        this.settingLayer.parent = this.node;
        this.settingLayer.setPosition(800, 0);
        this.settingLayer.getComponent(UIOpacity).opacity = 0;
        let controlSettingLayer = this.settingLayer.getComponent(settingLayer);
        controlSettingLayer.refreshValue();

        this.storeLayer = instantiate(this.storeLayerPrefab);
        this.storeLayer.parent = this.node;
        this.storeLayer.setPosition(800, 0);
        this.storeLayer.getComponent(UIOpacity).opacity = 0;

        this.playerLayer = instantiate(this.playerLayerPrefab);
        this.playerLayer.parent = this.node;
        this.playerLayer.setPosition(800, 0);
        this.playerLayer.getComponent(UIOpacity).opacity = 0;

        this.registLayer = instantiate(this.registLayerPrefab);
        this.registLayer.parent = this.node;
        this.registLayer.setPosition(800, 0);
        this.registLayer.getComponent(UIOpacity).opacity = 0;

        this.rankingLayer = instantiate(this.rankingLayerPrefab);
        this.rankingLayer.parent = this.node;
        this.rankingLayer.setPosition(800, 0);
        this.rankingLayer.getComponent(UIOpacity).opacity = 0;

        this.guildLayer = instantiate(this.guildLayerPrefab);
        this.guildLayer.parent = this.node;
        this.guildLayer.setPosition(800, 0);
        this.guildLayer.getComponent(UIOpacity).opacity = 0;

        AdManager.getInstance().showBanner();
    }


    onClickPlay() {
        let firstTime = gameInitManager.getLocalDataManager().getIsFirstTime();
        if (firstTime) {
            this.showGuildLayer();
            gameInitManager.getLocalDataManager().setIsFirstTime("false");
        } else {
            // AdManager.getInstance().showBanner();
            if (AdsIdConfig.platform == EPlatform.TikTok) {
                AdManager.getInstance().hideBanner();
                AdManager.getInstance().StartRecorder();
            }
            director.loadScene("MainGame");
        }
    }

    async initColorData() {
        await gameInitManager.getGameMainDataManager().getColorData(gameInitManager.getLocalDataManager().getBlockBg()).then(() => {
            let curMaxValue = gameInitManager.getLocalDataManager().getMaxBlockData();
            let color = gameInitManager.getGameMainDataManager().getBlockColor(curMaxValue);
            let controlBlock = this.sumBlockMain.getComponent(blockSetting);
            controlBlock.initBlock(-1, -1, curMaxValue, color);
        });
    }

    async getRankingData() {
        await gameInitManager.getGameMainDataManager().getRankingData();
    }

    //显示最右侧的最大值
    setHighScoreLabel(number: number) {
        this.label_currentHighScore.string = number ? gameInitManager.getGameMainDataManager().specialValue(number) : "0";
    }

    //设置钻石label的文字
    setDiamondLabel() {
        this.label_currentDiamond.string = gameInitManager.getGameMainDataManager().specialValue(gameInitManager.getDiamondManager().getDiamond())
    }

    //点击钻石旁+号
    onClickStore() {
        this.showShopLayer();
    }

    //展示商店界面
    showShopLayer() {
        gameInitManager.getSoundManager().playSound("button");
        let controlStoreLayer = this.storeLayer.getComponent(storeLayer);
        if (controlStoreLayer.isShowLayer()) {
            return;
        }
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
            AdManager.getInstance().hideBanner();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }else if(AdsIdConfig.platform==EPlatform.HUAWEI){
            AdManager.getInstance().showInsertAd();
        }

        controlStoreLayer.isDiamondEnough();
        controlStoreLayer.showLayer();
    }

    //点击玩家按钮
    onClickPlayer() {
        this.showPlayerLayer();
    }

    //展示玩家界面
    showPlayerLayer() {

        gameInitManager.getSoundManager().playSound("button");
        let controlPlayerLayer = this.playerLayer.getComponent(playerLayer);
        if (controlPlayerLayer.isShowLayer()) {
            return;
        }
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
            AdManager.getInstance().hideBanner();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }else if(AdsIdConfig.platform==EPlatform.HUAWEI){
            AdManager.getInstance().showHWNativeImageAd();
        }
        controlPlayerLayer.showLayerPlayer();
    }

    //点击签到按钮
    onClickRegist() {

        // this.registLayer.getComponent(registLayer).showAlert();
        this.registLayer.getComponent(registLayer).readingOpacity();
        this.showRegistLayer();
        for (let i = 0; i < 7; i++) {
            if (i == gameInitManager.getLocalDataManager().getSigningDay() - 1 && gameInitManager.getLocalDataManager().getIsCanSigning()) {
                this.registLayer.getChildByName("Mid").children[i].getComponent(Button).interactable = true;
            } else {
                this.registLayer.getChildByName("Mid").children[i].getComponent(Button).interactable = false;
            }
        }
    }

    //展示签到界面
    showRegistLayer() {
        gameInitManager.getSoundManager().playSound("button");
        gameInitManager.getVibrateManager().vibrate();
        let controlRegistLayer = this.registLayer.getComponent(registLayer);
        if (controlRegistLayer.isShowLayer()) {
            return;
        }
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
            AdManager.getInstance().hideBanner();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }else if(AdsIdConfig.platform==EPlatform.HUAWEI){
            // AdManager.getInstance().showHWNativeImageAd();
            this.registLayer.getChildByName("NativeAd").active=true;
        }
        controlRegistLayer.showLayer();
        // if(AdsIdConfig.platform==EPlatform.VIVO){
        //     controlRegistLayer.showDelay();
        // }
    }

    //点击设置按钮
    onClickSetting() {

        this.showSettingLayer();
    }

    //展示设置界面
    showSettingLayer() {

        gameInitManager.getSoundManager().playSound("button");
        let controlSettingLayer = this.settingLayer.getComponent(settingLayer);
        if (controlSettingLayer.isShowLayer()) {
            return;
        }
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
            AdManager.getInstance().hideBanner();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }
        controlSettingLayer.showLayer();
    }

    //点击排名按钮
    onClickRanking() {
        this.showRankingLayer();
    }

    //展示排名界面
    showRankingLayer() {

        gameInitManager.getSoundManager().playSound("button");
        let controlRankingLayer = this.rankingLayer.getComponent(rankingLayer);
        if (controlRankingLayer.isShowLayer()) {
            return;
        }
        // controlRankingLayer.initGameData();

        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
            AdManager.getInstance().hideBanner();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }
        controlRankingLayer.refreshRanking();
        controlRankingLayer.showLayer();
    }

    //展示新手引导界面
    showGuildLayer() {
        // gameInitManager.getSoundManager().playSound("button");
        let controlGuildLayer = this.guildLayer.getComponent(guildLayer);
        if (controlGuildLayer.isShowLayer()) {
            return;
        }
        controlGuildLayer.hideIcon();
        controlGuildLayer.initGameData();
        // let controlGuild=this.guildLayer.getChildByName("maskLayer").getComponent(guild);
        // controlGuild.initGameData();
        controlGuildLayer.showLayer();
    }

    //OPPO更多游戏（九宫格广告）
    onClickMoreGame() {
        if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showNavigateBoxPortal();
            // console.log("this is oppo !");
        }
    }

    //vivo添加桌面，TODO:后续看oppo能不能放在这里
    onClickAddToDesktop() {
        let node = this.node.getChildByName("gameTop").getChildByName("addToDesktop");
        if (AdsIdConfig.platform == EPlatform.VIVO || AdsIdConfig.platform == EPlatform.OPPO) {
            // console.log("platform is oppo ");
            AdManager.getInstance().addDesktop(function (str) {
                // AdManager.getInstance().hasShortcutInstalled(function(res){
                    if (str) {
                        gameInitManager.getTipsManager().create('添加成功!', node);
                    } else {
                        gameInitManager.getTipsManager().create('添加失败！', node);
                    }
                // });
            });
        }else if(AdsIdConfig.platform==EPlatform.HUAWEI){
                AdManager.getInstance().hasShortcutInstalled(function(res){
                    if(res==2){
                        AdManager.getInstance().addDesktop(function (str) {
                            if (str) {
                                gameInitManager.getTipsManager().create('添加成功!', node);
                            } else {
                            // console.log("str is ",str);
                                gameInitManager.getTipsManager().create('添加失败！', node);
                            }
                        });
                    }else{
                        gameInitManager.getTipsManager().create('添加失败！已有桌面图标',node);
                    }
                    
            });
        }
    }

    //激励关闭签到界面
    closeLayer(layerName: string) {  //激励过后关闭Layer
        if (layerName == "registLayer") {
            let controlRegist = this.registLayer.getComponent(registLayer);
            controlRegist.onClickClose();
        }
    }
}



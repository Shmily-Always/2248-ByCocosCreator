import { _decorator, Component, Node, Vec2, Label, UIOpacity, UITransform, Prefab, Animation, instantiate, game, Sprite, resources, error, SpriteFrame, find, Vec3, Button, AudioSource, director, EventTouch, view, ImageAsset, tween } from 'cc';
import { blockSetting } from './blockSetting';
import { colorData, effectActioin, propType, rewardType } from './Common/Enum';
import { skillControler } from './Controler/skillControler';
import { touchControler } from './Controler/touchControler';
import { addMaxBlockLayer } from './Layer/addMaxBlockLayer';
import { clothesLayer } from './Layer/clothesLayer';
import { deleteMinBlockLayer } from './Layer/deleteMinBlockLayer';
import { doubleLayer } from './Layer/doubleLayer';
import { exchangeLayer } from './Layer/exchangeLayer';
import { hammerLayer } from './Layer/hammerLayer';
import { mainMenuLayer } from './Layer/mainMenuLayer';
import { rewardExchangeLayer } from './Layer/rewardExchangeLayer';
import { rewardHammerLayer } from './Layer/rewardHammerLayer';
import { rewardRefreshLayer } from './Layer/rewardRefreshLayer';
import { storeLayer } from './Layer/storeLayer';
import { unlockLayer } from './Layer/unlockLayer';
import gameInitManager from './Manager/GameManager';
import { comboEleLayer } from './Layer/comboEleLayer';
import { comboTweLayer } from './Layer/comboTweLayer';
import { comboThrLayer } from './Layer/comboThrLayer';
import { comboForLayer } from './Layer/comboForLayer';
import { comboTenLayer } from './Layer/comboTenLayer';
import { notEnoughLayer } from './Layer/notEnoughLayer';
// import AdManager from '../resources/Extend/Ad/Platforms/AdManager';
// import AdsIdConfig, { EPlatform } from '../resources/Extend/Ad/Platforms/AdsIdConfig';
import { shareLayer } from './Layer/shareLayer';
import AdManager from '../Extend/Ad/Platforms/AdManager';
import AdsIdConfig, { EPlatform } from '../Extend/Ad/Platforms/AdsIdConfig';
import { AdLogUtil } from '../Extend/Ad/Util/AdLogUtil';
import { passLayer } from './Layer/passLayer';
import { treasureLayer } from './Layer/treasureLayer';
// import AdManager from '../resources/Extend/Ad/Platforms/AdManager';

const { ccclass, property } = _decorator;

@ccclass('GameMain')
export class GameMain extends Component {
    colorData: colorData;

    @property(Node)
    sumBlock: Node = null;
    @property(Label)
    label_score: Label | null = null;   //正中间显示的最大值
    @property(Label)
    label_currentHighScore: Label | null = null;  //最右侧的最高分
    @property(Node)
    label_score_bg: Node = null;

    @property(Label)
    label_nowScore: Label | null = null;  //现在分数

    @property(Label)
    label_passScore: Label | null = null;  //通关分数

    @property(Label)
    label_level: Label | null = null;  //第n关

    @property(Node)
    addDiamondEffect: Node = null;  //加钻石特效

    @property(Node)
    showComboEffect: Node = null;  //连击动画
    @property(Prefab)
    showComboEffectPrefab: Prefab = null;  //连击预制体

    @property(Label)
    label_addDiamond: Label | null = null;  //加钻石数字(闯关成功界面)
    @property(Prefab)
    addDiamondEffectPrefab: Prefab = null;  //加钻石预制体（闯关成功)

    @property(Node)
    effect: Node = null;  //游戏内加钻石动画控制

    @property(Label)
    label_deleteText: Label | null = null;  //删除次数

    @property(Label)
    label_exchangeText: Label | null = null;  //交换次数

    @property(Label)
    label_refreshText: Label | null = null;  //重置次数

    @property(Node)
    clearEffect: Node = null;  //方块破碎

    @property([SpriteFrame])
    combo: SpriteFrame[] = [];

    @property(Prefab)
    mainMenuLayerPrefab: Prefab = null;   //主菜单弹窗预制体
    mainMenuLayer: Node;

    @property(Prefab)
    doubleLayerPrefab: Prefab = null;   //双倍弹窗预制体
    doubleLayer: Node;  //双倍（512后）

    @property(Prefab)
    hammerLayerPrefab: Prefab = null;  //锤子弹窗预制体
    hammerLayer: Node //锤子(点击道具后)

    @property(Prefab)
    exchangeLayerPrefab: Prefab = null; //交换弹窗预制体
    exchangeLayer: Node  //交换（点击道具后）


    @property(Prefab)   //消除最小块(2048后)
    deleteMinBlockLayerPrefab: Prefab = null;
    minBlockLayer: Node;

    @property(Prefab)  //过关(256后)
    unlockLayerPrefab: Prefab = null;
    unlockLayer: Node;

    @property(Prefab)   //增加最大块(2048后)
    addMaxBlockLayerPrefab: Prefab = null;
    addMaxBlockLayer: Node;

    @property(Button)   //钻石旁+号
    addButton: Button = null;

    @property(Prefab)   //商店(点击钻石的add，三个按钮无次数时)
    storeLayerPrefab: Prefab = null;
    storeLayer: Node;

    canShowIntroduce: boolean = true;  //用于解决技能介绍和商店界面一起展示的问题

    @property(Prefab)    //连线奖励锤子
    rewardHammerLayerPrefab: Prefab = null;
    rewardHammerLayer: Node;

    @property(Prefab)   //连线奖励交换
    rewardExchangeLayerPrefab: Prefab = null;
    rewardExchangeLayer: Node;

    @property(Prefab)  //连线奖励刷新
    rewardRefreshLayerPrefab: Prefab = null;
    rewardRefreshLayer: Node;

    @property(Prefab)
    clothesLayerPrefab: Prefab = null;  //衣柜预制体
    clothesLayer: Node

    @property(AudioSource)
    _audioSource: AudioSource = null;   //不显示

    @property(Prefab)
    comboTenPrefab: Prefab = null;
    comboTenLayer: Node;

    @property(Prefab)
    comboElePrefab: Prefab = null;
    comboEleLayer: Node;

    @property(Prefab)
    comboTwePrefab: Prefab = null;
    comboTweLayer: Node;

    @property(Prefab)
    comboThrPrefab: Prefab = null;
    comboThrLayer: Node;

    @property(Prefab)
    comboForPrefab: Prefab = null;
    comboForLayer: Node;

    isShowCombo = false;  //是否展示连击数量中

    bgNode: Node;  //背景节点

    notEnoughGold: Sprite = null;

    @property(Prefab)   //金币不足弹窗
    notEnoughPrefab: Prefab = null;
    notEnoughLayer: Node;

    @property(Prefab)   //分享弹窗
    sharePrefab: Prefab = null;
    shareLayer: Node;

    // @property(Prefab)  //宝箱弹窗
    // treasurePrefab:Prefab =null;
    // treasureLayer:Node;

    @property(Prefab)
    passLayerPrefab:Prefab=null;
    passLayer: Node;   //过关弹窗

    gameTime = 0;
    inPlayGame = false;
    showShare = false;   //是否已展示分享弹窗

    onLoad() {
        const audioSource = this.node.getComponent(AudioSource);  //需要在load的时候就预加载声音
        this._audioSource = audioSource;

        gameInitManager.initManager();  //加载所有的Manager
        gameInitManager.getSoundManager().getSound(this._audioSource);

        // this.fitBg();
    }
    start() {

        gameInitManager.getBgManager().initBgData();
        gameInitManager.getGameMainDataManager().initGameData();
        // let node=find("Canvas/GameMain/blockContainer/touchLayer");
        // let controlNode=node.getComponent(touchControler);
        // controlNode.lineNumListHammer=[];
        // controlNode.lineNumListExchange=[];
        // controlNode.lineNumListRefresh=[];
        this.setScoreLabel(gameInitManager.getGameMainDataManager().getSumScore());   //设置后才可在start时读取本地信息
        this.setHighScoreLabel(Number(gameInitManager.getLocalDataManager().getMaxScoreByLocalData()));
        this.setTotalScore(gameInitManager.getLocalDataManager().getTotalScoreByLocalData());
        this.setNowScore(Number(gameInitManager.getLocalDataManager().getNowScoreByLocalData()));
        this.getLevel();
        this.setDiamondLabel();
        this.setLabelTimes("deleteTimes", gameInitManager.getLocalDataManager().getTimesByItemName("deleteTimes"));
        this.setLabelTimes("exchangeTimes", gameInitManager.getLocalDataManager().getTimesByItemName("exchangeTimes"));
        this.setLabelTimes("refreshTimes", gameInitManager.getLocalDataManager().getTimesByItemName("refreshTimes"));
        this.isPropEnough(propType.hammer);
        this.isPropEnough(propType.exchange);
        this.isPropEnough(propType.refresh);
        this.addDiamondEffect = instantiate(this.addDiamondEffectPrefab);
        this.addDiamondEffect.parent = this.node;
        this.addDiamondEffect.active = false;

        this.storeLayer = instantiate(this.storeLayerPrefab);
        this.storeLayer.parent = this.node;
        this.storeLayer.setPosition(800, 0);
        this.storeLayer.getComponent(UIOpacity).opacity = 0;

        this.showComboEffect = instantiate(this.showComboEffectPrefab)
        this.showComboEffect.parent = this.effect;
        this.showComboEffect.active = false;

        this.mainMenuLayer = instantiate(this.mainMenuLayerPrefab);
        this.mainMenuLayer.parent = this.node;
        this.mainMenuLayer.setPosition(800, 0);
        this.mainMenuLayer.getComponent(UIOpacity).opacity = 0;
        let controlMainMenuLayer = this.mainMenuLayer.getComponent(mainMenuLayer);
        controlMainMenuLayer.refreshValue();

        //弃用(?)，现在改为show文字
        // this.addDiamondEffect=instantiate(this.addDiamondEffectPrefab);
        // this.addDiamondEffect.parent=this.effect;
        // this.addDiamondEffect.active=false;

        this.doubleLayer = instantiate(this.doubleLayerPrefab);
        this.doubleLayer.parent = this.node;
        this.doubleLayer.setPosition(800, 0);
        this.doubleLayer.getComponent(UIOpacity).opacity = 0;

        this.hammerLayer = instantiate(this.hammerLayerPrefab);
        this.hammerLayer.parent = this.node;
        this.hammerLayer.setPosition(800, 0);
        this.hammerLayer.getComponent(UIOpacity).opacity = 0;


        this.exchangeLayer = instantiate(this.exchangeLayerPrefab);
        this.exchangeLayer.parent = this.node;
        this.exchangeLayer.setPosition(800, 0);
        this.exchangeLayer.getComponent(UIOpacity).opacity = 0;


        this.minBlockLayer = instantiate(this.deleteMinBlockLayerPrefab);
        this.minBlockLayer.parent = this.node;
        this.minBlockLayer.setPosition(800, 0);
        this.minBlockLayer.getComponent(UIOpacity).opacity = 0;


        this.unlockLayer = instantiate(this.unlockLayerPrefab);
        this.unlockLayer.parent = this.node;
        this.unlockLayer.setPosition(800, 0);
        this.unlockLayer.getComponent(UIOpacity).opacity = 0;


        this.addMaxBlockLayer = instantiate(this.addMaxBlockLayerPrefab);
        this.addMaxBlockLayer.parent = this.node;
        this.addMaxBlockLayer.setPosition(800, 0);
        this.addMaxBlockLayer.getComponent(UIOpacity).opacity = 0;


        this.rewardHammerLayer = instantiate(this.rewardHammerLayerPrefab);
        this.rewardHammerLayer.parent = this.node;
        this.rewardHammerLayer.setPosition(800, 0);
        this.rewardHammerLayer.getComponent(UIOpacity).opacity = 0;


        this.rewardExchangeLayer = instantiate(this.rewardExchangeLayerPrefab);
        this.rewardExchangeLayer.parent = this.node;
        this.rewardExchangeLayer.setPosition(800, 0);
        this.rewardExchangeLayer.getComponent(UIOpacity).opacity = 0;


        this.rewardRefreshLayer = instantiate(this.rewardRefreshLayerPrefab);
        this.rewardRefreshLayer.parent = this.node;
        this.rewardRefreshLayer.setPosition(800, 0);
        this.rewardRefreshLayer.getComponent(UIOpacity).opacity = 0;


        this.clothesLayer = instantiate(this.clothesLayerPrefab);
        this.clothesLayer.parent = this.node;
        this.clothesLayer.setPosition(800, 0);
        this.clothesLayer.getComponent(UIOpacity).opacity = 0;

        this.comboTenLayer = instantiate(this.comboTenPrefab);
        this.comboTenLayer.parent = this.node;
        this.comboTenLayer.setPosition(800, 0);
        this.comboTenLayer.getComponent(UIOpacity).opacity = 0;

        this.comboEleLayer = instantiate(this.comboElePrefab);
        this.comboEleLayer.parent = this.node;
        this.comboEleLayer.setPosition(800, 0);
        this.comboEleLayer.getComponent(UIOpacity).opacity = 0;

        this.comboTweLayer = instantiate(this.comboTwePrefab);
        this.comboTweLayer.parent = this.node;
        this.comboTweLayer.setPosition(800, 0);
        this.comboTweLayer.getComponent(UIOpacity).opacity = 0;

        this.comboThrLayer = instantiate(this.comboThrPrefab);
        this.comboThrLayer.parent = this.node;
        this.comboThrLayer.setPosition(800, 0);
        this.comboThrLayer.getComponent(UIOpacity).opacity = 0;

        this.comboForLayer = instantiate(this.comboForPrefab);
        this.comboForLayer.parent = this.node;
        this.comboForLayer.setPosition(800, 0);
        this.comboForLayer.getComponent(UIOpacity).opacity = 0;

        this.notEnoughLayer = instantiate(this.notEnoughPrefab);
        this.notEnoughLayer.parent = this.node;
        this.notEnoughLayer.setPosition(800, 0);
        this.notEnoughLayer.getComponent(UIOpacity).opacity = 0;

        this.shareLayer = instantiate(this.sharePrefab);
        this.shareLayer.parent = this.node;
        this.shareLayer.setPosition(800, 0);
        this.shareLayer.getComponent(UIOpacity).opacity = 0;

        this.passLayer=instantiate(this.passLayerPrefab);
        this.passLayer.parent=this.node;
        this.passLayer.setPosition(800,0);
        this.passLayer.getComponent(UIOpacity).opacity=0;

        // this.treasureLayer=instantiate(this.treasurePrefab);
        // this.treasureLayer.parent=this.node;
        // this.treasureLayer.setPosition(800,0);
        // this.treasureLayer.getComponent(UIOpacity).opacity=0;

        this.effect.setSiblingIndex(99);

        this.inPlayGame = true;
        director.preloadScene("MainMenu", function () {
            AdLogUtil.Log("next scene is preloaded!");
        });
    }


    //更换背景图
    setBg() {
        gameInitManager.getBgManager().changeBg(gameInitManager.getLocalDataManager().getBgNumber());
    }

    //显示最大值方块(正中间小方块)
    setSumBlock(isShow: boolean, touchedBlockList?: Vec2[]) {
        if (!isShow) {
            this.sumBlock.active = false;
            this.label_score.node.getComponent(UIOpacity).opacity = 255;  //如果不显示方块，就显示数字
            this.label_score_bg.getComponent(UIOpacity).opacity = 255;
            return;
        }
        this.sumBlock.active = true;
        this.label_score.node.getComponent(UIOpacity).opacity = 0;  //如果展示了方块，就不展示最高分（但是最高分依然在计算）
        this.label_score_bg.getComponent(UIOpacity).opacity = 0;   //同时隐藏最高分的背景
        let sumScore = 0;
        for (let i = 0; i < touchedBlockList.length; i++) {
            let blockPos = touchedBlockList[i];
            let value = gameInitManager.getGameMainDataManager().blockDataList.getValue(blockPos.y, blockPos.x);  //从已连接的方块中取最大值展示，getValue返回[x][y]的最大值value=2^n
            sumScore += Math.pow(2, value);  //显示的分数总和:2^n+2^n+2^n
        }
        let id = Math.ceil(Math.log2(sumScore));  //取最大值的对数值颜色显示方块
        let color = gameInitManager.getGameMainDataManager().getBlockColor(id);
        let controlBlock = this.sumBlock.getComponent(blockSetting);
        controlBlock.initBlock(-1, -1, id, color); //因为是在最上层生成，不在block中
    }

    //设置钻石label的文字
    setDiamondLabel() {
        this.label_addDiamond.string = gameInitManager.getGameMainDataManager().specialValue(gameInitManager.getDiamondManager().getDiamond())
    }

    //奖励钻石动画
    showAddDiamondAnimation() {
        gameInitManager.getVibrateManager().vibrate();
        this.scheduleOnce(() => {
            this.setDiamondLabel();
            //TODO：声音未做
        }, effectActioin.addMoneyTime);
    }

    //获取关卡数
    getLevel() {
        this.label_level.string = (gameInitManager.getLocalDataManager().getLevelByLocalData()).toString();
    }

    showNotEnough() {
        gameInitManager.getSoundManager().playSound("button");
        gameInitManager.getVibrateManager().vibrate();
        let controlNotEnough = this.notEnoughLayer.getComponent(notEnoughLayer);
        if (controlNotEnough.isShowLayer()) {
            return;
        }
        controlNotEnough.showLayer();
        controlNotEnough.showDelay();
    }

    //Combo框
    showComboText(times: number) {
        this.isShowCombo = true;
        gameInitManager.getVibrateManager().vibrate();
        this.showComboEffect.active = true;
        let anim = this.showComboEffect.getComponent(Animation);
        let time = [4, 5, 6, 7, 8];
        for (let i = 0; i < time.length; i++) {
            if (times == time[i]) {
                let sprite = this.showComboEffect.getChildByName("Sprite").getComponent(Sprite);
                sprite.spriteFrame = this.combo[i];
            }
            //废弃
            // }else if(times>=15){  //16以上全用同一张
            //     console.log("times >=15!");
            //     let sprite=this.showComboEffect.getChildByName("Sprite").getComponent(Sprite);
            //     sprite.spriteFrame=this.combo[11];
            // }
            anim.play("reward");
        }

    }

    //combo界面
    showCombo10Layer() {
        gameInitManager.getSoundManager().playSound("button");
        gameInitManager.getVibrateManager().vibrate();
        let controlComboLayer = this.comboTenLayer.getComponent(comboTenLayer);
        if (controlComboLayer.isShowLayer()) {
            return;
        }
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            //vivo添加逻辑，展示插屏时关闭普通banner
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }
        controlComboLayer.showLayer();
        controlComboLayer.playAnim();
        // if(AdsIdConfig.platform==EPlatform.TikTok){

        // }
    }

    showCombo11Layer() {
        //TODO:combo声音可能需要改
        gameInitManager.getSoundManager().playSound("button");
        gameInitManager.getVibrateManager().vibrate();
        let controlComboLayer = this.comboEleLayer.getComponent(comboEleLayer);
        if (controlComboLayer.isShowLayer()) {
            return;
        }
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }
        controlComboLayer.showLayer();
        controlComboLayer.playAnim();
        // if(AdsIdConfig.platform==EPlatform.TikTok){

        // }
    }

    showCombo12Layer() {
        gameInitManager.getSoundManager().playSound("button");
        gameInitManager.getVibrateManager().vibrate();
        let controlComboLayer = this.comboTweLayer.getComponent(comboTweLayer);
        if (controlComboLayer.isShowLayer()) {
            return;
        }
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }
        controlComboLayer.showLayer();
        controlComboLayer.playAnim();
        // if(AdsIdConfig.platform==EPlatform.TikTok){

        // }
    }

    showCombo13Layer() {
        gameInitManager.getSoundManager().playSound("button");
        gameInitManager.getVibrateManager().vibrate();
        let controlComboLayer = this.comboThrLayer.getComponent(comboThrLayer);
        if (controlComboLayer.isShowLayer()) {
            return;
        }
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }
        controlComboLayer.showLayer();
        controlComboLayer.playAnim();
        // if(AdsIdConfig.platform==EPlatform.TikTok){

        // }
    }

    showCombo14Layer() {
        gameInitManager.getSoundManager().playSound("button");
        gameInitManager.getVibrateManager().vibrate();
        let controlComboLayer = this.comboForLayer.getComponent(comboForLayer);
        if (controlComboLayer.isShowLayer()) {
            return;
        }
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }
        controlComboLayer.showLayer();
        controlComboLayer.playAnim();
        // if(AdsIdConfig.platform==EPlatform.TikTok){

        // }

    }

    //显示现在分数
    setNowScore(nowScore: number) {
        // let myScore=(gameInitManager.getLocalDataManager().getNowScoreByLocalData()).toString();
        this.label_nowScore.string = gameInitManager.getGameMainDataManager().specialValue(nowScore).toString();
    }

    //显示通关所需分数
    setTotalScore(totalScore: string) {
        // let score=gameInitManager.getLocalDataManager().getTotalScoreByLocalData();
        this.label_passScore.string = gameInitManager.getGameMainDataManager().specialValue((Number(totalScore) / 2)).toString();   //TODO:通关规则，在这里修改
        // gameInitManager.getLocalDataManager().setTotalScoreToLocalData(totalScore);
    }

    //显示正中间的数值
    setScoreLabel(number: number) {
        this.label_score.string = number ? gameInitManager.getGameMainDataManager().specialValue(number) : "0";
    }

    //显示最右侧的最大值
    setHighScoreLabel(number: number) {
        this.label_currentHighScore.string = number ? gameInitManager.getGameMainDataManager().specialValue(number) : "0";
    }

    //展示商店界面
    showShopLayer() {
        
        gameInitManager.getSoundManager().playSound("button");
        gameInitManager.getVibrateManager().vibrate();
        
        let controlStoreLayer = this.storeLayer.getComponent(storeLayer);
        if (controlStoreLayer.isShowLayer()) {
            return;
        }
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }
        controlStoreLayer.isDiamondEnough();
        controlStoreLayer.showLayer();
        // if(AdsIdConfig.platform==EPlatform.TikTok){

        // }
    }

    //过关界面
    showPassLayer() {
        gameInitManager.getSoundManager().playSound("button");
        gameInitManager.getVibrateManager().vibrate();

        let controlPassLayer=this.passLayer.getComponent(passLayer);
        if(controlPassLayer.isShowLayer()){
            return;
        }
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }
        controlPassLayer.refreshValue();
        controlPassLayer.showLayer();
        // resources.load("Layer/Level", Prefab, (err, prefab) => {
        //     if (!err) {
        //         let node: Node = instantiate(prefab);
        //         this.passLayer = node;
        //         this.passLayer.parent = this.node;
        //         let controlPassNode = this.passLayer.getComponent(passLayer);
        //         // if(controlPassNode.isShowLayer()){
        //         //     return;
        //         // }
                
        //     }
        // });
    }

    //主菜单界面
    showMainMenuLayer() {
        gameInitManager.getSoundManager().playSound("button");
        gameInitManager.getVibrateManager().vibrate();
        let controlMainMenuLayer = this.mainMenuLayer.getComponent(mainMenuLayer);
        if (controlMainMenuLayer.isShowLayer()) {
            return;
        }
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }

        controlMainMenuLayer.showLayer();
        let touchlayerNode = find("Canvas/GameMain/blockContainer/touchLayer");
        let controlNode = touchlayerNode.getComponent(touchControler);
        controlNode.initControlData(true);
        // if(AdsIdConfig.platform==EPlatform.TikTok){

        // }
    }

    //二倍窗口
    showDoubleEffectLayer(beenTouchedNode?: Vec2) {
        let controlDoubleLayer = this.doubleLayer.getComponent(doubleLayer);
        if (controlDoubleLayer.isShowLayer()) {
            return;
        }
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }
        controlDoubleLayer.showLayer();
        //TODO:暂时弃用延迟展示功能
        // if(AdsIdConfig.platform==EPlatform.VIVO){
        //     controlDoubleLayer.showDelay();
        // }
        gameInitManager.getVibrateManager().vibrate();
        gameInitManager.getSoundManager().playSound("doublelayer");
        if (beenTouchedNode) {
            controlDoubleLayer.refreshValue(beenTouchedNode);
        }
        // if(AdsIdConfig.platform==EPlatform.TikTok){
        // }
    }


    //点击商店
    onClickStore() {
        this.showShopLayer();
    }

    // //新增：点击+号  TODO:暂无用，看看后面需不需要改
    // onClickAdd(){

    // }

    //判断是否有道具次数
    isPropEnough(proptype: number) {
        switch (proptype) {
            case propType.hammer:
                let nodeHammer = find("Canvas/GameMain/gameBottom/Skill/delete");
                let nodeRemainHammer = nodeHammer.getChildByName("remain");
                let nodeRewardHammer = nodeHammer.getChildByName("reward");
                if (gameInitManager.getLocalDataManager().getTimesByItemName("deleteTimes") == 0) {
                    // nodeRemain.getComponent(UIOpacity).opacity=0;
                    // nodeReward.getComponent(UIOpacity).opacity=255;
                    nodeRemainHammer.active = false;
                    nodeRewardHammer.active = true;
                } else {
                    nodeRemainHammer.active = true;
                    nodeRewardHammer.active = false;
                }
                break;

            case propType.exchange:
                let nodeExchange = find("Canvas/GameMain/gameBottom/Skill/exchange");
                let nodeRemainExchange = nodeExchange.getChildByName("remain");
                let nodeRewardExchange = nodeExchange.getChildByName("reward");
                if (gameInitManager.getLocalDataManager().getTimesByItemName("exchangeTimes") == 0) {
                    // nodeRemain.getComponent(UIOpacity).opacity=0;
                    // nodeReward.getComponent(UIOpacity).opacity=255;    
                    nodeRemainExchange.active = false;
                    nodeRewardExchange.active = true;
                } else {
                    nodeRemainExchange.active = true;
                    nodeRewardExchange.active = false;
                }
                break;

            case propType.refresh:
                let nodeRefresh = find("Canvas/GameMain/gameBottom/Skill/refresh");
                let nodeRemainRefresh = nodeRefresh.getChildByName("remain");
                let nodeRewardRefresh = nodeRefresh.getChildByName("reward");
                if (gameInitManager.getLocalDataManager().getTimesByItemName("refreshTimes") == 0) {

                    // nodeRemain.getComponent(UIOpacity).opacity=0;
                    // nodeReward.getComponent(UIOpacity).opacity=255;
                    nodeRemainRefresh.active = false;
                    nodeRewardRefresh.active = true;
                } else {
                    nodeRemainRefresh.active = true;
                    nodeRewardRefresh.active = false;
                }
                break;
        }
    }

    //点击锤子
    onClickHammerButton() {
        // if(gameInitManager.getLocalDataManager().getTimesByItemName("deleteTimes")==0 || gameInitManager.getDiamondManager().isDiamondEnough(gameInitManager.getLocalDataManager().getDiamondByItemName("delete"))==false){
        if (gameInitManager.getLocalDataManager().getTimesByItemName("deleteTimes") == 0) {
            this.canShowIntroduce = false;
        } else {
            this.canShowIntroduce = true;
        }
        if (gameInitManager.getLocalDataManager().getTimesByItemName("deleteTimes") > 0) { //可用
            gameInitManager.getVibrateManager().vibrate();
            gameInitManager.getSoundManager().playSound("openskilllayer");
            this.showHammerLayer();
            let canTouchNode = find("Canvas/GameMain/blockContainer/touchLayer");
            let canTouchNodeControler = canTouchNode.getComponent(touchControler);
            if (!canTouchNodeControler.canTouchContainer) {
                return;
            }
            canTouchNodeControler.initControlData(true);
            // if(gameInitManager.getDiamondManager().isDiamondEnough(gameInitManager.getLocalDataManager().getDiamondByItemName("delete"))){
            canTouchNodeControler.setIsBeenDestory();  //摧毁方块
            // }else{
            // this.showShopLayer();
            // }
            // this.scheduleOnce(()=>{
            //     this.isPropEnough(propType.hammer);
            // },0.1);
        } else if (gameInitManager.getLocalDataManager().getTimesByItemName("deleteTimes") == 0) {
            let node = find("Canvas/GameMain/gameBottom/Skill/delete");
            // node.on(Node.EventType.TOUCH_START,function(event){
            gameInitManager.getAdManager().setPropType("hammer");
            gameInitManager.getAdManager().setRewardType(rewardType.addSkill);
            gameInitManager.getAdManager().onReward(node);
            // });
        }
    }

    //展示Hammer提示界面
    showHammerLayer() {
        let controlHammerLayer = this.hammerLayer.getComponent(hammerLayer);
        if (controlHammerLayer.isShowLayer() || this.canShowIntroduce == false) {
            return;
        }
        controlHammerLayer.showLayer();
    }

    //点击交换
    onClickExchangeButton() {
        // if(gameInitManager.getLocalDataManager().getTimesByItemName("exchangeTimes")==0 || gameInitManager.getDiamondManager().isDiamondEnough(gameInitManager.getLocalDataManager().getDiamondByItemName("exchange"))==false){
        if (gameInitManager.getLocalDataManager().getTimesByItemName("exchangeTimes") == 0) {
            this.canShowIntroduce = false;
        } else {
            this.canShowIntroduce = true;
        }
        if (gameInitManager.getLocalDataManager().getTimesByItemName("exchangeTimes") > 0) {
            gameInitManager.getVibrateManager().vibrate();
            gameInitManager.getSoundManager().playSound("openskilllayer");
            this.showExchangeLayer();
            let canTouchNode = find("Canvas/GameMain/blockContainer/touchLayer");
            let controlNode = canTouchNode.getComponent(touchControler);
            if (!controlNode.canTouchContainer) {
                return;
            }
            controlNode.initControlData(true);
            controlNode.setIsBeenExchange();  //交换方块
            // this.scheduleOnce(()=>{
            //     this.isPropEnough(propType.exchange);
            // },0.1);
        } else if (gameInitManager.getLocalDataManager().getTimesByItemName("exchangeTimes") == 0) {
            let node = find("Canvas/GameMain/gameBottom/Skill/exchange");
            // node.on(Node.EventType.TOUCH_START,function(event){
            gameInitManager.getAdManager().setPropType("exchange");
            gameInitManager.getAdManager().setRewardType(rewardType.addSkill);
            gameInitManager.getAdManager().onReward(node);
            // });
        }

    }

    //展示exchange提示界面
    showExchangeLayer() {
        let controlExchangeLayer = this.exchangeLayer.getComponent(exchangeLayer);
        if (controlExchangeLayer.isShowLayer() || this.canShowIntroduce == false) {
            return;
        }
        controlExchangeLayer.showLayer();
    }

    //点击刷新
    onClickRefreshButton() {
        if (gameInitManager.getLocalDataManager().getTimesByItemName("refreshTimes") > 0) {
            gameInitManager.getVibrateManager().vibrate();
            gameInitManager.getSoundManager().playSound("openskilllayer");
            let canTouchNode = find("Canvas/GameMain/blockContainer/touchLayer");
            let controlNode = canTouchNode.getComponent(touchControler);
            if (!controlNode.canTouchContainer) {
                return;
            }
            controlNode.initControlData(true);
            gameInitManager.getLocalDataManager().setTimesByItemName("refreshTimes", false);
            this.setLabelTimes("refreshTimes", gameInitManager.getLocalDataManager().getTimesByItemName("refreshTimes"));
            gameInitManager.getGameMainDataManager().refreshAllBlocks();
            this.scheduleOnce(() => {
                this.isPropEnough(propType.refresh);
            }, 0.1);
        } else if (gameInitManager.getLocalDataManager().getTimesByItemName("refreshTimes") == 0) {
            let node = find("Canvas/GameMain/gameBottom/Skill/refresh");
            // node.on(Node.EventType.TOUCH_START,function(event){
            gameInitManager.getAdManager().setPropType("refresh");
            gameInitManager.getAdManager().setRewardType(rewardType.addSkill);
            gameInitManager.getAdManager().onReward(node);
            // });
        }
    }

    //保存次数信息
    setLabelTimes(itemTimes: string, times: number) {
        if (itemTimes != "refreshTimes" && itemTimes != "deleteTimes" && itemTimes != "exchangeTimes") {  //本地存储3个道具名称，重组、删除、交换
            error("没有这个道具！");
            return null;
        }
        if (itemTimes == 'deleteTimes') {
            this.label_deleteText.string = gameInitManager.getGameMainDataManager().specialValue(times);
        } else if (itemTimes == 'refreshTimes') {
            this.label_refreshText.string = gameInitManager.getGameMainDataManager().specialValue(times);

        } else if (itemTimes == 'exchangeTimes') {
            this.label_exchangeText.string = gameInitManager.getGameMainDataManager().specialValue(times);
        }
    }

    //获取label的值信息
    getLabelTimes(item: number) {
        if (item == 1) {
            return Number(this.label_deleteText.string);
        } else if (item == 2) {
            return Number(this.label_exchangeText.string);
        } else if (item == 3) {
            return Number(this.label_refreshText.string);
        }
    }

    //展示去除最小值界面
    showDeleteMinBlockLayer() {
        let minBlockLayerControler = this.minBlockLayer.getComponent(deleteMinBlockLayer);
        if (minBlockLayerControler.isShowLayer()) {
            return;
        }
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        }
        // }else if(AdsIdConfig.platform==EPlatform.Platform4399){
        //     AdManager.getInstance().showInsertAd();
        // }
        minBlockLayerControler.showLayer();
        gameInitManager.getVibrateManager().vibrate();
        gameInitManager.getSoundManager().playSound("maxminlayer");
        minBlockLayerControler.refreshValue();
        // if(AdsIdConfig.platform==EPlatform.TikTok){

        // }
    }

    //分享
    showShareLayer() {
        let controlShare = this.shareLayer.getComponent(shareLayer);
        if (controlShare.isShowLayer()) {
            return;
        }
        this.inPlayGame = false;
        // this.gameTime=0;
        AdManager.getInstance().stopRecordScreen();
        controlShare.showLayer();
        gameInitManager.getSoundManager().playSound("button");
        gameInitManager.getVibrateManager().vibrate();
    }

    //展示闯关成功界面
    showUnlockLayer(maxValue) {
        let controlUnlockLayer = this.unlockLayer.getComponent(unlockLayer);
        if (controlUnlockLayer.isShowLayer()) {
            return;
        }
        controlUnlockLayer.goldUpdate(maxValue);
        controlUnlockLayer.showLayer();
        // console.log("this.gametime is ",this.gameTime);
        // AdManager.getInstance().stopRecordScreen();
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            if (this.gameTime >= 15) {
                this.showShare = true;
                this.scheduleOnce(() => {
                    // console.log("this.gameTime ",this.gameTime);
                    this.showShareLayer();
                }, 0.3);
            }
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            // controlUnlockLayer.showDelay();
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }
        if (this.isShowCombo) {
            this.scheduleOnce(() => {
                gameInitManager.getVibrateManager().vibrate();
                gameInitManager.getSoundManager().playSound("unlocklayer");
                controlUnlockLayer.showAnimation(maxValue);
                controlUnlockLayer.onUpdate();  //用于激励视频
            }, 1);
        } else {
            gameInitManager.getVibrateManager().vibrate();
            gameInitManager.getSoundManager().playSound("unlocklayer");
            controlUnlockLayer.showAnimation(maxValue);
            controlUnlockLayer.onUpdate();  //用于激励视频
        }

    }

    //闯关成功加钻石动画
    showAddDiamondInUnlockLayer(diamond: number) {
        this.addDiamondEffect.active = true;
        let label_addDiamond = this.addDiamondEffect.getChildByName("lb").getComponent(Label);
        label_addDiamond.string = "+" + diamond.toString();
        let animation = this.addDiamondEffect.getComponent(Animation);
        animation.play("rewardUnlockLayer");
        this.scheduleOnce(() => {
            this.setDiamondLabel();
            gameInitManager.getSoundManager().playSound("adddiamond");
        }, effectActioin.addDiamondTimeLayer);
    }

    //展示增加最大块界面
    showAddMaxBlockLayer(maxPower) {
        let controlMaxBlockLayer = this.addMaxBlockLayer.getComponent(addMaxBlockLayer);
        if (controlMaxBlockLayer.isShowLayer()) {
            return;
        }
        // AdManager.getInstance().showInsertAd();
        controlMaxBlockLayer.showLayer();
        gameInitManager.getVibrateManager().vibrate();
        gameInitManager.getSoundManager().playSound("maxminlayer");
        controlMaxBlockLayer.showAnimation(maxPower);
        // if(AdsIdConfig.platform==EPlatform.TikTok){

        // }
    }

    //展示连击奖励锤子界面
    showRewardHammerLayer() {
        let controlRewardHammerLayer = this.rewardHammerLayer.getComponent(rewardHammerLayer);
        if (controlRewardHammerLayer.isShowLayer()) {
            return;
        }
        controlRewardHammerLayer.refreshNum();
        controlRewardHammerLayer.showLayer();
        // if(AdsIdConfig.platform==EPlatform.VIVO){
            // controlRewardHammerLayer.showDelay();
        // }
        controlRewardHammerLayer.playAnim();
        // let node=find("Canvas/GameMain/blockContainer/touchLayer");
        // let controlNode=node.getComponent(touchControler);
        // controlNode.lineNumListHammer=[];
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }
    }

    //展示连击奖励交换界面
    showRewardExchangeLayer() {
        let controlRewardExchangeLayer = this.rewardExchangeLayer.getComponent(rewardExchangeLayer);
        if (controlRewardExchangeLayer.isShowLayer()) {
            return;
        }
        controlRewardExchangeLayer.refreshNum();
        controlRewardExchangeLayer.showLayer();
        // if(AdsIdConfig.platform==EPlatform.VIVO){
            // controlRewardExchangeLayer.showDelay();
        // }
        controlRewardExchangeLayer.playAnim();
        // let node=find("Canvas/GameMain/blockContainer/touchLayer");
        // let controlNode=node.getComponent(touchControler);
        // controlNode.lineNumListExchange=[];
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        }
    }

    //展示刷新奖励交换界面
    showRewardRefreshLayer() {
        let controlRewardRefreshLayer = this.rewardRefreshLayer.getComponent(rewardRefreshLayer);
        if (controlRewardRefreshLayer.isShowLayer()) {
            return;
        }
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }
        controlRewardRefreshLayer.refreshNum();
        controlRewardRefreshLayer.showLayer();
        // if(AdsIdConfig.platform==EPlatform.VIVO){
        //     controlRewardRefreshLayer.showDelay();
        // }
        controlRewardRefreshLayer.playAnim();
        // let node=find("Canvas/GameMain/blockContainer/touchLayer");
        // let controlNode=node.getComponent(touchControler);
        // controlNode.lineNumListRefresh=[];
        // if(AdsIdConfig.platform==EPlatform.TikTok){
        // }
    }

    // //展示宝箱激励界面
    // showTreasureLayer(){
    //     let controlTreasureLayer=this.treasureLayer.getComponent(treasureLayer);
    //     if(controlTreasureLayer.isShowLayer()){
    //         return;
    //     }
    //     if (AdsIdConfig.platform == EPlatform.TikTok) {
    //         AdManager.getInstance().showInsertAd();
    //     } else if (AdsIdConfig.platform == EPlatform.VIVO) {
    //         AdManager.getInstance().hideSystemBanner();
    //         AdManager.getInstance().showCustomAdWithInsert();
    //     } else if (AdsIdConfig.platform == EPlatform.OPPO) {
    //         AdManager.getInstance().showCustomAd();
    //     } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
    //         AdManager.getInstance().showInsertAd();
    //     }
    //     controlTreasureLayer.showLayer();
    // }

    //点击衣柜界面
    onClickClothes() {
        this.showClothesLayer();
    }

    //展示衣柜界面 
    showClothesLayer() {
        let controlClothesLayer = this.clothesLayer.getComponent(clothesLayer);
        if (controlClothesLayer.isShowLayer()) {
            return;
        }
        if (AdsIdConfig.platform == EPlatform.TikTok) {
            AdManager.getInstance().showInsertAd();
        } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            AdManager.getInstance().hideSystemBanner();
            AdManager.getInstance().showCustomAdWithInsert();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            AdManager.getInstance().showCustomAd();
        } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdManager.getInstance().showInsertAd();
        }
        controlClothesLayer.refreshButton();
        controlClothesLayer.refreshButtonBlock();
        controlClothesLayer.switchButton(1);
        controlClothesLayer.showLayer();
        // if(AdsIdConfig.platform==EPlatform.VIVO){
        //     controlClothesLayer.showDelay();
        // }
        // if(AdsIdConfig.platform==EPlatform.TikTok){

        // }
    }

    //返回主游戏
    onClickBack() {
        let opacityHammer = this.hammerLayer.getComponent(UIOpacity);
        let opacityExchange = this.exchangeLayer.getComponent(UIOpacity);
        if (opacityHammer.opacity == 255) {  //hammerLayer展示中
            this.hammerLayer.setPosition(800, 0);
            opacityHammer.opacity = 0;
            let touchlayerNode = find("Canvas/GameMain/blockContainer/touchLayer");
            let controlNode = touchlayerNode.getComponent(touchControler);
            controlNode.beenDestory = false;
        } else if (opacityExchange.opacity == 255) {   //exchangeLayer展示中
            this.exchangeLayer.setPosition(800, 0);
            opacityExchange.opacity = 0;
            let touchlayerNode = find("Canvas/GameMain/blockContainer/touchLayer");
            let controlNode = touchlayerNode.getComponent(touchControler);
            controlNode.beenExchange = false;
            let skillNode = find("Canvas/GameMain/blockContainer/skill");
            let controlSkillNode = skillNode.getComponent(skillControler);
            controlSkillNode.closeAnimaion();
        }
        find("Canvas/GameMain/gameTop").active = true;
        find("Canvas/GameMain/gameBottom").active = true;
        find("Canvas/GameMain/back/back").active = false;
    }

    closeLayer(layerName: string) {  //激励过后关闭Layer
        if (layerName == "unlockLayer") {
            let controlUnlock = this.unlockLayer.getComponent(unlockLayer);
            controlUnlock.onClickClose();
        } else if (layerName == "doubleLayer") {
            let controlDouble = this.doubleLayer.getComponent(doubleLayer);
            controlDouble.onClickClose();
        } else if (layerName == "rewardHammerLayer") {
            let controlRewardHammer = this.rewardHammerLayer.getComponent(rewardHammerLayer);
            controlRewardHammer.onClickClose();
        } else if (layerName == "rewardExchangeLayer") {
            let controlRewardExchange = this.rewardExchangeLayer.getComponent(rewardExchangeLayer);
            controlRewardExchange.onClickClose();
        } else if (layerName == "rewardRefreshLayer") {
            let controlRewardRefresh = this.rewardRefreshLayer.getComponent(rewardRefreshLayer);
            controlRewardRefresh.onClickClose();
        } else if (layerName == "storeLayer") {
            let controlStore = this.storeLayer.getComponent(storeLayer);
            controlStore.onClickCloseButton();
        } else if (layerName == "clothesLayer") {
            let controlClothesLayer = this.clothesLayer.getComponent(clothesLayer);
            controlClothesLayer.onClickClose();
        } else if (layerName == "notEnoughLayer") {
            let controlNotEnoughLayer = this.notEnoughLayer.getComponent(notEnoughLayer);
            controlNotEnoughLayer.onClickClose();
        } else if (layerName == "passLayer") {
            let controlPassLayer = this.passLayer.getComponent(passLayer);
            controlPassLayer.onClickClose();
        }
    }

    update(dt: number) {
        if (this.inPlayGame) {
            this.gameTime += dt;
        }
    }
}



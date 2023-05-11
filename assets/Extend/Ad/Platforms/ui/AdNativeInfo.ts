
import { _decorator, Component, Node, Label, Sprite, assetManager, SpriteFrame, game, Game } from 'cc';
import AdManager from '../../Platforms/AdManager';
import { AdLogUtil } from '../../Util/AdLogUtil';
import AdsIdConfig, { EPlatform } from '../AdsIdConfig';
const { ccclass, property } = _decorator;

@ccclass('AdNativeInfo')
export class AdNativeInfo extends Component {

    @property(Node)
    close_btn: Node = null!;

    @property(Sprite)
    Native_BigImage: Sprite = null!;

    @property(Label)
    desc: Label = null!;

    @property(Node)
    look_ad: Node = null!;

    @property(Node)
    LateNode: Node = null!;

    @property(SpriteFrame)
    defaut_BigImage: SpriteFrame = null!;

    /**
     * 原生广告icon节点
     */
    @property(Sprite)
    nativeAdSpTip: Sprite = null!;

    /**
     * 普通普通原生广告icon
     */
    @property(SpriteFrame)
    normalAdTip:SpriteFrame = null!;

    /**
     * 小米平台原生广告平台
     */
    @property(SpriteFrame)
    xmAdTip:SpriteFrame = null!;

    @property
    type = 0;

    private nativeInfo: any = null;
    private nativeUrl: Array<any> = [];
    onEnable() {
        if(AdsIdConfig.platform == EPlatform.HUAWEI||AdsIdConfig.platform == EPlatform.XiaoMi){
            // this.node.active=true;
            this.nativeUrl = [];
            AdLogUtil.Log("Go init NativeAd");
            this.ADInit();
        }
        else{
            this.node.active=false;
        }
    }

    onLoad() {
        if(AdsIdConfig.platform == EPlatform.HUAWEI||AdsIdConfig.platform == EPlatform.XiaoMi){
            this.addEvent();
        }
        if (AdsIdConfig.platform == EPlatform.HUAWEI) {
            game.on(Game.EVENT_HIDE, () => {
                AdLogUtil.Log("EVENT_Hide");
                this.node.active = false;
            }, this);
            game.on(Game.EVENT_SHOW, () => {
                AdLogUtil.Log("EVENT_SHOW");
                this.node.active = false;
                // this.node.active=true;
            }, this);
        }

        if(AdsIdConfig.platform == EPlatform.XiaoMi){
            this.nativeAdSpTip.spriteFrame=this.xmAdTip;
        }
        else{
            this.nativeAdSpTip.spriteFrame=this.normalAdTip;
        }
    }

    bannerOpen() {
        // AD.getInstance().hideBanner();
    }

    ADInit(_callback?: Function) {
        if (AdsIdConfig.platform == EPlatform.HUAWEI) {
            this.HWInitView(_callback);
            return;
        }else if(AdsIdConfig.platform == EPlatform.XiaoMi){
            this.XMInitView(_callback);
            return;
        }
        this.initView(_callback);
    }

    
    private initView(_callback?: Function) {
        this.node.active = true;
        this.nativeInfo = AdManager.getInstance().showNativeImageAd();
        console.log("MINIGAME ===> ===========adNativeInfo===========");
        this.LateNode && (this.LateNode.active = false);
        if (this.nativeInfo && this.nativeInfo.adId) {
            this.refreshAdUI();
            if (AdsIdConfig.platform == EPlatform.OPPO && this.type == 1) {
                // let random = ToolsHelper.Instance().randomNum(1, 10);
                // if (random <= this.nativeInfo.dcr * 10) {
                //     this.LateNode && (this.LateNode.active = true);
                // }
            }
            _callback && _callback(1);
        } else {
            this.node.active = false;
            _callback && _callback(0);
        }
    }


    private XMInitView(_callback?: Function) {
        this.node.active = true;
        AdManager.getInstance().showXMNativeImageAd((adInfo: any) => {
            this.nativeInfo = adInfo;
            console.log("小米 ===> ===========adNativeInfo===========");
            this.LateNode && (this.LateNode.active = false);
            if (this.nativeInfo && this.nativeInfo.adId) {
                this.refreshAdUI();
                _callback && _callback(1);
            } else {
                this.node.active = false;
                _callback && _callback(0);
            }
        });
    }


    private HWInitView(_callback?: Function) {
        this.node.active = true;
        AdManager.getInstance().showHWNativeImageAd((adInfo: any) => {
            this.nativeInfo = adInfo;
            console.log("MINIGAME ===> ===========adNativeInfo===========");
            this.LateNode && (this.LateNode.active = false);
            if (this.nativeInfo && this.nativeInfo.adId) {
                this.refreshAdUI();
                _callback && _callback(1);
            } else {
                this.node.active = false;
                _callback && _callback(0);
            }
        });
    }


    private refreshAdUI() {
        AdManager.getInstance().onNativeReportAdShow(this.nativeInfo.adId);
        this.nativeUrl[0] = this.nativeInfo.NativeClose;
        console.log('华为ad====>', JSON.stringify(this.nativeInfo));
        if (AdsIdConfig.platform == EPlatform.HUAWEI) {
            this.node.getChildByName('adLittle')!.getComponent(Label)!.string = this.nativeInfo.title;
            this.node.getChildByName('adDesc')!.getComponent(Label)!.string = this.nativeInfo.source;//华为渠道的字段不一样
            this.look_ad.getChildByName('Label')!.getComponent(Label)!.string = this.nativeInfo.clickBtnTxt;
        }else if(AdsIdConfig.platform == EPlatform.XiaoMi){
            this.node.getChildByName('adLittle')!.getComponent(Label)!.string = this.nativeInfo.title;
            this.node.getChildByName('adDesc')!.getComponent(Label)!.string = this.nativeInfo.desc;
            this.look_ad.getChildByName('Label')!.getComponent(Label)!.string = this.nativeInfo.clickBtnTxt;
        }
        if (this.nativeInfo.Native_BigImage_url) {
            this.nativeUrl[1] = this.nativeInfo.Native_BigImage_url;
        } else {
            if (this.nativeInfo.Native_icon_url) {
                this.nativeUrl[1] = this.nativeInfo.Native_icon_url;
            } else {
                this.Native_BigImage.spriteFrame = this.defaut_BigImage;
            }
        }
        this.nativeUrl[2] = this.nativeInfo.Native_icon_url;
        this.showNativeInfo();
    }


    private addEvent() {
        this.Native_BigImage.node.on("click", this.nativeClick, this);
        this.close_btn.on("click", this.closeThisNode, this);
        this.look_ad.on("click", this.nativeClick, this);

        this.LateNode && (this.LateNode.on("click", this.nativeErrClick, this));
    }

    private showNativeInfo() {
        console.log("========showNativeInfo========", this.nativeUrl);
        this.loadAdSprite(this.Native_BigImage, this.nativeUrl[1]);
        AdManager.getInstance().hideBanner();
    }

    private loadAdSprite(nodesprite, url) {
        if (url.indexOf('.png') > -1 || url.indexOf('.jpg') > -1) {
            assetManager.loadRemote(url, function (err, texture) {
                if (err != null || texture == null) {
                    return;
                }
                console.log('====>', texture);
                nodesprite.spriteFrame = SpriteFrame.createWithImage(texture);
            }.bind(this));
            return;
        }
        assetManager.loadRemote(url, { ext: '.png' }, function (err, texture) {
            if (err != null || texture == null) {
                return;
            }
            console.log('====>', texture);
            nodesprite.spriteFrame = SpriteFrame.createWithImage(texture);
        }.bind(this));
    }

    public nativeErrClick() {
        this.node.active = false;
        AdManager.getInstance().onNativeAdClick(this.nativeInfo.adId);
    }

    public nativeClick() {
        this.node.active = false;
        AdManager.getInstance().onNativeAdClick(this.nativeInfo.adId);
    }

    private closeThisNode() {
        // AD.getInstance().showBanner();
        console.log("关闭信息流节点");
        this.node.active = false;
    }

    onDisable() {
        AdManager.getInstance().loadNativeImage();
        // this.ADInit();
    }
}

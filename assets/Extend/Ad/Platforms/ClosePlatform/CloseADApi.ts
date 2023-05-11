
import { _decorator, Component, Node, director, UITransform, Sprite, SpriteFrame, Widget, view, Label, assetManager } from 'cc';
import { PlatformAdApi } from '../PlatformAdApi';
const { ccclass, property } = _decorator;

@ccclass('CloseADApi')
export class CloseADApi implements PlatformAdApi {
    showCustomAdWithInsert() {
        // throw new Error('Method not implemented.');
    }
    SystemBannerData: any = null;
    SystemIntersData: any = null;
    VideoData: any = null;
    NativeBannerData: any = null;
    NativeIntersData: any = null;
    NativeIconData: any = null;//
    JGGBoxData: any = null;//九宫格
    BlockData: any = null;//互推banner
    AdCustomIntersData: any = null;//模板插屏

    /**广告分组 */
    AdGroup = 0;

    /**banner */
    systemBannerAd: any = null;
    /**系统banner加载成功 */
    loadSucc_SystemBanner = false;
    /**正在展示系统banner */
    isShow_SystemBanner = false;
    /**banner刷新时间 */
    NUM_BannerUpdateTime = 30;
    /**banner刷新定时器 */
    interval_updateBanner = null;

    /**插屏 */
    interstitialAd: any = null;

    /**视频 */
    rewardedVideoAd: any = null;
    /**视频广告是否已经load到数据 */
    loadSucc_Video: boolean = false;
    /**视频广告回调 */
    callback_Video = null;

    /**原生本地图片资源 */
    nativeRes = null;
    /**原生本地图片资源否加载成功 */
    loadNativeRes = false;

    /**原生 */
    nativeAd: any = null;
    /**原生banner广告对象 */
    nativeBannerInfo = null;
    /**原生banner加载成功 */
    loadSucc_NativeBanner = false;
    /**正在展示原生banner */
    isShow_NativeBanner = false;
    /**展示原生banner的Node */
    node_nativeBanner = null;

    /**原生大图 */
    nativeImageAd: any = null;
    /**原生Image广告对象 */
    nativeImageInfo = null;
    /**原生banner加载成功 */
    loadSucc_NativeImage = false;
    /**正在展示原生banner */
    isShow_NativeImage = false;

    /**原生icon */
    nativeIconAd: any = null;
    /**原生Icon广告对象 */
    nativeIconInfo = null;
    /**原生Icon加载成功 */
    loadSucc_NativeIcon = false;
    /**正在展示原生Icon */
    isShow_NativeIcon = false;

    /**互推盒子九宫格广告对象 */
    navigateBoxPortalAd = null;
    /**互推盒子九宫格广告是否加载成功 */
    loadSucc_NavigateBoxPortal = false;

    /**互推盒子横幅广告对象 */
    navigateBoxBannerAd = null;
    /**互推盒子横幅广告是否加载成功 */
    loadSucc_NavigateBoxBanner = false;

    /**临时保存 互推盒子九宫格出现前是否调用过showBanner */
    temp_hasShowBanner = false;
    /**正在展示结算互推(互推盒子) */
    isShow_NavigateSettle = false;

    /**系统信息 */
    systemInfo: any = null;

    onInit(_callback: Function) {

        this.createAd();
        _callback && _callback();
        console.log('close ===================> onInit  ok');
    }
    createAd() {
        this.loadNativeBannerRes();
    }
    setGroup(group) {
        this.AdGroup = group;
    }
    onLogin() {

    }
    onShare(_callback: Function) {

    }
    ShareVideo(_title: string, templateId: string,_callback: Function) {

    }
    createSystemBanner() {
    }
    showBanner() {
        console.log('===============>展示banner');
        this.createNativeBanner();
    }
    hideBanner() {
        console.log('===============>关闭banner');
    }
    /**
     * 展示系统banner
     */
    showSystemBanner() {
    }
    /**
     * 隐藏系统banner
     */
    hideSystemBanner() {
    }
    /**
    * 刷新banner
    */
    updateBanner() {
    }
    /**
     * 刷新系统banner
     */
    updateSystemBanner() {
    }
    /** */
    updateNativeBanner() {
    }

    createVideo() {
    }
    showVideo(_successCallback?: Function) {
        console.log('===============>展示banner');
        _successCallback(true);
    }
    showVideoAward() {

    }
    showVideoFail() {

    }
    createInsertAd() {

    }
    showInsertAd() {

    }

    /**
     * 创建互推盒子九宫格广告
     */
    createNavigateBoxPortal() {
    }

    showNavigateBoxPortal() {
        console.log('===============>展示互推盒子九宫格广告');
    }

    /**
     * 创建互推盒子横幅广告
     */
    createNavigateBoxBanner() {
    }

    showNavigateBoxBanner() {
        console.log('===============>展示互推盒子横幅广告广告');
    }

    hideNavigateBoxBanner() {
    }

    /**
     * 加载原生banner广告资源
     */
    loadNativeBannerRes() {
        console.log("ChaoQiGameSDK", "--loadNativeBannerRes--");

        this.nativeRes = {
            NativeBannerBg: null,
            NativeBannerButton: null,
            NativeClose: null,
            NativeAdTip: null,
        }

        let nativeBannerResArr = [
            "images/ad/NativeBannerBg",
            "images/ad/NativeBannerButton",
            "images/ad/NativeClose",
            "images/ad/NativeAdTip",
        ];

       
    }

    createNativeBanner() {
        this.nativeBannerInfo = {
            adId: '123456',
            title: 'test',
            desc: 'test-------',
            Native_icon_url: "http://localhost:10002/ad/TestBanner.png",
            Native_icon: null,
            Native_BigImage_url: null,
            Native_BigImage: null,
        };

        assetManager.loadRemote(this.nativeBannerInfo.Native_icon_url, (err, texture) => {
            console.log("ChaoQiGameSDK", "OPPO 原生大图加载成功");
            this.nativeBannerInfo.Native_icon = texture;

            this.showNativeBanner();
        });
    }

    /**
     * 展示原生banner
     */
    showNativeBanner() {
        if (this.isShow_NavigateSettle) {
            console.log("ChaoQiGameSDK", " 正在展示互推盒子 return");
            return;
        }

        this.isShow_NativeBanner = true;

        let scene = director.getScene();

        //原生广告id
        let tempid = this.nativeBannerInfo.adId;
        this.reportNativeBannerShow(tempid);

        console.log("ChaoQiGameSDK", "showNativeBanner========================");

        this.node_nativeBanner = new Node("node_nativeBanner");
        this.node_nativeBanner.addComponent(UITransform);
        scene.getChildByName('Canvas').addChild(this.node_nativeBanner);
        this.node_nativeBanner.addComponent(Sprite);
        this.node_nativeBanner.getComponent(Sprite).spriteFrame = SpriteFrame.createWithImage(this.nativeRes.NativeBannerBg);
        this.node_nativeBanner.addComponent(Widget);
        this.node_nativeBanner.getComponent(Widget).isAlignHorizontalCenter = true;
        this.node_nativeBanner.getComponent(Widget).isAlignBottom = true;
        this.node_nativeBanner.getComponent(Widget).bottom = 0;
        let canvasSize = view.getVisibleSize();
        if (canvasSize.width < canvasSize.height) {
            this.node_nativeBanner.getComponent(UITransform).width = canvasSize.width;
            this.node_nativeBanner.getComponent(UITransform).height = canvasSize.width * 0.18;
        }
        else {
            this.node_nativeBanner.getComponent(UITransform).width = canvasSize.width / 2;
            this.node_nativeBanner.getComponent(UITransform).height = this.node_nativeBanner.getComponent(UITransform).width * 0.18;
        }

        if (this.AdGroup != 0) this.node_nativeBanner.layer = this.AdGroup;
        this.node_nativeBanner.setSiblingIndex(999);

        this.node_nativeBanner.on(Node.EventType.TOUCH_START, (event) => {
            this.reportNativeBannerClick(tempid);
        });

        // 广告
        let adTip = new Node("adTip");
        adTip.addComponent(UITransform);
        this.node_nativeBanner.addChild(adTip);
        adTip.addComponent(Sprite);
        adTip.getComponent(Sprite).spriteFrame = SpriteFrame.createWithImage(this.nativeRes.NativeAdTip);
        adTip.getComponent(UITransform).height = 0.2 * this.node_nativeBanner.getComponent(UITransform).height;
        adTip.getComponent(UITransform).width = adTip.getComponent(UITransform).height / 0.45;
        if (this.AdGroup != 0)
            adTip.layer = this.AdGroup;
        adTip.setPosition(this.node_nativeBanner.getComponent(UITransform).width / 2 - adTip.getComponent(UITransform).width / 2,
            -this.node_nativeBanner.getComponent(UITransform).height / 2 + adTip.getComponent(UITransform).height / 2);

        // 点击安装
        let bannerButton = new Node("bannerButton");
        bannerButton.addComponent(UITransform);
        this.node_nativeBanner.addChild(bannerButton);
        bannerButton.addComponent(Sprite);
        if (this.AdGroup != 0)
            bannerButton.layer = this.AdGroup;
        bannerButton.getComponent(Sprite).spriteFrame = SpriteFrame.createWithImage(this.nativeRes.NativeBannerButton);
        bannerButton.getComponent(UITransform).width = this.node_nativeBanner.getComponent(UITransform).width * 0.255;
        bannerButton.getComponent(UITransform).height = bannerButton.getComponent(UITransform).width * 0.351;
        bannerButton.setPosition(this.node_nativeBanner.getComponent(UITransform).width / 2 - this.node_nativeBanner.getComponent(UITransform).width * 0.185, 0);

        if (this.nativeBannerInfo.Native_icon) {
            // icon
            let icon = new Node("icon");
            icon.addComponent(UITransform);
            this.node_nativeBanner.addChild(icon);
            if (this.AdGroup != 0) icon.layer = this.AdGroup;
            icon.addComponent(Sprite);
            icon.getComponent(Sprite).spriteFrame = SpriteFrame.createWithImage(this.nativeBannerInfo.Native_icon);
            icon.getComponent(UITransform).height = this.node_nativeBanner.getComponent(UITransform).height * 0.8;
            icon.getComponent(UITransform).width = icon.getComponent(UITransform).height;
            icon.setPosition(icon.getComponent(UITransform).width * 0.8 - this.node_nativeBanner.getComponent(UITransform).width / 2, 0);
        } else if (this.nativeBannerInfo.Native_BigImage) {
            // 大图
            let image = new Node("image");
            image.addComponent(UITransform);
            this.node_nativeBanner.addChild(image);
            if (this.AdGroup != 0) image.layer = this.AdGroup;
            image.addComponent(Sprite);
            image.getComponent(Sprite).spriteFrame = SpriteFrame.createWithImage(this.nativeBannerInfo.Native_BigImage);
            image.getComponent(UITransform).height = this.node_nativeBanner.getComponent(UITransform).height;
            image.getComponent(UITransform).width = image.getComponent(UITransform).height * 2;
            image.setPosition(image.getComponent(UITransform).width / 2 - this.node_nativeBanner.getComponent(UITransform).width / 2, 0);
        }

        // 标题或描述
        let titleLabel = new Node("titleLabel");
        titleLabel.addComponent(UITransform);
        this.node_nativeBanner.addChild(titleLabel);
        if (this.AdGroup != 0) titleLabel.layer = this.AdGroup;
        titleLabel.addComponent(Label);
        // titleLabel.getComponent(UITransform).priority = 999;
        if (canvasSize.width < canvasSize.height) {
            titleLabel.getComponent(Label).fontSize = 35 * (view.getDesignResolutionSize().width / 1080);
        } else {
            titleLabel.getComponent(Label).fontSize = 35 * (view.getDesignResolutionSize().height / 1080);
        }
        if (this.nativeBannerInfo.desc == "") {
            titleLabel.getComponent(Label).string = this.nativeBannerInfo.title;
        } else {
            titleLabel.getComponent(Label).string = this.nativeBannerInfo.desc;
        }
        titleLabel.getComponent(Label).overflow = Label.Overflow.CLAMP;
        titleLabel.getComponent(Label).horizontalAlign = Label.HorizontalAlign.LEFT;
        titleLabel.getComponent(Label).verticalAlign = Label.VerticalAlign.CENTER;
        titleLabel.getComponent(Label).lineHeight = titleLabel.getComponent(Label).fontSize;
        titleLabel.getComponent(UITransform).width = this.node_nativeBanner.getComponent(UITransform).width - this.node_nativeBanner.getComponent(UITransform).height * 2 - bannerButton.getComponent(UITransform).width - 0.2 * this.node_nativeBanner.getComponent(UITransform).height / 0.45;
        titleLabel.getComponent(UITransform).height = this.node_nativeBanner.getComponent(UITransform).height;
        titleLabel.setPosition(0, -this.node_nativeBanner.getComponent(UITransform).width / 2 + this.node_nativeBanner.getComponent(UITransform).height * 2.1 + titleLabel.getComponent(UITransform).width / 2);

        let NativeClose = new Node("closeICON");
        NativeClose.addComponent(UITransform);
        this.node_nativeBanner.addChild(NativeClose);
        // NativeClose.getComponent(UITransform).priority = 999;
        NativeClose.addComponent(Sprite);
        if (this.AdGroup != 0) NativeClose.layer = this.AdGroup;
        NativeClose.getComponent(Sprite).spriteFrame = SpriteFrame.createWithImage(this.nativeRes.NativeClose);
        NativeClose.getComponent(UITransform).width = 0.27 * this.node_nativeBanner.getComponent(UITransform).height;
        NativeClose.getComponent(UITransform).height = 0.27 * this.node_nativeBanner.getComponent(UITransform).height;
        NativeClose.setPosition(this.node_nativeBanner.getComponent(UITransform).width / 2 - NativeClose.getComponent(UITransform).width / 2, this.node_nativeBanner.getComponent(UITransform).height / 2 - NativeClose.getComponent(UITransform).width / 2);


        // 监听原生banner关闭
        NativeClose.on(Node.EventType.TOUCH_START, (event) => {
            console.log("ChaoQiGameSDK", "原生banner关闭", this.NUM_BannerUpdateTime + "S后再次刷新");
            this.hideNativeBanner();
            this.updateBanner();
            // 清除触摸事件的冒泡
            // event.propagationStopped = true;
        });

    }
    /**
     * 隐藏原生banner
     */
    hideNativeBanner() {
        if (this.isShow_NativeBanner) {
            console.log("ChaoQiGameSDK", "OPPO hideNativeBanner========================");
            this.isShow_NativeBanner = false;
            this.node_nativeBanner.removeFromParent();
            this.node_nativeBanner = null;
        }
    }

    reportNativeBannerShow(adId) {
        console.log("ChaoQiGameSDK", "OPPO 该原生广告id上报展示", adId);
    }

    reportNativeBannerClick(adId) {
        console.log("ChaoQiGameSDK", "OPPO 原生广告上报点击", adId);
    }

    /**原生大图 */
    createNativeImage() {
        this.nativeImageInfo = {
            adId: "88888888",
            title: "测试标题",
            desc: "测试详情",
            Native_icon: "http://localhost:10002/ad/TestGetNativeAdIcon.png",
            Native_BigImage: "http://localhost:10002/ad/TestGetNativeAdImage.png",
            NativeAdTip: "http://localhost:10002/ad/TestGetNativeAdAdTip.png",
            NativeClose: "http://localhost:10002/ad/TestGetNativeAdClose.png",
        };
    }
    /**原生大图广告获取 */
    getNativeAdInfo(type) {
        return this.nativeImageInfo;
    }
    getHWNativeAdInfo(_infoCallback?: Function) {
        _infoCallback && _infoCallback(this.nativeImageInfo)
    }
    reportNativeImageShow(adId) {
        console.log("ChaoQiGameSDK", "OPPO 该原生大图广告id上报展示", adId);
    }
    reportNativeImageClick(adId) {
        console.log("ChaoQiGameSDK", "OPPO 原生大图广告上报点击", adId);
    }

    /**刷新原生大图广告 */
    loadNativeImage() {
    }

    /**原生icon */
    createNativeIcon() {
        console.log("ChaoQiGameSDK", "--createNativeIcon--");
        this.nativeIconInfo = {
            adId: "88888888",
            title: "测试标题",
            desc: "测试详情",
            Native_icon: "http://localhost:10002/ad/TestGetNativeAdIcon.png",
            Native_BigImage: "http://localhost:10002/ad/TestGetNativeAdImage.png",
            NativeAdTip: "http://localhost:10002/ad/TestGetNativeAdAdTip.png",
            NativeClose: "http://localhost:10002/ad/TestGetNativeAdClose.png",
        };
    }
    /**原生大图广告获取 */
    getNativeIconAdInfo(type) {
        console.log("ChaoQiGameSDK", "获取自定义原生Icon广告");
        return this.nativeIconInfo;
    }
    reportNativeIconShow(adId) {
        console.log("ChaoQiGameSDK", "OPPO 该原生Icon广告id上报展示", adId);
    }
    reportNativeIconClick(adId) {
        console.log("ChaoQiGameSDK", "OPPO 原生Icon广告上报点击", adId);
    }
    /**刷新原生Icon广告 */
    loadNativeIcon() {
    }

    addDesktop(_callback: Function) {
        
    }
    /**是否已经创建桌面图标 */
    hasShortcutInstalled(_callback: Function) {
        
    }
    StartRecorder(_duration) {

    }
    videoPath;
    clipIndexList = [];
    recordClipRecorder(data){}
    pauseGameVideo(){}
    resumeGameVideo(){}
    stopRecordScreen() {

    }
    createMoreGamesBtn() {

    }
    showMoreGamesBtn() {

    }
    jumpToGame(_packageName: string) {

    }
    addColorBookmark() {

    }
    addSubscribeApp() {

    }
    phoneVibrate(isLong) {
    }

    reportAnalytics(name, value) {
    }

    showCustomAd() {
    }
    hideCustomAd() {
    }
    showGridAd() {
    }
    hideGridAd() {
    }
}


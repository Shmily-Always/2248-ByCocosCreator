import { _decorator } from "cc";
import AdsIdConfig from "../AdsIdConfig";
import { PlatformAdApi } from "../PlatformAdApi";

const { ccclass, property } = _decorator;

@ccclass
export default class BaiDuADApi implements PlatformAdApi {
    setGroup(group: any) {
    }
    clipIndexList: any;
    videoPath: any;
    

    arg: any;

    SystemBannerData: any = null;
    SystemIntersData: any = null;
    VideoData: any = null;
    NativeBannerData: any = null;
    NativeIntersData: any = null;
    NativeIconData: any = null;//
    JGGBoxData: any = null;//九宫格
    BlockData: any = null;//互推banner
    AdCustomIntersData: any = null;//模板插屏

    /**平台环境 */
    swan: any = window["swan"];
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

    /**原生 */
    nativeAd: any = null;
    /**原生load取值 */
    resTemp: any = null;

    title: string = '超上瘾的解密游戏，挑战你的智商！';
    /**分享图地址 */
    shareUrl: string = "https://res.efunent.com/dev2/web2/LceFirePeople/qq/data/share.jpg";
    /**分享内容 */
    content: string = '分享内容';

    /**系统信息 */
    systemInfo: any = null;

    onInit(_callback: Function) {

        if (this.swan !== null && this.swan !== undefined) {
            this.systemInfo = this.swan.getSystemInfoSync();
            this.createAd();
        } else {
            this.swan = null;
        }
        _callback && _callback();
        console.log('百度 ===================> onInit ok');
    }

    createAd() {
        if (this.SystemBannerData.enabled && this.SystemBannerData.vendor_position != "") this.createSystemBanner();
        if (this.VideoData.enabled && this.VideoData.vendor_position != "") this.createVideo();
    }
    onLogin() {

    }
    onShare(_callback: Function) {
        if (this.swan != null && this.swan != undefined) {
            console.log("百度平台 分享");
            this.swan.shareAppMessage({
                title: this.title,
                imageUrl: this.shareUrl,
                content: this.content,
                success: () => {
                    _callback && _callback(1);
                },
                fail: () => {
                    _callback && _callback(0);
                }
            });
        }
    }
    ShareVideo(_title: string, templateId: string,_callback: Function) {
    }
    createSystemBanner() {
        console.log("ChaoQiGameSDK", "--createSystemBanner--");
        if (AdsIdConfig.stringHasSpace(this.SystemBannerData.vendor_position)) {
            console.log("ChaoQiGameSDK", "channelId:", "当前渠道系统banner广告ID中含有空字符串,请检查后台系统banner广告ID*********************");
            return;
        }

        this.systemBannerAd = this.swan.createBannerAd({
            adUnitId: this.SystemBannerData.vendor_position,
            appSid: this.SystemBannerData.vendor_position,
            style: {
            }
        })

        this.loadSucc_SystemBanner = true;

        // 监听系统banner错误
        this.systemBannerAd.onError((err) => {
            console.log("ChaoQiGameSDK", "OPPO 系统banner加载/展示失败：", JSON.stringify(err));
        })

        // 监听系统banner隐藏
        this.systemBannerAd.onHide(() => {
            console.log("ChaoQiGameSDK", "OPPO 系统banner关闭", this.NUM_BannerUpdateTime + "S之后再次刷新")
            this.updateBanner();
        })
    }
    showBanner() {
        if (this.swan !== null && this.swan !== undefined) {
            if (this.loadSucc_SystemBanner) {
                this.showSystemBanner();
            }
        }
    }
    hideBanner() {
        this.hideSystemBanner();
        if (this.interval_updateBanner) clearInterval(this.interval_updateBanner);
    }
    /**
     * 展示系统banner
     */
    showSystemBanner() {
        this.isShow_SystemBanner = true;
        this.systemBannerAd.show();
    }
    /**
     * 隐藏系统banner
     */
    hideSystemBanner() {
        if (this.isShow_SystemBanner && this.systemBannerAd) {
            this.isShow_SystemBanner = false;
            this.systemBannerAd.offHide();
            this.systemBannerAd.hide();
        }
    }
    /**
    * 刷新banner
    */
    updateBanner() {

        if (this.interval_updateBanner) clearInterval(this.interval_updateBanner);

        // 刷新广告条
        this.interval_updateBanner = setInterval(() => {
            this.updateSystemBanner();
        }, this.NUM_BannerUpdateTime * 1000)
    }
    /**
     * 刷新系统banner
     */
    updateSystemBanner() {
        this.hideSystemBanner();
        this.showSystemBanner();
    }
    createVideo() {
        if (this.swan !== null && this.swan !== undefined) {
            if (AdsIdConfig.stringHasSpace(this.VideoData.vendor_position)) {
                console.log("ChaoQiGameSDK", "vendor_position:", "当前渠道视频广告ID中含有空字符串,请检查后台视频广告ID*********************");
                return;
            }
            /**创建rewardedVideoAd 对象*/
            console.log("百度平台 创建激励视频广告");
            this.rewardedVideoAd = this.swan.createRewardedVideoAd({
                adUnitId: this.VideoData.vendor_position,
                appSid: this.VideoData.vendor_position,
            });
            this.rewardedVideoAd.onLoad(() => {
                console.log("激励视频广告 加载成功");
                this.loadSucc_Video = true;
            });
            this.rewardedVideoAd.onError((err) => {
                console.log('百度H5GameAPI 激励视频 加载失败:code =====>:' + err.code + "message ======>:" + JSON.stringify(err));
                this.loadSucc_Video = false;
                if (this.rewardedVideoAd) {
                    setTimeout(() => {
                        this.rewardedVideoAd && this.rewardedVideoAd.load()
                    }, 30 * 1000)
                }
            });
            //监听视频广告播放完成
            this.rewardedVideoAd.onClose(res => {
                if (res.isEnded) {
                    console.log("ChaoQiGameSDK", "OPPO 激励视频广告完成，发放奖励");
                    if (this.callback_Video) {
                        this.callback_Video(true);
                        this.rewardedVideoAd.load();
                    }
                } else {
                    console.log("ChaoQiGameSDK", "OPPO 激励视频广告关闭，不发放奖励");
                    if (this.callback_Video) {
                        this.callback_Video(false);
                        this.rewardedVideoAd.load();
                    }
                }
            })
            this.rewardedVideoAd.load();
        }
    }
    showVideo(_successCallback?: Function) {
        /**确保video正常创建并已经拉取到数据 */
        if (this.rewardedVideoAd && this.loadSucc_Video) {
            this.callback_Video = _successCallback;

            this.rewardedVideoAd.show();
            this.loadSucc_Video = false;

        } else {
            /**没有成功创建广告或者没有成功load广告 就重新创建一个 */
            // TipsManager.Instance().create("广告还未准备好,请稍后再试");
        }
    }
    showVideoAward() {

    }
    showVideoFail() {

    }
    createInsertAd() {

    }
    showInsertAd() {
    }
    createNativeAd() {

    }
    showNativeAd(adIdKey: string, _callback: Function, openIdKey?: string) {
    }
    onNativeAdClick(_id: string) {
    }
    onNativeReportAdShow(_id: string) {
    }
    createNativeIconAd() {

    }
    showNativeIconAd() {

    }
    onNativeIconAdClick(_id: string) {

    }
    /**创建格子广告组件 */
    createGridAd(adIdKey: string, openIdKey?: string) {

    }
    saveDataToCache(_key: string, _value: any) {

    }
    readDataFromCache(_key: string) {

    }
    
    addDesktop(_callback: Function) {
    }

    /**是否已经创建桌面图标 */
    hasShortcutInstalled(_callback: Function) {
    }

    StartRecorder(_duration) {
    }
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

    vibrateShort() {
        if (this.swan !== null && this.swan !== undefined) {
            this.swan.vibrateShort && this.swan.vibrateShort();
        }
    }

    vibrateLong() {
        if (this.swan !== null && this.swan !== undefined) {
            this.swan.vibrateLong && this.swan.vibrateLong();
        }
    }

    reportAnalytics(name, value) { }

    recordClipRecorder(data: any) {
        // throw new Error("Method not implemented.");
    }
    pauseGameVideo() {
        // throw new Error("Method not implemented.");
    }
    resumeGameVideo() {
        // throw new Error("Method not implemented.");
    }
    getNativeAdInfo(type: any) {
        // throw new Error("Method not implemented.");
    }
    getHWNativeAdInfo(_infoCallback?: Function | undefined) {
        // throw new Error("Method not implemented.");
    }
    reportNativeImageClick(id: any) {
        // throw new Error("Method not implemented.");
    }
    reportNativeImageShow(id: any) {
        // throw new Error("Method not implemented.");
    }
    loadNativeImage() {
        // throw new Error("Method not implemented.");
    }
    getNativeIconAdInfo(type: any) {
        // throw new Error("Method not implemented.");
    }
    reportNativeIconClick(_id: string) {
        // throw new Error("Method not implemented.");
    }
    reportNativeIconShow(_id: string) {
        // throw new Error("Method not implemented.");
    }
    loadNativeIcon() {
        // throw new Error("Method not implemented.");
    }
    showNavigateBoxPortal() {
        // throw new Error("Method not implemented.");
    }
    showNavigateBoxBanner() {
        // throw new Error("Method not implemented.");
    }
    hideNavigateBoxBanner() {
        // throw new Error("Method not implemented.");
    }
    phoneVibrate(isLong: any) {
        // throw new Error("Method not implemented.");
    }
    showCustomAd() {
        // throw new Error("Method not implemented.");
    }
    hideCustomAd() {
        // throw new Error("Method not implemented.");
    }
    showGridAd() {
        // throw new Error("Method not implemented.");
    }
    hideGridAd() {
        // throw new Error("Method not implemented.");
    }
    showCustomAdWithInsert() {
        // throw new Error("Method not implemented.");
    }
    showNativeBanner() {
        
    }
}

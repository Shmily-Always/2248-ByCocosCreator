import { _decorator } from "cc";
import AdsIdConfig from "../AdsIdConfig";
import { PlatformAdApi } from "../PlatformAdApi";

const { ccclass, property } = _decorator;

@ccclass
export default class KSADApi implements PlatformAdApi {
    
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
    wx: any = window["wx"];
    /**banner */
    bannerAd: any = null;
    /**标记是否为自动关闭banner广告 */
    _autoBannerClose: boolean = false;
    /**插屏 */
    interstitialAd: any = null;
    /**视频 */
    rewardedVideoAd: any = null;
    /**视频广告是否已经load到数据 */
    m_videoAdIsLoaded: boolean = false;
    /**原生 */
    nativeAd: any = null;
    /**原生load取值 */
    resTemp: any = null;
    /**盒子广告 */
    gridAd: any = null;

    title: string = '超上瘾的解密游戏，挑战你的智商！';
    /**分享图地址 */
    shareUrl: string = "https://res.efunent.com/dev2/web2/LceFirePeople/qq/data/share.jpg";

    /**系统信息 */
    systemInfo: any = null;


    /**模板插屏 */
    customIntersAd = null;
    customIconAd = null;
    loadSucc_IconAd = false;

    /**模板插屏加载成功 */
    loadSucc_CuctomInters = false;
    /**模板插屏间隔 */
    CuctomIntervalTime = true;

    onInit(_callback: Function) {

        if (this.wx !== null && this.wx !== undefined) {
            this.systemInfo = this.wx.getSystemInfoSync();
            this.createInsertAd();
            this.createVideo();
        } else {
            this.wx = null;
        }

        _callback && _callback();
        console.log('wx ===================> onInit   ok');
    }


    onLogin() {

    }

    onShare(_callback: Function) {
        if (this.wx != null && this.wx != undefined) {
            console.log("wx平台 分享");
            this.wx.shareAppMessage({
                title: this.title,
                imageUrl: this.shareUrl,
                success: () => {
                    _callback && _callback(1);
                },
                fail: () => {
                    _callback && _callback(0);
                }
            });
        }
    }


    ShareVideo(_title: string, templateId: string, _callback: Function) {
        if(this.recorder){
            this.recorder.publishVideo({
                callback: (error) => {
                    if (error != null && error != undefined) {
                        console.log("分享录屏失败: " + JSON.stringify(error));
                        _callback && _callback("分享失败");
                        return;
                    }
                    console.log("分享录屏成功");
                    _callback && _callback('1');
                }
            });
        }
    }


    createBanner() {

    }


    showBanner() {
        
    }


    hideBanner(close = false) {
       
    }

    createVideo() {
        if (this.wx == null && this.wx == undefined) {
            return;
        }
        if (this.VideoData && this.VideoData.enabled && this.VideoData.vendor_position != "") {
            /**创建rewardedVideoAd 对象*/
            console.log("wx平台 创建激励视频广告");
            this.rewardedVideoAd = this.wx.createRewardedVideoAd({
                adUnitId: this.VideoData.vendor_position,
            });
            this.rewardedVideoAd.onError((err) => {
                console.log('wxH5GameAPI 激励视频 加载失败:code =====>:' + err.code + "message ======>:" + JSON.stringify(err));
            });
        }
    }


    showVideo(_successCallback?: Function) {
        if (this.wx == null && this.wx == undefined) {
            return;
        }
        if (this.VideoData && this.VideoData.enabled && this.VideoData.vendor_position != "") {
            this.rewardedVideoAd.show();
            const onClose = (res) => {
                if (res.isEnded) {
                    console.log('激励视频广告完成，发放奖励');
                    /**播放完毕 处理播放成功的逻辑 */
                    _successCallback && _successCallback(true);
                } else {
                    console.log('激励视频广告取消关闭，不发放奖励');
                    /**播放失败 处理播放失败的逻辑 */
                    // _failCallback && _failCallback();
                    _successCallback && _successCallback(false);
                }
                this.rewardedVideoAd.offClose(onClose);
            }
            this.rewardedVideoAd.onClose(onClose);
        }

    }


    showVideoAward() {

    }


    showVideoFail() {

    }


    createInsertAd() {
        if (this.wx == null && this.wx == undefined) {
            return;
        }
        if (this.SystemIntersData && this.SystemIntersData.enabled && this.SystemIntersData.vendor_position != "") {
            this.interstitialAd = this.wx.createInterstitialAd({
                adUnitId: this.SystemIntersData.vendor_position
            });
            this.interstitialAd.onError((res) => {
                console.log('wx InsertAd load Error:' + JSON.stringify(res));
            });

        }
    }


    showInsertAd() {
        if (this.wx == null && this.wx == undefined) {
            return;
        }
        if (this.SystemIntersData && this.SystemIntersData.enabled && this.SystemIntersData.vendor_position != "") {
            if(this.interstitialAd == null){
                this.createInsertAd();
            }
            if(this.interstitialAd){
                this.interstitialAd.show();
                const onClose = (res) => {
                    this.interstitialAd.offClose(onClose);
                    this.interstitialAd.destroy();
                    this.interstitialAd = null;
                };
                this.interstitialAd.onClose(onClose);
            }
        }
    }


    showCustomAd() {
       
    }


    hideCustomAd() {
      
    }


    showCustomIconAd() {
       
    }


    hideCustomIconAd() {
       
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

    showGridAd() {
       
    }


    public hideGridAd() {
       
    }


    saveDataToCache(_key: string, _value: any) {

    }
    readDataFromCache(_key: string) {

    }

    addDesktop(_callback: Function) {
        this.wx.addShortcut({
            success: function (res) {
                console.log("MINIGAME ===> ", "添加桌面成功");
                _callback(true);
            },
            fail: function (res) {
                console.log("MINIGAME ===> ", "添加桌面失败：", JSON.stringify(res));
                _callback(false);
            }
        })
    }

    /**是否已经创建桌面图标 */
    hasShortcutInstalled(_callback: Function) {
    }


    private recorder;
    StartRecorder(_duration: number) {
        this.recorder = this.wx.getGameRecorder();
        this.recorder.start()
    }


    stopRecordScreen() {
        if(this.recorder){
            this.recorder.stop()
        }
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
        if (this.wx !== null && this.wx !== undefined)
            this.wx.vibrateShort && this.wx.vibrateShort();
    }

    vibrateLong() {
        if (this.wx !== null && this.wx !== undefined)
            this.wx.vibrateLong && this.wx.vibrateLong();
    }


    recordClipRecorder(data: any) {
    }
    pauseGameVideo() {
    }
    resumeGameVideo() {
    }
    getNativeAdInfo(type: any) {
    }
    getHWNativeAdInfo(_infoCallback?: Function | undefined) {
    }
    reportNativeImageClick(id: any) {
    }
    reportNativeImageShow(id: any) {
    }
    loadNativeImage() {
    }
    getNativeIconAdInfo(type: any) {
    }
    reportNativeIconClick(_id: string) {
    }
    reportNativeIconShow(_id: string) {
    }
    loadNativeIcon() {
    }
    showNavigateBoxPortal() {
    }
    showNavigateBoxBanner() {
    }
    hideNavigateBoxBanner() {
    }
    phoneVibrate(isLong: any) {
    }

    reportAnalytics(name, value) {
        
    }
    hideSystemBanner() {
        // throw new Error("Method not implemented.");
    }
    showCustomAdWithInsert() {
        // throw new Error("Method not implemented.");
    }
    showNativeBanner() {
        // throw new Error("Method not implemented.");
    }
}

import { _decorator } from "cc";
import AdsIdConfig from "../AdsIdConfig";
import { PlatformAdApi } from "../PlatformAdApi";

const { ccclass, property } = _decorator;

@ccclass
export default class Box4399ADApi implements PlatformAdApi {
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
            this.createBanner();
        } else {
            this.wx = null;
        }

        _callback && _callback();
        // console.log('4399 ===================> onInit   ok');
    }


    onLogin(_callback: Function) {
        if (this.wx !== null && this.wx !== undefined) {
            this.wx.login({
                success(res) {
                    if (res.code) {
                        _callback(1);
                    } else {
                        // console.log('登录失败！' + res.errMsg)
                        _callback(2);
                    }
                }
            })
        }
    }


    onShare(_callback: Function) {
        if (this.wx != null && this.wx != undefined) {
            // console.log("4399 分享");
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

    }


    private bannerWidth;
    private bannerHeight;
    private bannerLeft;
    private bannerTop;

    createBanner() {
        if (this.SystemBannerData && this.SystemBannerData.enabled) {
            //获取真机设备像素比
            const pixelRatio = this.wx.getSystemInfoSync().pixelRatio;
            //底部居中
            this.bannerWidth = 320 * pixelRatio;
            this.bannerHeight = 50 * pixelRatio;
            this.bannerLeft = (this.wx.getSystemInfoSync().screenWidth * pixelRatio - this.bannerWidth) / 2;
            this.bannerTop = this.wx.getSystemInfoSync().screenHeight * pixelRatio - this.bannerHeight;
        }
    }


    showBanner() {
        if (this.wx == null && this.wx == undefined) {
            // console.log("showbanner return");
            return;
        }
        if (this.SystemBannerData && this.SystemBannerData.enabled) {
            this.hideBanner(true);
            this._autoBannerClose = false;
            // console.log("4399 创建横幅广告");
            this.bannerAd = this.wx.createBannerAd({
                adUnitId: this.SystemBannerData.vendor_position,
                style: {
                    width: this.bannerWidth,
                    height: this.bannerHeight,
                    left: this.bannerLeft,
                    top: this.bannerTop
                }
            });
            this.bannerAd.onError(err => {
                console.log("bannerAd show error , err is ",err);
            })

            this.bannerAd.onLoad(() => {
                // console.log("横幅广告调用 onLoad");
                this.bannerAd.show().catch(err => console.log('wx banner show失败==》', JSON.stringify(err)));
            });
        }
    }


    hideBanner(close = false) {
        if (this.bannerAd) {
            // console.log("4399 销毁横幅广告");
            if (!close) {
                this._autoBannerClose = true;
            }
            this.bannerAd.hide();
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
    }

    hideSystemBanner() {
        
    }
    
    createVideo() {
        if (this.wx == null && this.wx == undefined) {
            // console.log("createVideo return");
            return;
        }
        if (this.VideoData && this.VideoData.enabled) {
            /**创建rewardedVideoAd 对象*/
            // console.log("4399 创建激励视频广告");
            this.rewardedVideoAd = this.wx.createRewardedVideoAd({
                adUnitId: this.VideoData.vendor_position,
            });
            this.rewardedVideoAd.onLoad(() => {
                // console.log("激励视频广告 加载成功");
                this.m_videoAdIsLoaded = true;
            });
            this.rewardedVideoAd.onError((err) => {
                // console.log('wxH5GameAPI 激励视频 加载失败:code =====>:' + err.code + "message ======>:" + JSON.stringify(err));
                this.m_videoAdIsLoaded = false;
            });
        }
    }


    showVideo(_successCallback?: Function) {
        if (this.wx == null && this.wx == undefined) {
            console.log("show rewrd return");
            return;
        }
        // console.log("this.videoData?",this.VideoData);
        // console.log("this.videoData enable?",this.VideoData.enable);
        if (this.VideoData && this.VideoData.enabled) {
            // console.log("ready to show");
            this.rewardedVideoAd.show().catch((err) => {
                // console.log("激励视频播放失败,error is ",err);
                _successCallback && _successCallback(false);
            });
            const onClose = (res) => {
                if (res.isEnded) {
                    // console.log('激励视频广告完成，发放奖励');
                    /**播放完毕 处理播放成功的逻辑 */
                    _successCallback && _successCallback(true);
                } else {
                    // console.log('激励视频广告取消关闭，不发放奖励');
                    /**播放失败 处理播放失败的逻辑 */
                    // _failCallback && _failCallback();
                    _successCallback && _successCallback(false);
                }
                this.rewardedVideoAd.offClose(onClose);
            }
            this.rewardedVideoAd.onClose(onClose);
        }
        // }else{
        //      _successCallback && _successCallback(false);
        // }
    }


    showVideoAward() {

    }


    showVideoFail() {

    }


    private isIntertLoaded = false;
    createInsertAd() {
        if (this.wx == null && this.wx == undefined) {
            return;
        }
        if (this.SystemIntersData && this.SystemIntersData.enabled) {
            this.interstitialAd = this.wx.createInterstitialAd({
                adUnitId: this.SystemIntersData.vendor_position
            });
            this.interstitialAd.onLoad(() => {
                this.isIntertLoaded = true;
            });
            this.interstitialAd.onError((res) => {
                this.isIntertLoaded = false;
            });
        }
    }


    private canShowInterstitial = true;
    showInsertAd() {
        if (this.wx == null && this.wx == undefined) {
            return;
        }
        if (this.SystemIntersData && this.SystemIntersData.enabled) {
            if (this.isIntertLoaded && this.canShowInterstitial) {
                this.interstitialAd.show();
                const onClose = (res) => {
                    this.interstitialAd.offClose(onClose);
                    this.isIntertLoaded = false;
                    this.canShowInterstitial = false;
                    let adIntervalTime = this.SystemIntersData.ad_interval;
                    setTimeout(()=>{
                        this.canShowInterstitial = true;
                    },adIntervalTime*1000);
                };
                this.interstitialAd.onClose(onClose);
            }
            else {
                this.interstitialAd && this.interstitialAd.load();
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
    StartRecorder(_duration: number) {

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
        if (this.wx !== null && this.wx !== undefined)
            this.wx.vibrateShort && this.wx.vibrateShort({});
    }

    vibrateLong() {
        if (this.wx !== null && this.wx !== undefined)
            this.wx.vibrateLong && this.wx.vibrateLong({});
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

    showCustomAdWithInsert() {
        // throw new Error("Method not implemented.");
    }
    
    showNativeBanner() {
        
    }
}

import { _decorator } from "cc";
import AdsIdConfig from "../AdsIdConfig";
import { PlatformAdApi } from "../PlatformAdApi";

const { ccclass, property } = _decorator;

@ccclass
export default class WXADApi implements PlatformAdApi {
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

    }

    createBanner() {

    }


    showBanner() {
        if (this.wx == null && this.wx == undefined) {
            return;
        }
        if (this.SystemBannerData && this.SystemBannerData.enabled && this.SystemBannerData.vendor_position != "") {
            this.hideBanner(true);
            this._autoBannerClose = false;
            console.log("wx平台 创建横幅广告");
            this.bannerAd = this.wx.createBannerAd({
                adUnitId: this.SystemBannerData.vendor_position,
                style: {
                    left: 0,
                    top: this.systemInfo.windowHeight - 300 / 2.88,
                    width: 320
                }
            });
            this.bannerAd.onError(err => {
                console.log(err)
            })

            this.bannerAd.onResize((size) => {
                this.bannerAd.style.top = this.systemInfo.windowHeight - size.height;
                this.bannerAd.style.left = (this.systemInfo.windowWidth - size.width) / 2;
            });

            this.bannerAd.onLoad(() => {
                console.log("横幅广告调用 onLoad");

                this.bannerAd.show().catch(err => console.log('wx banner show失败==》', JSON.stringify(err)));
            });
        }
    }


    hideBanner(close = false) {
        if (this.bannerAd) {
            console.log("wx平台 销毁横幅广告");
            if (!close) {
                this._autoBannerClose = true;
            }
            this.bannerAd.hide();
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
    }


    // createVideo() {
    //     if (this.wx == null && this.wx == undefined) {
    //         return;
    //     }
    //     if (this.VideoData && this.VideoData.enabled && this.VideoData.vendor_position != ""){
    //         if (this.rewardedVideoAd) {
    //             this.rewardedVideoAd.destroy();
    //             this.rewardedVideoAd = null;
    //         }
    //         /**创建rewardedVideoAd 对象*/
    //         console.log("wx平台 创建激励视频广告");
    //         this.rewardedVideoAd = this.wx.createRewardedVideoAd({
    //             adUnitId: this.VideoData.vendor_position,
    //         });
    //         this.rewardedVideoAd.onLoad(() => {
    //             console.log("激励视频广告 加载成功");
    //             this.m_videoAdIsLoaded = true;
    //         });
    //         this.rewardedVideoAd.onError((err) => {
    //             console.log('wxH5GameAPI 激励视频 加载失败:code =====>:' + err.code + "message ======>:" + JSON.stringify(err));
    //             this.m_videoAdIsLoaded = false;
    //         });
    //     }
    // }


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
            this.rewardedVideoAd.onLoad(() => {
                console.log("激励视频广告 加载成功");
                this.m_videoAdIsLoaded = true;
            });
            this.rewardedVideoAd.onError((err) => {
                console.log('wxH5GameAPI 激励视频 加载失败:code =====>:' + err.code + "message ======>:" + JSON.stringify(err));
                this.m_videoAdIsLoaded = false;
            });
        }
    }


    showVideo(_successCallback?: Function) {
        if (this.wx == null && this.wx == undefined) {
            return;
        }
        if (this.VideoData && this.VideoData.enabled && this.VideoData.vendor_position != "") {
            this.rewardedVideoAd.show().catch(() => {
                this.rewardedVideoAd.load()
                    .then(() => {
                        this.rewardedVideoAd.show();
                    })
                    .catch(err => {
                        console.log("加载激励失败");
                    });
            });

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
        }else{
            console.log("enter here!");
            _successCallback && _successCallback(false);
        }

    }


    //之前的
    // showVideo(_successCallback?: Function) {
    //     if (this.wx == null && this.wx == undefined) {
    //         return;
    //     }
    //     if (this.VideoData && this.VideoData.enabled && this.VideoData.vendor_position != ""){
    //         /**确保video正常创建并已经拉取到数据 */
    //         if (this.m_videoAdIsLoaded) {
    //             this.rewardedVideoAd.show();
    //             const onClose = (res) => {
    //                 if (res.isEnded) {
    //                     console.log('激励视频广告完成，发放奖励');
    //                     /**播放完毕 处理播放成功的逻辑 */
    //                     _successCallback && _successCallback(true);
    //                     this.rewardedVideoAd.load();
    //                 } else {
    //                     console.log('激励视频广告取消关闭，不发放奖励');
    //                     /**播放失败 处理播放失败的逻辑 */
    //                     // _failCallback && _failCallback();
    //                     _successCallback && _successCallback(false);
    //                     this.rewardedVideoAd.load();
    //                 }
    //                 this.rewardedVideoAd.offClose(onClose);
    //             }
    //             this.rewardedVideoAd.onClose(onClose);
    //         } else {
    //             /**没有成功创建广告或者没有成功load广告 就重新创建一个 */
    //             // TipsManager.Instance().create("广告还未准备好,请稍后再试");
    //             // _failCallback && _failCallback();
    //             _successCallback && _successCallback(false);
    //             this.createVideo();
    //         }
    //     }

    // }


    showVideoAward() {

    }


    showVideoFail() {

    }


    private isIntertLoaded =false;
    createInsertAd() {
        if (this.wx == null && this.wx == undefined) {
            return;
        }
        if (this.SystemIntersData && this.SystemIntersData.enabled && this.SystemIntersData.vendor_position != "") {
            this.interstitialAd = this.wx.createInterstitialAd({
                adUnitId: this.SystemIntersData.vendor_position
            });
            this.interstitialAd.onLoad(() => {
                console.log("interstitial loaded!");
                this.isIntertLoaded = true;
            });
            this.interstitialAd.onError((res) => {
                console.log('wx InsertAd load Error:' + JSON.stringify(res));
                this.isIntertLoaded = false;
            });
        }
    }


    showInsertAd() {
        if (this.wx == null && this.wx == undefined) {
            return;
        }
        if (this.SystemIntersData && this.SystemIntersData.enabled && this.SystemIntersData.vendor_position != "") {
            if(this.isIntertLoaded){
                this.interstitialAd.show();
                const onClose = (res) => {
                    console.log("用户关闭插屏广告并销毁");
                    this.interstitialAd.offClose(onClose);
                    this.interstitialAd.load();
                    this.isIntertLoaded = false;
                };
                this.interstitialAd.onClose(onClose);
            }
            else{
                this.interstitialAd && this.interstitialAd.load();
            }
        }
    }


    // showInsertAd() {
    //     if (this.wx == null && this.wx == undefined) {
    //         return;
    //     }
    //     if (this.SystemIntersData && this.SystemIntersData.enabled && this.SystemIntersData.vendor_position != ""){
    //         if (this.interstitialAd) {
    //             this.interstitialAd.destroy();
    //             this.interstitialAd = null;
    //         }
    //         this.interstitialAd = this.wx.createInterstitialAd({
    //             adUnitId: this.SystemIntersData.vendor_position
    //         });
    //         this.interstitialAd.onLoad(() => {
    //             this.interstitialAd.show();
    //         });
    //         this.interstitialAd.onError((res) => {
    //             console.log('wx InsertAd load Error:' + JSON.stringify(res));
    //             this.interstitialAd.destroy();
    //             this.interstitialAd = null;
    //         });
    //         const onClose = (res) => {
    //             console.log("用户关闭插屏广告并销毁");
    //             this.interstitialAd.offClose(onClose);
    //             this.interstitialAd.destroy();
    //             this.interstitialAd = null;
    //         };
    //         this.interstitialAd.onClose(onClose);
    //         this.interstitialAd.load();
    //     }
    // }


    showCustomAd() {
        if (this.wx == null && this.wx == undefined) {
            return;
        }
        if (this.AdCustomIntersData && this.AdCustomIntersData.enabled && this.AdCustomIntersData.vendor_position != "") {
            if (this.customIntersAd) {
                this.customIntersAd.destroy();
                this.customIntersAd = null;
            }
            this.customIntersAd = this.wx.createCustomAd({
                adUnitId: this.AdCustomIntersData.vendor_position,
                style: {}
            });
            this.customIntersAd.onLoad(() => {
                this.customIntersAd.show();
            });
            this.customIntersAd.onError((res) => {
                console.log('wx Custom load Error:' + JSON.stringify(res));
                this.customIntersAd.destroy();
                this.customIntersAd = null;
            });
            const onClose = () => {
                console.log("用户关闭插屏广告并销毁");
                this.customIntersAd.offClose(onClose);
                this.customIntersAd.destroy();
                this.customIntersAd = null;
            };
            this.customIntersAd.onClose(onClose);
        }
    }


    hideCustomAd() {
        if (this.wx == null && this.wx == undefined) {
            return;
        }
        if (this.customIntersAd) {
            this.customIntersAd.hide();
            this.customIntersAd.destroy();
            this.customIntersAd = null;
        }
    }


    showCustomIconAd() {
        if (this.wx == null && this.wx == undefined) {
            return;
        }
        if (this.NativeIconData && this.NativeIconData.enabled && this.NativeIconData.vendor_position != "") {
            if (this.customIconAd) {
                this.customIconAd.destroy();
                this.customIconAd = null;
            }
            console.log("wx平台 showCustomIconAd");
            this.customIconAd = this.wx.createCustomAd({
                adUnitId: this.NativeIconData.vendor_position,
                style: {
                    left: 100,
                }
            });
            this.customIconAd.onLoad(() => {
                this.customIconAd.show();
            });
            this.customIconAd.onError((res) => {
                console.log('wx Custom load icon Error:' + JSON.stringify(res));
                this.customIconAd.destroy();
                this.customIconAd = null;
            });
            const onClose = () => {
                console.log("用户关闭icon广告并销毁");
                this.customIconAd.offClose(onClose);
                this.customIconAd.destroy();
                this.customIconAd = null;
            };
            this.customIconAd.onClose(onClose);
        }
    }


    hideCustomIconAd() {
        if (this.customIconAd) {
            this.customIconAd.hide();
            this.customIconAd.destroy();
            this.customIconAd = null;
        }
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
        if (this.wx != null && this.wx != undefined) {
            if (this.gridAd) {
                this.gridAd.destroy();
                this.gridAd = null;
            }
            this.gridAd = this.wx.createGridAd({
                adUnitId: this.JGGBoxData.vendor_position,
                style: {},
                adTheme: 'white',
                gridCount: 8
            });
            this.gridAd.onLoad(() => {
                this.gridAd.show();
            });
            this.gridAd.onError((res) => {
                console.log('wx InsertAd load Error:' + JSON.stringify(res));
                this.gridAd.destroy();
                this.gridAd = null;
            });
            const onClose = (res) => {
                console.log("用户关闭插屏广告并销毁");
                this.gridAd.offClose(onClose);
                this.gridAd.destroy();
                this.gridAd = null;
            };
            this.gridAd.onClose(onClose);
            this.gridAd.load();
        }
    }


    public hideGridAd() {
        if (this.gridAd) {
            this.gridAd.hide();
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
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

    showCustomAdWithInsert() {
        // throw new Error("Method not implemented.");
    }
    
    reportAnalytics(name, value) {
        if (this.wx != null && this.wx != undefined)
            this.wx.reportEvent(name, value)
    }
    hideSystemBanner() {
        // throw new Error("Method not implemented.");
    
    }
    showNativeBanner() {
        
    }
}

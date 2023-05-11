import { _decorator } from "cc";
import AdsIdConfig from "../AdsIdConfig";
import { PlatformAdApi } from "../PlatformAdApi";

const { ccclass, property } = _decorator;

@ccclass
export default class MeiZuADApi implements PlatformAdApi {
    showNativeBanner() {
        throw new Error("Method not implemented.");
    }
    hideSystemBanner() {
        throw new Error("Method not implemented.");
    }
    showCustomAd() {
        throw new Error("Method not implemented.");
    }
    hideCustomAd() {
        throw new Error("Method not implemented.");
    }
    showGridAd() {
        throw new Error("Method not implemented.");
    }
    hideGridAd() {
        throw new Error("Method not implemented.");
    }
    showCustomAdWithInsert() {
        throw new Error("Method not implemented.");
    }
    setGroup(group: any) {
        throw new Error("Method not implemented.");
    }
    clipIndexList: any;
    videoPath: any;
    recordClipRecorder(data: any) {
        throw new Error("Method not implemented.");
    }
    pauseGameVideo() {
        throw new Error("Method not implemented.");
    }
    resumeGameVideo() {
        throw new Error("Method not implemented.");
    }
    showBanner() {
        throw new Error("Method not implemented.");
    }
    showVideo(_successCallback?: Function) {
        throw new Error("Method not implemented.");
    }
    showInsertAd() {
        throw new Error("Method not implemented.");
    }
    getNativeAdInfo(type: any) {
        throw new Error("Method not implemented.");
    }
    getHWNativeAdInfo(_infoCallback?: Function) {
        throw new Error("Method not implemented.");
    }
    reportNativeImageClick(id: any) {
        throw new Error("Method not implemented.");
    }
    reportNativeImageShow(id: any) {
        throw new Error("Method not implemented.");
    }
    loadNativeImage() {
        throw new Error("Method not implemented.");
    }
    getNativeIconAdInfo(type: any) {
        throw new Error("Method not implemented.");
    }
    reportNativeIconClick(_id: string) {
        throw new Error("Method not implemented.");
    }
    reportNativeIconShow(_id: string) {
        throw new Error("Method not implemented.");
    }
    loadNativeIcon() {
        throw new Error("Method not implemented.");
    }
    showNavigateBoxPortal() {
        throw new Error("Method not implemented.");
    }
    showNavigateBoxBanner() {
        throw new Error("Method not implemented.");
    }
    hideNavigateBoxBanner() {
        throw new Error("Method not implemented.");
    }
    hasShortcutInstalled(_callback: Function) {
        throw new Error("Method not implemented.");
    }
    phoneVibrate(isLong: any) {
        throw new Error("Method not implemented.");
    }

    videoType: string;
    arg: any;

    SystemBannerData:any = null;
    SystemIntersData:any = null;
    VideoData:any = null;
    NativeBannerData:any = null;
    NativeIntersData:any = null;
    NativeIconData:any = null;//
    JGGBoxData:any = null;//九宫格
    BlockData:any = null;//互推banner
    AdCustomIntersData:any = null;//模板插屏

    /**平台环境 */
    qg: any = window["qg"];
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

    /**系统信息 */
    systemInfo: any = null;

    onInit(_callback: Function) {

        if (this.qg !== null && this.qg !== undefined) {
            this.systemInfo = this.qg.getSystemInfoSync();

            // this.createVideo();
        } else {
            this.qg = null;
        }

        _callback && _callback();
        console.log('meizu ==> onInit ok  Tip:原生广告 1091版本开放,其他接口测试通过');
    }
    onLogin() {

    }
    onShare(_callback: Function) {

    }
    ShareVideo(_title: string, templateId: string,_callback: Function) {

    }
    createBanner() {

    }
    // showBanner(adIdKey: string, openIdKey: string) {
    //     if (this.qg !== null && this.qg !== undefined) {
    //         this.hideBanner(true);
    //         this._autoBannerClose = false;
    //         console.log("meizu平台 创建横幅广告");
    //         this.bannerAd = this.qg.createBannerAd({
    //             adUnitId: AdsIdConfig.meizuId[adIdKey],
    //             style: {
    //                 left: 0,
    //                 top: this.systemInfo.screenHeight - this.systemInfo.screenWidth / 6.7,
    //                 width: this.systemInfo.screenWidth,
    //                 // 设置banner需要的宽度，横屏游戏宽度建议使用参考值1440，必须设置              
    //                 height: this.systemInfo.screenWidth / 6.7
    //             }
    //         });

    //         this.bannerAd.onClose(() => {
    //             console.log("横幅广告调用 onClose");
    //             if (!this._autoBannerClose) {
    //             }
    //         });
    //         this.bannerAd.onError((err) => {
    //             console.log('横幅广告调用 onError', JSON.stringify(err));
    //         });
    //         this.bannerAd.onResize((res) => {
    //             console.log("Banner 尺寸改变");
    //             //重新修改位置                       
    //             this.bannerAd.style.top = this.systemInfo.screenHeight - res.height;
    //             //确定左上角位置，当前为底部位置            
    //             this.bannerAd.style.left = (this.systemInfo.screenWidth - res.width) / 2;
    //         });
    //         this.bannerAd.onLoad(() => {
    //             console.log("banner 广告加载成功");
    //             this.bannerAd.show();
    //         })
    //     }
    // }
    hideBanner(close = false) {
        if (this.bannerAd) {
            console.log("meizu平台 销毁横幅广告");
            if (!close) {
                this._autoBannerClose = true;
            }
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
    }
    // createVideo() {
    //     if (this.qg !== null && this.qg !== undefined) {
    //         if (this.rewardedVideoAd) {
    //             this.rewardedVideoAd.destroy();
    //             this.rewardedVideoAd = null;
    //         }
    //         /**创建rewardedVideoAd 对象*/
    //         console.log("meizu平台 创建激励视频广告");
    //         this.rewardedVideoAd = this.qg.createRewardedVideoAd({
    //             adUnitId: AdsIdConfig.meizuId['video'],
    //         });
    //         this.rewardedVideoAd.onLoad(() => {
    //             console.log("激励视频广告 加载成功");
    //             this.m_videoAdIsLoaded = true;
    //         });
    //         this.rewardedVideoAd.onError((err) => {
    //             console.log('meizuH5GameAPI 激励视频 加载失败:code =====>:' + err.code + "message ======>:" + JSON.stringify(err));
    //             this.m_videoAdIsLoaded = false;
    //         });
    //         this.rewardedVideoAd.load();
    //     }
    // }
    // showVideo(_type: string, _successCallback?: Function, _failCallback?: Function) {
    //     this.videoType = _type;
    //     /**确保video正常创建并已经拉取到数据 */
    //     if (this.rewardedVideoAd && this.m_videoAdIsLoaded) {
    //         this.rewardedVideoAd.show();
    //         const onClose = () => {
    //             console.log('魅族没有失败，必须播完。激励视频广告完成，发放奖励');
    //             /**播放完毕 处理播放成功的逻辑 */
    //             setTimeout(() => {
    //                 _successCallback && _successCallback();
    //             }, 200);
    //             this.rewardedVideoAd.load();
    //             this.rewardedVideoAd.offClose(onClose);
    //         }
    //         this.rewardedVideoAd.onClose(onClose);
    //     } else {
    //         /**没有成功创建广告或者没有成功load广告 就重新创建一个 */
    //         // TipsManager.Instance().create("广告还未准备好,请稍后再试");
    //         _failCallback && _failCallback();
    //         this.createVideo();
    //     }
    // }
    showVideoAward() {

    }
    showVideoFail() {

    }
    createInsertAd() {

    }
    // showInsertAd(adIdKey: string, openIdKey?: string, closeCall?: Function) {
    //     if (this.qg != null && this.qg != undefined) {
    //         if (this.interstitialAd) {
    //             this.interstitialAd.destroy();
    //             this.interstitialAd = null;
    //         }
    //         this.interstitialAd = this.qg.createInsertAd({
    //             adUnitId: AdsIdConfig.meizuId[adIdKey],
    //         });
    //         this.interstitialAd.onError((res) => {
    //             console.log('meizu InsertAd load Error:' + JSON.stringify(res));
    //             this.interstitialAd.destroy();
    //             this.interstitialAd = null;
    //         });
    //         const onClose = (res) => {
    //             console.log("用户关闭插屏广告并销毁");
    //             this.interstitialAd.offClose(onClose);
    //             this.interstitialAd.destroy();
    //             this.interstitialAd = null;
    //             closeCall && closeCall();
    //         };
    //         this.interstitialAd.onClose(onClose);
    //         this.interstitialAd.onLoad(() => {
    //             this.interstitialAd.show();
    //         });
    //         this.interstitialAd.load();
    //     }
    // }
    createNativeAd() {

    }
    // showNativeAd(adIdKey: string, _callback: Function, openIdKey?: string) {
    //     if (this.qg != null && this.qg != undefined) {
    //         if (this.systemInfo.platformVersion < 1091) {
    //             console.log('原生广告 1091版本开放');
    //             return;
    //         }
    //         if (this.nativeAd) {
    //             this.nativeAd.destroy();
    //             this.nativeAd = null;
    //         }
    //         this.nativeAd = this.qg.createNativeAd({
    //             adUnitId: AdsIdConfig.meizuId['native'][adIdKey],
    //         });
    //         this.nativeAd.onError((res) => {
    //             console.log('meizu nativeAd load Error:' + JSON.stringify(res));
    //             this.nativeAd.destroy();
    //             this.nativeAd = null;
    //             _callback(null);
    //         });
    //         this.nativeAd.onLoad((res) => {
    //             console.log("原生广告 加载成功 展示原生广告");
    //             if (res && res.adList) {
    //                 this.resTemp = res.adList.pop();
    //                 console.log("原生广告 res==>:", this.resTemp);
    //                 if (this.resTemp) {
    //                     this.resTemp.openIdKey = openIdKey;
    //                     _callback(this.resTemp);
    //                     this.nativeAd.reportAdShow({
    //                         adId: this.resTemp.adId
    //                     });
    //                 }
    //             }
    //         });
    //         this.nativeAd.load();
    //     }
    // }
    onNativeAdClick(_id: string) {
        if (this.nativeAd) {
            this.nativeAd.reportAdClick({
                adId: _id
            });
        }
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
        if (this.qg != null && this.qg != undefined) {
            this.qg.installShortcut({
                success: (res) => {
                    // 判断图标未存在时，创建图标
                    // if (res == false) {
                    //     _callback && _callback(false);
                    // } else {
                    //     TipsManager.Instance().create('已存在桌面图标');
                    // }
                    _callback && _callback(true);
                },
                fail: (err) => {
                    _callback && _callback(false);
                },
                complete: () => { }
            })
        }
    }
    /**是否已经创建桌面图标 */
    // hasShortcutInstalled(_callback: Function) {
    //     if (this.qg != null && this.qg != undefined) {
    //         this.qg.hasShortcutInstalled({
    //             success: (res) => {
    //                 // 判断图标未存在时，创建图标
    //                 if (res == false) {
    //                     _callback && _callback(false);
    //                 } else {
    //                     _callback && _callback(true);
    //                     TipsManager.Instance().create('已存在桌面图标');
    //                 }
    //             },
    //             fail: (err) => { },
    //             complete: () => { }
    //         })
    //     }
    // }
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
        if (this.qg !== null && this.qg !== undefined) {
            this.qg.vibrateShort && this.qg.vibrateShort();
        }
    }

    vibrateLong() {
        if (this.qg !== null && this.qg !== undefined) {
            this.qg.vibrateLong && this.qg.vibrateLong();
        }
    }
    reportAnalytics(name, value) { }
}

import { _decorator } from "cc";
import AdsIdConfig from "../AdsIdConfig";
import { PlatformAdApi } from "../PlatformAdApi";

const { ccclass, property } = _decorator;

@ccclass
export default class QQADApi implements PlatformAdApi {
    
    setGroup(group: any) {
    }
    clipIndexList: any;
    videoPath: any;
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
    qq: any = window["qq"];
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

    title: string = '快来人啊大西瓜据点被攻占啦';
    /**分享图地址 */
    shareUrl: string = "https://micro.dragon.efunent.com/web5_jqm/CubeWarfare/qq/data/share.jpg";

    /**盒子广告 */
    appBoxAd: any = null;

    /**系统信息 */
    systemInfo: any = null;

    onInit(_callback: Function) {

        if (this.qq !== null && this.qq !== undefined) {
            this.qq.showShareMenu({
                showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
            });
            this.systemInfo = this.qq.getSystemInfoSync();

            this.createVideo();
        } else {
            this.qq = null;
        }


        _callback && _callback();
        console.log('qq ===================> onInit OK');
    }

    onLogin() {

    }

    onShare(_callback: Function) {
        if (this.qq != null && this.qq != undefined) {
            console.log("qq平台 分享");
            this.qq.shareAppMessage({
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


    ShareVideo(_title: string, templateId: string,_callback: Function) {

    }


    createBanner() {

    }

    showBanner() {
        if (this.qq !== null && this.qq !== undefined) {
            this.hideBanner(true);
            this._autoBannerClose = false;
            console.log("qq平台 创建横幅广告", this.SystemBannerData.vendor_position);
            let BannerAdWidth = 300;
            this.bannerAd = this.qq.createBannerAd({
                adUnitId: this.SystemBannerData.vendor_position,
                style: {
                    top: 0,
                    left: 0,
                    height: BannerAdWidth / 16 * 9,
                    width: BannerAdWidth
                }
            });

            this.bannerAd.onResize(size => {
                // 底部居中显示
                this.bannerAd.style.top = this.systemInfo.windowHeight - size.height;
                this.bannerAd.style.left = (this.systemInfo.windowWidth - size.width) / 2;

                this.bannerAd.show().then(() => {
                    console.log('广告显示成功');
                }).catch(err => {
                    console.log('广告显示失败', JSON.stringify(err));
                });
            });

            this.bannerAd.onError((err) => {
                console.log('Banner ad error', JSON.stringify(err));
            });
        }
    }

    hideBanner(close = false) {
        console.log("qq平台 允许banner和插屏同时存在，不是必要可以不调用");
        if (this.bannerAd) {
            this.bannerAd.hide();
            this.bannerAd.destroy();
        }
    }

    createVideo() {
        if (this.qq !== null && this.qq !== undefined) {
            if (this.rewardedVideoAd) {
                this.rewardedVideoAd.destroy();
                this.rewardedVideoAd = null;
            }
            /**创建rewardedVideoAd 对象*/
            console.log("qq平台 创建激励视频广告");
            this.rewardedVideoAd = this.qq.createRewardedVideoAd({
                adUnitId: this.VideoData.vendor_position,
            });
            this.rewardedVideoAd.onLoad(() => {
                console.log("激励视频广告 加载成功");
                this.m_videoAdIsLoaded = true;
            });
            this.rewardedVideoAd.onError((err) => {
                console.log('qqH5GameAPI 激励视频 加载失败:code =====>:' + err.code + "message ======>:" + JSON.stringify(err));
                this.m_videoAdIsLoaded = false;
            });
            this.rewardedVideoAd.load();
        }
    }

    showVideo(_successCallback?: Function) {
        /**确保video正常创建并已经拉取到数据 */
        if (this.rewardedVideoAd && this.m_videoAdIsLoaded) {
            this.rewardedVideoAd.show();
            const onClose = (res) => {
                if (res.isEnded) {
                    console.log('激励视频广告完成，发放奖励');
                    /**播放完毕 处理播放成功的逻辑 */
                    // _successCallback && _successCallback();
                    _successCallback && _successCallback(true);
                    this.rewardedVideoAd.load();
                } else {
                    console.log('激励视频广告取消关闭，不发放奖励');
                    /**播放失败 处理播放失败的逻辑 */
                    _successCallback && _successCallback(false);
                    this.rewardedVideoAd.load();
                }
                this.rewardedVideoAd.offClose(onClose);
            }
            this.rewardedVideoAd.onClose(onClose);
        } else {
            /**没有成功创建广告或者没有成功load广告 就重新创建一个 */
            // TipsManager.Instance().create("广告还未准备好,请稍后再试");
            // _failCallback && _failCallback();
            _successCallback && _successCallback(false);
            this.createVideo();
        }
    }


    showVideoAward() {

    }
    showVideoFail() {

    }
    createInsertAd() {

    }
    showInsertAd() {
        // if (this.qq != null && this.qq != undefined) {
        //     if (this.interstitialAd) {
        //         this.interstitialAd.destroy();
        //         this.interstitialAd = null;
        //     }
        //     this.interstitialAd = this.qq.createInterstitialAd({
        //         adUnitId: AdsIdConfig.qqId[adIdKey]
        //     });
        //     this.interstitialAd.load();
        //     this.interstitialAd.onLoad(() => {
        //         console.log('==> onLoad');
        //         this.interstitialAd && this.interstitialAd.show && this.interstitialAd.show();
        //     });
        //     this.interstitialAd.onError((res) => {
        //         console.log('qq InsertAd load Error:' + JSON.stringify(res));
        //     });
        //     const onClose = (res) => {
        //         console.log("用户关闭插屏广告并销毁");
        //         this.interstitialAd.offClose(onClose);
        //         this.interstitialAd.destroy();
        //         this.interstitialAd = null;
        //     };
        //     this.interstitialAd.onClose(onClose);
        // }
    }
    createNativeAd() {

    }
    showNativeAd() {
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
    createGridAd() {
        // if (this.qq != null && this.qq != undefined) {
        //     if (this.appBoxAd) {
        //         this.appBoxAd.destroy();
        //         this.appBoxAd = null;
        //     }
        //     this.appBoxAd = this.qq.createAppBox({
        //         adUnitId: AdsIdConfig.qqId[adIdKey]
        //     });
        //     this.appBoxAd.onError((res) => {
        //     });
        //     const onClose = (res) => {
        //         console.log("用户关闭盒子广告并销毁");
        //         this.appBoxAd.offClose(onClose);
        //         this.appBoxAd.destroy();
        //         this.appBoxAd = null;
        //     };
        //     this.appBoxAd.onClose(onClose);
        //     this.appBoxAd.load().then(() => {
        //         this.appBoxAd && this.appBoxAd.show && this.appBoxAd.show();
        //     }).catch((res) => {
        //         console.log('qq appBoxAd load Error:' + JSON.stringify(res));
        //     });
        // }
    }


    saveDataToCache(_key: string, _value: any) {

    }


    readDataFromCache(_key: string) {

    }


    addDesktop(_callback: Function) {
        if (this.qq != null && this.qq != undefined) {
            this.qq.saveAppToDesktop({
                success: (res) => {
                    // 判断图标未存在时，创建图标
                    if (res == false) {
                        _callback && _callback(2);
                    } else {
                        _callback && _callback(1);
                    }
                },
                fail: (err) => {
                    _callback && _callback(0);
                },
                complete: () => {
                    _callback && _callback(2);
                }
            })
        }
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


    addColorBookmark(_callback: Function) {
        if (this.qq != null && this.qq != undefined) {
            console.log("qq 添加彩签");
            this.qq.addColorSign({
                success(res) {
                    console.log('添加彩签成功 ', res);
                    _callback && _callback(1);
                },
                fail(err) {
                    console.log('添加彩签失败', err);
                    _callback && _callback(0);
                },
                complete(res) {
                    console.log('添加彩签 complete: ', res);
                    _callback && _callback(2);
                }
            });
        }
    }


    addSubscribeApp(_callback: Function) {
        if (this.qq != null && this.qq != undefined) {
            console.log("qq 添加订阅");
            this.qq.subscribeAppMsg({
                subscribe: true,
                success: (res) => {
                    console.log("qq 订阅成功");
                    _callback && _callback(1);
                },
                fail: (res) => {
                    console.log("qq 订阅失败");
                    _callback && _callback(0);
                }
            });
        }
    }


    vibrateShort() {
        if (this.qq != null && this.qq != undefined)
            this.qq.vibrateShort && this.qq.vibrateShort();
    }


    vibrateLong() {
        if (this.qq != null && this.qq != undefined)
            this.qq.vibrateLong && this.qq.vibrateLong();
    }
    reportAnalytics(name, value) { }


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
    showCustomAd() {
    }
    hideCustomAd() {
    }
    showGridAd() {
    }
    hideGridAd() {
    }
    hideSystemBanner() {
        // throw new Error("Method not implemented.");
    }
    showCustomAdWithInsert() {
        // throw new Error("Method not implemented.");
    }
    showNativeBanner() {
        
    }
}

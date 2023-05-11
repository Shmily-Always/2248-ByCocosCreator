
import { PlatformAdApi } from "../PlatformAdApi";
import { _decorator, Component, Node } from 'cc';
import { AdLogUtil } from "../../Util/AdLogUtil";
const { ccclass, property } = _decorator;

@ccclass('XmADApi')
export class XmADApi implements PlatformAdApi {
    showCustomAdWithInsert() {
        // throw new Error("Method not implemented.");
    }
    
    SystemBannerData: any;
    SystemIntersData: any;
    VideoData: any;
    NativeBannerData: any;
    NativeIntersData: any;
    NativeIconData: any;
    JGGBoxData: any;
    BlockData: any;
    AdCustomIntersData: any;

    /**平台环境 */
    qg: any = window["qg"];

    /**系统信息 */
    systemInfo: any = null;

    /**banner */
    systemBannerAd = null;
    /**系统banner加载成功 */
    loadSucc_SystemBanner = false;
    /**正在展示系统banner */
    isShow_SystemBanner = false;
    /**banner刷新时间 */
    NUM_BannerUpdateTime = 30;
    /**banner刷新定时器 */
    interval_updateBanner = null;

    /**插屏 */
    systemIntersAd: any = null;
    /**系统插屏加载成功 */
    loadSucc_SystemInters = false;

    /**视频 */
    rewardedVideoAd = null;
    /**视频广告是否已经load到数据 */
    loadSucc_Video: boolean = false;
    /**视频广告回调 */
    callback_Video = null;


    /**互推盒子九宫格广告对象 */
    navigateBoxPortalAd = null;
    /**互推盒子九宫格广告是否加载成功 */
    loadSucc_NavigateBoxPortal = false;


    /**原生大图 */
    nativeImageAd: any = null;
    /**原生Image广告对象 */
    nativeImageInfo: any = null;
    /**原生banner加载成功 */
    loadSucc_NativeImage = false;
    /**正在展示原生banner */
    isShow_NativeImage = false;
    /**视频广告回调 */
    callback_Native = null;


    onInit(_callback: Function) {
        if (this.qg !== null && this.qg !== undefined) {
            this.systemInfo = this.qg.getSystemInfoSync();
            console.log('MINIGAME ===> 设备信息.systemInfo===>', this.systemInfo);

            this.createAd();
        } else {
            this.qg = null;
        }

        _callback && _callback();
        console.log('MINIGAME ===> 小米 ===================> onInit ok');
    }


    /**
     * 创建广告
     */
    private createAd() {
        if (this.SystemBannerData.enabled && this.SystemBannerData.vendor_position != "") this.createSystemBanner();
        console.log("MINIGAME ===> createAd");
        console.log(this.SystemIntersData.enabled);
        console.log(this.SystemIntersData.vendor_position);
        if (this.SystemIntersData && this.SystemIntersData.enabled && this.SystemIntersData.vendor_position != "") this.createInsertAd();
        if (this.VideoData.enabled && this.VideoData.vendor_position != "") this.createVideo();

        // // this.loadNativeBannerRes();

        //原生广告
        if (this.NativeIntersData && this.NativeIntersData.enabled && this.NativeIntersData.vendor_position != "") this.createNativeImage();

    }


    private createSystemBanner() {
        console.log("MINIGAME ===> ", "小米 系统banner加载", this.SystemBannerData.vendor_position);
        this.systemBannerAd = this.qg.createBannerAd({
            adUnitId: this.SystemBannerData.vendor_position,
            // style: {

            // }
        })

        // this.loadSucc_SystemBanner = true;

        // 监听系统banner错误
        this.systemBannerAd.onError((err) => {
            AdLogUtil.Log("小米banner onError!");
            console.log("MINIGAME ===> ", "小米 系统banner加载/展示失败：", JSON.stringify(err));
            this.loadSucc_SystemBanner = false;
        })

        // 监听系统banner隐藏
        this.systemBannerAd.onClose(() => {
            AdLogUtil.Log("小米banner onClose!");
            console.log("MINIGAME ===> ", "小米 系统banner关闭", this.NUM_BannerUpdateTime + "S之后再次刷新")
            // this.createSystemBanner();
            this.systemBannerAd&&this.systemBannerAd.destroy();
            this.loadSucc_SystemBanner = false;
        })
        this.systemBannerAd.onLoad(() => {
            AdLogUtil.Log("小米banner 加载成功!");
            this.loadSucc_SystemBanner = true;
            // this.systemBannerAd.show();
        });
    }


    /**
     * 展示系统banner
     */
    showSystemBanner() {
        AdLogUtil.Log("showSystemBanner");
        this.isShow_SystemBanner = true;
        this.systemBannerAd.show();
    }


    /**
     * 隐藏系统banner
     */
    hideSystemBanner() {
        AdLogUtil.Log("hideSystemBanner");
        if (this.isShow_SystemBanner && this.systemBannerAd) {
            this.systemBannerAd&&this.systemBannerAd.destroy();
            this.loadSucc_SystemBanner = false;
        }
    }
    

    showBanner() {
        AdLogUtil.Log("showBanner isLoaded:"+this.loadSucc_SystemBanner);
        if(!this.loadSucc_SystemBanner){
            this.createSystemBanner();
        }
        setTimeout(() => {
            this.isShow_SystemBanner = true;
            this.systemBannerAd.show();
        }, 1000)
    }


    hideBanner() {
        AdLogUtil.Log("hideBanner");
        this.hideSystemBanner();
    }


    setGroup(group: any) {
    }


    onLogin(_callback?: Function | undefined) {
        console.log("xiaomi onLogin");
        if (this.qg !== null && this.qg !== undefined) {
            this.qg.login({
                success: function (res) {
                    console.log(" game login with real success:" + JSON.stringify(res));
                    _callback(1);
                },
                fail: function (res) {
                    console.log("game login with real fail:" + res);
                    _callback(2);
                }
            });
        }
    }


    onShare(_callback: Function) {
    }
    ShareVideo(_title: string, templateId: string, _callback: Function) {
    }
    clipIndexList: any;
    videoPath: any;
    recordClipRecorder(data: any) {
    }
    pauseGameVideo() {
    }
    resumeGameVideo() {
    }


    createInsertAd() {
        console.log("MINIGAME ===> createInsertAd");
        if (this.qg != null && this.qg != undefined) {
            console.log("MINIGAME ===> 小米  创建插屏广告");
            this.systemIntersAd = this.qg.createInterstitialAd({
                adUnitId: this.SystemIntersData.vendor_position
            });
            this.loadSucc_SystemInters = false;
            this.systemIntersAd.onLoad(() => {
                this.loadSucc_SystemInters = true;
            });
            //监听插屏广告错误
            this.systemIntersAd.onError(err => {
                console.log("MINIGAME ===> ", "小米 系统插屏onError"+err);
                this.loadSucc_SystemInters = false;
                setTimeout(() => {
                    this.createInsertAd();
                    // this.systemIntersAd && this.systemIntersAd.load()
                }, 15 * 1000);
            });
            //监听插屏广告关闭
            this.systemIntersAd.onClose(() => {
                console.log("MINIGAME ===> ", "小米 系统插屏广告关闭");
                this.loadSucc_SystemInters = false;
                // this.systemIntersAd && this.systemIntersAd.destroy();
                // 系统插屏关闭后5s后再次load
                setTimeout(() => {
                    // this.systemIntersAd && this.systemIntersAd.load()
                    this.createInsertAd();
                }, 5 * 1000);
            })

            // this.systemIntersAd.load();
        }
    }


    public showInsertAd() {
        console.log("MINIGAME ===> showInsertAd");
        if (this.systemIntersAd && this.loadSucc_SystemInters) {
            this.systemIntersAd.show();
        }
    }

    private createVideo() {
        console.log("MINIGAME ===> createVideo");
        if (this.qg !== null && this.qg !== undefined) {
            /**创建rewardedVideoAd 对象*/
            console.log("MINIGAME ===> 小米 创建激励视频广告");
            this.rewardedVideoAd = this.qg.createRewardedVideoAd({
                adUnitId: this.VideoData.vendor_position,
            });
            this.rewardedVideoAd.onLoad(() => {
                console.log("MINIGAME ===> 激励视频广告 加载成功");
                this.loadSucc_Video = true;
            });
            this.rewardedVideoAd.onError((err) => {
                console.log('MINIGAME ===>  激励视频 加载失败:code =====>:' + err.code + "message ======>:" + JSON.stringify(err));
                this.loadSucc_Video = false;
                if (this.rewardedVideoAd) {
                    setTimeout(() => {
                        this.rewardedVideoAd && this.rewardedVideoAd.load()
                    }, 5 * 1000)
                }
            });
            //监听视频广告播放完成
            this.rewardedVideoAd.onClose(res => {
                if (res.isEnded) {
                    console.log("MINIGAME ===> ", "小米 激励视频广告完成，发放奖励");
                    if (this.callback_Video) {
                        this.callback_Video(true);
                    }
                } else {
                    console.log("MINIGAME ===> ", "小米 激励视频广告关闭，不发放奖励");
                    if (this.callback_Video) {
                        this.callback_Video(false);
                    }
                }
                setTimeout(() => {
                    this.rewardedVideoAd.load();
                }, 300)
            })
            this.rewardedVideoAd.load();
        }
    }

    public showVideo(_successCallback?: Function) {
        console.log("MINIGAME ===> showVideo");
        /**确保video正常创建并已经拉取到数据 */
        if (this.rewardedVideoAd && this.loadSucc_Video) {
            this.callback_Video = _successCallback;
            this.rewardedVideoAd.show();
            this.loadSucc_Video = false;
        } else {
            /**没有成功创建广告或者没有成功load广告 就重新创建一个 */
            // TipsManager.Instance().create("广告还未准备好,请稍后再试");
            _successCallback(false);
        }
    }


    /**
     * 显示九宫格
     */
    public showNavigateBoxPortal() {
        console.log("xiaomi showNavigateBoxPortal");
        if (this.qg !== null && this.qg !== undefined) {
            this.qg.displayAd(
                {
                    type: 100,
                    upid: this.JGGBoxData.vendor_position,
                    success: (res) => {
                        console.log("成功显示九宫格");
                        console.log(res);
                        // 将会打印以下信息，表示调用成功
                        // {errMsg: "", errCode: 0}
                    },
                    fail: (res) => {
                        console.log("显示九宫格失败");
                        console.log(res)
                    }
                }
            )
        }
    }

    
    /**原生大图 */
    createNativeImage() {
        console.log("MINIGAME ===> 原生大图", "--createNativeImage--");
        this.nativeImageAd = this.qg.createNativeAd({
            adUnitId: this.NativeIntersData.vendor_position
            // adUnitId: "u7m3hc4gvm"
        })
        this.loadSucc_NativeImage = false;
        this.nativeImageInfo = {
            adId: null,
            title: '',
            desc: '',
            source: '',
            clickBtnTxt: '',
            Native_icon_url: null,
            Native_icon: null,
            Native_BigImage_url: null,
            Native_BigImage: null,
            dcr: this.NativeIntersData.dcr,
        };

        this.nativeImageAd.onLoad((res) => {

            console.info('ad data loaded: ' + JSON.stringify(res))

            let index = 0;
            if (typeof res.adList != undefined && res.adList.length != 0) {
                index = res.adList.length - 1;
            } else {
                console.log("MINIGAME ===> ", "小米 原生大图广告列表为空 return");
                return;
            }

            this.nativeImageInfo.adId = String(res.adList[index].adId);
            this.nativeImageInfo.title = String(res.adList[index].title);
            this.nativeImageInfo.desc = String(res.adList[index].desc);
            // this.nativeImageInfo.source = String(res.adList[index].source)
            this.nativeImageInfo.clickBtnTxt = String(res.adList[index].clickBtnTxt);


            if (res.adList && res.adList[index].icon != "") {
                this.nativeImageInfo.Native_icon_url = res.adList[index].icon;
            }

            if (res.adList && res.adList[index].imgUrlList.length > 0) {
                this.nativeImageInfo.Native_BigImage_url = res.adList[index].imgUrlList[0];
            }

            this.loadSucc_NativeImage = true;
            console.log("MINIGAME ===> ", "小米 原生大图广告加载成功：", this.nativeImageInfo)

            this.callback_Native && this.callback_Native(this.nativeImageInfo);
        });

        //监听原生广告加载错误
        this.nativeImageAd.onError(err => {
            console.log("MINIGAME ===> ", "小米 原生大图广告加载失败：", JSON.stringify(err));
            this.callback_Native && this.callback_Native(null);
        });

        // this.nativeImageAd.load();
    }
    


    /**小米原生大图广告获取 */
    getNativeAdInfo(_infoCallback?: Function) {
        this.callback_Native = _infoCallback;
        if (!this.nativeImageAd) {
            if (this.NativeIntersData && this.NativeIntersData.enabled && this.NativeIntersData.vendor_position != "") {
                this.createNativeImage();
            }
        }
        this.nativeImageAd && this.nativeImageAd.load();
    }


    reportNativeImageShow(adId) {
        console.log("MINIGAME ===> ", "小米 该原生大图广告id上报展示", adId);
        this.nativeImageAd.reportAdShow({
            adId: adId
        })
    }


    reportNativeImageClick(adId) {
        console.log("MINIGAME ===> ", "小米 原生大图广告上报点击", adId);
        this.nativeImageAd.reportAdClick({
            adId: adId
        })
    }

    
    getHWNativeAdInfo(type: any) {
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


    showNavigateBoxBanner() {
    }


    hideNavigateBoxBanner() {
    }


    addDesktop(_callback: Function) {
    }


    hasShortcutInstalled(_callback: Function) {
    }


    StartRecorder(_duration: any) {
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
    }


    addSubscribeApp(_callback: Function) {
    }


    phoneVibrate(isLong: any) {
    }


    reportAnalytics(name: string, value: number | object) {
    }


    showCustomAd() {
    }


    hideCustomAd() {
    }


    showGridAd() {
    }
    hideGridAd() {
    }

    showNativeBanner() {
        
    }
}
import { assetManager, director, Label, Node, Sprite, SpriteFrame, UITransform, view, Widget, _decorator } from "cc";
import { AdLogUtil } from "../../Util/AdLogUtil";
import AdsIdConfig from "../AdsIdConfig";
import { PlatformAdApi } from "../PlatformAdApi";

const { ccclass, property } = _decorator;

@ccclass
export default class OppoADApi implements PlatformAdApi {
    showCustomAdWithInsert() {
        // throw new Error("Method not implemented.");
    }

    /**原生模板广告 */
    customIntersAd = null;

    /**模板插屏间隔 */
    CuctomIntervalTime = true;

    /**
     * 左上角距离屏幕上边的距离
     */
    customAdTop = 720;

    /**
     * 左上角距离屏幕左边的距离
     */
    // customAdLeft = 0;

    /**
     * CustomAd 展示的宽度
     */
    customAdWidth = 700;

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
    qg: any = window["qg"];

    /**广告分组 */
    AdGroup = 0;

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
    interstitialAd = null;

    /**视频 */
    rewardedVideoAd = null;
    /**视频广告是否已经load到数据 */
    loadSucc_Video: boolean = false;
    /**视频广告回调 */
    callback_Video = null;

    /**原生本地图片资源 */
    nativeRes = null;
    /**原生本地图片资源否加载成功 */
    loadNativeRes = false;

    /**原生 */
    nativeAd = null;
    /**原生banner广告对象 */
    nativeBannerInfo = null;
    /**原生banner加载成功 */
    loadSucc_NativeBanner = false;
    /**正在展示原生banner */
    isShow_NativeBanner = false;
    /**展示原生banner的Node */
    node_nativeBanner = null;

    /**原生大图 */
    nativeImageAd = null;
    /**原生Image广告对象 */
    nativeImageInfo = null;
    /**原生banner加载成功 */
    loadSucc_NativeImage = false;
    /**正在展示原生banner */
    isShow_NativeImage = false;

    /**原生icon */
    nativeIconAd = null;
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

    //用于控制展示时间间隔
    lastDisplayTime:number=0;

    firstEnter:boolean=true;

    onInit(_callback: Function) {
        // console.log("oppo platform load config success...");
        AdLogUtil.Log("OPPO平台加载配置成功!");
        if (this.qg !== null && this.qg !== undefined) {
            this.systemInfo = this.qg.getSystemInfoSync();
            // console.log('MINIGAME ===> 设备信息.systemInfo===>', this.systemInfo);
            this.createAd();
        } else {
            this.qg = null;
        }
        _callback && _callback();
        // console.log('MINIGAME ===> oppo ===================> onInit  ok');
    }


    createAd() {
        AdLogUtil.Log("OPPO平台 createAd!");
        if (this.NativeBannerData && this.NativeBannerData.enabled && this.NativeBannerData.vendor_position != "") this.createNativeBanner();  //原生模板banner
        if (this.SystemBannerData && this.SystemBannerData.enabled && this.SystemBannerData.vendor_position != "") this.createSystemBanner();   //普通banner
        if (this.VideoData && this.VideoData.enabled && this.VideoData.vendor_position != "") this.createVideo();
        if (this.JGGBoxData && this.JGGBoxData.enabled && this.JGGBoxData.vendor_position != "") this.createNavigateBoxPortal();
        if (this.BlockData && this.BlockData.enabled && this.BlockData.vendor_position != "") this.createNavigateBoxBanner();


        // this.loadNativeBannerRes();
        if (this.NativeIntersData && this.NativeIntersData.enabled && this.NativeIntersData.vendor_position != "") this.createNativeImage();
        if (this.NativeIconData && this.NativeIconData.enabled && this.NativeIconData.vendor_position != "") this.createNativeIcon();

        //创建原生模板广告
        if (this.AdCustomIntersData && this.AdCustomIntersData.enabled && this.AdCustomIntersData.vendor_position != "") this.createNativeCuston();
    }


    setGroup(group) {
        this.AdGroup = group;
    }
    onLogin() {

    }
    onShare(_callback: Function) {

    }
    clipIndexList = [];
    videoPath;
    recordClipRecorder(data) { }
    pauseGameVideo() { }
    resumeGameVideo() { }
    ShareVideo(_title: string, templateId: string, _callback: Function) {
    }
    createSystemBanner() {
        // console.log("MINIGAME ===> ", "OPPO 系统banner加载", this.SystemBannerData.vendor_position);
        // AdLogUtil.Log("OPPO createSystemBanner: "+this.SystemBannerData.vendor_position);
        this.systemBannerAd = this.qg.createBannerAd({
            adUnitId: this.SystemBannerData.vendor_position,
            style: {
            }
        })

        this.loadSucc_SystemBanner = true;

        // 监听系统banner错误
        this.systemBannerAd.onError((err) => {
            AdLogUtil.Log("systemBannerAd onError:"+JSON.stringify(err));
            // console.log("MINIGAME ===> ", "OPPO 系统banner加载/展示失败：", JSON.stringify(err));
        })

        // 监听系统banner隐藏
        this.systemBannerAd.onHide(() => {
            AdLogUtil.Log("systemBannerAd onHide");
            // console.log("MINIGAME ===> ", "OPPO 系统banner关闭", this.NUM_BannerUpdateTime + "S之后再次刷新")
            this.updateBanner();
        })
    }


    showBanner() {
        AdLogUtil.Log("showBanner isLoadedBanner:"+this.loadSucc_SystemBanner+this.loadSucc_NativeBanner);
        //轮播banner逻辑
        // this.showNativeBanner();
        // setTimeout(()=>{
        //     if (this.loadSucc_SystemBanner && !this.loadSucc_NativeBanner) {
        //         this.showSystemBanner();
        //     }
        // },10*1000);
        
        if(this.loadSucc_SystemBanner){
            this.showSystemBanner();
        }
    }


    hideBanner() {
        AdLogUtil.Log("hideBanner");
        this.hideSystemBanner();
        this.hideNativeBanner();

        // this.updateBanner();
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
            this.isShow_SystemBanner = false;
            this.systemBannerAd.offHide();
            this.systemBannerAd.hide();
        }
    }


    /**
    * 刷新banner
    */
    updateBanner() {
        AdLogUtil.Log("updateBanner");
        if (this.interval_updateBanner) clearInterval(this.interval_updateBanner);
        // 刷新广告条
        this.interval_updateBanner = setInterval(() => {
            if (this.loadSucc_NativeBanner) {
                this.updateNativeBanner();
            } else if (this.loadSucc_SystemBanner) {
                this.updateSystemBanner();
            }
        }, this.NUM_BannerUpdateTime * 1000)
    }
    
    /**
     * 刷新系统banner
     */
    updateSystemBanner() {
        this.hideSystemBanner();
        this.hideNativeBanner();
        this.showSystemBanner();
    }
    /** */
    updateNativeBanner() {
        this.hideNativeBanner();
        this.hideSystemBanner();
        this.showNativeBanner();
    }


    /**
     * 创建原生插屏模板广告
     */
    createNativeCuston() {
        AdLogUtil.Log("OPPO创建原生模板广告! createNativeCuston: "+this.AdCustomIntersData.vendor_position);
        // console.log("MINIGAME ===> ", "OPPO 创建原生模板插屏模板广告:" + this.AdCustomIntersData.vendor_position)
        this.customIntersAd = this.qg.createCustomAd({
            adUnitId: this.AdCustomIntersData.vendor_position,
            // adUnitId: '764650',
            //竖屏设置
            style: {
                // left: this.customAdLeft,
                top: this.customAdTop
            }

            // //横屏设置
            // style: {
            //     left: 720,
            //     top: 100
            // }
        });
        this.customIntersAd.onLoad(() => {
            AdLogUtil.Log("原生模板广告加载成功回调 customIntersAd onLoad");
            // console.log("MINIGAME ===> ", "OPPO 原生模板插屏广告加载完成")
        })

        this.customIntersAd.onError((err) => {
            AdLogUtil.Log("原生模板广告报错回调 customIntersAd onError:"+JSON.stringify(err));
            // console.log("MINIGAME ===> ", "OPPO 原生模板插屏广告加载错误! " + err)
            setTimeout(() => {
                this.createNativeCuston();
            }, 20 * 1000);
        })

        //监听插屏广告显示 修改bug
        this.customIntersAd.onShow(() => {
            // console.log("MINIGAME ===> ", "OPPO 原生模板插屏广告关闭");
            AdLogUtil.Log("原生模板广告展示回调 customIntersAd onShow");
            // let lastDisplayTime=
            
        })

        this.customIntersAd.onHide(()=>{
            AdLogUtil.Log("原生模板广告关闭回调 customIntersAd onHide");
            // let time=this.AdCustomIntersData.ad_interval;
            // if(time==0){
            //     time=2;
            // }
            // console.log("time is ",time);
            // 系统插屏关闭后2s后再次load
            setTimeout(() => {
                this.createNativeCuston();
            }, 2 * 1000);
            this.lastDisplayTime=Date.parse(new Date().toString());
            // console.log("lastDisplayTime is ",this.lastDisplayTime);
        })
    }


    /**
    * 展示原生模板插屏
    */
    private showCustomInters() {   //TODO:OPPO原生模版由后台参数控制
        AdLogUtil.Log("显示原生模板广告 showCustomInters");
        let time=this.AdCustomIntersData.ad_interval;
        let nowTime=Date.parse(new Date().toString());
        let interval=(nowTime-this.lastDisplayTime)/1000;
        // console.log("interval is ",interval);
        if(this.AdCustomIntersData && this.AdCustomIntersData.enabled && this.AdCustomIntersData.vendor_position != ""){
            if ((this.customIntersAd && interval>=time) || (this.customIntersAd && this.firstEnter)) {
                // let time = this.AdCustomIntersData.day_limits;
                // setTimeout(() => {
                    // console.log("MINIGAME ===> ", "OPPO 原生模板广告调用");
                    AdLogUtil.Log("原生模板广告调用 show");
                    this.customIntersAd.show().then(() => {
                        AdLogUtil.Log("OPPO 原生模板广告展示成功");
                        this.firstEnter=false;
                        // console.log("MINIGAME ===> ", "OPPO 原生模板广告展示成功==================");
                    }).catch((err) => {
                        AdLogUtil.Log("OPPO 原生模板广告展示成功"+JSON.stringify(err));
                        // console.log("MINIGAME ===> ", "OPPO 原生模板广告展示错误:" + JSON.stringify(err));
                    })
    
                // }, time * 1000);
            }
        }else{
            AdLogUtil.Log("未打开广告位开关或广告位为空");
            return;
        }
    }


    /**
     * 调用原生模板广告
     */
    public showCustomAd() {
        this.showCustomInters();
    }


    
    public hideCustomAd() {
        this.customIntersAd&&this.customIntersAd.hide();
    }


    private createVideo() {
        if (this.qg !== null && this.qg !== undefined) {
            AdLogUtil.Log("OPPO创建激励视频广告 createVideo");
            /**创建rewardedVideoAd 对象*/
            // console.log("MINIGAME ===> Oppo平台 创建激励视频广告");
            this.rewardedVideoAd = this.qg.createRewardedVideoAd({
                adUnitId: this.VideoData.vendor_position,
            });
            this.rewardedVideoAd.onLoad(() => {
                // console.log("MINIGAME ===> 激励视频广告 加载成功");
                AdLogUtil.Log("OPPO 激励视频广告 加载成功 rewardedVideoAd onLoad");
                this.loadSucc_Video = true;
            });
            this.rewardedVideoAd.onError((err) => {
                // console.log('MINIGAME ===>  激励视频 加载失败:code =====>:' + err.code + "message ======>:" + JSON.stringify(err));
                AdLogUtil.Log("OPPO 激励视频 加载失败:code"+err.code +"msg:"+ JSON.stringify(err)+" rewardedVideoAd onError");
                this.loadSucc_Video = false;
                if (this.rewardedVideoAd) {
                    setTimeout(() => {
                        this.rewardedVideoAd && this.rewardedVideoAd.load()
                    }, 5 * 1000)
                }
            });
            //监听视频广告播放完成
            this.rewardedVideoAd.onClose(res => {
                AdLogUtil.Log("rewardedVideoAd onClose: "+res.isEnded);
                if (res.isEnded) {
                    // console.log("MINIGAME ===> ", "OPPO 激励视频广告完成，发放奖励");
                    AdLogUtil.Log("OPPO 激励视频广告完成，发放奖励");
                    if (this.callback_Video) {
                        this.callback_Video(true);
                    }
                } else {
                    // console.log("MINIGAME ===> ", "OPPO 激励视频广告关闭，不发放奖励");
                    AdLogUtil.Log("OPPO 激励视频广告关闭，不发放奖励");
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
        AdLogUtil.Log("showVideo");
        /**确保video正常创建并已经拉取到数据 */
        if (this.rewardedVideoAd && this.loadSucc_Video) {
            this.callback_Video = _successCallback;
            AdLogUtil.Log("showVideo 激励加载成功调用 rewardedVideoAd show 方法");
            this.rewardedVideoAd.show();
            this.loadSucc_Video = false;

        } else {
            /**没有成功创建广告或者没有成功load广告 就重新创建一个 */
            // TipsManager.Instance().create("广告还未准备好,请稍后再试");
            AdLogUtil.Log("showVideo 没有加载成功调用失败回到");
            _successCallback(false);
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

    /**
     * 创建互推盒子九宫格广告
     */
    createNavigateBoxPortal() {
        // console.log("MINIGAME ===> ", "--createNavigateBoxPortal--");
        AdLogUtil.Log("创建九宫格广告 createNavigateBoxPortal");
        if (this.qg.getSystemInfoSync().platformVersionCode < 1076) {
            // console.log("MINIGAME ===> ", "OPPO 版本较低,不支持互推盒子广告");
            AdLogUtil.Log("OPPO 版本较低,不支持互推盒子广告");
            this.loadSucc_NavigateBoxPortal = false;
            return;
        }

        this.navigateBoxPortalAd = this.qg.createGamePortalAd({
            adUnitId: this.JGGBoxData.vendor_position
        })

        // 监听互推盒子九宫格广告加载成功
        this.navigateBoxPortalAd.onLoad(() => {
            // console.log("MINIGAME ===> ", "OPPO 互推盒子九宫格广告加载完成");
            AdLogUtil.Log("九宫格广告加载完成 navigateBoxPortalAd onLoad");
            this.loadSucc_NavigateBoxPortal = true;
        })

        // 监听互推盒子九宫格广告加载失败
        this.navigateBoxPortalAd.onError((err) => {
            AdLogUtil.Log("九宫格广告加载失败 navigateBoxPortalAd onError:"+JSON.stringify(err));
            // console.log("MINIGAME ===> ", "OPPO 互推盒子九宫格广告加载/展示失败：", JSON.stringify(err));
            this.loadSucc_NavigateBoxPortal = false;
            setTimeout(() => {
                this.navigateBoxPortalAd.load();
            }, 20 * 1000);
        })

        // 监听互推盒子九宫格广告关闭
        this.navigateBoxPortalAd.onClose(() => {
            // console.log("MINIGAME ===> ", "OPPO 互推盒子九宫格广告关闭");
            AdLogUtil.Log("九宫格广告关闭回调 navigateBoxPortalAd onClose");
            // 关闭后再次加载互推盒子九宫格
            this.navigateBoxPortalAd.load();
            // 如果banner在展示时被互推盒子九宫格关闭则再次showBanner
            this.showBanner();
        })

        this.navigateBoxPortalAd.load();
    }


    showNavigateBoxPortal() {
        AdLogUtil.Log("九宫格广告显示 showNavigateBoxPortal");
        if (this.loadSucc_NavigateBoxPortal) {
            this.hideBanner();
                        //修改bug
                        if(this.navigateBoxPortalAd){
                            this.navigateBoxPortalAd.show();
                        }
        }else{
            AdLogUtil.Log("九宫格广告未加载成功!");
        }
    }

    
    /**
     * 创建互推盒子横幅广告
     */
    createNavigateBoxBanner() {
        // console.log("MINIGAME ===> ", "--createNavigateBoxBanner--");

        if (this.qg.getSystemInfoSync().platformVersionCode < 1076) {
            console.log("MINIGAME ===> ", "OPPO 版本较低,不支持互推盒子广告");
            return;
        }

        this.navigateBoxBannerAd = this.qg.createGameBannerAd({
            adUnitId: this.BlockData.vendor_position
        })

        this.loadSucc_NavigateBoxBanner = true;

        // 监听互推盒子横幅广告加载失败
        this.navigateBoxBannerAd.onError((err) => {
            // this.loadSucc_NavigateBoxBanner = false;
            console.log("MINIGAME ===> ", "OPPO 互推盒子横幅广告出错:", JSON.stringify(err));
        })
    }

    showNavigateBoxBanner() {
        if (this.isShow_NavigateSettle) {
            console.log("MINIGAME ===> ", "已经调用过showNavigateBoxBanner,请勿重复调用");
            return;
        }
        this.isShow_NavigateSettle = true;

        if (this.loadSucc_NavigateBoxBanner) {
            this.hideBanner();
            // console.log("MINIGAME ===> ", "showNavigateBoxBanner=====================");
            this.navigateBoxBannerAd.show();
        }
    }

    hideNavigateBoxBanner() {
        if (this.isShow_NavigateSettle) {
            // console.log("MINIGAME ===> ", "hideNavigateBoxBanner=====================");
            this.isShow_NavigateSettle = false;
            if (this.navigateBoxBannerAd) {
                this.navigateBoxBannerAd.hide()
            }
        }
    }

    /**
     * 加载原生banner广告资源
     */
    loadNativeBannerRes() {
        // console.log("MINIGAME ===> ", "--loadNativeBannerRes--");

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

        assetManager.loadBundle("UI", (err, ab) => {
            // console.log("加载原生广告ab包成功!");
            ab.load(nativeBannerResArr, (texture) => {
                this.nativeRes.NativeBannerBg = texture[0];
                this.nativeRes.NativeBannerButton = texture[1];
                this.nativeRes.NativeClose = texture[2];
                this.nativeRes.NativeAdTip = texture[3];
                this.loadNativeRes = true;
                // console.log("加载原生广告资源成功!");
            });
        });

    }

    //TODO:原生Banner
    createNativeBanner() {
        AdLogUtil.Log("OPPO创建原生模板Banner广告! createNativeBanner: "+this.NativeBannerData.vendor_position);

        AdLogUtil.Log("windowHeight"+this.systemInfo.windowHeight);
        this.nativeAd = this.qg.createCustomAd({
            adUnitId: this.NativeBannerData.vendor_position,
            // adUnitId: '764650',
            //竖屏设置
            style: {//TODO:adStyle，可能会出问题
                // left: this.customAdLeft,
                left: 0,
                top: this.systemInfo.windowHeight-(this.systemInfo.windowWidth/320*110),
                width:this.systemInfo.windowWidth
            }

            // //横屏设置
            // style: {
            //     left: 720,
            //     top: 100
            // }
        });
        this.nativeAd.onLoad(() => {
            AdLogUtil.Log("原生模板Banner加载成功回调 customBannerAd onLoad");
            this.loadSucc_NativeBanner = true;
            // console.log("MINIGAME ===> ", "OPPO 原生模板插屏广告加载完成")
        })

        this.nativeAd.onError((err) => {
            AdLogUtil.Log("原生模板广告报错回调 customBannerAd onError:"+JSON.stringify(err));
            // console.log("MINIGAME ===> ", "OPPO 原生模板插屏广告加载错误! " + err)
            setTimeout(() => {
                this.createNativeBanner();
            }, 20 * 1000);
        })

        //监听插屏广告显示 修改bug
        this.nativeAd.onShow(() => {
            // console.log("MINIGAME ===> ", "OPPO 原生模板插屏广告关闭");
            AdLogUtil.Log("原生模板广告关闭回调 customIntersAd onShow");
            let time=this.NativeBannerData.ad_interval;
            if(time==0){
                time=2;
            }
            // 系统插屏关闭后2s后再次load
            setTimeout(() => {
                this.createNativeBanner();
            }, time * 1000);
            this.updateBanner();
        })
        // this.nativeAd = this.qg.createNativeAd({
        //     posId: this.NativeBannerData.vendor_position
        // })

        // this.nativeBannerInfo = {
        //     adId: null,
        //     title: null,
        //     desc: null,
        //     Native_icon_url: null,
        //     Native_icon: null,
        //     Native_BigImage_url: null,
        //     Native_BigImage: null,
        // };

        // this.nativeAd.onLoad((res) => {

        //     let index = 0;
        //     if (typeof res.adList != undefined && res.adList.length != 0) {
        //         index = res.adList.length - 1;
        //     } else {
        //         console.log("MINIGAME ===> ", "OPPO原生banner广告列表为空 return");
        //         return;
        //     }

        //     console.log("MINIGAME ===> ", "OPPO 原生banner广告加载成功：", JSON.stringify(res.adList[index]))

        //     if (res.adList[index].icon != "" && res.adList[index].imgUrlList.length > 0) {
        //         console.log("MINIGAME ===> ", "OPPO 原生banner广告同时存在原生ICON和大图");
        //     } else {
        //         console.log("MINIGAME ===> ", "OPPO 原生banner广告只存在原生ICON或大图");
        //     }

        //     this.nativeBannerInfo.adId = String(res.adList[index].adId);
        //     this.nativeBannerInfo.title = String(res.adList[index].title);
        //     this.nativeBannerInfo.desc = String(res.adList[index].desc);


        //     if (res.adList && res.adList[index].icon != "") {
        //         this.nativeBannerInfo.Native_icon_url = res.adList[index].icon;
        //         assetManager.loadRemote(String(res.adList[index].icon), (err, texture) => {
        //             this.nativeBannerInfo.Native_icon = texture;
        //         });
        //     }

        //     if (res.adList && res.adList[index].imgUrlList.length > 0) {
        //         this.nativeBannerInfo.Native_BigImage_url = res.adList[index].imgUrlList[0];
        //         assetManager.loadRemote(String(res.adList[index].imgUrlList[0]), (err, texture) => {
        //             this.nativeBannerInfo.Native_BigImage = texture;
        //         });
        //     }
           

        // });

        //监听原生广告加载错误
        // this.nativeAd.onError(err => {
        //     console.log("MINIGAME ===> ", "OPPO 原生banner广告加载失败：", JSON.stringify(err))

        //     setTimeout(() => {
        //         this.nativeAd.load();
        //     }, 20 * 1000);
        // });

        // this.nativeAd.load();
    }


    /**
     * 展示原生banner
     */
    showNativeBanner() {
      //TODO:OPPO原生模版由后台参数控制
            AdLogUtil.Log("显示原生模板Banner广告 showNativeBanner");
            if (this.nativeAd) {
                let time = this.NativeBannerData.day_limits;
                setTimeout(() => {
                    // console.log("MINIGAME ===> ", "OPPO 原生模板广告调用");
                    AdLogUtil.Log("原生模板Banner广告调用 show");
                    this.nativeAd.show().then(() => {
                        AdLogUtil.Log("OPPO 原生模板Banner广告展示成功");
                        // console.log("MINIGAME ===> ", "OPPO 原生模板广告展示成功==================");
                        this.isShow_NativeBanner = true;
                    }).catch((err) => {
                        AdLogUtil.Log("OPPO 原生模板Banner广告展示成功"+JSON.stringify(err));
                        // console.log("MINIGAME ===> ", "OPPO 原生模板广告展示错误:" + JSON.stringify(err));
                    })
                }, time * 1000);
            }
                

        // if (this.isShow_NavigateSettle) {
        //     // console.log("MINIGAME ===> ", "OPPO 正在展示互推盒子 return");
        //     return;
        // }

        // this.isShow_NativeBanner = true;

        // let scene = director.getScene();

        // //原生广告id
        // let tempid = this.nativeBannerInfo.adId;
        // this.reportNativeBannerShow(tempid);

        // console.log("MINIGAME ===> 原生banner", "showNativeBanner========================");

        // this.node_nativeBanner = new Node("node_nativeBanner");
        // this.node_nativeBanner.addComponent(UITransform);
        // scene.getChildByName('Canvas').addChild(this.node_nativeBanner);
        // this.node_nativeBanner.addComponent(Sprite);
        // this.node_nativeBanner.getComponent(Sprite).spriteFrame = SpriteFrame.createWithImage(this.nativeRes.NativeBannerBg);
        // this.node_nativeBanner.addComponent(Widget);
        // this.node_nativeBanner.getComponent(Widget).isAlignHorizontalCenter = true;
        // this.node_nativeBanner.getComponent(Widget).isAlignBottom = true;
        // this.node_nativeBanner.getComponent(Widget).bottom = 0;
        // let canvasSize = view.getVisibleSize();
        // if (canvasSize.width < canvasSize.height) {
        //     this.node_nativeBanner.getComponent(UITransform).width = canvasSize.width;
        //     this.node_nativeBanner.getComponent(UITransform).height = canvasSize.width * 0.18;
        // }
        // else {
        //     this.node_nativeBanner.getComponent(UITransform).width = canvasSize.width / 2;
        //     this.node_nativeBanner.getComponent(UITransform).height = this.node_nativeBanner.getComponent(UITransform).width * 0.18;
        // }

        // if (this.AdGroup != 0) this.node_nativeBanner.layer = this.AdGroup;
        // this.node_nativeBanner.setSiblingIndex(999);

        // this.node_nativeBanner.on(Node.EventType.TOUCH_START, (event) => {
        //     this.reportNativeBannerClick(tempid);
        // });

        // // 广告
        // let adTip = new Node("adTip");
        // adTip.addComponent(UITransform);
        // this.node_nativeBanner.addChild(adTip);
        // adTip.addComponent(Sprite);
        // adTip.getComponent(Sprite).spriteFrame = SpriteFrame.createWithImage(this.nativeRes.NativeAdTip);
        // adTip.getComponent(UITransform).height = 0.2 * this.node_nativeBanner.getComponent(UITransform).height;
        // adTip.getComponent(UITransform).width = adTip.getComponent(UITransform).height / 0.45;
        // if (this.AdGroup != 0)
        //     adTip.layer = this.AdGroup;
        // adTip.setPosition(this.node_nativeBanner.getComponent(UITransform).width / 2 - adTip.getComponent(UITransform).width / 2,
        //     -this.node_nativeBanner.getComponent(UITransform).height / 2 + adTip.getComponent(UITransform).height / 2);

        // // 点击安装
        // let bannerButton = new Node("bannerButton");
        // bannerButton.addComponent(UITransform);
        // this.node_nativeBanner.addChild(bannerButton);
        // bannerButton.addComponent(Sprite);
        // if (this.AdGroup != 0)
        //     bannerButton.layer = this.AdGroup;
        // bannerButton.getComponent(Sprite).spriteFrame = SpriteFrame.createWithImage(this.nativeRes.NativeBannerButton);
        // bannerButton.getComponent(UITransform).width = this.node_nativeBanner.getComponent(UITransform).width * 0.255;
        // bannerButton.getComponent(UITransform).height = bannerButton.getComponent(UITransform).width * 0.351;
        // bannerButton.setPosition(this.node_nativeBanner.getComponent(UITransform).width / 2 - this.node_nativeBanner.getComponent(UITransform).width * 0.185, 0);

        // if (this.nativeBannerInfo.Native_icon) {
        //     // icon
        //     let icon = new Node("icon");
        //     icon.addComponent(UITransform);
        //     this.node_nativeBanner.addChild(icon);
        //     if (this.AdGroup != 0) icon.layer = this.AdGroup;
        //     icon.addComponent(Sprite);
        //     icon.getComponent(Sprite).spriteFrame = SpriteFrame.createWithImage(this.nativeBannerInfo.Native_icon);
        //     icon.getComponent(UITransform).height = this.node_nativeBanner.getComponent(UITransform).height * 0.8;
        //     icon.getComponent(UITransform).width = icon.getComponent(UITransform).height;
        //     icon.setPosition(icon.getComponent(UITransform).width * 0.8 - this.node_nativeBanner.getComponent(UITransform).width / 2, 0);
        // } else if (this.nativeBannerInfo.Native_BigImage) {
        //     // 大图
        //     let image = new Node("image");
        //     image.addComponent(UITransform);
        //     this.node_nativeBanner.addChild(image);
        //     if (this.AdGroup != 0) image.layer = this.AdGroup;
        //     image.addComponent(Sprite);
        //     image.getComponent(Sprite).spriteFrame = SpriteFrame.createWithImage(this.nativeBannerInfo.Native_BigImage);
        //     image.getComponent(UITransform).height = this.node_nativeBanner.getComponent(UITransform).height;
        //     image.getComponent(UITransform).width = image.getComponent(UITransform).height * 2;
        //     image.setPosition(image.getComponent(UITransform).width / 2 - this.node_nativeBanner.getComponent(UITransform).width / 2, 0);
        // }

        // // 标题或描述
        // let titleLabel = new Node("titleLabel");
        // titleLabel.addComponent(UITransform);
        // this.node_nativeBanner.addChild(titleLabel);
        // if (this.AdGroup != 0) titleLabel.layer = this.AdGroup;
        // titleLabel.addComponent(Label);
        // // titleLabel.getComponent(UITransform).priority = 999;
        // if (canvasSize.width < canvasSize.height) {
        //     titleLabel.getComponent(Label).fontSize = 35 * (view.getDesignResolutionSize().width / 1080);
        // } else {
        //     titleLabel.getComponent(Label).fontSize = 35 * (view.getDesignResolutionSize().height / 1080);
        // }
        // if (this.nativeBannerInfo.desc == "") {
        //     titleLabel.getComponent(Label).string = this.nativeBannerInfo.title;
        // } else {
        //     titleLabel.getComponent(Label).string = this.nativeBannerInfo.desc;
        // }
        // titleLabel.getComponent(Label).overflow = Label.Overflow.CLAMP;
        // titleLabel.getComponent(Label).horizontalAlign = Label.HorizontalAlign.LEFT;
        // titleLabel.getComponent(Label).verticalAlign = Label.VerticalAlign.CENTER;
        // titleLabel.getComponent(Label).lineHeight = titleLabel.getComponent(Label).fontSize;
        // titleLabel.getComponent(UITransform).width = this.node_nativeBanner.getComponent(UITransform).width - this.node_nativeBanner.getComponent(UITransform).height * 2 - bannerButton.getComponent(UITransform).width - 0.2 * this.node_nativeBanner.getComponent(UITransform).height / 0.45;
        // titleLabel.getComponent(UITransform).height = this.node_nativeBanner.getComponent(UITransform).height;
        // titleLabel.setPosition(0, -this.node_nativeBanner.getComponent(UITransform).width / 2 + this.node_nativeBanner.getComponent(UITransform).height * 2.1 + titleLabel.getComponent(UITransform).width / 2);

        // let NativeClose = new Node("closeICON");
        // NativeClose.addComponent(UITransform);
        // this.node_nativeBanner.addChild(NativeClose);
        // // NativeClose.getComponent(UITransform).priority = 999;
        // NativeClose.addComponent(Sprite);
        // if (this.AdGroup != 0) NativeClose.layer = this.AdGroup;
        // NativeClose.getComponent(Sprite).spriteFrame = SpriteFrame.createWithImage(this.nativeRes.NativeClose);
        // NativeClose.getComponent(UITransform).width = 0.27 * this.node_nativeBanner.getComponent(UITransform).height;
        // NativeClose.getComponent(UITransform).height = 0.27 * this.node_nativeBanner.getComponent(UITransform).height;
        // NativeClose.setPosition(this.node_nativeBanner.getComponent(UITransform).width / 2 - NativeClose.getComponent(UITransform).width / 2, this.node_nativeBanner.getComponent(UITransform).height / 2 - NativeClose.getComponent(UITransform).width / 2);

        // // 监听原生banner关闭
        // NativeClose.on(Node.EventType.TOUCH_START, (event) => {
        //     console.log("MINIGAME ===> ", "原生banner关闭", this.NUM_BannerUpdateTime + "S后再次刷新");
        //     this.hideNativeBanner();
        //     // this.updateBanner();
        //     // 清除触摸事件的冒泡
        //     // event.event.propagationStopped = true;
        // });

    }
    /**
     * 隐藏原生banner
     */
    hideNativeBanner() {
        if (this.isShow_NativeBanner) {
            console.log("MINIGAME ===> ", "OPPO原生banner hideNativeBanner========================");
            this.isShow_NativeBanner = false;
            this.nativeAd.hide();
            // this.node_nativeBanner.active = false;
            // this.node_nativeBanner.removeFromParent();
            // this.node_nativeBanner = null;
            // console.log("MINIGAME ===> ", "OPPO原生banner hideNativeBanner========================end");
        }
    }

    reportNativeBannerShow(adId) {
        console.log("MINIGAME ===> ", "OPPO 该原生banner广告id上报展示", adId);
        this.nativeAd.reportAdShow({
            adId: adId
        })
    }

    reportNativeBannerClick(adId) {
        console.log("MINIGAME ===> ", "OPPO 原生banner广告上报点击", adId);
        this.nativeAd.reportAdClick({
            adId: adId
        })
    }

    /**原生大图 */
    createNativeImage() {
        console.log("MINIGAME ===> 原生大图", "--createNativeBanner--");
        this.nativeImageAd = this.qg.createNativeAd({
            posId: this.NativeIntersData.vendor_position
        })
        this.loadSucc_NativeImage = false;
        this.nativeImageInfo = {
            adId: null,
            title: null,
            desc: null,
            Native_icon_url: null,
            Native_icon: null,
            Native_BigImage_url: null,
            Native_BigImage: null,
            dcr: this.NativeIntersData.dcr,
        };

        this.nativeImageAd.onLoad((res) => {

            let index = 0;
            if (typeof res.adList != undefined && res.adList.length != 0) {
                index = res.adList.length - 1;
            } else {
                console.log("MINIGAME ===> ", "OPPO 原生大图广告列表为空 return");
                return;
            }

            console.log("MINIGAME ===> ", "OPPO 原生大图广告加载成功：", JSON.stringify(res.adList[index]))

            // if (res.adList[index].icon != "" && res.adList[index].imgUrlList.length > 0) {
            //     console.log("MINIGAME ===> ", "OPPO 原生大图广告同时存在原生ICON和大图");
            // } else {
            //     console.log("MINIGAME ===> ", "OPPO 原生大图广告只存在原生ICON或大图");
            // }

            this.nativeImageInfo.adId = String(res.adList[index].adId);
            this.nativeImageInfo.title = String(res.adList[index].title);
            this.nativeImageInfo.desc = String(res.adList[index].desc);


            if (res.adList && res.adList[index].icon != "") {
                this.nativeImageInfo.Native_icon_url = res.adList[index].icon;
            }

            if (res.adList && res.adList[index].imgUrlList.length > 0) {
                this.nativeImageInfo.Native_BigImage_url = res.adList[index].imgUrlList[0];
            }

            this.loadSucc_NativeImage = true;
            console.log("MINIGAME ===> ", "OPPO 原生大图广告加载成功：")
        });

        //监听原生广告加载错误
        this.nativeImageAd.onError(err => {
            console.log("MINIGAME ===> ", "OPPO 原生大图广告加载失败：", JSON.stringify(err))

            setTimeout(() => {
                this.nativeImageAd.load();
            }, 20 * 1000);
        });

        this.nativeImageAd.load();
    }
    /**原生大图广告获取 */
    getNativeAdInfo(type) {
        if (!this.loadSucc_NativeImage) {
            console.log("MINIGAME ===> ", "自定义原生大图广告加载中....");
            return null;
        }
        console.log("MINIGAME ===> ", "获取自定义原生大图广告");
        return this.nativeImageInfo;
    }
    getHWNativeAdInfo(_infoCallback?: Function) { }
    reportNativeImageShow(adId) {
        console.log("MINIGAME ===> ", "OPPO 该原生大图广告id上报展示", adId);
        this.nativeImageAd.reportAdShow({
            adId: adId
        })
    }
    reportNativeImageClick(adId) {
        console.log("MINIGAME ===> ", "OPPO 原生大图广告上报点击", adId);
        this.nativeImageAd.reportAdClick({
            adId: adId
        })
    }
    /**刷新原生大图广告 */
    loadNativeImage() {
        this.nativeImageAd && this.nativeImageAd.load();
    }
    /**原生icon */
    createNativeIcon() {
        console.log("MINIGAME ===> 原生icon", "--createNativeBanner--");

        this.nativeIconAd = this.qg.createNativeAd({
            posId: this.NativeIconData.vendor_position
        })
        this.loadSucc_NativeIcon = false;
        this.nativeIconInfo = {
            adId: null,
            title: null,
            desc: null,
            Native_icon_url: null,
            Native_icon: null,
            Native_BigImage_url: null,
            Native_BigImage: null,
        };

        this.nativeIconAd.onLoad((res) => {

            let index = 0;
            if (typeof res.adList != undefined && res.adList.length != 0) {
                index = res.adList.length - 1;
            } else {
                console.log("MINIGAME ===> ", "OPPO 原生icon广告列表为空 return");
                return;
            }

            console.log("MINIGAME ===> ", "OPPO 原生icon广告加载成功：", JSON.stringify(res.adList[index]))

            if (res.adList[index].icon != "" && res.adList[index].imgUrlList.length > 0) {
                console.log("MINIGAME ===> ", "OPPO 原生icon广告同时存在原生ICON和大图");
            } else {
                console.log("MINIGAME ===> ", "OPPO 原生icon广告只存在原生ICON或大图");
            }

            this.nativeIconInfo.adId = String(res.adList[index].adId);
            this.nativeIconInfo.title = String(res.adList[index].title);
            this.nativeIconInfo.desc = String(res.adList[index].desc);


            if (res.adList && res.adList[index].icon != "") {
                this.nativeIconInfo.Native_icon_url = res.adList[index].icon;
            }

            if (res.adList && res.adList[index].imgUrlList.length > 0) {
                this.nativeIconInfo.Native_BigImage_url = res.adList[index].imgUrlList[0];
            }
            this.loadSucc_NativeIcon = true;

            // console.log("MINIGAME ===> ", "OPPO 原生大图广告加载成功：");
        });

        //监听原生广告加载错误
        this.nativeIconAd.onError(err => {
            console.log("MINIGAME ===> ", "OPPO 原生icon广告加载失败：", JSON.stringify(err))

            setTimeout(() => {
                this.nativeIconAd.load();
            }, 20 * 1000);
        });

        this.nativeIconAd.load();
    }
    /**原生大图广告获取 */
    getNativeIconAdInfo(type) {
        if (!this.loadSucc_NativeIcon) {
            console.log("MINIGAME ===> ", "自定义原生Icon广告加载中....");
            return null;
        }
        console.log("MINIGAME ===> ", "获取自定义原生Icon广告");
        return this.nativeIconInfo;
    }
    reportNativeIconShow(adId) {
        console.log("MINIGAME ===> ", "OPPO 该原生Icon广告id上报展示", adId);
        this.nativeIconAd.reportAdShow({
            adId: adId
        })
    }
    reportNativeIconClick(adId) {
        console.log("MINIGAME ===> ", "OPPO 原生Icon广告上报点击", adId);
        this.nativeIconAd.reportAdClick({
            adId: adId
        });
    }

    
    /**刷新原生Icon广告 */
    loadNativeIcon() {
        this.nativeIconAd && this.nativeIconAd.load();
    }

    addDesktop(_callback: Function) {
        console.log("oppo addDesktop");
        if (this.qg != null && this.qg != undefined) {
            console.log("oppo addDesktop qg is correct!");
            this.qg.installShortcut({
                success: (res) => {
                    // 判断图标未存在时，创建图标
                    if (res == false) {
                        _callback && _callback(true);
                        // console.log("创建成功");
                    } else {
                        _callback && _callback(false);
                        // TipsManager.Instance().create('已存在桌面图标');
                        console.log("已存在桌面图标");
                    }
                },
                fail: (err) => {
                    _callback && _callback(false);
                    // console.log("创建错误:" + err);
                    // console.log(err);
                    // console.log(`err is ${JSON.parse(err)}`);
                },
                complete: () => { }
            })
        }
    }


    /**是否已经创建桌面图标 */
    hasShortcutInstalled(_callback: Function) {
        if (this.qg != null && this.qg != undefined) {
            this.qg.hasShortcutInstalled({
                success: (res) => {
                    // 判断图标未存在时，创建图标
                    if (res == false) {
                        // console.log("MINIGAME ===> ", "OPPO 不存在桌面图标");
                        _callback && _callback(true);
                    } else {
                        // console.log("MINIGAME ===> ", "OPPO 存在桌面图标");
                        _callback && _callback(false);
                        // TipsManager.Instance().create('已存在桌面图标');
                    }
                },
                fail: (err) => { },
                complete: () => { }
            })
        }
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

    phoneVibrate(isLong) {
        if (this.qg !== null && this.qg !== undefined) {
            if (isLong) {
                this.qg.vibrateLong && this.qg.vibrateLong();
            } else {
                this.qg.vibrateShort && this.qg.vibrateShort();
            }
        }
    }

    reportAnalytics(name, value) {
        if (this.qg !== null && this.qg !== undefined)
            this.qg.reportMonitor(name, value);
    }

    showGridAd() {
    }
    hideGridAd() {
    }
}

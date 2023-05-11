import { assetManager, director, Label, Node, Sprite, SpriteFrame, UITransform, view, Widget, _decorator } from "cc";
import { AdLogUtil } from "../../Util/AdLogUtil";
import AdsIdConfig from "../AdsIdConfig";
import { PlatformAdApi } from "../PlatformAdApi";
import AdManager from "../AdManager";
import gameInitManager from "../../../../Scripts/Manager/GameManager";

const { ccclass, property } = _decorator;

@ccclass
export default class VivoADApi implements PlatformAdApi {
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
    systemIntersAd = null;
    /**系统插屏加载成功 */
    loadSucc_SystemInters = false;

    /**模板插屏 */
    customIntersAd = null;
    /**模板插屏加载成功 */
    loadSucc_CuctomInters = false;
    /**模板插屏间隔 */
    CuctomIntervalTime = true;

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

    /**兜底插屏 */
    hasErr:boolean=false;

    /** 上次展示时间，用于控制广告位的时间间隔 */
    intervalMap:Map<string,number>=new Map();

    /**首次进入游戏,模板信息流先show才收到load回调 */
    firstEnter:boolean=true;

    onInit(_callback: Function) {

        if (this.qg !== null && this.qg !== undefined) {
            this.systemInfo = this.qg.getSystemInfoSync();
            // console.log('MINIGAME ===> 设备信息.systemInfo===>', this.systemInfo);
            
            this.createAd();
        } else {
            this.qg = null;
        }
        _callback && _callback();
        // console.log('MINIGAME ===> Vivo ===================> onInit  ok');
    }
    createAd() {
        if (this.SystemBannerData && this.SystemBannerData.enabled && this.SystemBannerData.vendor_position != "") this.createSystemBanner();
        if (this.SystemIntersData && this.SystemIntersData.enabled && this.SystemIntersData.vendor_position != "") this.createInsertAd();
        if (this.AdCustomIntersData && this.AdCustomIntersData.enabled && this.AdCustomIntersData.vendor_position != "") this.createNativeCuston();
        if (this.VideoData.enabled && this.VideoData.vendor_position != "") this.createVideo();
        if (this.JGGBoxData && this.JGGBoxData.enabled && this.JGGBoxData.vendor_position != "") this.createNavigateBoxPortal();
        if (this.BlockData && this.BlockData.enabled && this.BlockData.vendor_position != "") this.createNavigateBoxBanner();

        //暂无原生自定义广告
        // this.loadNativeBannerRes();

        // if (this.NativeBannerData && this.NativeBannerData.enabled && this.NativeBannerData.vendor_position != "") this.createNativeBanner();
        if (this.NativeIntersData && this.NativeIntersData.enabled && this.NativeIntersData.vendor_position != "") this.createNativeImage();
        if (this.NativeIconData && this.NativeIconData.enabled && this.NativeIconData.vendor_position != "") this.createNativeIcon();
    }
    setGroup(group) {
        this.AdGroup = group;
    }
    onLogin() {

    }
    onShare(_callback: Function) {

    }
    ShareVideo(_title: string, templateId: string, _callback: Function) {

    }


    createSystemBanner() {
        // console.log("MINIGAME ===> ", "Vivo 系统banner加载");
        AdLogUtil.Log("createSystemBanner:"+this.SystemBannerData.vendor_position);
        this.systemBannerAd = this.qg.createBannerAd({
            posId: this.SystemBannerData.vendor_position,
            style: {}
        });

        this.systemBannerAd.onLoad(() => {
            this.loadSucc_SystemBanner = true;
            // console.log("MINIGAME ===> ", "VIVO 系统banner加载成功");
            AdLogUtil.Log("banner加载成功 systemBannerAd onLoad");
        });

        // 监听系统banner错误
        this.systemBannerAd.onError((err) => {
            // console.log("MINIGAME ===> ", "Vivo 系统banner加载/展示失败：", JSON.stringify(err));
            AdLogUtil.Log("banner加载/展示失败 systemBannerAd onError:"+JSON.stringify(err));
        });

        // 监听系统banner隐藏
        this.systemBannerAd.onClose(() => {
            // 每个场景用户关闭就不再出现
            AdLogUtil.Log("banner关闭 systemBannerAd onClose");
            // this.hideBanner();
            this.hideSystemBanner();
        })
    }


    showBanner() {
        AdLogUtil.Log("showBanner");
        if (this.loadSucc_SystemBanner) {
            this.showSystemBanner();
        }
    }


    hideBanner() {
        AdLogUtil.Log("hideBanner");
        this.hideSystemBanner();
        this.hideNativeBanner();
        if (this.interval_updateBanner) clearInterval(this.interval_updateBanner);
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
            // this.systemBannerAd.offHide();
            this.systemBannerAd.hide();
        }
        if (this.interval_updateBanner) clearInterval(this.interval_updateBanner);
    }


    /**
    * 刷新banner
    */
    updateBanner() {
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
        this.showSystemBanner();
    }

    /** */
    updateNativeBanner() {
        this.hideSystemBanner();
        this.showNativeBanner();
    }

    createVideo() {
        AdLogUtil.Log("创建激励视频 createVideo");
        if (this.qg !== null && this.qg !== undefined) {
            /**创建rewardedVideoAd 对象*/
            // console.log("MINIGAME ===> Vivo平台 创建激励视频广告");
            AdLogUtil.Log("Vivo平台创建激励视频 createVideo");
            this.rewardedVideoAd = this.qg.createRewardedVideoAd({
                posId: this.VideoData.vendor_position,
            });
            this.rewardedVideoAd.onError((err) => {
                // console.log('MINIGAME ===>  激励视频 加载失败:code =====>:' + err.code + "message ======>:" + JSON.stringify(err));
                AdLogUtil.Log("Vivo激励视频 加载失败 code:"+err.code+" msg: "+JSON.stringify(err));
                this.loadSucc_Video = false;
                setTimeout(() => {
                    this.rewardedVideoAd && this.rewardedVideoAd.load()
                }, 10 * 1000)
            });
            this.rewardedVideoAd.onLoad(() => {
                AdLogUtil.Log("激励视频广告 加载成功 rewardedVideoAd onLoad");
                // console.log("MINIGAME ===> 激励视频广告 加载成功");
                this.loadSucc_Video = true;
            });
            //监听视频广告播放完成
            this.rewardedVideoAd.onClose(res => {
                AdLogUtil.Log("rewardedVideoAd onClose: "+res.isEnded);
                if (res.isEnded) {
                    // console.log("MINIGAME ===> ", "Vivo 激励视频广告完成，发放奖励");
                    AdLogUtil.Log("Vivo 激励视频广告完成，发放奖励");
                    if (this.callback_Video) {
                        this.callback_Video(true);
                        this.callback_Video = null;
                    }
                } else {
                    // console.log("MINIGAME ===> ", "Vivo 激励视频广告关闭，不发放奖励");
                    AdLogUtil.Log("Vivo 激励视频广告关闭，不发放奖励");
                    if (this.callback_Video) {
                        this.callback_Video(false);
                        this.callback_Video = null;
                    }
                }
                this.loadSucc_Video = false;
                setTimeout(() => {
                    this.rewardedVideoAd && this.rewardedVideoAd.load();
                }, 3000)
            })
        }
    }
    showVideo(_successCallback?: Function) {
        AdLogUtil.Log("Vivo 激励视频 showVideo");
        /**确保video正常创建并已经拉取到数据 */
        if (this.rewardedVideoAd && this.loadSucc_Video) {
            this.callback_Video = _successCallback;
            AdLogUtil.Log("调用接口里面的show: rewardedVideoAd show");
            this.rewardedVideoAd.show();
            this.loadSucc_Video = false;

        } else {
            AdLogUtil.Log("Vivo 没有成功创建广告或者没有成功load广告");
            /**没有成功创建广告或者没有成功load广告 就重新创建一个 */
            // TipsManager.Instance().create("广告还未准备好,请稍后再试");
            _successCallback(false);
        }
    }
    showVideoAward() {

    }
    showVideoFail() {

    }


    createInsertAd() {
        // console.log("MINIGAME ===> ", "--createSystemInters--");
        // let interval=0;
        // if(this.SystemIntersData.ad_interval || this.SystemIntersData.ad_interval!=0){
        //     interval=this.SystemIntersData.ad_interval;
        // }else{
        //     interval=5;
        // }
        AdLogUtil.Log("Vivo创建插屏 createInsertAd:"+this.SystemIntersData.vendor_position);
        this.systemIntersAd = this.qg.createInterstitialAd({
            posId: this.SystemIntersData.vendor_position
        })

        //监听插屏加载完成
        this.systemIntersAd.onLoad(() => {
            AdLogUtil.Log("插屏加载成功 systemIntersAd onLoad");
            // console.log("MINIGAME ===> ", "VIVO 系统插屏广告加载完成")
            this.loadSucc_SystemInters = true;
        })

        //监听插屏广告错误
        this.systemIntersAd.onError(err => {
            AdLogUtil.Log("插屏加载/展示失败 systemIntersAd onError:"+JSON.stringify(err));
            this.loadSucc_SystemInters = false;
            setTimeout(() => {
                this.createInsertAd();
            }, 10 * 1000);
            //TODO:此处添加原生banner，目前暂用普通banner代替
            // AdManager.getInstance().showBanner();
            // AdManager.getInstance().showNativeBanner();
        })

        //监听插屏广告关闭
        this.systemIntersAd.onClose(() => {
            // console.log("MINIGAME ===> ", "VIVO 系统插屏广告关闭");
            AdLogUtil.Log("插屏关闭 systemIntersAd onClose");
            this.loadSucc_SystemInters = false;
            // 系统插屏关闭后5s后再次load
            setTimeout(() => {
                this.createInsertAd();
            }, 5 * 1000);
            //TODO:此处添加原生banner，目前暂用普通banner代替
            // AdManager.getInstance().showBanner();
            if (this.NativeBannerData && this.NativeBannerData.enabled && this.NativeBannerData.vendor_position != "") this.createNativeBanner();
            AdManager.getInstance().showNativeBanner();
            this.setStartTimer("SystemInters");
        })
    }


    /**
     * 展示系统插屏
     */
    showSystemInters() {
        AdLogUtil.Log("showSystemInters interval is "+this.getTimeInterval("SystemInters"));
        let showInsertAd=true;
        if ((this.systemIntersAd && this.loadSucc_SystemInters && this.getTimeInterval("SystemInters")>=this.SystemIntersData.ad_interval)) {
            // console.log("MINIGAME ===> ", "VIVO showSystemInters==================");
            AdLogUtil.Log("showSystemInters调用show接口 systemIntersAd show");
            this.systemIntersAd.show().then(() => {
                // console.log("MINIGAME ===> ", "VIVO 系统插屏广告展示成功==================");
                AdLogUtil.Log("插屏广告展示成功 showSystemInters");
                // AdManager.getInstance().hideBanner();
            }).catch((err) => {
                showInsertAd=false;
                // console.log("MINIGAME ===> ", "VIVO 系统插屏展示错误:" + JSON.stringify(err));
                AdLogUtil.Log("插屏广告展示错误 showSystemInters:"+JSON.stringify(err));
            })
            // if(!showInsertAd){
            //     AdManager.getInstance().showNativeBanner();
            // }
        }
    }


    /**
     * 创建原生插屏模板广告
     */
    createNativeCuston() {
        AdLogUtil.Log("创建原生模板广告 createNativeCuston:"+this.AdCustomIntersData.vendor_position);
        if (this.qg.createCustomAd) {
            console.log("MINIGAME ===> ", "VIVO 创建原生模板广告");
            this.customIntersAd = this.qg.createCustomAd({
                posId: this.AdCustomIntersData.vendor_position,
                //竖屏设置
                style: {
                    left: 0,
                    top: 720
                }
                // //横屏设置
                // style: {
                //     left: 720,
                //     top: 100
                // }
            });
            
            this.customIntersAd.onLoad(() => {
                AdLogUtil.Log("原生模板广告加载完成 customIntersAd onLoad");
                // console.log("MINIGAME ===> ", "VIVO 原生模板插屏广告加载完成")
                this.loadSucc_CuctomInters = true;
            })

            this.customIntersAd.onError((err) => {
                AdLogUtil.Log("原生模板广告错误 customIntersAd onError:"+JSON.stringify(err));
                // console.log("vivo 原生模板广告错误:"+err);
                // console.log(err);
                this.loadSucc_CuctomInters = false;
                setTimeout(() => {
                    this.createNativeCuston();
                }, 10 * 1000);
            })

            //监听插屏广告关闭
            this.customIntersAd.onClose(() => {
                AdLogUtil.Log("原生模板广告关闭 customIntersAd onClose");
                // console.log("MINIGAME ===> ", "VIVO 原生模板插屏广告关闭");
                this.loadSucc_CuctomInters = false;
                // AdManager.getInstance().showBanner();
                // 系统插屏关闭后2s后再次load
                setTimeout(() => {
                    this.createNativeCuston();
                }, 2 * 1000);
                if (this.NativeBannerData && this.NativeBannerData.enabled && this.NativeBannerData.vendor_position != "") this.createNativeBanner();
                AdManager.getInstance().showNativeBanner();
                this.setStartTimer("customInters");
            })
        }

        
    }
    /**
    * 展示原生模板插屏
    */
    showCustomInters() {
        AdLogUtil.Log("showCustomInters");
        // if (this.customIntersAd && this.loadSucc_CuctomInters) {
        // // if (this.customIntersAd) {
        //     let time = this.AdCustomIntersData.day_limits;
        //     setTimeout(() => {
        //         this.customIntersAd.show().then(() => {
        //             // console.log("MINIGAME ===> ", "VIVO 原生模板插屏广告展示成功==================");
        //             AdManager.getInstance().hideBanner();
        //             AdLogUtil.Log("原生模板广告展示成功 customIntersAd show");
        //         }).catch((err) => {
        //             // console.log("MINIGAME ===> ", "VIVO 原生模板插屏展示错误:" + JSON.stringify(err));
        //             AdLogUtil.Log("原生模板广告展示错误:"+ JSON.stringify(err));
        //         })
        //     }, time * 1000);
        // }
        AdLogUtil.Log("interval customInters is "+this.getTimeInterval("customInters"));
        AdLogUtil.Log("this.customIntersAd "+this.customIntersAd+"this.loadSucc_CuctomInters "+this.loadSucc_CuctomInters);
        if(this.customIntersAd && this.loadSucc_CuctomInters &&this.getTimeInterval("customInters")>=this.AdCustomIntersData.ad_interval){
            console.log("enter show custom");
            this.customIntersAd.show().then(() => {
                // console.log("MINIGAME ===> ", "VIVO 原生模板插屏广告展示成功==================");
                // AdManager.getInstance().hideBanner();
                AdLogUtil.Log("原生模板广告展示成功 customIntersAd show");
                this.firstEnter=false;
            }).catch((err) => {
                this.hasErr=true;
                // console.log("MINIGAME ===> ", "VIVO 原生模板插屏展示错误:" + JSON.stringify(err));
                AdLogUtil.Log("原生模板广告展示错误:"+ JSON.stringify(err));
            })
        }
        // setTimeout(()=>{
            if(!this.loadSucc_CuctomInters || this.hasErr){
                AdLogUtil.Log("loadSuccess?"+this.loadSucc_CuctomInters);
                this.hasErr=false;
                if (this.loadSucc_SystemInters) {
                    this.showSystemInters();
                }
            }
        // },2*1000);
    }


    /**
     * 显示原生模板广告
     */
    showCustomAd() {
        AdLogUtil.Log("showCustomAd");
        this.showCustomInters();
    }

    /**插屏2逻辑:原生插屏1--普通插屏兜底--关闭插屏并展示原生banner
     * 目前暂用普通banner替代原生banner进行测试
     */
    showCustomAdWithInsert(){
        if(this.AdCustomIntersData && this.AdCustomIntersData.enabled && this.AdCustomIntersData.vendor_position != ""){
            this.showCustomAd();
        }else{
            if (this.loadSucc_SystemInters) {
                this.showSystemInters();
            }
        }
        // if (this.customIntersAd && this.loadSucc_CuctomInters) {
            // if(this.AdCustomIntersData && this.AdCustomIntersData.enabled && this.AdCustomIntersData.vendor_position != ""){
            //     if((this.customIntersAd && this.loadSucc_CuctomInters &&this.getTimeInterval("customInters")>=this.AdCustomIntersData.ad_interval)||(this.customIntersAd && this.loadSucc_CuctomInters &&this.firstEnter)){
            //         this.customIntersAd.show().then(() => {
            //             // console.log("MINIGAME ===> ", "VIVO 原生模板插屏广告展示成功==================");
            //             // AdManager.getInstance().hideBanner();
            //             AdLogUtil.Log("原生模板广告展示成功 customIntersAd show");
            //         }).catch((err) => {
            //             this.hasErr=true;
            //             // console.log("MINIGAME ===> ", "VIVO 原生模板插屏展示错误:" + JSON.stringify(err));
            //             AdLogUtil.Log("原生模板广告展示错误:"+ JSON.stringify(err));
            //         })
            //     }
            // }else{
            //     if(!this.loadSucc_CuctomInters || this.hasErr){
            //         this.hasErr=false;
            //         if (this.loadSucc_SystemInters) {
            //             this.showSystemInters();
            //         }
            //     }
            // } 
            
        // if (this.customIntersAd) {
            // let time = this.AdCustomIntersData.day_limits;
            // setTimeout(() => {
            //     this.customIntersAd.show().then(() => {
            //         // console.log("MINIGAME ===> ", "VIVO 原生模板插屏广告展示成功==================");
            //         AdManager.getInstance().hideBanner();
            //         AdLogUtil.Log("原生模板广告展示成功 customIntersAd show");
            //     }).catch((err) => {
            //         this.hasErr=true;
            //         // console.log("MINIGAME ===> ", "VIVO 原生模板插屏展示错误:" + JSON.stringify(err));
            //         AdLogUtil.Log("原生模板广告展示错误:"+ JSON.stringify(err));
            //     })
            // }, time * 1000);
        // }
        
    }

    /**
     * 隐藏原生模板广告
     */
    public hideCustomAd(){
        AdLogUtil.Log("hideCustomAd");
        if (this.customIntersAd){
            this.customIntersAd.hide();
        }
    }


    showInsertAd() {
        AdLogUtil.Log("showInsertAd");
        // if (this.loadSucc_CuctomInters && this.CuctomIntervalTime) {
        //     let time = this.AdCustomIntersData.ad_interval;
        //     this.showCustomInters();
        //     this.CuctomIntervalTime = false;
        //     setTimeout(() => {
        //         this.CuctomIntervalTime = true;
        //     }, time * 1000);
        //     return;
        // }
        if (this.loadSucc_SystemInters) {
            this.showSystemInters();
        }
    }

    /**
     * 创建互推盒子九宫格广告
     */
    createNavigateBoxPortal() {
        // console.log("MINIGAME ===> ", "--createNavigateBoxPortal--");
        AdLogUtil.Log("创建互推盒子九宫格广告 createNavigateBoxPortal");
        this.navigateBoxPortalAd = this.qg.createBoxPortalAd({
            posId: this.JGGBoxData.vendor_position,
            marginTop: 350
        })

        // 监听互推盒子九宫格广告加载成功
        this.navigateBoxPortalAd.onLoad(() => {
            // console.log("MINIGAME ===> ", "Vivo 互推盒子九宫格广告加载完成");
            AdLogUtil.Log("九宫格广告加载成功 createNavigateBoxPortal navigateBoxPortalAd onLoad");
            this.loadSucc_NavigateBoxPortal = true;
        })

        // 监听互推盒子九宫格广告加载失败
        this.navigateBoxPortalAd.onError((err) => {
            // console.log("MINIGAME ===> ", "Vivo 互推盒子九宫格广告加载/展示失败：", JSON.stringify(err));
            AdLogUtil.Log("互推盒子九宫格广告加载/展示失败 navigateBoxPortalAd onError:"+JSON.stringify(err));
            this.loadSucc_NavigateBoxPortal = false;
            setTimeout(() => {
                this.createNavigateBoxPortal();
            }, 30 * 1000);
        })

        // 监听互推盒子九宫格广告关闭
        this.navigateBoxPortalAd.onClose(() => {
            // console.log("MINIGAME ===> ", "Vivo 互推盒子九宫格广告关闭");
            AdLogUtil.Log("九宫格广告关闭 createNavigateBoxPortal navigateBoxPortalAd onClose");
            // 关闭后再次加载互推盒子九宫格
            setTimeout(() => {
                this.createNavigateBoxPortal();
            }, 5 * 1000);
        })
    }

    /**
     * 显示互推九宫格广告
     */
    showNavigateBoxPortal() {
        AdLogUtil.Log("显示互推盒子九宫格广告 showNavigateBoxPortal");
        if (this.loadSucc_NavigateBoxPortal) {
            this.hideBanner();
            this.navigateBoxPortalAd.show();
            AdLogUtil.Log("显示互推盒子九宫格广告 navigateBoxPortalAd接口 show");
        }
    }

    
    /**
     * 创建互推盒子横幅广告
     */
    createNavigateBoxBanner() {
        // console.log("MINIGAME ===> ", "--createNavigateBoxBanner--");

        if (this.qg.createBoxBannerAd) {
            this.navigateBoxBannerAd = this.qg.createBoxBannerAd({
                posId: this.BlockData.vendor_position
            })
        } else {
            console.log("MINIGAME ===> ", '暂不支持互推盒子相关 API');
            return;
        }
        // 监听互推盒子九宫格广告加载成功
        this.navigateBoxBannerAd.onLoad(() => {
            // console.log("MINIGAME ===> ", "VIVO 互推盒子横幅广告加载完成");
            this.loadSucc_NavigateBoxBanner = true;
        })
        // 监听互推盒子横幅广告加载失败
        this.navigateBoxBannerAd.onError((err) => {
            this.loadSucc_NavigateBoxBanner = false;
            console.log("MINIGAME ===> ", "VIVO 互推盒子横幅广告出错:", JSON.stringify(err));
            setTimeout(() => {
                this.createNavigateBoxBanner();
            }, 30 * 1000);
        })

        this.navigateBoxPortalAd.onShow((err)=>{
            AdLogUtil.Log("互推盒子九宫格展示 navigateBoxPortalAd onShow:"+JSON.stringify(err));
            this.hideBanner();
        })
        
        //监听互推横幅广告关闭
        this.navigateBoxBannerAd.onClose(() => {
            this.isShow_NavigateSettle = false;
            // 如果banner在展示时被互推盒子九宫格关闭则再次showBanner
            this.temp_hasShowBanner && this.showBanner();
        })
    }

    showNavigateBoxBanner() {
        if (this.isShow_NavigateSettle) {
            console.log("MINIGAME ===> ", "已经调用过showNavigateBoxBanner,请勿重复调用");
            return;
        }

        // console.log("MINIGAME ===> ", "showNavigateBoxBanner=====================", this.loadSucc_NavigateBoxBanner);
        if (this.loadSucc_NavigateBoxBanner) {
            this.isShow_NavigateSettle = true;
            this.hideBanner();
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

        
    }

    /** 启用模板banner */
    createNativeBanner() {
        //以下为模板渲染,后续可用广告位开启状态判断是用模板还是自渲染
        AdLogUtil.Log("创建模板Banner广告 createNativeBanner:"+this.NativeBannerData.vendor_position);
        if (this.qg.createCustomAd) {
            // console.log("MINIGAME ===> ", "VIVO 创建原生模板广告")
            this.nativeAd = this.qg.createCustomAd({
                posId: this.NativeBannerData.vendor_position,
                //竖屏设置
                style: {
                    left: 0,
                    // top: 720
                    //看看top尺寸是否正确
                    top:this.systemInfo.screenHeight-300
                }
                // //横屏设置
                // style: {
                //     left: 720,
                //     top: 100
                // }
            });

            this.nativeAd.onLoad(() => {
                AdLogUtil.Log("模板Banner广告加载完成 createNativeBanner onLoad");
                // console.log("MINIGAME ===> ", "VIVO 原生模板插屏广告加载完成")
                this.loadSucc_NativeBanner = true;
            })

            this.nativeAd.onError((err) => {
                AdLogUtil.Log("模板Banner广告错误 createNativeBanner onError:"+JSON.stringify(err));
                // console.log("vivo 原生模板广告错误:"+err);
                // console.log(err);
                this.loadSucc_NativeBanner = false;
                setTimeout(() => {
                    this.createNativeBanner();
                }, 20 * 1000);
            })

            //监听模板Banner广告关闭
            this.nativeAd.onClose(() => {
                AdLogUtil.Log("模板Banner广告关闭 createNativeBanner onClose");
                // console.log("MINIGAME ===> ", "VIVO 原生模板插屏广告关闭");
                this.loadSucc_NativeBanner = false;
                // 系统插屏关闭后2s后再次load
                setTimeout(() => {
                    this.createNativeBanner();
                }, 2 * 1000);
                this.setStartTimer("NativeBanner");
            })
        }

        //TODO:以下为自渲染banner，暂时弃用，现在启用模板banner
        // console.log("MINIGAME ===> 原生banner", "--createNativeBanner--");

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
        //         console.log("MINIGAME ===> ", "Vivo原生banner广告列表为空 return");
        //         return;
        //     }

        //     // console.log("MINIGAME ===> ", "Vivo 原生banner广告加载成功：", JSON.stringify(res.adList[index]))

        //     if (res.adList[index].icon != "" && res.adList[index].imgUrlList.length > 0) {
        //         // console.log("MINIGAME ===> ", "Vivo 原生banner广告同时存在原生ICON和大图");
        //     } else {
        //         // console.log("MINIGAME ===> ", "Vivo 原生banner广告只存在原生ICON或大图");
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
        //     this.loadSucc_NativeBanner = true;

        // });

        // //监听原生广告加载错误
        // this.nativeAd.onError(err => {
        //     console.log("MINIGAME ===> ", "Vivo 原生banner广告加载失败：", JSON.stringify(err))

        //     setTimeout(() => {
        //         this.nativeAd.load();
        //     }, 20 * 1000);
        // });

        // this.nativeAd.load();
    }

    /**
     * 展示原生banner（目前启用模板banner）
     */
    showNativeBanner() {
        //以下为模板banner的show
        AdLogUtil.Log("showNativeBanner");
        // if(this.NativeBannerData && this.NativeBannerData.enabled && this.NativeBannerData.vendor_position != ""){
            AdLogUtil.Log("this.NativeBannerData.ad_interval："+this.NativeBannerData.ad_interval+"this.getTimeInterval():"+this.getTimeInterval("NativeBanner"));
            if((this.nativeAd && this.loadSucc_NativeBanner && this.getTimeInterval("NativeBanner")>=this.NativeBannerData.ad_interval)||(this.nativeAd && this.loadSucc_NativeBanner && this.firstEnter)){
                this.nativeAd.show().then(() => {
                    // console.log("MINIGAME ===> ", "VIVO 原生模板插屏广告展示成功==================");
                    // AdManager.getInstance().hideBanner();
                    AdLogUtil.Log("模板Banner广告展示成功 NativeBanner show");
                    this.isShow_NativeBanner = true;
                    // this.firstEnter=false;
                }).catch((err) => {
                    // console.log("MINIGAME ===> ", "VIVO 原生模板插屏展示错误:" + JSON.stringify(err));
                    AdLogUtil.Log("模板Banner广告展示错误:"+ JSON.stringify(err));
                })
            }
        // }else{
            // AdLogUtil.Log("广告位信息："+this.NativeBannerData+"广告位开启状态："+this.NativeBannerData.enabled+"广告位posId："+this.NativeBannerData.vendor_position);
            // return;
        // }
        // if (this.nativeAd && this.loadSucc_NativeBanner) {
        // // if (this.customIntersAd) {
        //     let time = this.AdCustomIntersData.day_limits;
        //     setTimeout(() => {
        //         this.customIntersAd.show().then(() => {
        //             // console.log("MINIGAME ===> ", "VIVO 原生模板插屏广告展示成功==================");
        //             // AdManager.getInstance().hideBanner();
        //             AdLogUtil.Log("模板Banner广告展示成功 NativeBanner show");
        //         }).catch((err) => {
        //             // console.log("MINIGAME ===> ", "VIVO 原生模板插屏展示错误:" + JSON.stringify(err));
        //             AdLogUtil.Log("模板Banner广告展示错误:"+ JSON.stringify(err));
        //         })
        //     }, time * 1000);
        // }
        //TODO:以下为弃用的自渲染banner
        // if (this.isShow_NavigateSettle) {
        //     console.log("MINIGAME ===> ", "Vivo 正在展示互推盒子 return");
        //     return;
        // }

        // this.isShow_NativeBanner = true;

        // let scene = director.getScene();

        // //原生广告id
        // let tempid = this.nativeBannerInfo.adId;
        // this.reportNativeBannerShow(tempid);

        // // console.log("MINIGAME ===> 原生banner", "showNativeBanner========================");

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
        //     // console.log("MINIGAME ===> ", "原生banner关闭", this.NUM_BannerUpdateTime + "S后再次刷新");
        //     this.hideNativeBanner();
        //     this.updateBanner();
        //     // 清除触摸事件的冒泡
        //     // event.event.propagationStopped = true;
        // });

    }
    /**
     * 隐藏原生banner(现为模板banner)
     */
    hideNativeBanner() {
        if (this.isShow_NativeBanner) {
            // console.log("MINIGAME ===> ", "Vivo原生banner hideNativeBanner========================");
            this.isShow_NativeBanner = false;
            // if(this.nativeAd){
            if(this.nativeAd.isShow()){
                this.nativeAd.hide();
            }
            // }
            //TODO:以下为自渲染banner的内容，目前暂时先启用模板banner
            // this.node_nativeBanner.removeFromParent();
            // this.node_nativeBanner = null;
        }
    }

    reportNativeBannerShow(adId) {
        // console.log("MINIGAME ===> ", "Vivo 该原生banner广告id上报展示", adId);
        this.nativeAd.reportAdShow({
            adId: adId
        })
    }

    reportNativeBannerClick(adId) {
        // console.log("MINIGAME ===> ", "Vivo 原生banner广告上报点击", adId);
        this.nativeAd.reportAdClick({
            adId: adId
        })
    }

    /**原生大图 */
    createNativeImage() {
        // console.log("MINIGAME ===> 原生大图", "--createNativeBanner--");

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
        };

        this.nativeImageAd.onLoad((res) => {

            let index = 0;
            if (typeof res.adList != undefined && res.adList.length != 0) {
                index = res.adList.length - 1;
            } else {
                console.log("MINIGAME ===> ", "Vivo 原生大图广告列表为空 return");
                return;
            }

            // console.log("MINIGAME ===> ", "Vivo 原生大图广告加载成功：", JSON.stringify(res.adList[index]))

            // if (res.adList[index].icon != "" && res.adList[index].imgUrlList.length > 0) {
            //     console.log("MINIGAME ===> ", "Vivo 原生大图广告同时存在原生ICON和大图");
            // } else {
            //     console.log("MINIGAME ===> ", "Vivo 原生大图广告只存在原生ICON或大图");
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
            // console.log("MINIGAME ===> ", "Vivo 原生大图广告加载成功：")
        });

        //监听原生广告加载错误
        this.nativeImageAd.onError(err => {
            console.log("MINIGAME ===> ", "Vivo 原生大图广告加载失败：", JSON.stringify(err))

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
        // console.log("MINIGAME ===> ", "获取自定义原生大图广告");
        return this.nativeImageInfo;
    }
    getHWNativeAdInfo(_infoCallback?: Function) { }
    reportNativeImageShow(adId) {
        // console.log("MINIGAME ===> ", "Vivo 该原生大图广告id上报展示", adId);
        this.nativeImageAd.reportAdShow({
            adId: adId
        })
    }
    reportNativeImageClick(adId) {
        // console.log("MINIGAME ===> ", "Vivo 原生大图广告上报点击", adId);
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
        // console.log("MINIGAME ===> 原生icon", "--createNativeBanner--");

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
                // console.log("MINIGAME ===> ", "Vivo 原生icon广告列表为空 return");
                return;
            }

            // console.log("MINIGAME ===> ", "Vivo 原生icon广告加载成功：", JSON.stringify(res.adList[index]))

            if (res.adList[index].icon != "" && res.adList[index].imgUrlList.length > 0) {
                console.log("MINIGAME ===> ", "Vivo 原生icon广告同时存在原生ICON和大图");
            } else {
                console.log("MINIGAME ===> ", "Vivo 原生icon广告只存在原生ICON或大图");
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

            // console.log("MINIGAME ===> ", "Vivo 原生大图广告加载成功：");
        });

        //监听原生广告加载错误
        this.nativeIconAd.onError(err => {
            console.log("MINIGAME ===> ", "Vivo 原生icon广告加载失败：", JSON.stringify(err))

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
        // console.log("MINIGAME ===> ", "获取自定义原生Icon广告");
        return this.nativeIconInfo;
    }
    reportNativeIconShow(adId) {
        // console.log("MINIGAME ===> ", "Vivo 该原生Icon广告id上报展示", adId);
        this.nativeIconAd.reportAdShow({
            adId: adId
        })
    }
    reportNativeIconClick(adId) {
        // console.log("MINIGAME ===> ", "Vivo 原生Icon广告上报点击", adId);
        this.nativeIconAd.reportAdClick({
            adId: adId
        });
    }
    /**刷新原生Icon广告 */
    loadNativeIcon() {
        this.nativeIconAd && this.nativeIconAd.load();
    }

    addDesktop(_callback: Function) {
        // console.log("addDesktop in vivoApi");
        if (this.qg != null && this.qg != undefined) {
            this.qg.installShortcut({
                success: (res) => {
                    // 判断图标未存在时，创建图标
                    if (res == false) {
                        _callback && _callback(true);
                    } else {
                        _callback && _callback(false);
                        // TipsManager.Instance().create('已存在桌面图标');
                    }
                },
                fail: (err) => { },
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
                        _callback && _callback(true);
                    } else {
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
    videoPath;
    clipIndexList = [];
    recordClipRecorder(data) { }
    pauseGameVideo() { }
    resumeGameVideo() { }
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

    /** 开始计算时间间隔
     * @param adName:广告位名称
     */
    setStartTimer(adName:string){
        this.intervalMap.set(adName,Date.parse(new Date().toString()));
        // this.lastDisplayTime=;
    }

    /**获取时间间隔
     * @param adName:广告位名称,需要判断传入的是否是首次时间
     */
    getTimeInterval(adName:string){
        if(this.intervalMap.get(adName)!=null){
            AdLogUtil.Log("adName is "+adName);
            let nowTime=Date.parse(new Date().toString());
            let lastDisplayTime=this.intervalMap.get(adName);
            AdLogUtil.Log("time is "+(nowTime-lastDisplayTime)/1000);
            return (nowTime-lastDisplayTime)/1000;
        }else{
            AdLogUtil.Log("firstTime");
            let nowTime=Date.parse(new Date().toString());
            let firstTime=Number(gameInitManager.getLocalDataManager().getFirstStartTime());
            AdLogUtil.Log("first time is "+(nowTime-firstTime)/1000);
            this.firstEnter=false;
            return (nowTime-firstTime)/1000;
        }

        
    }

    // /**获取首次启动时间 */
    // getFirstTime(){
    //     let firstTime=Number(gameInitManager.getLocalDataManager().getFirstStartTime());
    //     let nowTime=Date.parse(new Date().toString());
    //     return (nowTime-firstTime)/1000;
    // }
}

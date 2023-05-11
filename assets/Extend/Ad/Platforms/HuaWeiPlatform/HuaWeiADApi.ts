import { assetManager, director, game, Label, Node, Sprite, SpriteFrame, UITransform, view, Widget, _decorator } from "cc";
import AdManager from "../AdManager";
import AdsIdConfig from "../AdsIdConfig";
import { PlatformAdApi } from "../PlatformAdApi";
import { AdLogUtil } from "../../Util/AdLogUtil";

const { ccclass, property } = _decorator;

@ccclass
export default class HuaWeiADApi implements PlatformAdApi {

    /**
     * 应用id 测试应用appid = 106706049;
     */
    private static readonly appid = "108020551";

    videoType: string = "";
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
    qg: any = window["qg"];
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
    systemIntersAd: any = null;
    /**系统插屏加载成功 */
    loadSucc_SystemInters = false;

    // /**模板插屏 */
    // customIntersAd = null;
    // /**模板插屏加载成功 */
    // loadSucc_CuctomInters = false;
    // /**模板插屏间隔 */
    // CuctomIntervalTime = true;

    /**视频 */
    rewardedVideoAd: any = null;
    /**视频广告是否已经load到数据 */
    loadSucc_Video: boolean = false;
    /**视频广告回调 */
    callback_Video = null;

    /**原生 */
    nativeAd: any = null;
    /**原生banner广告对象 */
    nativeBannerInfo: any = null;
    /**原生banner加载成功 */
    loadSucc_NativeBanner = false;
    /**正在展示原生banner */
    isShow_NativeBanner = false;
    /**展示原生banner的Node */
    node_nativeBanner: Node = null!;

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

    /**原生icon */
    nativeIconAd: any = null;
    /**原生Icon广告对象 */
    nativeIconInfo: any = null;
    /**原生Icon加载成功 */
    loadSucc_NativeIcon = false;
    /**正在展示原生Icon */
    isShow_NativeIcon = false;

    /**系统信息 */
    systemInfo: any = null;

    /**原生本地图片资源 */
    nativeRes: any = null;
    /**原生本地图片资源否加载成功 */
    loadNativeRes = false;

    onInit(_callback: Function) {

        if (this.qg !== null && this.qg !== undefined) {
            //从1078版本开始
            this.systemInfo = this.qg.getSystemInfoSync();
            console.log('MINIGAME ===> 设备信息.systemInfo===>', this.systemInfo);

            this.createAd();
        } else {
            this.qg = null;
        }

        _callback && _callback();
        console.log('MINIGAME ===> 华为 ===================> onInit ok');
    }
    createAd() {
        if (this.SystemBannerData.enabled && this.SystemBannerData.vendor_position != "") this.createSystemBanner();
        if (this.SystemIntersData && this.SystemIntersData.enabled && this.SystemIntersData.vendor_position != "") this.createInsertAd();
        
        if (this.VideoData.enabled && this.VideoData.vendor_position != "") this.createVideo();

        // if(this.AdCustomIntersData.enabled && this.AdCustomIntersData.vendor_position!="") this.createNativeCuston();
        this.loadNativeBannerRes();
        if (this.NativeBannerData && this.NativeBannerData.enabled && this.NativeBannerData.vendor_position != "") this.createNativeBanner();

        //当原生广告数据
        if (this.NativeIntersData && this.NativeIntersData.enabled && this.NativeIntersData.vendor_position != "") this.createNativeImage();
    }
    setGroup(group: number) {
        this.AdGroup = group;
    }
    /**
     * 加载原生banner广告资源
     */
    loadNativeBannerRes() {
        console.log("MINIGAME ===> ", "--loadNativeBannerRes--");

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


    onLogin(_callback: Function) {
        console.log("Sign-in");
        if (this.qg !== null && this.qg !== undefined) {
            this.qg.gameLoginWithReal({
                forceLogin: 0,
                appid: HuaWeiADApi.appid,
                success: function (data) {
                    // 登录成功后，可以存储帐号信息,进入游戏。             
                    console.log(" game login with real success:" + JSON.stringify(data));
                    director.resume();
                    _callback(1);
                },
                fail: function (data, code) {

                    console.log("game login with real fail:" + data + ", code:" + code);
                    // _callback(2);
                    director.resume();
                    //根据状态码处理游戏的逻辑。
                    //状态码为7004或者2012，表示玩家取消登录。
                    //此时，建议返回游戏界面，可以让玩家重新进行登录操作。
                    if (code == 7004 || code == 2012) {
                        console.log("玩家取消登录，返回游戏界面让玩家重新登录。")
                        _callback(2);
                    }
                    //状态码为7021表示玩家取消实名认证。
                    //在中国大陆的情况下，此时需要禁止玩家进入游戏。
                    if (code == 7021) {
                        console.log("The player has canceled identity verification. Forbid the player from entering the game.")
                        _callback(3);
                    }
                }
            });
        }
    }
    onShare(_callback: Function) {

    }
    clipIndexList = [];
    videoPath = null;
    recordClipRecorder(data) { }
    pauseGameVideo() { }
    resumeGameVideo() { }
    ShareVideo(_title: string, templateId: string, _callback: Function) {

    }
    createSystemBanner() {
        if (this.qg !== null && this.qg !== undefined) {
            console.log("MINIGAME ===> 华为平台 创建Banner广告", this.SystemBannerData.vendor_position);

            console.log(this.systemInfo.screenHeight, this.systemInfo.screenWidth);
            var sysInfo = this.qg.getSystemInfoSync();
            console.log("on getSystemInfoSync: success =" + JSON.stringify(sysInfo));
            //获取当前手机屏幕高度(dp)
            var bannerTop = sysInfo.safeArea.height;

            this.systemBannerAd = this.qg.createBannerAd({
                adUnitId: this.SystemBannerData.vendor_position,
                // adUnitId: "j1pcnpx5tu",
                // style: {
                //     top: this.systemInfo.screenHeight - 57,
                //     left: (this.systemInfo.screenWidth - 360) / 2,
                //     height: 57,
                //     width: 360
                // }
                style:{
                    //top需要手机屏幕高度减去广告本身高度
                   top:bannerTop-57,
                   left:0,
                   height:57,
                   width:360,
                 }
            });
            this.loadSucc_SystemBanner = false;
            // this.systemBannerAd.onResize((size) => {
            //     console.log('size=====>', size.height, size.width);

            //     this.systemBannerAd.style.top = this.systemInfo.windowHeight - size.height;
            //     this.systemBannerAd.style.left = (this.systemInfo.windowWidth - size.width) / 2;
            // })
            this.systemBannerAd.onError((err) => {
                console.log('MINIGAME ===>横幅广告Banner ', JSON.stringify(err))
            })
            // this.systemBannerAd.onClose(() => {
            //     console.log("MINIGAME ===> 横幅广告调用 onClose");
            // });
            this.systemBannerAd.onLoad(() => {
                console.log("MINIGAME ===> 横幅广告 加载完成");
                this.loadSucc_SystemBanner = true;
                // this.systemBannerAd.show();
            });
        }
    }
    showBanner() {
        // if (this.loadSucc_NativeBanner) {
        //     this.showNativeBanner();
        // } else 
        if (this.loadSucc_SystemBanner) {
            console.log("show system banner");
            this.showSystemBanner();
        } else {
            //华为预加载的时候onLoad没回调
            this.createSystemBanner();
            setTimeout(() => {
                this.isShow_SystemBanner = true;
                this.systemBannerAd.show();
            }, 2000)

        }
    }
    hideBanner(close = false) {
        this.hideSystemBanner();
        // this.hideNativeBanner();
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
        console.log('隐藏系统banner', this.isShow_SystemBanner);
        if (this.isShow_SystemBanner && this.systemBannerAd) {
            this.isShow_SystemBanner = false;
            // this.systemBannerAd.offHide();
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

    // createNativeCuston(){
    //     AdLogUtil.Log("创建原生模板广告 createNativeCuston:"+this.AdCustomIntersData.vendor_position);

    // }

    createVideo() {
        if (this.qg !== null && this.qg !== undefined) {
            /**创建rewardedVideoAd 对象*/
            console.log("MINIGAME ===> 华为平台 创建激励视频广告");
            this.rewardedVideoAd = this.qg.createRewardedVideoAd({
                adUnitId: this.VideoData.vendor_position,
                // adUnitId: "e7hm5vx799",
            });
            this.loadSucc_Video = false;
            this.rewardedVideoAd.onLoad(() => {
                console.log("MINIGAME ===> 激励视频广告 加载成功");
                this.loadSucc_Video = true;
            });
            this.rewardedVideoAd.onError((err) => {
                console.log('MINIGAME ===> 华为H5GameAPI 激励视频 加载失败:code =====>:' + err.code + "message ======>:" + JSON.stringify(err));
            });
            //监听视频广告播放完成
            this.rewardedVideoAd.onClose(res => {
                if (res.isEnded) {
                    console.log("MINIGAME ===> ", "HUAWEI 激励视频广告完成，发放奖励");
                    if (this.callback_Video) {
                        this.callback_Video(true);
                    }
                } else {
                    console.log("MINIGAME ===> ", "HUAWEI 激励视频广告关闭，不发放奖励");
                    if (this.callback_Video) {
                        this.callback_Video(false);
                    }
                }
                setTimeout(() => {
                    this.rewardedVideoAd.load();
                }, 300)
            });
            this.rewardedVideoAd.load();
        }
    }
    showVideo(_successCallback: Function) {
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
    createInsertAd() {
        if (this.qg != null && this.qg != undefined) {
            console.log("MINIGAME ===> 华为  创建插屏广告 1078+");
            this.systemIntersAd = this.qg.createInterstitialAd({
                adUnitId: this.SystemIntersData.vendor_position
            });
            this.loadSucc_SystemInters = false;
            this.systemIntersAd.onLoad(() => {
                this.loadSucc_SystemInters = true;
                console.log("MINIGAME ===> ", "HUAWEI 系统插屏广告加载完成");
            });
            //监听插屏广告错误
            this.systemIntersAd.onError(err => {
                this.loadSucc_SystemInters = false;
                console.log("MINIGAME ===> ", "HUAWEI 系统插屏广告加载失败，原因：",err);
                setTimeout(() => {
                    this.systemIntersAd && this.systemIntersAd.load()
                }, 15 * 1000);
            });
            //监听插屏广告关闭
            this.systemIntersAd.onClose(() => {
                console.log("MINIGAME ===> ", "HUAWEI 系统插屏广告关闭");
                this.loadSucc_SystemInters = false;
                // 系统插屏关闭后5s后再次load
                setTimeout(() => {
                    this.systemIntersAd && this.systemIntersAd.load()
                }, 5 * 1000);
            })

            this.systemIntersAd.load();
        }
    }
    showInsertAd() {
        if (this.systemIntersAd && this.loadSucc_SystemInters) {
            this.systemIntersAd.show();
        }
    }
    createNativeBanner() {
        console.log("MINIGAME ===> 原生banner", "--createNativeBanner--");
        
        this.nativeAd = this.qg.createNativeAd({
            adUnitId: this.NativeBannerData.vendor_position
            // adUnitId: "u7m3hc4gvm"
        })

        this.nativeBannerInfo = {
            adId: null,
            title: null,
            desc: null,
            Native_icon_url: null,
            Native_icon: null,
            Native_BigImage_url: null,
            Native_BigImage: null,
        };

        this.nativeAd.onLoad((res) => {

            let index = 0;
            if (typeof res.adList != undefined && res.adList.length != 0) {
                index = res.adList.length - 1;
            } else {
                console.log("MINIGAME ===> ", "HUAWEI原生banner广告列表为空 return");
                return;
            }

            console.log("MINIGAME ===> ", "HUAWEI 原生banner广告加载成功：", JSON.stringify(res.adList[index]))

            if (res.adList[index].icon != "" && res.adList[index].imgUrlList.length > 0) {
                // console.log("MINIGAME ===> ", "HUAWEI 原生banner广告同时存在原生ICON和大图");
            } else {
                // console.log("MINIGAME ===> ", "HUAWEI 原生banner广告只存在原生ICON或大图");
            }

            this.nativeBannerInfo.adId = String(res.adList[index].adId);
            this.nativeBannerInfo.title = String(res.adList[index].title);
            this.nativeBannerInfo.desc = String(res.adList[index].desc);


            if (res.adList && res.adList[index].icon != "") {
                this.nativeBannerInfo.Native_icon_url = res.adList[index].icon;
                assetManager.loadRemote(String(res.adList[index].icon), (err, texture) => {
                    this.nativeBannerInfo.Native_icon = texture;
                });
            }

            if (res.adList && res.adList[index].imgUrlList.length > 0) {
                this.nativeBannerInfo.Native_BigImage_url = res.adList[index].imgUrlList[0];
                assetManager.loadRemote(String(res.adList[index].imgUrlList[0]), (err, texture) => {
                    this.nativeBannerInfo.Native_BigImage = texture;
                });
            }
            this.loadSucc_NativeBanner = true;

        });

        //监听原生广告加载错误
        this.nativeAd.onError(err => {
            console.log("MINIGAME ===> ", "HUAWEI 原生banner广告加载失败：", JSON.stringify(err))

            setTimeout(() => {
                this.nativeAd.load();
            }, 20 * 1000);
        });

        this.nativeAd.load();
    }

    /**
     * 展示原生banner
     */
    showNativeBanner() {

        this.isShow_NativeBanner = true;

        let scene = director.getScene();

        //原生广告id
        let tempid = this.nativeBannerInfo.adId;
        this.reportNativeBannerShow(tempid);

        console.log("MINIGAME ===> 原生banner", "showNativeBanner========================");

        this.node_nativeBanner = new Node("node_nativeBanner");
        this.node_nativeBanner.addComponent(UITransform);
        scene!.getChildByName('Canvas')!.addChild(this.node_nativeBanner);
        this.node_nativeBanner.addComponent(Sprite);
        this.node_nativeBanner.getComponent(Sprite)!.spriteFrame = SpriteFrame.createWithImage(this.nativeRes.NativeBannerBg);
        this.node_nativeBanner.addComponent(Widget);
        this.node_nativeBanner.getComponent(Widget)!.isAlignHorizontalCenter = true;
        this.node_nativeBanner.getComponent(Widget)!.isAlignBottom = true;
        this.node_nativeBanner.getComponent(Widget)!.bottom = 0;
        let canvasSize = view.getVisibleSize();
        if (canvasSize.width < canvasSize.height) {
            this.node_nativeBanner.getComponent(UITransform)!.width = canvasSize.width;
            this.node_nativeBanner.getComponent(UITransform)!.height = canvasSize.width * 0.18;
        }
        else {
            this.node_nativeBanner.getComponent(UITransform)!.width = canvasSize.width / 2;
            this.node_nativeBanner.getComponent(UITransform)!.height = this.node_nativeBanner.getComponent(UITransform)!.width * 0.18;
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
        adTip.getComponent(Sprite)!.spriteFrame = SpriteFrame.createWithImage(this.nativeRes.NativeAdTip);
        adTip.getComponent(UITransform)!.height = 0.2 * this.node_nativeBanner.getComponent(UITransform)!.height;
        adTip.getComponent(UITransform)!.width = adTip.getComponent(UITransform)!.height / 0.45;
        if (this.AdGroup != 0)
            adTip.layer = this.AdGroup;
        adTip.setPosition(this.node_nativeBanner.getComponent(UITransform)!.width / 2 - adTip.getComponent(UITransform)!.width / 2,
            -this.node_nativeBanner.getComponent(UITransform)!.height / 2 + adTip.getComponent(UITransform)!.height / 2);

        // 点击安装
        let bannerButton = new Node("bannerButton");
        bannerButton.addComponent(UITransform);
        this.node_nativeBanner.addChild(bannerButton);
        bannerButton.addComponent(Sprite);
        if (this.AdGroup != 0)
            bannerButton.layer = this.AdGroup;
        bannerButton.getComponent(Sprite)!.spriteFrame = SpriteFrame.createWithImage(this.nativeRes.NativeBannerButton);
        bannerButton.getComponent(UITransform)!.width = this.node_nativeBanner.getComponent(UITransform)!.width * 0.255;
        bannerButton.getComponent(UITransform)!.height = bannerButton.getComponent(UITransform)!.width * 0.351;
        bannerButton.setPosition(this.node_nativeBanner.getComponent(UITransform)!.width / 2 - this.node_nativeBanner.getComponent(UITransform)!.width * 0.185, 0);

        if (this.nativeBannerInfo.Native_icon) {
            // icon
            let icon = new Node("icon");
            icon.addComponent(UITransform);
            this.node_nativeBanner.addChild(icon);
            if (this.AdGroup != 0) icon.layer = this.AdGroup;
            icon.addComponent(Sprite);
            icon.getComponent(Sprite)!.spriteFrame = SpriteFrame.createWithImage(this.nativeBannerInfo.Native_icon);
            icon.getComponent(UITransform)!.height = this.node_nativeBanner.getComponent(UITransform)!.height * 0.8;
            icon.getComponent(UITransform)!.width = icon.getComponent(UITransform)!.height;
            icon.setPosition(icon.getComponent(UITransform)!.width * 0.8 - this.node_nativeBanner.getComponent(UITransform)!.width / 2, 0);
        } else if (this.nativeBannerInfo.Native_BigImage) {
            // 大图
            let image = new Node("image");
            image.addComponent(UITransform);
            this.node_nativeBanner.addChild(image);
            if (this.AdGroup != 0) image.layer = this.AdGroup;
            image.addComponent(Sprite);
            image.getComponent(Sprite)!.spriteFrame = SpriteFrame.createWithImage(this.nativeBannerInfo.Native_BigImage);
            image.getComponent(UITransform)!.height = this.node_nativeBanner.getComponent(UITransform)!.height;
            image.getComponent(UITransform)!.width = image.getComponent(UITransform)!.height * 2;
            image.setPosition(image.getComponent(UITransform)!.width / 2 - this.node_nativeBanner.getComponent(UITransform)!.width / 2, 0);
        }

        // 标题或描述
        let titleLabel = new Node("titleLabel");
        titleLabel.addComponent(UITransform);
        this.node_nativeBanner.addChild(titleLabel);
        if (this.AdGroup != 0) titleLabel.layer = this.AdGroup;
        titleLabel.addComponent(Label);
        // titleLabel.getComponent(UITransform).priority = 999;
        if (canvasSize.width < canvasSize.height) {
            titleLabel.getComponent(Label)!.fontSize = 35 * (view.getDesignResolutionSize().width / 1080);
        } else {
            titleLabel.getComponent(Label)!.fontSize = 35 * (view.getDesignResolutionSize().height / 1080);
        }
        if (this.nativeBannerInfo.desc == "") {
            titleLabel.getComponent(Label)!.string = this.nativeBannerInfo.title;
        } else {
            titleLabel.getComponent(Label)!.string = this.nativeBannerInfo.desc;
        }
        titleLabel.getComponent(Label)!.overflow = Label.Overflow.CLAMP;
        titleLabel.getComponent(Label)!.horizontalAlign = Label.HorizontalAlign.LEFT;
        titleLabel.getComponent(Label)!.verticalAlign = Label.VerticalAlign.CENTER;
        titleLabel.getComponent(Label)!.lineHeight = titleLabel.getComponent(Label)!.fontSize;
        titleLabel.getComponent(UITransform)!.width = this.node_nativeBanner.getComponent(UITransform)!.width - this.node_nativeBanner.getComponent(UITransform)!.height * 2 - bannerButton.getComponent(UITransform)!.width - 0.2 * this.node_nativeBanner.getComponent(UITransform)!.height / 0.45;
        titleLabel.getComponent(UITransform)!.height = this.node_nativeBanner.getComponent(UITransform)!.height;
        titleLabel.setPosition(0, -this.node_nativeBanner.getComponent(UITransform)!.width / 2 + this.node_nativeBanner.getComponent(UITransform)!.height * 2.1 + titleLabel.getComponent(UITransform)!.width / 2);

        let NativeClose = new Node("closeICON");
        NativeClose.addComponent(UITransform);
        this.node_nativeBanner.addChild(NativeClose);
        // NativeClose.getComponent(UITransform).priority = 999;
        NativeClose.addComponent(Sprite);
        if (this.AdGroup != 0) NativeClose.layer = this.AdGroup;
        NativeClose.getComponent(Sprite)!.spriteFrame = SpriteFrame.createWithImage(this.nativeRes.NativeClose);
        NativeClose.getComponent(UITransform)!.width = 0.27 * this.node_nativeBanner.getComponent(UITransform)!.height;
        NativeClose.getComponent(UITransform)!.height = 0.27 * this.node_nativeBanner.getComponent(UITransform)!.height;
        NativeClose.setPosition(this.node_nativeBanner.getComponent(UITransform)!.width / 2 - NativeClose.getComponent(UITransform)!.width / 2, this.node_nativeBanner.getComponent(UITransform)!.height / 2 - NativeClose.getComponent(UITransform)!.width / 2);

        // 监听原生banner关闭
        NativeClose.on(Node.EventType.TOUCH_START, (event) => {
            console.log("MINIGAME ===> ", "原生banner关闭", this.NUM_BannerUpdateTime + "S后再次刷新");
            this.hideNativeBanner();
            this.updateBanner();
            // 清除触摸事件的冒泡
            // event.event.propagationStopped = true;
        });

    }
    /**
     * 隐藏原生banner
     */
    hideNativeBanner() {
        if (this.isShow_NativeBanner) {
            console.log("MINIGAME ===> ", "HUAWEI原生banner hideNativeBanner========================");
            this.isShow_NativeBanner = false;
            this.node_nativeBanner.removeFromParent();
            this.node_nativeBanner = null;
        }
    }
    reportNativeBannerShow(adId) {
        console.log("MINIGAME ===> ", "HUAWEI 该原生banner广告id上报展示", adId);
        this.nativeAd.reportAdShow({
            adId: adId
        })
    }
    reportNativeBannerClick(adId) {
        console.log("MINIGAME ===> ", "HUAWEI 原生banner广告上报点击", adId);
        this.nativeAd.reportAdClick({
            adId: adId
        })
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
                console.log("MINIGAME ===> ", "HUAWEI 原生大图广告列表为空 return");
                return;
            }

            // if (res.adList[index].icon != "" && res.adList[index].imgUrlList.length > 0) {
            //     console.log("MINIGAME ===> ", "HUAWEI 原生大图广告同时存在原生ICON和大图");
            // } else {
            //     console.log("MINIGAME ===> ", "HUAWEI 原生大图广告只存在原生ICON或大图");
            // }

            this.nativeImageInfo.adId = String(res.adList[index].adId);
            this.nativeImageInfo.title = String(res.adList[index].title);
            // this.nativeImageInfo.desc = String(res.adList[index].desc);
            this.nativeImageInfo.source = String(res.adList[index].source)
            this.nativeImageInfo.clickBtnTxt = String(res.adList[index].clickBtnTxt);


            if (res.adList && res.adList[index].icon != "") {
                this.nativeImageInfo.Native_icon_url = res.adList[index].icon;
            }

            if (res.adList && res.adList[index].imgUrlList.length > 0) {
                this.nativeImageInfo.Native_BigImage_url = res.adList[index].imgUrlList[0];
            }

            this.loadSucc_NativeImage = true;
            console.log("MINIGAME ===> ", "HUAWEI 原生大图广告加载成功：", this.nativeImageInfo)

            this.callback_Native && this.callback_Native(this.nativeImageInfo);
        });

        //监听原生广告加载错误
        this.nativeImageAd.onError(err => {
            console.log("MINIGAME ===> ", "HUAWEI 原生大图广告加载失败：", JSON.stringify(err));
            this.callback_Native && this.callback_Native(null);
        });

        // this.nativeImageAd.load();
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


    /**华为原生大图广告获取 */
    getHWNativeAdInfo(_infoCallback?: Function) {
        this.callback_Native = _infoCallback;
        if (!this.nativeImageAd) {
            if (this.NativeIntersData && this.NativeIntersData.enabled && this.NativeIntersData.vendor_position != "") {
                this.createNativeImage();
            }
        }
        AdLogUtil.Log("load nativeImageAd");
        this.nativeImageAd && this.nativeImageAd.load();
    }


    reportNativeImageShow(adId) {
        console.log("MINIGAME ===> ", "HUAWEI 该原生大图广告id上报展示", adId);
        this.nativeImageAd.reportAdShow({
            adId: adId
        })
    }
    reportNativeImageClick(adId) {
        console.log("MINIGAME ===> ", "HUAWEI 原生大图广告上报点击", adId);
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
            adUnitId: this.NativeIconData.vendor_position
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
                console.log("MINIGAME ===> ", "HUAWEI 原生icon广告列表为空 return");
                return;
            }

            console.log("MINIGAME ===> ", "HUAWEI 原生icon广告加载成功：", JSON.stringify(res.adList[index]))

            if (res.adList[index].icon != "" && res.adList[index].imgUrlList.length > 0) {
                console.log("MINIGAME ===> ", "HUAWEI 原生icon广告同时存在原生ICON和大图");
            } else {
                console.log("MINIGAME ===> ", "HUAWEI 原生icon广告只存在原生ICON或大图");
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

            console.log("MINIGAME ===> ", "HUAWEI 原生大图广告加载成功：");
        });

        //监听原生广告加载错误
        this.nativeIconAd.onError(err => {
            console.log("MINIGAME ===> ", "HUAWEI 原生icon广告加载失败：", JSON.stringify(err))

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
        console.log("MINIGAME ===> ", "HUAWEI 该原生Icon广告id上报展示", adId);
        this.nativeIconAd.reportAdShow({
            adId: adId
        })
    }


    reportNativeIconClick(adId) {
        console.log("MINIGAME ===> ", "HUAWEI 原生Icon广告上报点击", adId);
        this.nativeIconAd.reportAdClick({
            adId: adId
        });
    }


    /**刷新原生Icon广告 */
    loadNativeIcon() {
        this.nativeIconAd && this.nativeIconAd.load();
    }

    
    /**创建格子广告组件 */
    showNavigateBoxPortal() {
    }
    createNavigateBoxBanner() {
    }
    showNavigateBoxBanner() {
    }
    hideNavigateBoxBanner() {
    }

    addDesktop(_callback: Function) {
        if (this.qg != null && this.qg != undefined) {
            this.qg.installShortcut({
                success: (res) => {
                    // 判断图标未存在时，创建图标
                    if (res.search('success')!=-1) {
                        _callback && _callback(true);
                    } else {
                        _callback && _callback(false);
                    }
                },
                fail: (err) => { },
                complete: () => { }
            })
        }
    }
    /**是否已经创建桌面图标 */
    hasShortcutInstalled(_callback: Function){
        if (this.qg != null && this.qg != undefined) {
            this.qg.hasShortcutInstalled({
                success: (res) => {
                    // 判断图标未存在时，创建图标
                    if (res == true) {
                        _callback && _callback(true);
                    } else {
                        _callback && _callback(false);
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

    reportAnalytics(name, value) { }

    showCustomAd() {

    }
    
    hideCustomAd() {
        
    }

    showGridAd() {
    }
    hideGridAd() {
    }
    showCustomAdWithInsert() {
        // throw new Error("Method not implemented.");
    }
}

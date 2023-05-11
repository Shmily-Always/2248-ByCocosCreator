import MeiZuADApi from "./MeiZuPlatform/MeiZuADApi";
import OppoADApi from "./oppoPlatform/OppoADApi";
import { PlatformAdApi } from "./PlatformAdApi";
import QQADApi from "./qqPlatform/QQADApi";
import VivoADApi from "./vivoPlatform/VivoADApi";
import WXADApi from "./wxPlatform/WXADApi";
import KSADApi from "./KSPlatform/KSADApi";
import BaiDuADApi from "./BaiduPlatform/BaiDuADApi";
import HuaWeiADApi from "./HuaWeiPlatform/HuaWeiADApi";
import AdsIdConfig, { AdType, EPlatform } from "./AdsIdConfig";

import { director, _decorator } from "cc";
import { CloseADApi } from "./ClosePlatform/CloseADApi";
import TiktokADApi from "./TictokADApi/TiktokADApi";
import { XmADApi } from "./XiaoMiPlatform/XmADApi";
import { AdLogUtil } from "../Util/AdLogUtil";
import Box4399ADApi from "./4399Platform/Box4399ADApi";

//#region 广告和通用部分说明


//#region TikTok部分 2023.02.02

//********备注:必须有录屏分享,时长不能少于3s，关卡时长明显大于15s，录屏必须大于15s，游戏中场景不能有广告********
//开始录屏  AdManager.getInstance().StartRecorder();
//停止录屏  AdManager.getInstance().stopRecordScreen();
//分享录屏,要停止录屏后才可以分享           AdManager.getInstance().ShareVideo('游戏名', 'appid', 回调);
//显示banner         AdManager.getInstance().showBanner();
//隐藏banner         AdManager.getInstance().hideBanner();
//显示插屏           AdManager.getInstance().showInsertAd();
//激励视频           AdManager.getInstance().showVideo((param)=>{param为true为回调成功,false回调失败});

//#endregion


//#region oppo部分  2023.02.02  推荐的最低版本号 1060(界面只能出现一个广告,原生广告不能遮挡按钮)

//显示banner         AdManager.getInstance().showBanner();
//隐藏banner         AdManager.getInstance().hideBanner();
//激励视频           AdManager.getInstance().showVideo((param)=>{param为true为回调成功,false回调失败});
//显示原生模板广告   AdManager.getInstance().showCustomAd();    //位置需要在OppoADApi中调节customAdTop,默认居中
//隐藏原生模板广告   AdManager.getInstance().hideCustomAd();    //位置需要在OppoADApi中调节customAdTop,默认居中
//显示九宫格广告     AdManager.getInstance().showNavigateBoxPortal();

//#endregion


//#region vivo部分 2023.02.03

//显示banner         AdManager.getInstance().showBanner();
//隐藏banner         AdManager.getInstance().hideBanner();
//显示插屏           AdManager.getInstance().showInsertAd();
//激励视频           AdManager.getInstance().showVideo((param)=>{param为true为回调成功,false回调失败});
//显示原生模板广告   AdManager.getInstance().showCustomAd();    
//隐藏原生模板广告   AdManager.getInstance().hideCustomAd();    
//显示九宫格广告     AdManager.getInstance().showNavigateBoxPortal();

//#endregion


//#region 华为部分  2023.02.06

//显示banner         AdManager.getInstance().showBanner();
//隐藏banner         AdManager.getInstance().hideBanner();
//原生广告      将UI/下的ad预制体放入指定场景,获取AdNativeInfo组件执行ADInit方法
//激励视频      AdManager.getInstance().showVideo((param)=>{param为true为回调成功,false回调失败});

//#endregion


//#region 小米部分

//显示banner         AdManager.getInstance().showBanner();
//隐藏banner         AdManager.getInstance().hideBanner();

//#endregion

//#endregion

const { ccclass, property } = _decorator;

export enum ResultEnum {
    Success = 1,
    Fail = 2,
}


@ccclass
export default class AdManager {

    public platform: EPlatform = EPlatform.Close;
    public platformAdApi: PlatformAdApi = null!;

    private static _adManager: AdManager = null!;
    public static getInstance(): AdManager {
        if (this._adManager == null) {
            this._adManager = new AdManager();
        }
        return this._adManager;
    }
    // isInitSuccess:boolean=false;

    public onInit(_callBack: Function) {
        switch (this.platform) {
            case EPlatform.Close:
                this.platformAdApi = new CloseADApi();
                break;
            case EPlatform.OPPO:
                this.platformAdApi = new OppoADApi();
                break;
            case EPlatform.VIVO:
                this.platformAdApi = new VivoADApi();
                break;
            case EPlatform.TikTok:
                this.platformAdApi = new TiktokADApi();
                break;
            case EPlatform.HUAWEI:
                this.platformAdApi = new HuaWeiADApi();
                break;
            case EPlatform.XiaoMi:
                this.platformAdApi = new XmADApi();
                break;
            case EPlatform.WX:
                this.platformAdApi = new WXADApi();
                break;
            case EPlatform.KS:
                this.platformAdApi = new KSADApi();
                break;
            case EPlatform.Platform4399:
                this.platformAdApi=new Box4399ADApi();
                break;
        }
        AdLogUtil.Log("current platform: " + this.platform);
        AdsIdConfig.getAdConfigWeb(() => {
            this.startLoadAd(_callBack);
        });

    }


    private startLoadAd(_callBack) {
        //TODO:后续把初始化放在每个不同平台里初始化，下个版本更新
        if (AdsIdConfig.adConfig != null) {
            this.setAllAdConfig();
        }
        // this.initAdCountData();
        AdLogUtil.Log("获取server配置成功!");
        // this.isInitSuccess=true;
        // console.log("this.init,",this.isInitSuccess);
        this.platformAdApi.onInit(_callBack);
        director.emit("loadMainMenu");
    }


    /**
     * 服务器配置相关
     */
    private setAllAdConfig() {
        // console.log("setAllAdConfig");
        AdLogUtil.Log("setAllAdConfig!");
        /**
     * 设置所有参数
     * 
     * {"status":200,"date":1649225421431,"data":{
     *              "package_name":"com.changwan.com.ttdjs.meta",
     *              "is_online":1, 测试上线
     *              "vendor_appid":"a609bccee0e461,262c1a96aba11f8052279fd0a880a1e1",
     *              "app_key":null,"tdk":"EF7F0E36374B420E932EB57E5532FC11",
     *              "cn":"233","umk":null,
     *              "positions":
     * 
     *   {"position_id":"10006223",
     *    "probability":0.0, 概率
     *    "ad_interval":90,  间隔
     *     "day_limits":0,   每日次数
     *        "ad_type":1,   广告类型
     * vendor_position":"b609bcd76482a8",
     *            "dtc":0.0,每天总点击
     *            "dcr":0.0,误点概率
     *        "enabled":false} 是否开启
     */
        // 所有广告开关
        let ad_Datas: any = AdsIdConfig.adConfig.data.positions;
        for (let i = 0; i < ad_Datas.length; i++) {
            // console.log("MiniGame adType: "+ad_Datas);
            if (ad_Datas[i].vendor_position && ad_Datas[i].enabled) {
                if (ad_Datas[i].ad_type == AdType.Banner) {
                    this.platformAdApi.SystemBannerData = ad_Datas[i];
                } else if (ad_Datas[i].ad_type == AdType.插屏) {
                    this.platformAdApi.SystemIntersData = ad_Datas[i];
                } else if (ad_Datas[i].ad_type == AdType.激励视频) {
                    this.platformAdApi.VideoData = ad_Datas[i];
                } else if (ad_Datas[i].ad_type == AdType.原生Banner) {
                    this.platformAdApi.NativeBannerData = ad_Datas[i];
                } else if (ad_Datas[i].ad_type == AdType.原生插屏) {
                    this.platformAdApi.NativeIntersData = ad_Datas[i];
                }
                else if (ad_Datas[i].ad_type == AdType.原生开屏) { //互推九宫格
                    this.platformAdApi.JGGBoxData = ad_Datas[i];
                } else if (ad_Datas[i].ad_type == AdType.浮标) { //互推banner
                    this.platformAdApi.BlockData = ad_Datas[i];
                } else if (ad_Datas[i].ad_type == AdType.原生模板) { //原生模板
                    this.platformAdApi.AdCustomIntersData = ad_Datas[i];
                }
                else if (ad_Datas[i].ad_type == AdType.全屏视频) { //原生icon
                    if (AdsIdConfig.platform == EPlatform.VIVO) {
                        this.platformAdApi.AdCustomIntersData = ad_Datas[i];
                    } else {
                        this.platformAdApi.NativeIconData = ad_Datas[i];
                    }
                }
            }
        }

    }


    initAdCountData() {

    }


    public setGroup(group) {
        this.platformAdApi && this.platformAdApi.setGroup(group);
    }


    /**登录 */
    public onLogin(_callback: Function) {
        this.platformAdApi && this.platformAdApi.onLogin(_callback);
    }


    /**分享游戏链接 */
    public onShare(_callback: Function) {
        this.platformAdApi && this.platformAdApi.onShare(_callback);
    }


    /**展示banner */
    public showBanner() {
        if (AdsIdConfig.platform == EPlatform.Close) {
            return;
        }
        this.platformAdApi && this.platformAdApi.showBanner();
    }


    /**隐藏banner(自渲染/模板+普通banner)，目前只有ov有 */
    public hideBanner() {
        this.platformAdApi && this.platformAdApi.hideBanner();
    }

    /**隐藏普通banner */
    public hideSystemBanner(){
        this.platformAdApi && this.platformAdApi.hideSystemBanner();
    }

    /**展示激励视频 */
    public showVideo(_successCallback?: Function, isStop = true) {
        // this.platformAdApi && this.platformAdApi.showVideo(_successCallback);
        director.pause();
        if (AdsIdConfig.platform == EPlatform.Close) {
            director.resume();
            this.platformAdApi && this.platformAdApi.showVideo(_successCallback);
            return;
        }
        this.platformAdApi.showVideo((_result) => {
            if (isStop) {
                director.resume();
            }
            if (_result) {
                _successCallback(1);
            } else {
                _successCallback(2);
            }
        });
    }


    /**展示插屏 */
    public showInsertAd() {
        if (AdsIdConfig.platform == EPlatform.Close) {
            return;
        }
        this.platformAdApi && this.platformAdApi.showInsertAd();
    }

    /**插屏兜底信息流，vivo特有 */
    public showCustomAdWithInsert(){
        this.platformAdApi && this.platformAdApi.showCustomAdWithInsert();
    }

    /**模板banner，vivo特有 */
    public showNativeBanner(){
        this.platformAdApi && this.platformAdApi.showNativeBanner();
    }
    /**
     * 显示模板原生广告
     */
    public showCustomAd() {
        this.platformAdApi && this.platformAdApi.showCustomAd();
    }


    public hideCustomAd() {
        this.platformAdApi && this.platformAdApi.hideCustomAd();
    }


    /**展示原生大图 */
    public showNativeImageAd() {
        return this.platformAdApi.getNativeAdInfo(0);
    }


    /**
     * 小米展示原生大图
     * @param _infoCallback 
     * @returns 
     */
    public showXMNativeImageAd(_infoCallback?: Function) {
        return this.platformAdApi.getNativeAdInfo(_infoCallback);
    }


    /**华为展示原生大图 */
    public showHWNativeImageAd(_infoCallback?: Function) {
        return this.platformAdApi.getHWNativeAdInfo(_infoCallback);
    }


    /**原生大图 被点击 */
    public onNativeAdClick(_id: string) {
        this.platformAdApi && this.platformAdApi.reportNativeImageClick(_id);
    }


    /**原生大图 展示 */
    public onNativeReportAdShow(_id: string) {
        this.platformAdApi && this.platformAdApi.reportNativeImageShow(_id);
    }


    /**刷新原生大图广告 */
    public loadNativeImage() {
        // this.platformAdApi && this.platformAdApi.loadNativeImage();
    }


    /**展示原生icon */
    public showNativeIconAd() {
        return this.platformAdApi.getNativeIconAdInfo(0);
    }


    /**原生icon被点击 */
    public reportNativeIconClick(_id: string) {
        this.platformAdApi && this.platformAdApi.reportNativeIconClick(_id);
    }


    /**原生icon展示 */
    public reportNativeIconShow(_id: string) {
        this.platformAdApi && this.platformAdApi.reportNativeIconShow(_id);
    }

    /**刷新原生icon广告 */
    public loadNativeIcon() {
        this.platformAdApi && this.platformAdApi.loadNativeIcon();
    }

    /**互推盒子九宫格广告 */
    public showNavigateBoxPortal() {
        this.platformAdApi && this.platformAdApi.showNavigateBoxPortal();
    }


    /**互推盒子横幅广告 */
    public showNavigateBoxBanner() {
        this.platformAdApi && this.platformAdApi.showNavigateBoxBanner();
    }


    /**关闭互推盒子横幅广告 */
    public hideNavigateBoxBanner() {
        this.platformAdApi && this.platformAdApi.hideNavigateBoxBanner();
    }

    /**添加icon到桌面 */
    public addDesktop(_callback: Function) {
        this.platformAdApi && this.platformAdApi.addDesktop(_callback);
    }


    /**是否已经创建桌面图标 */
    public hasShortcutInstalled(_callback: Function) {
        this.platformAdApi && this.platformAdApi.hasShortcutInstalled((_result) => {
            if (_result) {
                _callback(ResultEnum.Success);
            } else {
                _callback(ResultEnum.Fail);
            }
        });
    }


    /**分享录屏 */
    public ShareVideo(_title: string, templateId: string, _callback: Function) {
        this.platformAdApi && this.platformAdApi.ShareVideo(_title, templateId, _callback);
    }

    /**开始录制视频 */
    public StartRecorder(_duration: number = 300) {
        this.platformAdApi && this.platformAdApi.StartRecorder(_duration);
    }

    /**分段录屏 */
    public recordClipRecorder(data) {
        this.platformAdApi && this.platformAdApi.recordClipRecorder(data);
    }

    /**暂停录屏 */
    public pauseGameVideo() {
        this.platformAdApi && this.platformAdApi.pauseGameVideo();
    }

    /**继续录屏 */
    public resumeGameVideo() {
        this.platformAdApi && this.platformAdApi.resumeGameVideo();
    }
    /**结束录制视频 */
    public stopRecordScreen() {
        this.platformAdApi && this.platformAdApi.stopRecordScreen();
    }

    /**创建更多游戏按钮 */
    public createMoreGamesBtn() {
        this.platformAdApi && this.platformAdApi.createMoreGamesBtn();
    }


    /**展示更多游戏按钮 */
    public showMoreGamesBtn() {
        this.platformAdApi && this.platformAdApi.showMoreGamesBtn();
    }


    /**
     * 跳转游戏
     * @param _packageName 包名
     */
    public jumpToGame(_packageName: string) {
        this.platformAdApi && this.platformAdApi.jumpToGame(_packageName);
    }


    /** 添加彩签*/
    public addColorBookmark(_callback: Function) {
        this.platformAdApi && this.platformAdApi.addColorBookmark(_callback);
    }


    /**订阅app */
    public addSubscribeApp(_callback: Function) {
        this.platformAdApi && this.platformAdApi.addSubscribeApp(_callback);
    }


    public phoneVibrate(isLong) {
        this.platformAdApi && this.platformAdApi.phoneVibrate(isLong);
    }


    /**退出 */
    public exitApplication() {
        switch (AdsIdConfig.platform) {
            case EPlatform.Platform4399:
                gamebox.exitMiniProgram({});
                break;
            case EPlatform.VIVO:
                qg.exitApplication();
                break;
            case EPlatform.OPPO:
                qg.exitApplication({})
                break;
            case EPlatform.HUAWEI:
                qg.exitApplication({});
                break;
            case EPlatform.WX:
                wx.exitMiniProgram({});
                break;
            case EPlatform.KS:
                wx.exitMiniProgram();
                break;
            case EPlatform.TikTok:
                tt.exitMiniProgram({
                    success(res) {
                        console.log("调用成功");
                    },
                    fail(res) {
                        console.log("调用失败");
                    },
                });
                break;
        }
    }

    public transactionId = 9999453654545895165;


    /**
     * 华为上报进入和退出游戏的事件
     * @param type type为true时是进入游戏，false是退出游戏
     */
    public submitPlayerEvent(type: boolean) {
        if (AdsIdConfig.platform == EPlatform.HUAWEI) {
            let eventId = this.transactionId;
            let eventType = 'GAMEBEGIN';
            if (!type) {
                eventType = 'GAMEEND';
            }
            qg.submitPlayerEvent({
                //randomNumStr 是不超过64位的随机数字符串
                eventId: eventId,
                eventType: eventType,
                success: function (res) {
                    if (eventType == 'GAMEBEGIN') {
                        console.log("提交玩家信息成功,transactionId ===> ", res.transactionId);
                        AdManager.getInstance().transactionId = res.transactionId;
                    }
                }.bind(this),
                fail: function (data, code) {
                    console.log("hide float window fail:" + data + ", code:" + code);
                }
            });
        }
    }


    public reportAnalytics(name, value) {
        this.platformAdApi && this.platformAdApi.reportAnalytics(name, value);
    }


    private gameClubBtn;
    /**
     * 显示微信游戏圈,仅微信游戏可用
     */
    public showGameClubBtn() {
        if(AdsIdConfig.platform == EPlatform.WX){
            if (window['wx']) {
                this.gameClubBtn = window['wx'].createGameClubButton({
                    icon: 'light',
                    style: {
                        left: 80,
                        top: 10,
                        width: 50,
                        height: 50
                    },
                })
            }
        }
    }


    public hideGameClubBtn() {
        if (this.gameClubBtn) {
            this.gameClubBtn.hide();
        }
    }

}

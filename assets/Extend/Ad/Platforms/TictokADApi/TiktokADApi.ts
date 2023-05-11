import { _decorator } from "cc";
import AdManager from "../AdManager";
import { PlatformAdApi } from "../PlatformAdApi";
import { MiniSDK } from "../sdk/MiniSDK";

const { ccclass, property } = _decorator;

@ccclass
export default class TiktokADApi implements PlatformAdApi {
    
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
    tt: any = window["tt"];
    /**banner */
    bannerAd: any = null;
    /**系统banner是否加载成功 */
    loadSucc_SystemBanner = false;

    /**插屏 */
    systemIntersAd: any = null;
    /**系统插屏是否加载成功 */
    loadSucc_SystemInters = false;

    /**视频 */
    rewardedVideoAd: any = null;
    /**视频广告是否已经load到数据 */
    loadSucc_Video: boolean = false;
    /**视频广告回调 */
    callback_Video = null;
    /**视频广告是否正在播放 */
    isShow_Video = false;

    /**原生 */
    nativeAd: any = null;
    /**原生load取值 */
    resTemp: any = null;
    /**录屏 */
    recorder: any = null;
    /**录屏video地址 */
    videoPath: any = null;
    /**记录录屏时间 */
    timeCount: number = 0;
    /**录屏时间 */
    recordTime: number = 0;

    templateId: number = 0;

    /**系统信息 */
    systemInfo: any = null;


    /**
 * 最小录屏时间 毫秒
 */
    minRecordTime = 3000;

    /**
     * 最大录屏时间 秒
     */
    maxRecordTime = 290;

    onInit(_callback: Function) {

        if (this.tt !== null && this.tt !== undefined) {
            this.systemInfo = this.tt.getSystemInfoSync();
            // console.log('MINIGAME ===> ', this.systemInfo);

            this.createAd();
        } else {
            this.tt = null;
        }

        _callback && _callback();
        // console.log('MINIGAME ===> toutiao ===================> onInit ok');
    }
    createAd() {
        if (this.SystemBannerData&&this.SystemBannerData.enabled && this.SystemBannerData.vendor_position != "") this.createSystemBanner();
        if (this.SystemIntersData && this.SystemIntersData.enabled && this.SystemIntersData.vendor_position != "") this.createSystemInters();
        if (this.VideoData&&this.VideoData.enabled && this.VideoData.vendor_position != "") this.createVideo();
    }
    setGroup(group) {
    }
    onLogin() {

    }


    onShare(_callback: Function) {

    }


    StartRecorder(_duration: number = 300) {
        // console.log('MINIGAME ===> 开始录屏');
        if (this.tt == null && this.tt == undefined) {
            return;
        }
        this.recorder = this.tt.getGameRecorderManager();
        this.recorder.start({
            duration: _duration
        });
        this.timeCount = Date.parse(new Date().toString());
        this.recordTime = 0;
    }


    public clipIndexList = []; // 剪辑索引列表
    /**录屏选择录的时间 */
    recordClipRecorder(data) {
        if (this.recorder) {
            this.recorder.recordClip({
                timeRange: data,
                success(r) {
                    // console.log('MINIGAME ===> 分享索引', r.index); // 裁剪唯一索引
                    // this.clipIndexList.push(r.index);
                    AdManager.getInstance().platformAdApi.clipIndexList.push(r.index);
                },
            });
        }
    }
    pauseGameVideo() {
        // console.log("MINIGAME ===> ", "Tiktok 暂停录屏==================");
        this.recorder && this.recorder.pause();
    }
    resumeGameVideo() {
        // console.log("MINIGAME ===> ", "Tiktok 继续录屏==================");
        this.recorder && this.recorder.resume();
    }


    /**
    * 
    * @param _duration 录屏停止时从后往前截取多少秒 
    */
    public stopRecordScreen(_duration: number = 299) {
        // console.log('MINIGAME ===> 结束录屏', this.clipIndexList);

        let temp = Date.parse(new Date().toString());
        this.recordTime = temp - this.timeCount - 2000;

        if (this.tt == null && this.tt == undefined) {
            return;
        }
        let record = (this.recordTime / 1000);
        if (record > this.maxRecordTime) {
            record = this.maxRecordTime;
        }
        this.recordClipRecorder([record, 0]);

        // this.recordClipRecorder([30, 0]);
        this.recorder.onStop(res => {

            this.recorder.clipVideo({
                path: res.videoPath,
                timeRange: this.clipIndexList,
                success(res) {
                    // console.log('MINIGAME ===>', res.videoPath);
                    AdManager.getInstance().platformAdApi.videoPath = res.videoPath;
                },
                fail(e) {
                    console.error(e);
                }
            });
            // console.log('MINIGAME ===> 结束录屏-录屏地址：' + res.videoPath);
        });
        this.recorder.stop();
    }

    
    ShareVideo(_title: string, templateId: string, _callback: Function) {
        if (this.recordTime < this.minRecordTime) {
            MiniSDK.showToast("录屏小于3s,无法分享");
            return;
        }
        if (this.tt != null && this.tt != undefined) {
            // console.log("MINIGAME ===> tt平台 调用分享");
            this.tt.shareAppMessage({
                channel: "video",
                templateId: templateId,
                title: _title,
                desc: _title,
                extra: {
                    videoPath: this.videoPath, // 可用录屏得到的视频地址
                    videoTopics: [_title, '小游戏'],
                    video_title: "",
                },
                success: () => {
                    _callback && _callback('1');
                },
                fail: (res) => {
                    _callback && _callback(res.errMsg);
                }
            });
        }
    }

    createSystemBanner() {
        if (this.tt !== null && this.tt !== undefined) {
            this.loadSucc_SystemBanner = false;
            // console.log("MINIGAME ===> toutiao平台 创建横幅广告", this.SystemBannerData.vendor_position);
            this.bannerAd = this.tt.createBannerAd({
                adUnitId: this.SystemBannerData.vendor_position,
                style: {
                    width: this.systemInfo.screenWidth,
                    top: this.systemInfo.windowHeight - (this.systemInfo.screenWidth / 16) * 9, // 根据系统约定尺寸计算出广告高度
                }
            });

            // 尺寸调整时会触发回调，通过回调拿到的广告真实宽高再进行定位适配处理
            // 注意：如果在回调里再次调整尺寸，要确保不要触发死循环！！！
            this.bannerAd.onResize((size) => {
                this.bannerAd.style.top = this.systemInfo.windowHeight - size.height;
                this.bannerAd.style.left = (this.systemInfo.windowWidth - size.width) / 2;
            });

            this.bannerAd.onError((err)=>{
                console.log("banner onError:"+JSON.stringify(err));
            })

            this.bannerAd.onLoad(() => {
                this.loadSucc_SystemBanner = true;
            });
        } else {
            console.log('MINIGAME ===> this.tt == null');
        }
    }
    /**
     * 展示系统banner
     */
    showSystemBanner() {
        if (this.bannerAd) {
            // console.log("MINIGAME ===> ", "Tiktok showSystemBanner========================");
            this.bannerAd.show();
        }
    }
    /**
     * 隐藏系统banner
     */
    hideSystemBanner() {
        if (this.bannerAd) {
            // console.log("MINIGAME ===> ", "Tiktok hideSystemBanner========================");
            this.bannerAd.hide();
        }
    }
    hideBanner() {
        if (this.bannerAd) {
            this.hideSystemBanner();
        }
    }
    showBanner() {
        if (this.bannerAd) {
            this.showSystemBanner();
        }
    }
    createVideo() {
        if (this.tt !== null && this.tt !== undefined) {
            /**创建rewardedVideoAd 对象*/
            // console.log("MINIGAME ===> toutiao平台 创建激励视频广告", this.VideoData.vendor_position);
            this.rewardedVideoAd = this.tt.createRewardedVideoAd({
                adUnitId: this.VideoData.vendor_position,
            });
            this.rewardedVideoAd.onLoad(() => {
                // console.log("MINIGAME ===> 激励视频广告 加载成功");
                this.loadSucc_Video = true;
            });
            this.rewardedVideoAd.onError((err) => {
                console.log('MINIGAME ===>  激励视频 加载失败:code =====>:' + err.code + "message ======>:" + JSON.stringify(err));
                this.loadSucc_Video = false;
                setTimeout(() => {
                    this.rewardedVideoAd && this.rewardedVideoAd.load();
                }, 10 * 1000)
            });
            //监听视频广告播放完成
            this.rewardedVideoAd.onClose(res => {
                setTimeout(() => {
                    if (res.isEnded) {
                        // console.log("MINIGAME ===> ", "Tiktok 激励视频广告完成，发放奖励");
                        if (this.callback_Video) {
                            this.callback_Video(true);
                            this.loadSucc_Video = false;
                            this.rewardedVideoAd.load();
                        }
                    } else {
                        // console.log("MINIGAME ===> ", "Tiktok 激励视频广告取消，不发放奖励");
                        if (this.callback_Video) {
                            this.callback_Video(false)
                            this.loadSucc_Video = false;
                            this.rewardedVideoAd.load();
                        }
                    }
                    this.isShow_Video = false;
                }, 300);
            })
            this.rewardedVideoAd.load();
        }
    }
    showVideo(_successCallback?: Function) {
        /**确保video正常创建并已经拉取到数据 */
        if (this.rewardedVideoAd && this.loadSucc_Video) {
            if (this.isShow_Video) {
                console.log("MINIGAME ===> ", "视频正在播放中,请勿多次点击！");
                return;
            }
            this.isShow_Video = true;
            this.callback_Video = _successCallback;
            this.rewardedVideoAd.show()
                .then(() => {
                    // console.log("MINIGAME ===> ", "Tiktok 激励视频广告显示成功");
                })
                .catch(err => {
                    console.log("MINIGAME ===> ", "Tiktok 激励视频广告组件出现问题", JSON.stringify(err));
                    // 可以手动加载一次
                    this.rewardedVideoAd.load().then(() => {
                        // console.log("MINIGAME ===> ", "Tiktok 激励视频广告手动加载成功");
                        // 加载成功后需要再显示广告
                        this.rewardedVideoAd.show().catch(err => {
                            console.log("MINIGAME ===> ", "Tiktok 激励视频广告播放失败", JSON.stringify(err));
                            this.isShow_Video = false;
                            this.callback_Video(false);
                        });
                    });
                });
        } else {
            /**没有成功创建广告或者没有成功load广告 就重新创建一个 */
            // TipsManager.Instance().create("广告还未准备好,请稍后再试");
            this.isShow_Video = false;
            _successCallback(false);
        }
    }
    showVideoAward() {

    }
    showVideoFail() {

    }
    createSystemInters() {
        if (this.tt != null && this.tt != undefined) {
            // console.log('MINIGAME ===> 创建插屏', this.SystemIntersData.vendor_position);

            this.systemIntersAd = this.tt.createInterstitialAd({
                adUnitId: this.SystemIntersData.vendor_position,
            });
            this.systemIntersAd.onError((res) => {
                // console.log('MINIGAME ===> toutiao InsertAd load Error:' + JSON.stringify(res));
                if (this.systemIntersAd) {
                    setTimeout(() => {
                        this.systemIntersAd && this.systemIntersAd.load()
                    }, 10 * 1000);
                }
                AdManager.getInstance().showBanner();
            });
            this.systemIntersAd.onLoad(() => {
                // console.log("MINIGAME ===>插屏加载完成");
                this.loadSucc_SystemInters = true;
            });
            //监听插屏广告关闭
            this.systemIntersAd.onClose(() => {
                //TODO:在此添加了关闭插屏后在负一屏展示banner的功能，原先的banner没有关闭
                // console.log("MINIGAME ===> ", "Tiktok 关闭插屏,重新创建插屏广告");

                setTimeout(() => {
                    this.systemIntersAd && this.systemIntersAd.load()
                }, 2 * 1000);
                this.loadSucc_SystemInters = false;
                AdManager.getInstance().showBanner();
            });

            //加载一次
            this.systemIntersAd.load();
        }
    }
    showInsertAd() {
        if (this.tt != null && this.tt != undefined) {
            if (this.systemIntersAd && this.loadSucc_SystemInters) {
                // console.log("MINIGAME ===> ", "Tiktok showSystemInters========================");
                this.systemIntersAd.show();
            }
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
    reportNativeBannerShow(adId) {
    }
    reportNativeBannerClick(adId) {
    }
    getNativeAdInfo(type) {
        return null;
    }
    getHWNativeAdInfo(_infoCallback?: Function) { }
    reportNativeImageShow(type) {
    }
    reportNativeImageClick(type) {
    }
    loadNativeImage() { }

    /**原生icon广告获取 */
    getNativeIconAdInfo(type) { }
    reportNativeIconShow(adId) { }
    reportNativeIconClick(adId) { }
    loadNativeIcon() { }

    /**创建格子广告组件 */
    createGridAd(adIdKey: string, openIdKey?: string) {
    }
    saveDataToCache(_key: string, _value: any) {
    }
    readDataFromCache(_key: string) {
    }

    showNavigateBoxPortal() { }
    showNavigateBoxBanner() { }
    hideNavigateBoxBanner() { }

    addDesktop(_callback: Function) {
        this.tt.addShortcut({
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
        if (this.tt != null && this.tt != undefined) {
            this.tt.checkShortcut({
                success: function (res) {
                    if (!res.status.exist || res.status.needUpdate) {
                        console.log("MINIGAME ===> ", "checkShortcut res:", JSON.stringify(res));
                        console.log("MINIGAME ===> ", "Tiktok 未创建桌面图标或图标需要更新");
                        _callback(true);
                    } else {
                        console.log("MINIGAME ===> ", "Tiktok 已创建桌面图标");
                        _callback(false);
                    }
                },
                fail: function (res) {
                    console.log("MINIGAME ===> ", "Tiktok 添加桌面图标失败：", JSON.stringify(res.errMsg));
                    _callback(false);
                }
            })
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

    phoneVibrate(isLong) {
        if (this.tt != null && this.tt != undefined) {
            if (isLong) {
                this.tt.vibrateLong && this.tt.vibrateLong();
            } else {
                this.tt.vibrateShort && this.tt.vibrateShort();
            }
        }
    }
    reportAnalytics(name, value) {
        if (this.tt != null && this.tt != undefined)
            this.tt.reportAnalytics(name, value)
    }


    hideCustomAd() {
    }
    showGridAd() {
    }
    hideGridAd() {
    }
    showCustomAd() {
        // throw new Error("Method not implemented.");
    }
    showCustomAdWithInsert() {
        // throw new Error("Method not implemented.");
    }
    showNativeBanner() {
        
    }
}

export interface PlatformAdApi {

    SystemBannerData;
    SystemIntersData;
    VideoData;
    NativeBannerData;
    NativeIntersData;
    NativeIconData;//
    JGGBoxData;//九宫格
    BlockData;//互推banner
    AdCustomIntersData;//模板插屏原生

    /**初始化 */
    onInit(_callback: Function);
    /**广告分组 */
    setGroup(group);
    /**登录*/
    onLogin(_callback?: Function);
    /**分享游戏链接 */
    onShare(_callback: Function);
    /**分享录屏 */
    ShareVideo(_title: string, templateId: string, _callback: Function);
    clipIndexList;
    videoPath;
    recordClipRecorder(data);
    pauseGameVideo();
    resumeGameVideo();
    /**展示banner */
    showBanner();
    /**隐藏banner(模板/自渲染banner+普通banner)，目前只有ov有轮播 */
    hideBanner();

    /**隐藏普通banner */
    hideSystemBanner();

    /**
     * @param _successCallback 成功回调
     */
    /**展示激励视频 */
    showVideo(_successCallback?: Function);

    /**展示插屏 */
    showInsertAd();

    /**展示原生大图 */
    getNativeAdInfo(type);
    /**华为展示原生大图 */
    getHWNativeAdInfo(_infoCallback?: Function);
    /**原生大图 被点击 */
    reportNativeImageClick(id);
    /**原生大图 展示 */
    reportNativeImageShow(id);
    /**刷新原生大图广告 */
    loadNativeImage();

    /**展示原生icon */
    getNativeIconAdInfo(type);
    /**原生icon被点击 */
    reportNativeIconClick(_id: string);
    /**原生icon展示 */
    reportNativeIconShow(_id: string);
    /**刷新原生icon广告 */
    loadNativeIcon();

    /**互推盒子九宫格广告 */
    showNavigateBoxPortal();
    /**互推盒子横幅广告 */
    showNavigateBoxBanner();
    /**关闭互推盒子横幅广告 */
    hideNavigateBoxBanner();

    /**添加icon到桌面 */
    addDesktop(_callback: Function);
    /**是否已经创建桌面图标 */
    hasShortcutInstalled(_callback: Function);
    /**开始录制视频 */
    StartRecorder(_duration);
    /**结束录制视频 */
    stopRecordScreen();
    /**创建更多游戏按钮 */
    createMoreGamesBtn();
    /**展示更多游戏按钮 */
    showMoreGamesBtn();
    /**
     * 跳转游戏
     * @param _packageName 包名
     */
    jumpToGame(_packageName: string);
    /** 添加彩签*/
    addColorBookmark(_callback: Function);
    /**订阅app */
    addSubscribeApp(_callback: Function);
    /**震动 */
    phoneVibrate(isLong);
    /**数据上报 */
    reportAnalytics(name: string, value: number | object);

    showCustomAd();
    hideCustomAd();

    showGridAd();
    hideGridAd();

    /**兜底*/
    showCustomAdWithInsert();

    /**信息流banner(vivo特有) */
    showNativeBanner();
}
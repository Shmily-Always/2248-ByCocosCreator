
import { _decorator, Component, Node, sys } from 'cc';
import AdManager from '../AdManager';
import AdsIdConfig, { EPlatform } from '../AdsIdConfig';
const { ccclass, property } = _decorator;

export enum SDKPlatForm {
    Wechat,
    ByteBance,
    QQ,
    OV,
}

@ccclass('MiniSDK')
export class MiniSDK {

    public static SDKPlatForm;
    public static Init(platform: SDKPlatForm) {
        MiniSDK.SDKPlatForm = platform;
    }

    /**
     * 获取网络类型.
     * Object object
     * success	Function	否	成功回调
     * fail	Function	    否	失败回调，可能是因为缺乏权限
     * complete	Function	否	执行结束后的回调
     * 
     * success回调参数： Object data
     * metered	Boolean	是否按照流量计费
     * type	String	网络类型，可能的值为2g，3g，4g，wifi，none
     * @param callback 带boolean类型参数的回调
     */
    public static getNetworkType(callback: any) {
        // if (sys.platform == sys.Platform.VIVO_MINI_GAME || sys.platform == sys.Platform.OPPO_MINI_GAME) {
        let currentPlat = AdManager.getInstance().platform;
        if (currentPlat == EPlatform.VIVO || currentPlat == EPlatform.OPPO) {
            window["qg"]?.getNetworkType({
                success: function (res) {
                    // if (sys.platform === sys.Platform.VIVO_MINI_GAME) {
                    if (currentPlat == EPlatform.VIVO) {
                        // console.log("MINIGAME ===> vivo network getNetworkType type:", res.type);
                        if (res.type != 'none') {
                            if (callback) callback(true);
                        }
                        else {
                            console.log('MINIGAME ===> vivo 无网络连接');
                            if (callback) callback(false);
                        }
                    }
                    // else if (sys.platform === sys.Platform.OPPO_MINI_GAME) {
                    else if (currentPlat == EPlatform.OPPO) {
                        console.log("MINIGAME ===> oppo network getNetworkType type:", res.networkType);
                        if (res.networkType != 'none') {
                            if (callback) callback(true);
                        }
                        else {
                            if (callback) callback(false);
                        }
                    } 
                    // else if (sys.platform === sys.Platform.HUAWEI_QUICK_GAME) {
                    else if (currentPlat == EPlatform.HUAWEI) {
                        console.log("MINIGAME ===> getNetworkType success networkType   " + res.networkType);
                        if (res.networkType != 'none') {
                            if (callback) callback(true);
                        }
                        else {
                            if (callback) callback(false);
                        }
                    }

                },
                fail: function (res) {
                    if (callback) callback(false);
                    console.log("MINIGAME ===> network getNetworkType   ", res.errMsg);
                },
                complete: function (res) { }
            })
        } 
        // else if (sys.platform == sys.Platform.HUAWEI_QUICK_GAME) {
        else if (currentPlat == EPlatform.HUAWEI) {
            window["hbs"]?.getNetworkType({
                success: function (res) {
                    console.log("MINIGAME ===> getNetworkType success networkType   " + res.networkType);
                    if (res.networkType != 'none') {
                        if (callback) callback(true);
                    }
                    else {
                        if (callback) callback(false);
                    }
                },
                fail: function (res) {
                    if (callback) callback(false);
                    console.log("MINIGAME ===> network getNetworkType   ", res.errMsg);
                },
                complete: function (res) { }
            })
        }
        else {
            if (callback) callback(true);
        }
    }

    /**
     * 监听网络连接状态。如果多次调用，仅最后一次调用生效（vivo）
     * 监听网络状态变化事件（oppo）
     * @param callback  带boolean类型参数的回调
     */
    public static subscribeNetworkStatus(callback: any) {
        let currentPlat = AdManager.getInstance().platform;

        // if (sys.platform === sys.Platform.VIVO_MINI_GAME) {
        if (currentPlat === EPlatform.VIVO) {
            window["qg"]?.subscribeNetworkStatus({
                callback: function (data) {
                    console.log('MINIGAME ===> vivo network status ,type:', data.type);
                    if (data.type != 'none') {
                        if (callback) callback(true);
                    }
                    else {
                        if (callback) callback(false);
                    }
                }
            })
        }
        // else if (sys.platform === sys.Platform.OPPO_MINI_GAME) {
        else if (currentPlat === EPlatform.OPPO) {
            window["qg"]?.onNetworkStatusChange(function (res) {
                console.log('MINIGAME ===> oppo network status ,isConnected:', res.isConnected, ',networkType:', res.netWorkType);
                if (res.isConnected) {
                    if (res.netWorkType != 'none') {
                        if (callback) callback(true);

                    }
                    else {
                        if (callback) callback(false);
                    }
                }
                else {
                    if (callback) callback(false);
                }
            })
        } 
        // else if (sys.platform === sys.Platform.HUAWEI_QUICK_GAME) {
        else if (currentPlat === EPlatform.HUAWEI) {
            hbs.onNetworkStatusChange(function (res) {
                console.log("MINIGAME ===> onNetworkStatusChange isConnected = " + res.isConnected + ", networkType = " + res.networkType);
                if (res.isConnected) {
                    if (res.netWorkType != 'none') {
                        if (callback) callback(true);

                    }
                    else {
                        if (callback) callback(false);
                    }
                }
                else {
                    if (callback) callback(false);
                }
            }
            )
        }
        else {
            if (callback) callback(true);
        }

    }

    /**
     * 显示对话框
     * 
     */
    public static showDialog(dialogData: any) {
        let currentPlat = AdManager.getInstance().platform;

        // if (sys.platform === sys.Platform.VIVO_MINI_GAME) {
        if (currentPlat === EPlatform.VIVO) {
            let dialogPanel: DialogPanel = new DialogPanel();
            dialogPanel.title = dialogData._title;
            dialogPanel.message = dialogData._msg;
            let btn: DailogButton = new DailogButton();
            btn.text = '确定';
            /* let btn2: DailogButton = new DailogButton();
            btn2.text = '取消';
            let btn3: DailogButton = new DailogButton();
            btn3.text = '按钮3'; */
            dialogPanel.buttons.push(btn);
            //dialogPanel.buttons.push(btn2);
            //dialogPanel.buttons.push(btn3);
            dialogPanel.success = (data) => {
                console.log('MINIGAME ===> dialog 成功回调：', data.index);
                if (data.index == 0) {
                    //第一个按钮的回调
                    dialogData.callback1();
                }
                else if (data.index == 1) {
                    //第二个按钮的回调
                    if (dialogData.callback2) dialogData.callback2();
                }
                else if (data.index == 2) {
                    //第三个按钮的回调
                    if (dialogData.callback3) dialogData.callback3();
                }
            };
            dialogPanel.cancel = () => {
                console.log('MINIGAME ===> dialog 取消回调：');
            };
            dialogPanel.fail = (data, code) => {
                console.log('MINIGAME ===> dialog 失败回调：', data, ',====code', code);
            };
            if (sys.platform === sys.Platform.VIVO_MINI_GAME)
                qg.showDialog(dialogPanel);
        } 
        // else if (sys.platform == sys.Platform.OPPO_MINI_GAME) {
        else if (currentPlat === EPlatform.OPPO) {
            qg.showModal({
                title: dialogData._title,
                content: dialogData._msg,
                success(res) {
                    if (res.confirm) {
                        console.log('MINIGAME ===> 用户点击确定');
                        if (dialogData.callback1) dialogData.callback1();
                    } else if (res.cancel) {
                        console.log('MINIGAME ===> 用户点击取消');
                        if (dialogData.callback2) dialogData.callback2();
                    }
                }
            })
        } 
        // else if (sys.platform == sys.Platform.HUAWEI_QUICK_GAME) {
        else if (currentPlat === EPlatform.HUAWEI) {
            if (dialogData.showCancel == '' || dialogData.showCancel == null) {
                dialogData.showCancel = true;
            }
            qg.showModal({
                title: dialogData._title,
                content: dialogData._msg,
                showCancel: dialogData.showCancel,
                cancelText: dialogData.cancelText || '取消',
                confirmText: dialogData.confirmText || '确定',
                confirmColor: dialogData.confirmColor || '#576B95',
                success(res) {
                    if (res) {
                        console.log('MINIGAME ===> 用户点击确定');
                        if (dialogData.callback1) dialogData.callback1();
                    } else{
                        console.log('MINIGAME ===> 用户点击取消');
                        if (dialogData.callback2) dialogData.callback2();
                    }
                }
            })
        } else {
            console.log('MINIGAME ===> other platform show dialog');
        }
    }

    /**
     * 显示弹窗
     * @param _msg 要显示的文本
     * @param _duration vivo:0为短时，1为长时，默认0.Oppo:提示的延迟时间，默认为1500
     */
    public static showToast(_msg: string, _duration: number=2000) {
        let currentPlat = AdManager.getInstance().platform;

        // if (sys.platform == sys.Platform.VIVO_MINI_GAME) {
        if (currentPlat === EPlatform.VIVO) {
            qg.showToast({
                message: _msg,
                duration: _duration
            })
        } 
        // else if (sys.platform == sys.Platform.OPPO_MINI_GAME) {
        else if (currentPlat === EPlatform.OPPO) {
            qg.showToast({
                title: _msg,
                icon: 'success',
                duration: _duration
            })
        } 
        // else if (sys.platform == sys.Platform.HUAWEI_QUICK_GAME) {
        else if (currentPlat === EPlatform.HUAWEI) {
            qg.showToast({
                title: _msg,
                icon: 'success',
                duration: _duration
            })
        }else if(currentPlat === EPlatform.TikTok){
            window["tt"].showToast({
                title: _msg,
                duration: _duration,
            });
        }

    }

    /**
     * 游戏切后台切换监听
     * @param callback 
     */
    public static onApplication(callback: OnApplication) {
        let currentPlat = AdManager.getInstance().platform;
        // if (sys.platform === sys.Platform.VIVO_MINI_GAME) {
        if (currentPlat === EPlatform.VIVO) {
            qg.onShow(() => {
                console.log('MINIGAME ===> vivo game enter foreground');
                if (callback) callback(true);
            });

            qg.onHide(() => {
                console.log('MINIGAME ===> vivo game enter background');
                if (callback) callback(false);
            });
        }

    }

    /**
     * 退出游戏
     */
    public static exitApplication() {
        if (AdsIdConfig.platform == EPlatform.VIVO) {
            qg.exitApplication();
        } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            qg.exitApplication({})
        } else if (AdsIdConfig.platform == EPlatform.HUAWEI) {
            qg.exitApplication({});
        }

    }
}


/** 监听游戏切入前台的接口委托 */
export interface OnApplication {
    /** 委托方法 */
    (result: boolean): void
}

/** 委托接口，不带参数的回调方法 */
export interface funVoid {
    /** 不带参数的回调方法 */
    (): void
}

/** 委托接口，带参数的回调方法 
 * data.index==0: 点击了第一个按钮
 * data.index==1: 点击了第二个按钮
 * data.index==2: 点击了第三个按钮
*/
export interface funParam {
    /** 带参数回调方法 */
    (data): void
}

/** 委托接口，带两个参数的回调方法 */
export interface funParams {
    /** 带两个参数的回调方法 */
    (data, code): void
}



export class DialogPanel {
    /** 标题 */
    title: string = 'title';
    /** 信息内容 */
    message: string = 'message';
    /** 按钮组 */
    buttons: DailogButton[] = [];
    /** 成功的回调,点击任何按钮都会触发该回调 */
    success: funParam;
    /** 取消的回调 */
    cancel: funVoid;
    /** 失败的回调 */
    fail: funParams;
}

export class DailogButton {
    /** 按钮标签文字 */
    text: string = '按钮';
    /** 按钮背景颜色 */
    color: string = '#33dd44';
}

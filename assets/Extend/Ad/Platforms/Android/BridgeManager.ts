/**
 * 
 * BridgeManager
 * Describe: 
 * Tue Dec 13 2022 12:08:59 GMT+0800 (中国标准时间)
 * BridgeManager.ts
 * db://assets/Scripts/FrameWork/Bridge/BridgeManager.ts
 * https://docs.cocos.com/creator/3.6/manual/zh/
 *
 */

import { game, sys } from "cc";


export class BridgeManager {
    private static _instance: BridgeManager;
    public static Instance() {
        if (!this._instance) {
            this._instance = new this;
        }
        return this._instance;
    }

    //是否debug模式
    private isDebugMode = false;

    private rewardSuccessFunc?: Function;
    private rewardFailFunc?: Function;

    private readonly androidJavaClass: string = "com/google/android/gms/Docking";

    public SetDebugMode(isDebugMode: boolean) {
        this.isDebugMode = isDebugMode;
    }


    /**
     * 调用java静态方法,注意引擎版本
     * @param funcName 方法名
     * @param engineVerEM36 引擎版本,引擎版本小于3.6要设置为false
     * @returns 
     */
    public CallJavaFunc(funcName: string, engineVerEM36: boolean = true) {
        // console.log("CallJavaFunc: "+funcName);
        if (this.isDebugMode) {
            return;
        }
        if (engineVerEM36) {
            //cocoscreator 3.6及以上版本用native.
            native.reflection.callStaticMethod(this.androidJavaClass, funcName, "()V");
        }
        else {
            //cocos creator 3.6以下版本是jsb
            jsb.reflection.callStaticMethod(this.androidJavaClass, funcName, "()V");
        }
    }


    /**
     * 调用激励视频
     * @param successFunc 成功回调
     * @param failFunc 失败回调
     */
    public ShowRewardVideo(successFunc: Function, failFunc?: Function) {
        this.rewardSuccessFunc = successFunc;
        this.rewardFailFunc = failFunc;
        this.CallJavaFunc("ShowRewardVideo");
        if (this.isDebugMode) {
            this.rewardSuccessFunc();
        }
    }


    /**
     * java回调ts
     * @param msg 
     */
    public JavaCallBackFunc(msg: string) {
        // console.log("java回调js: "+msg);
        if (msg == "RewardSuccess") {
            if (this.rewardSuccessFunc) {
                this.rewardSuccessFunc();
            }
        } else if (msg == "RewardFail") {
            if (this.rewardFailFunc) {
                this.rewardFailFunc();
            }
        }
    }
}


//Andriod回调类似以下，回调此脚本的JavaCallBackFunc方法,参数为msg
//CocosJavascriptJavaBridge.evalString("window.BridgeManager.JavaCallBackFunc('RewardSuccess')");
window["BridgeManager"] = BridgeManager.Instance();

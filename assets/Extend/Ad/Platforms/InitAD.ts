
import { _decorator, Component, Node, Enum, sys, game, director } from 'cc';
import { AdLogUtil } from '../Util/AdLogUtil';
import AdManager from './AdManager';
import AdsIdConfig, { EPlatform } from './AdsIdConfig';
import { MiniSDK } from './sdk/MiniSDK';
const { ccclass, property } = _decorator;

@ccclass('InitAD')
export class InitAD extends Component {

    /**
     * 当前平台
     */
    @property({
        type: Enum(EPlatform)
    })
    private platfrom = EPlatform.Close;

    @property(Node)
    private startNode: Node = null!;

    private static isInitAd =false;

    onLoad() {
        if(this.platfrom==EPlatform.Close){
            return;
        }
        AdsIdConfig.platform = this.platfrom;
        let is = localStorage.getItem('akPrivacy');
        if(is == null || is === ''){
            return;
        }
        this.StartInitAd();
    }


    onEnable(){
        director.on("AccetPrivacy",this.StartInitAd,this);
        director.on("loadMainMenu",this.loadScene,this);
        // EventCenter.Instance.AddEventListener("AccetPrivacy",this.StartInitAd,this);
    }

    
    onDisable(){
        director.off("AccetPrivacy",this.StartInitAd,this);
        director.off("loadMainMenu",this.loadScene,this);
        // EventCenter.Instance.RemoveEventListener("AccetPrivacy",this.StartInitAd,this);
    }


    private loadScene(){
        director.loadScene("MainMenu");
    }
    private StartInitAd(){
        AdLogUtil.Log("StartInitAd");
        if(this.platfrom==EPlatform.Close){
            return;
        }
        if(InitAD.isInitAd){
            return;
        }
        InitAD.isInitAd=true;
        AdsIdConfig.platform = this.platfrom;
        AdManager.getInstance().platform = this.platfrom;
        this.scheduleOnce(() => {
            if (this.platfrom != EPlatform.Close) {
                MiniSDK.getNetworkType((result: any) => {
                    if (result) {
                        AdManager.getInstance().onInit(this.GoLoadView.bind(this));
                    }
                    else {
                        MiniSDK.showDialog({
                            _title: '提示', _msg: '无网络，请退出游戏重启网络', callback1: function () {
                                MiniSDK.exitApplication();
                            }.bind(this)
                        });
                    }
                });
            } else {
                // console.log("on init : ",this.platfrom);
                AdManager.getInstance().onInit(this.GoLoadView.bind(this));
            }
        }, 0.1);
    }


    private GoLoadView() {
        AdManager.getInstance().setGroup(33554432);
        if (AdsIdConfig.platform == EPlatform.Platform4399) {
            AdLogUtil.Log("go load 4399");
            this.Box4399Login();
            return;
        }
        if (AdsIdConfig.platform == EPlatform.HUAWEI) {
            AdLogUtil.Log("go load huawei");
            this.HUAWEILogin();
            return;
        }
        if(this.startNode){
            this.startNode.active = false;
        }
    }


    Box4399Login() {
        AdLogUtil.Log("Box4399 Login");
        AdManager.getInstance().onLogin(this.Box4399LoginCallBack.bind(this))
    }


    private Box4399LoginCallBack(res: number){
        console.log("登录回调",res);
    }

    HUAWEILogin() {
        AdLogUtil.Log("HUAWEILogin");
        director.pause();
        AdManager.getInstance().onLogin(this.HuaweiLoginCallBack.bind(this))
    }


    private HuaweiLoginCallBack(res: number){
        AdLogUtil.Log("Huawei login result:"+res);
        if (res == 1) {
            this.startNode.active = false;
            console.log("登录华为成功，继续游戏");
        } else if (res == 2) {
            AdLogUtil.Log("玩家取消登录");
            MiniSDK.showDialog({
                _title: '提示', 
                _msg: '登录失败，是否重新登录？', 
                cancelText: '退出游戏', 
                confirmText: '重新登录', 
                confirmColor: '#1C008A', 
                callback1: function () {
                    this.HUAWEILogin();
                }.bind(this), 
                callback2: function () {
                    MiniSDK.exitApplication();
                }
            });
        } else if (res == 3) {
            MiniSDK.showDialog({
                _title: '提示', 
                _msg: '实名认证后可进入游戏!', 
                cancelText: '退出游戏', 
                confirmText: '实名验证', 
                showCancel: true, 
                callback1: function () {
                    this.HUAWEILogin();
                }.bind(this), 
                callback2: function () {
                    MiniSDK.exitApplication();
                }.bind(this)
            });
        }
    }


    public XiaoMiLogin(){
        AdLogUtil.Log("XiaoMiLogin");
        AdManager.getInstance().onLogin((res: number) => {
            if (res == 1) {
                this.startNode.active = false;
            } else if (res == 2) {
                console.log("玩家取消登录")
                MiniSDK.showDialog({
                    _title: '提示', _msg: '登录失败，是否重新登录？', cancelText: '退出游戏', confirmText: '重新登录', confirmColor: '#1C008A', callback1: function () {
                        this.XiaoMiLogin();
                    }.bind(this), callback2: function () {
                        MiniSDK.exitApplication();
                    }
                });
            } else if (res == 3) {
                MiniSDK.showDialog({
                    _title: '提示', _msg: '取消实名认证', confirmText: '退出游戏', showCancel: false, callback1: function () {
                        MiniSDK.exitApplication();
                    }.bind(this)
                });
            }
        })
    }

}


import { _decorator, Component, Node, sys, native } from 'cc';
import { NATIVE } from 'cc/env';
import AdsIdConfig, { EPlatform } from '../../Extend/Ad/Platforms/AdsIdConfig';
import { AdIconInfo } from '../../Extend/Ad/Platforms/ui/AdIconInfo';
const { ccclass, property } = _decorator;

@ccclass('VibrateManager')
export class VibrateManager {
    isOpenVibrate:boolean=true;
    
    setIsOpenVibrate(bool:boolean){
        this.isOpenVibrate=bool;
    }

    vibrate(){
        if(!this.isOpenVibrate || NATIVE){
            return;
        }
        // if(sys.platform===sys.Platform.IOS || sys.platform===sys.Platform.ANDROID){  //TODO:安卓原生，先放一个在这里
        //     native.reflection.callStaticMethod("com/cocos/Project2048","vibrate","(F)V",duration);
        // }else if(AdsIdConfig.platform==EPlatform.TikTok){
        if(AdsIdConfig.platform==EPlatform.TikTok){
            tt.vibrateShort();
        }else if(AdsIdConfig.platform==EPlatform.VIVO){
            qg.vibrateShort();
        }else if(AdsIdConfig.platform==EPlatform.WX){
            wx.vibrateShort();
        }else if(AdsIdConfig.platform==EPlatform.Platform4399){
            gamebox.vibrateShort();
        }else if(AdsIdConfig.platform==EPlatform.OPPO){
            qg.vibrateShort({
                type:"light",
                // success:function(res){
                    
                // }
            });
        }
        else{ 
            console.log("震动，不在移动设备上");
        }
    }
}

var vibrateManager=null;
export var getVibrateManagerInstance=function(){
    if(!vibrateManager){
        vibrateManager=new VibrateManager();
    }
    return vibrateManager;
}



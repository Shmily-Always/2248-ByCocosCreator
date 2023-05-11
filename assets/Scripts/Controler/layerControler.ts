import { _decorator, Component, Node, Vec3, find, UIOpacity } from 'cc';
import { GameMain } from '../GameMain';
import AdManager from '../../Extend/Ad/Platforms/AdManager';
import AdsIdConfig, { EPlatform } from '../../Extend/Ad/Platforms/AdsIdConfig';
const { ccclass, property } = _decorator;

@ccclass('layerControler')
export class layerControler extends Component {

    /** 能否展示layer */
    isShowLayer(){
        if(this.node.position.strictEquals(new Vec3(0,0,0))){
            return true;
        }else{
            return false;
        }
    }

    /** 展示layer */
    showLayer(){
        //无法在此添加广告，因为有些界面不需要展示
        //延后更新，把layerControler传入layer名字进行控制
        let mainNode=find("Canvas/GameMain");
        if(mainNode){
            // if (AdsIdConfig.platform == EPlatform.TikTok) {
            //     AdManager.getInstance().showInsertAd();
            // } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            //     AdManager.getInstance().showCustomAdWithInsert();
            // } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            //     AdManager.getInstance().showCustomAd();
            // } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            //     AdManager.getInstance().showInsertAd();
            // }
            //GameMain逻辑
            let controlMainNode=mainNode.getComponent(GameMain);
            if(controlMainNode.isShowCombo){
                this.scheduleOnce(()=>{
                    this.node.setPosition(0,0);
                    this.node.getComponent(UIOpacity).opacity=255;
                },1);
            }else{
                    this.node.setPosition(0,0);
                    this.node.getComponent(UIOpacity).opacity=255;
            }
        }else{
            //MainMenu逻辑
            // if (AdsIdConfig.platform == EPlatform.TikTok) {
            //     AdManager.getInstance().showInsertAd();
            //     AdManager.getInstance().hideBanner();
            // } else if (AdsIdConfig.platform == EPlatform.VIVO) {
            //     AdManager.getInstance().hideSystemBanner();
            //     AdManager.getInstance().showCustomAdWithInsert();
            // } else if (AdsIdConfig.platform == EPlatform.OPPO) {
            //     AdManager.getInstance().showCustomAd();
            // } else if (AdsIdConfig.platform == EPlatform.Platform4399) {
            //     AdManager.getInstance().showInsertAd();
            // }
            this.node.setPosition(0,0);
            this.node.getComponent(UIOpacity).opacity=255;
        }
        
    }

    onClickCloseButton(){
        let mainNode=find("Canvas/GameMain");
        if(mainNode && mainNode.getComponent(GameMain).isShowCombo){
            // let controlMainNode=mainNode.getComponent(GameMain);
            mainNode.getComponent(GameMain).isShowCombo=false;
        }
        this.node.setPosition(800,0);
        this.node.getComponent(UIOpacity).opacity=0;
        if(AdsIdConfig.platform==EPlatform.TikTok){
            AdManager.getInstance().hideBanner();
        }else if(AdsIdConfig.platform==EPlatform.VIVO){
            AdManager.getInstance().hideBanner();
            AdManager.getInstance().showBanner();
        }
    }
    
    // start() {

    // }

    // update(deltaTime: number) {
        
    // }
}



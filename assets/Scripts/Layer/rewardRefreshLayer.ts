import { _decorator, Component, Node, find, Button, Label, Animation, UIOpacity, tween } from 'cc';
import { rewardType } from '../Common/Enum';
import { layerControler } from '../Controler/layerControler';
import { GameMain } from '../GameMain';
import gameInitManager from '../Manager/GameManager';
import { touchControler } from '../Controler/touchControler';
import AdsIdConfig, { EPlatform } from '../../Extend/Ad/Platforms/AdsIdConfig';
const { ccclass, property } = _decorator;

@ccclass('rewardRefreshLayer')
export class rewardRefreshLayer extends layerControler {
    @property(Button)
    rewardButton:Button=null;

    @property(Label)
    num:Label|null=null;

    refreshNum(){
        let node=find("Canvas/GameMain/blockContainer/touchLayer");
        let controlNode=node.getComponent(touchControler);
        let blockNum=controlNode.lineListIndex+1;
        this.num.string=blockNum.toString();
    }

    playAnim(){
        let anim=this.node.getChildByName("Mid").getChildByName("anim").getComponent(Animation);
        this.scheduleOnce(()=>{
            tween(anim.getComponent(UIOpacity))
            .to(0.2,{opacity:255})
            .start();
            anim.play("combo");
        },1);
    }

    // showDelay(){
    //     let opacity=this.node.getChildByName("Top").getChildByName("guanbi").getComponent(UIOpacity);
    //     this.scheduleOnce(()=>{
    //         tween(opacity)
    //             .to(0.1,{opacity:0})
    //             .delay(0.1)
    //             .to(1,{opacity:255})
    //             .start();
    //     },1.5);
    // }

    onClickClose(){
        super.onClickCloseButton();
        let node=find("Canvas/GameMain");
        let controlNode=node.getComponent(GameMain);
        if(gameInitManager.getAdManager().getRewardType()!=rewardType.addProp){
        gameInitManager.getLocalDataManager().setTimesByItemName("refreshTimes",true);
        controlNode.setLabelTimes("refreshTimes",gameInitManager.getLocalDataManager().getTimesByItemName("refreshTimes"));  
        }  
        let anim=this.node.getChildByName("Mid").getChildByName("anim");
        anim.getComponent(UIOpacity).opacity=0;
        anim.getComponent(Animation).stop();
        // if(AdsIdConfig.platform==EPlatform.VIVO){
        //     let opacity=this.node.getChildByName("Top").getChildByName("guanbi").getComponent(UIOpacity);
        //     opacity.opacity=0;
        // }
    }

    onClickVideoButton(){
        gameInitManager.getAdManager().setPropType("refresh");
        gameInitManager.getAdManager().setRewardType(rewardType.addProp);
        this.scheduleOnce(()=>{
            gameInitManager.getAdManager().onReward(this.node);
        },0.5);
        let anim=this.node.getChildByName("Mid").getChildByName("anim");
        anim.getComponent(UIOpacity).opacity=0;
        anim.getComponent(Animation).stop();
    }
}



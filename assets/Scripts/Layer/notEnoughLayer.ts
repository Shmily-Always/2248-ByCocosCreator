import { _decorator, Component, find, Node, tween, UIOpacity } from 'cc';
import { layerControler } from '../Controler/layerControler';
import gameInitManager from '../Manager/GameManager';
import { rewardType, rewardLayer, addMoney } from '../Common/Enum';
import { GameMain } from '../GameMain';
import { MenuMain } from '../MenuMain';
const { ccclass, property } = _decorator;

@ccclass('notEnoughLayer')
export class notEnoughLayer extends layerControler {

    showDelay(){
        let opacity=this.node.getChildByName("Top").getChildByName("guanbi").getComponent(UIOpacity);
        this.scheduleOnce(()=>{
            tween(opacity)
                .to(1,{opacity:255})
                .start();
        },2);
    }
    
    onClickReward(){
        gameInitManager.getAdManager().setRewardType(rewardType.addDiamond);
        gameInitManager.getAdManager().setAddLayerType(addMoney.notEnoughLayer);
        //TODO：广告判断未做
        let node=find("Canvas/GameMain");
            if(node){
                let controlnode=node.getComponent(GameMain);
                controlnode.setDiamondLabel();            
                this.scheduleOnce(()=>{
                    gameInitManager.getAdManager().onReward(this.node);
                },0.5);      

            }
    }

    onClickClose(){
        super.onClickCloseButton();
        let opacity=this.node.getChildByName("Top").getChildByName("guanbi").getComponent(UIOpacity);
        opacity.opacity=0;
    }
}



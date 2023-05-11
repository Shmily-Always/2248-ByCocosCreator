import { _decorator, Component, Node, Button, find, UIOpacity, EventHandheld, EventHandler, tween, resources, error, Prefab, instantiate } from 'cc';
import { rewardType } from '../Common/Enum';
import { layerControler } from '../Controler/layerControler';
import gameInitManager from '../Manager/GameManager';
import { GetLocalDataMgrInstance } from '../Manager/LocalDataManager';
import { MenuMain } from '../MenuMain';
import AdsIdConfig, { EPlatform } from '../../Extend/Ad/Platforms/AdsIdConfig';
const { ccclass, property } = _decorator;

@ccclass('registLayer')
export class registLayer extends layerControler {
    @property(Node)  //含有签到按钮的面板
    signingNode:Node=null;

    @property(Button)
    rewardButton:Button=null;

    // rewardEventDay=1;
    // day=0;

    alertNode:Node=null;

    // isReward:boolean=false;   //控制获得钻石处是普通点击获得还是激励获得
    isDaySeven:boolean=false;   //是否为第七天签到

    // showAlert(){
    //     resources.load("Layer/alertRegist",Prefab,(err,alertRegist)=>{
    //         this.alertNode=instantiate(alertRegist);
    //         this.node.addChild(this.alertNode);
    //     });
    //     // tween(this.node.getChildByName("alertRegist").getComponent(UIOpacity))
    //     // .to(0.5,{opacity:255})
    //     // .start();
    // }

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
    
    readingOpacity(){
        if(gameInitManager.getLocalDataManager().getIsCanSigning()){
            this.rewardButton.getComponent(Button).interactable=true;
        }
        let alreadySigningButton=gameInitManager.getLocalDataManager().getSigningDay()-1;
        
        for(let i=0;i<alreadySigningButton;i++ ){
            this.signingNode.children[i].getChildByName("yes").active=true;
            this.signingNode.children[i].getChildByName("button").getComponent(UIOpacity).opacity=130;
        }
    }

    onClickSigningButton(event,customEventData){
        gameInitManager.getSoundManager().playSound("adddiamond");
        gameInitManager.getLocalDataManager().setIsCanSigning(0);  //点击了按钮就是签到过了
        let day=parseInt(customEventData)+1;
        this.signingNode.children[gameInitManager.getLocalDataManager().getSigningDay()-1].getComponent(Button).interactable=false;
        this.signingNode.children[gameInitManager.getLocalDataManager().getSigningDay()-1].getChildByName("yes").active=true;
        this.signingNode.children[gameInitManager.getLocalDataManager().getSigningDay()-1].getChildByName("button").getComponent(UIOpacity).opacity=130;
        this.rewardButton.getComponent(Button).interactable=false;

        gameInitManager.getDiamondManager().subDiamond(this.getGold());  //加gold
        let node=find("Canvas/MainMenu");
        let controlNode=node.getComponent(MenuMain);
        controlNode.setDiamondLabel();

        if(day>7){
            this.isDaySeven=true;
            this.scheduleOnce(()=>{
                for(let i=0;i<7;i++){
                    this.signingNode.children[i].getChildByName("yes").active=false;
                    this.signingNode.children[i].getChildByName("button").getComponent(UIOpacity).opacity=255;
                }   
            },2);
        }
        gameInitManager.getLocalDataManager().setSigningDay(day);     
        gameInitManager.getLocalDataManager().setSigningDate(new Date().getDate());
    }
    
    getGold(){
        let day:number=0;
        if(!this.isDaySeven){
            day=gameInitManager.getLocalDataManager().getSigningDay();
        }else{
            // if(!this.isReward){
                day=7;
            // }else{
                // day=8;
            // }
            this.isDaySeven=false;
        }
        let arr=[50,75,100,150,200,250,300];
        // if(!this.isReward){
            return arr[day-1];
        // }else{
            // this.isReward=false;
            // return arr[day-2];
        // }
    }

    onClickRewardButton(){
        // this.isReward=true;
        gameInitManager.getAdManager().rewardType==rewardType.addDiamond;
        gameInitManager.getAdManager().setIsRegistLayer=true;

        this.scheduleOnce(()=>{
            gameInitManager.getAdManager().onRewardMainMenu(this.node);
        },0.5);

    }

    onClickClose(){
        super.onClickCloseButton();
        // if(AdsIdConfig.platform==EPlatform.VIVO){
        //     let opacity=this.node.getChildByName("Top").getChildByName("guanbi").getComponent(UIOpacity);
        //     opacity.opacity=0;
        // }
    }
}



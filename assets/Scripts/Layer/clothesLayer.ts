import { _decorator, Component, Node, Button, find, Sprite, UIOpacity, tween, Vec3 } from 'cc';
import { blockScaleAnimation, rewardType } from '../Common/Enum';
import { layerControler } from '../Controler/layerControler';
import { GameMain } from '../GameMain';
import gameInitManager from '../Manager/GameManager';
import AdsIdConfig, { EPlatform } from '../../Extend/Ad/Platforms/AdsIdConfig';
import AdManager from '../../Extend/Ad/Platforms/AdManager';
const { ccclass, property } = _decorator;

@ccclass('clothesLayer')
export class clothesLayer extends layerControler {

    @property(Button)   //button背景
    gameBgButton:Button=null;
    
    @property(Button)  //button皮肤
    blockBgButton:Button=null;

    @property(Node)  //node背景
    gameBgNode:Node=null;  

    @property(Node)  //node皮肤
    blockBgNode:Node=null;

    @property(Node)  //main背景
    mainGameBg:Node=null;

    @property(Node)  //main皮肤
    mainBlockBg:Node=null;

    countButton:number=0;
    countButtonBlock:number=0;

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

    switchButton(button:number){
        if(button==1){  //
            let spriteGameBg=this.gameBgNode.getChildByName("Sprite");
            spriteGameBg.getComponent(UIOpacity).opacity=255;
            let spriteBlockBg=this.blockBgNode.getChildByName("Sprite");
            spriteBlockBg.getComponent(UIOpacity).opacity=0;
            this.mainGameBg.active=true;
            this.mainBlockBg.active=false;
        }else{
            let spriteGameBg=this.gameBgNode.getChildByName("Sprite");
            spriteGameBg.getComponent(UIOpacity).opacity=0;
            let spriteBlockBg=this.blockBgNode.getChildByName("Sprite");
            spriteBlockBg.getComponent(UIOpacity).opacity=255;
            this.mainBlockBg.active=true;
            this.mainGameBg.active=false;
        }
    }
 
    onClickgameBgButton(){    //界面切换到gameBg时
        this.switchButton(1);   //刷新界面
        this.refreshButton();   //刷新已解锁数据
    }

    onClickBlockBgButton(){   //界面切换到blockBg时
        this.switchButton(2);
        this.refreshButtonBlock();
    }

    refreshButton(){    //刷新  √ 所在的地方，解锁的状态
        let nowId=gameInitManager.getLocalDataManager().getBgNumber();   
        for(let i=0;i<9;i++){
            if(i==nowId){
                this.mainGameBg.children[nowId].getChildByName("yesbg").getChildByName("yes").active=true;
            }else{
                this.mainGameBg.children[i].getChildByName("yesbg").getChildByName("yes").active=false;
            }

            let arr=gameInitManager.getLocalDataManager().getUnlockBg();
            if(typeof(arr)!="undefined"){
                if(arr[i]==1){
                    this.mainGameBg.children[i].getChildByName("lock").active=false;   //true是已解锁
                    this.mainGameBg.children[i].getChildByName("yesbg").active=true;
                }
            }else{
                return;
            }
            
        }
    }

    refreshButtonBlock(){    //刷新  √ 所在的地方，解锁的状态
        let nowId=gameInitManager.getLocalDataManager().getBlockBg();   
        for(let i=0;i<5;i++){
            if(i==nowId){
                this.mainBlockBg.children[nowId].getChildByName("yesbg").getChildByName("yes").active=true;
            }else{
                this.mainBlockBg.children[i].getChildByName("yesbg").getChildByName("yes").active=false;
            }

            let arr=gameInitManager.getLocalDataManager().getUnlockBlockBg();
            if(typeof(arr)!="undefined"){
                if(arr[i]==1){
                    this.mainBlockBg.children[i].getChildByName("lock").active=false;   //true是已解锁
                    this.mainBlockBg.children[i].getChildByName("yesbg").active=true;
                }
            }else{
                return;
            }
            
        }
    }

    setIsBeenUnlock(child:number){  //点击购买时设置已解锁
        let n=this.mainGameBg.children[child];
        n.getChildByName("lock").active=false;
        n.getChildByName("yesbg").active=true;
    }

    setIsBeenUnlockBlock(child:number){  //点击购买时设置已解锁Block
        let n=this.mainBlockBg.children[child];
        n.getChildByName("lock").active=false;
        n.getChildByName("yesbg").active=true;
    }

    getIsBeenUnlock(child:number){  //判断是否已被购买

            if(this.mainGameBg.children[child].getChildByName("lock").active==true){  //未解锁
                return true;
            }else{
                return false;    //已解锁
            }
    }

    getIsBeenUnlockBlock(child:number){  //判断是否已被购买Block
        if(this.mainBlockBg.children[child].getChildByName("lock").active==true){  //未解锁
            return true;
        }else{
            return false;    //已解锁
        }
}
    

    onClickgameBg(event,customEventData){  //customEvenData一定要作为第二个参数传入
        for(let i=0;i<9;i++){
            let count=Number(this.mainGameBg.children[customEventData].getComponent(Button).clickEvents[0].customEventData);
            if(this.getIsBeenUnlock(count)){
                if(i==count){
                    tween(this.mainGameBg.children[i])
                    .to(0.1,{scale:new Vec3(0.9,0.9,0.9)})
                    .start();
                }else{
                    tween(this.mainGameBg.children[i])
                    .to(0.1,{scale:new Vec3(1.0,1.0,1.0)})
                    .start();
                }
            }else{
                if(i==count){
                    this.mainGameBg.children[count].getChildByName("yesbg").getChildByName("yes").active=true;
                    gameInitManager.getBgManager().changeBg(count);
                }else{
                    this.mainGameBg.children[i].getChildByName("yesbg").getChildByName("yes").active=false;
                }
                
            }
                
            
     }
        this.countButton=Number(customEventData);  //注意：customEventData是个any类型！！
    }
    
    onClickBlockBg(event,customEventData){
        for(let i=0;i<5;i++){
            let count=Number(this.mainBlockBg.children[customEventData].getComponent(Button).clickEvents[0].customEventData);
            if(this.getIsBeenUnlockBlock(count)){

                if(i==count){
                    tween(this.mainBlockBg.children[i])
                    .to(0.1,{scale:new Vec3(0.9,0.9,0.9)})
                    .start();
                }else{
                    tween(this.mainBlockBg.children[i])
                    .to(0.1,{scale:new Vec3(1.0,1.0,1.0)})
                    .start();
                }
            }else{
                if(i==count){
                    this.mainBlockBg.children[count].getChildByName("yesbg").getChildByName("yes").active=true;
                    gameInitManager.getBgManager().changeBlockBg(count);
                    this.onClickClose();
                }else{
                    this.mainBlockBg.children[i].getChildByName("yesbg").getChildByName("yes").active=false;
                }
                
            }
     }
        this.countButtonBlock=Number(customEventData);
    }

    onClickClose(){
        super.onClickCloseButton();
        for(let i=0;i<9;i++){
            if(this.mainGameBg.active==true){
                tween(this.mainGameBg.children[i])
                .to(0,{scale:new Vec3(1,1,1)})
                .start();
            }
        }
        for(let i=0;i<5;i++){
            if(this.mainBlockBg.active==true){
                tween(this.mainBlockBg.children[i])
                .to(0,{scale:new Vec3(1,1,1)})
                .start();
            }
        }
        // if(AdsIdConfig.platform==EPlatform.VIVO){
        //     let opacity=this.node.getChildByName("Top").getChildByName("guanbi").getComponent(UIOpacity);
        //     opacity.opacity=0;
        // }
    }

    onClickBuyButton(){
        let gameMainNode=find("Canvas/GameMain");
        let controlGameMainNode=gameMainNode.getComponent(GameMain);
        if(AdsIdConfig.platform==EPlatform.TikTok){
            AdManager.getInstance().hideBanner();
        }
        if(this.mainGameBg.active==true){  //如果是背景界面
            if(gameInitManager.getDiamondManager().isDiamondEnough(100)){  //钻石够，扣除
                tween(this.mainGameBg.children[this.countButton])
                .to(0,{scale:new Vec3(1,1,1)})
                .start();
                if((this.countButton!=0) && (this.getIsBeenUnlock(this.countButton))){   //选了款式，且未解锁过
                    gameInitManager.getDiamondManager().subDiamond(-100);
                    controlGameMainNode.setDiamondLabel();   
                    this.setIsBeenUnlock(this.countButton);  //解锁
                    let arrGameBg=gameInitManager.getLocalDataManager().getUnlockBg();
                    arrGameBg[this.countButton]=1;
                    // this.gameBgArr[this.countButton]=1;
                    gameInitManager.getLocalDataManager().setUnlockBg(arrGameBg);   //true是unlock
                    gameInitManager.getBgManager().changeBg(this.countButton);  //换背景
                    this.refreshButton();
            }//TODO:else if时，随机挑选未做（注意和原始状态进行区分）
            }else{  //钻石不够打开商店
                // this.onClickClose();
                
                // this.scheduleOnce(()=>{
                // controlGameMainNode.showShopLayer();
                // controlGameMainNode.notEnoughAlert();
                controlGameMainNode.showNotEnough();
                // },1);
        }
        }else if(this.mainBlockBg.active==true){   //如果是方块背景界面
            if(gameInitManager.getDiamondManager().isDiamondEnough(100)){  //钻石够，扣除
                tween(this.mainBlockBg.children[this.countButtonBlock])
                .to(0,{scale:new Vec3(1,1,1)})
                .start();
                if((this.countButtonBlock!=0) && (this.getIsBeenUnlockBlock(this.countButtonBlock))){   //选了款式，且未解锁过
                    gameInitManager.getDiamondManager().subDiamond(-100);
                    controlGameMainNode.setDiamondLabel();   
                    this.setIsBeenUnlockBlock(this.countButtonBlock);  //解锁
                    let arrBlockBg=gameInitManager.getLocalDataManager().getUnlockBlockBg();
                    arrBlockBg[this.countButtonBlock]=1;
                    gameInitManager.getLocalDataManager().setUnlockBlockBg(arrBlockBg);   //true是unlock
                    this.refreshButtonBlock();
                    this.onClickClose();
                    gameInitManager.getBgManager().changeBlockBg(this.countButtonBlock);  //换背景
            }//TODO:else if时，随机挑选未做（注意和原始状态进行区分）
        }else{  //钻石不够打开商店
            // this.onClickClose();
            
            // this.scheduleOnce(()=>{
            // controlGameMainNode.showShopLayer();
            // controlGameMainNode.notEnoughAlert();
                controlGameMainNode.showNotEnough();
            // },1);
            }
        }
        
    }

    onClickRewardButton(){
        gameInitManager.getAdManager().setRewardType(rewardType.unlockClothes);
        this.scheduleOnce(()=>{
            gameInitManager.getAdManager().onReward(this.node);
        },0.5);
    }

}



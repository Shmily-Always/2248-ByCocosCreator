import { _decorator, Button, Component, find, Node } from 'cc';
import { layerControler } from '../Controler/layerControler';
import { GameMain } from '../GameMain';
// import AdManager from '../../resources/Extend/Ad/Platforms/AdManager';
import gameInitManager from '../Manager/GameManager';
import AdManager from '../../Extend/Ad/Platforms/AdManager';
const { ccclass, property } = _decorator;

@ccclass('shareLayer')
export class shareLayer extends layerControler {
    // enterShare=false;
    // onClickContinu1e(){
    //     // AdManager.getInstance().stopRecordScreen();
    //     let node=find("Canvas/GameMain");
    //     let controlNode=node.getComponent(GameMain);
    //     // controlNode.inPlayGame=true;
    //     // controlNode.gameTime=0;
    //     super.onClickCloseButton();
    //     if(controlNode.showShare ){
    //         // controlNode.showShare=false;
    //         AdManager.getInstance().stopRecordScreen();
    //         controlNode.inPlayGame=true;
    //         controlNode.gameTime=0;
    //         AdManager.getInstance().StartRecorder();
    //     }
    //     // this.enterShare=false;
    //     // controlNode.showShare=false;
    //     // controlNode.inPlayGame=true;
    //     // controlNode.gameTime=0;
    //     // AdManager.getInstance().StartRecorder();
    //     // console.log("start Record in continue");
    // }

    onClickContinue(){
        let node=find("Canvas/GameMain");
        let controlNode=node.getComponent(GameMain);
        controlNode.showShare=false;
        // controlNode.unlockLayer.getChildByName("Bot").getChildByName("button").getComponent(Button).interactable=true;
        // controlNode.unlockLayer.getChildByName("Top").getChildByName("guanbi").getComponent(Button).interactable=true;
        super.onClickCloseButton();
    }

    onClickShare(){
        // this.enterShare=true;
        AdManager.getInstance().ShareVideo('2048游乐场','ttf08c86316fb387e502',this.ShareCallback.bind(this));
    }

    ShareCallback(data){
        if(data==1){
            gameInitManager.getTipsManager().create('分享成功！获得5颗宝石',this.node);
            let node=find("Canvas/GameMain");
            let controlNode=node.getComponent(GameMain);
            // controlNode.setDiamondLabel();
            // controlNode.showShare=false;
            gameInitManager.getDiamondManager().subDiamond(5);
            this.scheduleOnce(()=>{
                this.onClickContinue();
                controlNode.showAddDiamondInUnlockLayer(5);
            },1);
            
        }else{
            gameInitManager.getTipsManager().create('分享失败，不能获得奖励！',this.node);
            let node=find("Canvas/GameMain");
            let controlNode=node.getComponent(GameMain);
            // controlNode.showShare=false;
            this.scheduleOnce(()=>{
                this.onClickContinue();
            },1);
        }
    }
}



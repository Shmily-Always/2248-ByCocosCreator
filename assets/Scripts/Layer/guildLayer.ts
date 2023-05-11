import { _decorator, Component, Node, Prefab, NodePool, Vec2, instantiate, tween, Vec3, Animation, EventTouch, UITransform, Label, find, UIOpacity, Button, director } from 'cc';
import { blockSetting } from '../blockSetting';
import { my2DArray } from '../Common/my2DArray';
import { layerControler } from '../Controler/layerControler';
import { guildFir } from '../Guild/guildFir';
import { guildSec } from '../Guild/guildSec';
import { guildThird } from '../Guild/guildThird';
import gameInitManager from '../Manager/GameManager';
import { MenuMain } from '../MenuMain';
import AdManager from '../../Extend/Ad/Platforms/AdManager';
import AdsIdConfig, { EPlatform } from '../../Extend/Ad/Platforms/AdsIdConfig';
// import AdManager from '../../resources/Extend/Ad/Platforms/AdManager';
const { ccclass, property } = _decorator;

@ccclass('guildLayer')
export class guildLayer extends layerControler {
    
    guildStep:Number=1;

    hideIcon(){
        let node=find("Canvas/MainMenu/blockContainer");
        node.getComponent(UIOpacity).opacity=0;
        let nodeBottom=find("Canvas/MainMenu/gameBottom");
        nodeBottom.getComponent(UIOpacity).opacity=0;
    }

    showIcon(){
        let node=find("Canvas/MainMenu/blockContainer");
        node.getComponent(UIOpacity).opacity=255;
        let nodeBottom=find("Canvas/MainMenu/gameBottom");
        nodeBottom.getComponent(UIOpacity).opacity=255;
    }

    initGameData(){
        let node=this.node.getChildByName("guildFir");
        let controlNode=node.getComponent(guildFir);
        // node.getComponent(UIOpacity).opacity=0;
        // this.node.getChildByName("guildSec").getComponent(UIOpacity).opacity=0;
        // this.node.getChildByName("guildThird").getComponent(UIOpacity).opacity=0;
        controlNode.playAnimation();
    }

    onClickNextButton(){
        switch(this.guildStep){  //新手引导一共有三步,第一步的时候不用点击下一步
            // case 1:
                
            //     this.node.getChildByName("button").getComponent(Button).interactable=false;
            //     this.node.getChildByName("guildSec").getComponent(UIOpacity).opacity=0;
            //     let nodeFir=this.node.getChildByName("guildFir");
            //     let controlNodeFir=nodeFir.getComponent(guildFir);
            //     controlNodeFir.playAnimation();
            case 2:
                this.node.getChildByName("button").getComponent(Button).interactable=false;
                this.node.getChildByName("guildFir").getComponent(UIOpacity).opacity=0;
                let nodeSec=this.node.getChildByName("guildSec");
                let controlNodeSec=nodeSec.getComponent(guildSec);
                controlNodeSec.playAnimation();
                // this.node.getChildByName("guildThird").getComponent(UIOpacity).opacity=0;
                break;
            case 3:
                this.node.getChildByName("button").getComponent(Button).interactable=false;
                let nodeThird=this.node.getChildByName("guildThird");
                let controlNodeThird=nodeThird.getComponent(guildThird);
                controlNodeThird.playAnimation();
                // this.node.getChildByName("guildFir").getComponent(UIOpacity).opacity=0;
                this.node.getChildByName("guildSec").getComponent(UIOpacity).opacity=0;
                break;
        }
    }

    onClickBegin(){
        console.log("on click begin");
        director.loadScene("MainGame");
        super.onClickCloseButton();
        this.showIcon();
        // this.node.getChildByName("guildFir").getComponent(UIOpacity).opacity=0;
        // this.node.getChildByName("guildSec").getChildByName("block").getChildByName("4");
        // this.node.getChildByName("guildThird").getChildByName("block").getChildByName("8");
        let block1=this.node.getChildByName("guildFir").getChildByName("block").getChildByName("3");
        let block2=this.node.getChildByName("guildSec").getChildByName("block").getChildByName("4");
        let block3=this.node.getChildByName("guildThird").getChildByName("block").getChildByName("8");
        block1.getComponent(UIOpacity).opacity=0;
        block1.setPosition(new Vec3(75,0,0));
        block2.getComponent(UIOpacity).opacity=0;
        block2.setPosition(new Vec3(0,160,0));
        block3.getComponent(UIOpacity).opacity=0;
        block3.setPosition(new Vec3(-165,-235,0));
        let button=this.node.getChildByName("button");
        button.getComponent(UIOpacity).opacity=0;
        button.getComponent(Button).interactable=false;
        let begin=this.node.getChildByName("begin");
        begin.getComponent(UIOpacity).opacity=0;
        begin.active=false;
        // begin.getComponent(Button).interactable=false;
        this.node.getChildByName("guildThird").getComponent(UIOpacity).opacity=0;
        if(AdsIdConfig.platform==EPlatform.TikTok){
            AdManager.getInstance().hideBanner();
            AdManager.getInstance().StartRecorder();
        }
        // AdManager.getInstance().showBanner();
    }

    // onClickClose(){
    //     super.onClickCloseButton();
    //     this.showIcon();
    //     let block1=this.node.getChildByName("guildFir").getChildByName("block").getChildByName("3");
    //     let block2=this.node.getChildByName("guildSec").getChildByName("block").getChildByName("4");
    //     let block3=this.node.getChildByName("guildThird").getChildByName("block").getChildByName("8");
    //     block1.getComponent(UIOpacity).opacity=0;
    //     block1.setPosition(new Vec3(75,0,0));
    //     block2.getComponent(UIOpacity).opacity=0;
    //     block2.setPosition(new Vec3(0,160,0));
    //     block3.getComponent(UIOpacity).opacity=0;
    //     block3.setPosition(new Vec3(-165,-235,0));
    //     let button=this.node.getChildByName("button");
    //     button.getComponent(UIOpacity).opacity=0;
    //     button.getComponent(Button).interactable=false;
    //     this.node.getChildByName("Label").getChildByName("guanbi").getComponent(UIOpacity).opacity=0;
    //     this.node.getChildByName("guildThird").getComponent(UIOpacity).opacity=0;
    // }
}



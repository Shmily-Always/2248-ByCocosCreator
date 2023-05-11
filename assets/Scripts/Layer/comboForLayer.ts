import { _decorator, Animation, Component, find, Node, tween, UIOpacity } from 'cc';
import { layerControler } from '../Controler/layerControler';
import { GameMain } from '../GameMain';
import gameInitManager from '../Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('comboForLayer')
export class comboForLayer extends layerControler {

    // isGive:boolean=false;

    playAnim(){
        let anim=this.node.getChildByName("Mid").getChildByName("anim");
        this.scheduleOnce(()=>{
            tween(anim.getComponent(UIOpacity))
                .to(0.2,{opacity:255})
                .start();
            anim.getComponent(Animation).play("combo");
        },1);
    }

    onClickButton(){
        super.onClickCloseButton();
        // if(!this.isGive){
            gameInitManager.getDiamondManager().subDiamond(15);
            let node=find("Canvas/GameMain");
            let controlNode=node.getComponent(GameMain);
            controlNode.showAddDiamondInUnlockLayer(15);
        // }
        let anim=this.node.getChildByName("Mid").getChildByName("anim");
        anim.getComponent(UIOpacity).opacity=0;
        anim.getComponent(Animation).stop();
    }

    // onClickClose(){
    //     super.onClickCloseButton();
    //     if(!this.isGive){
    //         gameInitManager.getDiamondManager().subDiamond(15);
    //         let node=find("Canvas/GameMain");
    //         let controlNode=node.getComponent(GameMain);
    //         controlNode.showAddDiamondInUnlockLayer(15);
    //     }
    //     let anim=this.node.getChildByName("Mid").getChildByName("anim");
    //     anim.getComponent(UIOpacity).opacity=0;
    // }
}



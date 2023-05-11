import { _decorator, Component, Node, Vec3, find, UIOpacity } from 'cc';
import { blockControler } from '../Controler/blockControler';
import { layerControler } from '../Controler/layerControler';
import { skillControler } from '../Controler/skillControler';
import { touchControler } from '../Controler/touchControler';
import { GameMain } from '../GameMain';
import gameInitManager from '../Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('exchangeLayer')
export class exchangeLayer extends layerControler {
    
    isShowLayer(){
        if(this.node.position.strictEquals(new Vec3(0,-561.078,0))){
            return true;
        }else{
            return false;
        }
    }

    /** 展示layer */
    showLayer(){
        this.node.setPosition(0,-561.078);
        this.node.getComponent(UIOpacity).opacity=255;
        find("Canvas/GameMain/back/back").active=true;
        find("Canvas/GameMain/gameTop").active=false;
        find("Canvas/GameMain/gameBottom").active=false;
    }

    hideLayer(){
        super.onClickCloseButton();
        find("Canvas/GameMain/gameTop").active=true;
        find("Canvas/GameMain/gameBottom").active=true;
        find("Canvas/GameMain/back/back").active=false;
    }
    
    // onClickCloseButton(){
    //     super.onClickCloseButton();
    //     find("Canvas/GameMain/gameTop").active=true;
    //     find("Canvas/GameMain/gameBottom").active=true;
    //     let touchlayerNode=find("Canvas/GameMain/blockContainer/touchLayer");
    //     let controlNode=touchlayerNode.getComponent(touchControler);
    //     controlNode.beenExchange=false;
    //     let skillNode=find("Canvas/GameMain/blockContainer/skill");
    //     let controlSkillNode=skillNode.getComponent(skillControler);
    //     controlSkillNode.closeAnimaion();
    // }
}



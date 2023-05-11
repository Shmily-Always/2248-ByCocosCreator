import { _decorator, Component, Node, Vec2, find, UIOpacity, Vec3 } from 'cc';
import { layerControler } from '../Controler/layerControler';
const { ccclass, property } = _decorator;

@ccclass('hammerLayer')
export class hammerLayer extends layerControler {

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
    //     controlNode.beenDestory=false;
    // }
}



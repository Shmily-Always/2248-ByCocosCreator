import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
import { TipsManager } from '../Manager/TipsManager';
import gameInitManager from '../Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Tips')
export class Tips extends Component {
    showInfo(tip: string) {
        let tipLabel = this.node.getChildByName('Label');
        tipLabel.setPosition(new Vec3(0, -200, 0));
        tipLabel.getComponent(Label).string = tip;
        let nodeTween = tween(tipLabel);
        nodeTween.to(0.8, { position: new Vec3(0, -50, 0) })
            .call(() => {
                gameInitManager.getTipsManager().putNode(this.node);
            }).start();
    }
}



// import uma from '../uma.min';
// import umeng=require('umtrack-quickgame');
// import { default as umeng } from 'umtrack-quickgame';
import { _decorator, Component, Node, Prefab, instantiate, director } from 'cc';
import AdManager from '../Ad/Platforms/AdManager';
import { AdLogUtil } from '../Ad/Util/AdLogUtil';
const { ccclass, property } = _decorator;

@ccclass('PrivacyViewUi')
export class PrivacyViewUi extends Component {

    @property(Prefab)
    privacyPrefab = null;

    @property(Node)
    ovLabels: Node[] = [];


    onEnable() {
        // localStorage.clear();
        let is = localStorage.getItem('akPrivacy');
        if (!is) {
            this.node.active = true;
        }
        else {
            this.node.active = false;
        }
    }


    private showPrivacyView() {
        let prefabNode = instantiate(this.privacyPrefab);
        prefabNode.parent = this.node;
        prefabNode.setPosition(0, 0, 0);
    }


    private surePrivacy() {
        // director.loadScene("MainScene");
        AdLogUtil.Log("surePrivacy");
        // AdManager.getInstance().showBanner();
        director.emit("AccetPrivacy");
        localStorage.setItem('akPrivacy', '1');
        this.node.active = false;

        // console.log(umeng);
        // uma.init({
        //     appKey: '644771547dddcc5bad3ad930',
        //     useOpenid: false, // 因当前暂不支持openid,此处需要设置为false
        //     debug: true
        //   });
        // if(AdManager.getInstance().isInitSuccess){
            // console.log("load MainMenu");
            // director.loadScene("MainMenu");
        // }
        // this.scheduleOnce(()=>{
        //     director.loadScene("MainMenu");
        // },1);
    }


    private noPrivacy() {
        AdManager.getInstance().exitApplication();
        AdLogUtil.Log('退出游戏');
    }


    private closePrivacy() {
        this.node.active = false;
    }

}


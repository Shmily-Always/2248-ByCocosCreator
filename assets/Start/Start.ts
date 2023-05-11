import { _decorator, Component, Node,  find, director, CameraComponent } from 'cc';
import { progressBar } from './progressBar';
// import {uma} from 'umtrack-quickgame';
const { ccclass, property } = _decorator;

@ccclass('Start')
export class Start extends Component {
    @property(Node)
    privacy: Node = null!;

    onLoad(){
        // this.privacy.active=false;
        
    }

    start(){
        // director.preloadScene("MainMenu");
        // ,function(){
        //     // console.log("next scene MainMenu is preloaded!");
        // });
        this.scheduleOnce(()=>{
            this.playGame();
        },1);
        
    }

    playGame(){
        let progressBarNode=find("Canvas/startBar/ProgressBar");
        let bar=progressBarNode.getComponent(progressBar);
        let privacyNode=this.privacy;  //用privacyNode接收privacy：https://blog.csdn.net/ToBeTheOnlyOne/article/details/77949980
        director.preloadScene('MainMenu',function(completeCount,totalCount,item){
            bar.num=completeCount/totalCount;
            bar.show();
        },function(){
            bar.hide();
            let first=localStorage.getItem("akPrivacy");
            if(!first){
                privacyNode.active=true;
            }else{
            director.loadScene("MainMenu");
            // uma.init({
            //     appKey: 'xxxx',
            //     useOpenid: false, // 因当前暂不支持openid,此处需要设置为false
            //     debug: true
            //   });
            // console.log("get here00");
            // director.preloadScene('MainGame');
            }
            
        });
    }
}



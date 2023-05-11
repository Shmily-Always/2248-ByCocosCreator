import { _decorator, Component, Node, ProgressBar, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('progressBar')
export class progressBar extends Component {
    num=0;  //进度
    isShow=false;  //是否显示
    progress: number;

    show(){
        this.isShow=true;
        this.node.active=true;
    }

    hide(){
        this.isShow=false;
        this.node.active=false;
    }
    // start() {

    // }

    update(deltaTime: number) {
        let progressBar=this.node.getComponent(ProgressBar);
        progressBar.progress=this.num;
        this.node.getChildByName("Label").getComponent(Label).string=Math.trunc(this.num*100)+'%';  //更新
    }
}



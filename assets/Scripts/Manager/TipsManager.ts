import { _decorator, Component, Director, director, find, Label, LabelOutline, Layers, Node, NodePool, UITransform } from 'cc';
import { Tips } from '../Common/Tips';
const { ccclass, property } = _decorator;

@ccclass('TipsManager')
export class TipsManager {
    tipsPool:NodePool;
    queue:Array<string>=[];
    name:string='Tips';

    constructor(){
        this.tipsPool=new NodePool(this.name);
        director.once(Director.EVENT_AFTER_SCENE_LAUNCH,()=>{
            this.queue=[];
        });
    }

    /**
     * 创建
     * @param str 
     */
    public async create(str: string,node:Node) {
        this.initTip(str,node);
        return null;
    }

    /**
     * 回收
     * @param node 
     */
    public putNode(node: Node) {
        this.tipsPool.put(node);
        this.queue.shift();
        if (this.queue.length == 0) return;
        let nextStr = this.queue[0];
        this.initTip(nextStr);
    }


    /**
     * 不需要放入对象池
     * @param node 
     */
    public removeTipeNode(node: Node) {

        node.removeFromParent();
        this.queue.shift();
        if (this.queue.length == 0) return;
        let nextStr = this.queue[0];
        this.initTip(nextStr);
    }

    private initTip(str: string,layerNode?:Node) {
        let node: Node = null;
        if (this.tipsPool.size() == 0) {
            node = new Node('TipUI');
            node.addComponent(UITransform);
            node.addComponent(Tips);
            let lableNode = new Node('Label');
            node.addChild(lableNode);
            lableNode.layer = Layers.Enum.UI_2D;
            let label = lableNode.addComponent(Label);
            label.fontSize = 28;
            label.isBold = true;
            label.addComponent(LabelOutline);
        } else {
            node = this.tipsPool.get();
        }
        if(layerNode){
            layerNode.addChild(node);
            let script = node.getComponent(Tips);
            script.showInfo(str);
        }
    }
}
var tipsManager=null;
export var getTipsManagerInstance=function(){

    
    if(!tipsManager){
        tipsManager=new TipsManager();
    }
    return tipsManager;
}



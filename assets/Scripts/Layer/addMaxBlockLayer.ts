import { _decorator, Component, Node, Prefab, NodePool, instantiate, tween, Vec3, find } from 'cc';
import { blockSetting } from '../blockSetting';
import { layerControler } from '../Controler/layerControler';
import { GameMain } from '../GameMain';
import gameInitManager from '../Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('addMaxBlockLayer')
export class addMaxBlockLayer extends layerControler {
    
    @property(Prefab)
    blcokPrefab:Prefab=null;  //block预制体

    @property(Node)
    createNode:Node=null;   //三个方块的生成节点

    blockPool:NodePool;
    blockList:Node[]=[];  //存储三个方块
    
    lastMinPower:number=0;   //用于存储上次最小倍数

    start(){
        this.blockPool=new NodePool();
        for(let i=0;i<3;i++){  //实例化三个方块
            let block=instantiate(this.blcokPrefab);
            this.blockPool.put(block);
        }
    }

    //展示中间方块的最大值动画
    showAnimation(maxPower:number){
        //TODO:烟花特效未做
        for(let i=0;i<3;i++){
            let block:Node=null;
            if(this.blockPool.size()>0){
                block=this.blockPool.get();
            }else{
                block=instantiate(this.blcokPrefab);
            }
            let controlBlock=block.getComponent(blockSetting);
            let color=gameInitManager.getGameMainDataManager().getBlockColor(maxPower-1+i);  //获取三个方块应有的颜色
            controlBlock.initBlock(-1,-1,maxPower-1+i,color);  //生成方块配置
            block.parent=this.createNode;  //把方块放在生成栏里
            this.blockList.push(block);
            if(i==0){
                controlBlock.CreateBigBlock();
                block.setPosition((i+1)*200,20);
                tween(block)
                    .delay(0.1)
                    .call(()=>{
                        controlBlock.createNowBlock();
                    })  
                    .to(0.2,{position:new Vec3(-200,0,0)})
                    .start();
            }else if(i==1){
                controlBlock.createNowBlock();
                block.setPosition((i+1)*200,0);
                tween(block)
                    .delay(0.1)
                    .to(0.2,{position:new Vec3(0,20,0)})
                    .call(()=>{
                        this.scheduleOnce(()=>{
                            controlBlock.CreateBigBlock();
                        },0.2)
                    })
                    .start();
            }else{
                controlBlock.createNowBlock();
                block.setPosition((i+1)*200,0);
                tween(block)
                    .delay(0.1)
                    .to(0.2,{position:new Vec3(200,0,0)})
                    .start();
            }
        }
    }

    onClick(){
        for(let i=0;i<3;i++){
            let block=this.blockList[i];
            let controlBlock=block.getComponent(blockSetting);
            controlBlock.createNowBlock();
            block.setPosition(800,0);
            this.blockPool.put(block);
        }
        this.onClickCloseButton();
        
       
        let minPower=gameInitManager.getGameMainDataManager().refresh();

        if(minPower==2 || (minPower>2 &&minPower>this.lastMinPower)){
            let node=find("Canvas/GameMain");
            let controlNode=node.getComponent(GameMain);
            controlNode.showDeleteMinBlockLayer();
            this.lastMinPower=minPower;
        }
    }
}



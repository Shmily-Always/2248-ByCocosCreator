import { _decorator, Component, Node, NodePool, instantiate, Prefab, Vec2, Vec3, color, Color, error , Animation, Tween, tween, Slider } from 'cc';
import { clearEffect, effectActioin } from '../Common/Enum';
import { Skill } from '../Common/Skill';
import gameInitManager from '../Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('skillControler')
export class skillControler extends Component {

    
    @property(Prefab)
    clearEffectPrefab: Prefab = null;
    
    @property(Prefab)
    destoryEffectPrefab: Prefab = null;  //摧毁方块预制体
    

    @property(Prefab)    //选择动画
    choosePrefab:Prefab=null;
    chooseNodeList:Node[]=[];

    @property(Prefab)
    hammerPrefab:Prefab=null;  //锤子预制体
      
    hammerNode:Node|null=null;
    
    clearNodePool: NodePool;   //用clear与后面的锤子 destory区分
    clearNodeList: Node[] = [];
    destoryPool: NodePool;
    destroyNodeList: Node[] = [];
    start() {
        this.node.setSiblingIndex(99);
        this.clearNodePool=new NodePool();
        this.destoryPool=new NodePool();
        for (let i = 0; i < 5 * 8; i++) {
            //https://forum.cocos.org/t/instantiate-prefab/92229/2
            //报错因为没有在start里面马上将他挂在父节点上(The thing you want to instantiate is nil)
            let clearEffect = instantiate(this.clearEffectPrefab);   
            let destoryEffect = instantiate(this.destoryEffectPrefab);
            this.clearNodePool.put(clearEffect);
            this.destoryPool.put(destoryEffect);  //生成摧毁节点的节点池
        }
        for(let i=0;i<2;i++){
            let node=instantiate(this.choosePrefab);  //选择两个方块进行操作动画
            node.parent=this.node;
            node.setPosition(new Vec3(0,0,0));
            node.active=false;
            this.chooseNodeList.push(node);
        }

        this.hammerNode=instantiate(this.hammerPrefab);
        this.hammerNode.parent=this.node;
        this.hammerNode.setPosition(new Vec3(0,0,0));
        this.hammerNode.active=false;

    }

    //摧毁方块
    destoryBlock(touchedBlockList:Vec3[],colorList:string[],finalColor:Color){
        if(touchedBlockList.length!=colorList.length){
            error("touchedBlockList.length %s != colorList.length",touchedBlockList.length,colorList.length);
            return;
        }
        for(let i=0;i<touchedBlockList.length;i++){
            let skill:Node=null;
            if(this.clearNodePool.size()>0){  //池子里有就从池子里取
                skill=this.clearNodePool.get();
            }else{
                skill=instantiate(this.clearEffectPrefab);
            }
            skill.parent=this.node;  
            skill.setPosition(touchedBlockList[i]);  //作用于触摸到的点上
            this.clearNodeList.push(skill);

            let controlSkill=skill.getComponent(Skill);
            let anim=skill.getComponent(Animation);
            controlSkill.setColor(colorList[i]);  
            if(i==touchedBlockList.length-1){
                anim.play("blockBoom2");
            }else{
                anim.play("blockBoom");  //名字要对！！
            }
        }
        let length=this.clearNodeList.length;  //有(length-1)个节点需要被摧毁
        let effectTime=clearEffect.moveTime/(length-1);  //每个节点需要移动的时间
        for(let i=0;i<length;i++){
            let value=length-(i+1);  //移动了几段 (节点+1)-(i+1)
            if(value>1){  //前几段移动
                let tweenList:Tween<Node>[]=[];
                for(let j=i+1;j<length;j++){
                    let movation=tween(this.clearNodeList[i]).to(effectTime,{position:touchedBlockList[j]});
                    tweenList.push(movation); //每一段都要有动画,每段动画的播放快慢不一样
                }
                tween(this.clearNodeList[i])
                    .delay(clearEffect.biggerTime)
                    .call(()=>{
                        let controlSkill=this.clearNodeList[i].getComponent(Skill);
                        controlSkill.changeColor(finalColor);
                    })  //call要在sequence前,否则getComponet报错
                    .sequence(...tweenList)
                    .start();
            }
        }
        tween(this.clearNodeList[length - 2])
            .delay(clearEffect.biggerTime)
            .call(() => {
                this.clearNodeList[length - 2].getComponent(Skill).changeColor(finalColor);
            })
            .to(effectTime, { position: touchedBlockList[length - 1] })
            .start();
        tween(this.clearNodeList[length - 1])
            .delay(clearEffect.biggerTime)
            .call(() => {
                this.clearNodeList[length - 1].getComponent(Skill).changeColor(finalColor);
            })
            .start()
    }

    //填充合成的空缺
    fillNode(){
        for(let i=0;i<this.clearNodeList.length;i++){
            this.clearNodeList[i].setPosition(8888,8888);
            this.clearNodePool.put(this.clearNodeList[i]);
        }
        this.clearNodeList=[];
    }

    // 关闭格子选中动画
    closeAnimaion(){
        for(let i=0;i<this.chooseNodeList.length;i++){
            let anim=this.chooseNodeList[i].getComponent(Animation);
            anim.stop();
            this.chooseNodeList[i].setPosition(new Vec3(0,0,0));
            this.chooseNodeList[i].active=false;
        }
    }

    //展示或者关闭某个格子动画
    showOrCloseChooseAnimation(pos:Vec3,isBeenChoose:boolean){
        if(isBeenChoose){
            for(var i=0;i<this.chooseNodeList.length;i++){
                if(this.chooseNodeList[i].getPosition().strictEquals(new Vec3(0,0,0))){
                    this.chooseNodeList[i].active=true;
                    this.chooseNodeList[i].setPosition(pos);
                    let anim=this.chooseNodeList[i].getComponent(Animation);
                    anim.play("choose");
                    return;
                }
            }
        }else{
            for(var i=0;i<this.chooseNodeList.length;i++){
                if(this.chooseNodeList[i].getPosition().strictEquals(pos)){
                    let anim=this.chooseNodeList[i].getComponent(Animation);
                    anim.stop();
                    this.chooseNodeList[i].setPosition(new Vec3(0,0,0));
                    this.chooseNodeList[i].active=false;
                }
            }
        }
    }
    //敲碎砖块
    skillDestoryBlock(blockPos:Vec3,color:string){
        this.hammerNode.active=true;
        this.hammerNode.setPosition(blockPos);
        let anim1=this.hammerNode.getComponent(Animation);
        anim1.play("delete");
        let skill:Node=null;
        if(this.clearNodePool.size()>0){  //节点池里有东西，就拿节点池里的复用
            skill=this.clearNodePool.get();
        }else{
            skill=instantiate(this.clearEffectPrefab);  //没有就实例化一个
        }
        skill.parent=this.node;
        skill.setPosition(blockPos);   //技能的作用节点为touchPos
        this.hammerNode.setSiblingIndex(99);
        this.clearNodeList.push(skill);

        let controlSkill=skill.getComponent(Skill);
        let anim2=skill.getComponent(Animation);
        controlSkill.setColor(color);
        anim2.play("blockDestory2");
        
        this.scheduleOnce(()=>{
            gameInitManager.getSoundManager().playSound("skillSound");
            gameInitManager.getVibrateManager().vibrate();  
            this.hammerNode.active=false;
        },effectActioin.hammerTime);
    }

    //消除最小块
    showDeleteBlockAnimation(blockPosList:Vec3[],colorList:string[]){
        if(blockPosList.length!=colorList.length){
            // error(`blockPosList.length ${blockPosList.length}!=colorList.length ${colorList.length}`);
            return;
        }
        for(let i=0;i<blockPosList.length;i++){
            let skill:Node=null;
            if(this.destoryPool.size()>0){
                skill=this.destoryPool.get();
            }else{
                skill=instantiate(this.destoryEffectPrefab);
            }
            skill.parent=this.node;
            skill.setPosition(blockPosList[i]);
            this.destroyNodeList.push(skill);

            let controlSkill=skill.getComponent(Skill);
            let anim=skill.getComponent(Animation);
            controlSkill.setColor(colorList[i]);
            anim.play("blockDestory");
        }
    }

    //恢复消除最小块之后的空缺
    fillNodeBeenDelete(){
        for(let i=0;i<this.destroyNodeList.length;i++){
            this.destroyNodeList[i].setPosition(8888,8888);
            this.destoryPool.put(this.destroyNodeList[i]);
        }
        this.destroyNodeList=[];
    }
}



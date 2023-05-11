import { _decorator, Component, Node, Button, Label, NodePool, Prefab, tween, UIOpacity, instantiate, Animation, Sprite, Vec3 } from 'cc';
import { Skill } from '../Common/Skill';
import { guildLayer } from '../Layer/guildLayer';
import gameInitManager from '../Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('guildThird')
export class guildThird extends Component {
    
    @property(Prefab)
    guildEffectPrefab:Prefab=null;

    clearNodePool: NodePool;   
    clearNodeList: Node[] = [];
    @property(Node)
    guildThridNode:Node=null;
    @property(Node)
    blockNode:Node=null;

    @property(Label)
    labelThird:Label|null=null;

    @property(Label)
    intro:Label|null=null;

    @property(Button)
    nextButton:Button=null;

    @property(Node)
    beginButton:Node=null;

    // @property(Node)
    // closeButton:Node=null;

    start() {
        this.node.setSiblingIndex(99);
        this.clearNodePool=new NodePool();
        for(let i=0;i<7;i++){
            let guildEffect=instantiate(this.guildEffectPrefab);
            this.clearNodePool.put(guildEffect);
        }
    }

    playAnimation(){
        this.node.parent.getComponent(guildLayer).guildStep=1;
        let label=this.node.parent.getChildByName("Label");
        label.getChildByName("LabelSec").getComponent(UIOpacity).opacity=0;
        label.getChildByName("IntroSec").getComponent(UIOpacity).opacity=0;
        this.nextButton.getComponent(UIOpacity).opacity=0;

        tween(this.labelThird.getComponent(UIOpacity))
            .to(1,{opacity:255})
            .start();
        this.scheduleOnce(()=>{
            tween(this.intro.getComponent(UIOpacity))
                .to(0.3,{opacity:255})
                .start();
        },1.5);
        this.scheduleOnce(()=>{
            this.labelThird.getComponent(UIOpacity).opacity=0;
            this.intro.getComponent(UIOpacity).opacity=0;
            tween(this.guildThridNode.getComponent(UIOpacity))
                .to(1,{opacity:255})
                .start();
        },3.5);   //原：2.5
        this.scheduleOnce(()=>{
            // this.node.active=true;
            let children=this.blockNode.children;
            let anim=this.guildThridNode.getComponent(Animation);
            anim.play("guildThird");
            this.scheduleOnce(()=>{
                for(let i=0;i<7;i++){
                    let skill:Node=null;
                    if(this.clearNodePool.size()>0){  //池子里有就从池子里取
                        skill=this.clearNodePool.get();
                    }else{
                        skill=instantiate(this.guildEffectPrefab);
                    }
                    skill.parent=children[i]; 
                    let color=children[i].getChildByName("bg").getComponent(Sprite).color;
                    let hexColor='#'.concat(color.toHEX());
                    this.clearNodeList.push(skill);
        
                    let controlSkill=skill.getComponent(Skill);
                    let anim=skill.getComponent(Animation);
                    controlSkill.setColor(hexColor); 
                        anim.play("blockDestoryGuild");
                }
            },2);
            this.scheduleOnce(()=>{
                this.blockNode.getChildByName("1").getComponent(UIOpacity).opacity=0;
                this.blockNode.getChildByName("2").getComponent(UIOpacity).opacity=0;
                this.blockNode.getChildByName("3").getComponent(UIOpacity).opacity=0;
                this.blockNode.getChildByName("4").getComponent(UIOpacity).opacity=0;
                this.blockNode.getChildByName("5").getComponent(UIOpacity).opacity=0;
                this.blockNode.getChildByName("6").getComponent(UIOpacity).opacity=0;
                this.blockNode.getChildByName("7").getComponent(UIOpacity).opacity=0;
                this.blockNode.getChildByName("8").getComponent(UIOpacity).opacity=255;

            },2);
            let blockNew=this.blockNode.getChildByName("8");
            this.scheduleOnce(()=>{
                tween(blockNew)
                    .to(0.3,{position:new Vec3(0,0,0)})
                    .to(0.3,{scale:new Vec3(1.2,1.2,1.2)})
                    .start();
                
                    tween(this.beginButton.getComponent(UIOpacity))
                    .to(1,{opacity:255})
                    .start();
            },2);
            this.scheduleOnce(()=>{
                this.beginButton.active=true;
            },2.5)
            // this.beginButton.getComponent(Button).interactable=true;
        },5.5);   //原：4.5
        
    }

}

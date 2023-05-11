import { _decorator, Component, Node, Prefab, Button, Label, NodePool, tween, UIOpacity, Animation, instantiate, Sprite, Vec3 } from 'cc';
import { Skill } from '../Common/Skill';
import { guildLayer } from '../Layer/guildLayer';
const { ccclass, property } = _decorator;

@ccclass('guildSec')
export class guildSec extends Component {

    @property(Prefab)
    guildEffectPrefab:Prefab=null;

    clearNodePool: NodePool;   
    clearNodeList: Node[] = [];
    @property(Node)
    guildSecNode:Node=null;
    @property(Node)
    blockNode:Node=null;

    @property(Label)
    labelSec:Label|null=null;

    @property(Label)
    intro:Label|null=null;

    @property(Button)
    nextButton:Button=null;

    start() {
        this.node.setSiblingIndex(99);
        this.clearNodePool=new NodePool();
        for(let i=0;i<3;i++){
            let guildEffect=instantiate(this.guildEffectPrefab);
            this.clearNodePool.put(guildEffect);
        }
    }

    playAnimation(){
        
        this.node.parent.getComponent(guildLayer).guildStep=3;
        let label=this.node.parent.getChildByName("Label");
        label.getChildByName("LabelFir").getComponent(UIOpacity).opacity=0;
        label.getChildByName("IntroFir").getComponent(UIOpacity).opacity=0;
        this.nextButton.getComponent(UIOpacity).opacity=0;
        
        tween(this.labelSec.getComponent(UIOpacity))
            .to(1,{opacity:255})
            .start();
        this.scheduleOnce(()=>{
            tween(this.intro.getComponent(UIOpacity))
                .to(1,{opacity:255})
                .start();
        },1.5);
        this.scheduleOnce(()=>{
            tween(this.guildSecNode.getComponent(UIOpacity))
                .to(1,{opacity:255})
                .start();
        },2.5);
        this.scheduleOnce(()=>{
            // this.node.active=true;
            let children=this.blockNode.children;
            let anim=this.guildSecNode.getComponent(Animation);
            anim.play("guildSec");
            this.scheduleOnce(()=>{
                for(let i=0;i<3;i++){
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
                    // if(i==children.length-3){
                        // console.log("i==chidren.length-3");
                        // anim.play("blockDestoryGuild");
                    // }else if(i==children.length-4){
                        // console.log("i==children.length-4");
                        anim.play("blockDestoryGuild");
                    // }
                }
            },1);
            this.scheduleOnce(()=>{
                this.blockNode.getChildByName("1").getComponent(UIOpacity).opacity=0;
                this.blockNode.getChildByName("2").getComponent(UIOpacity).opacity=0;
                this.blockNode.getChildByName("3").getComponent(UIOpacity).opacity=0;
                this.blockNode.getChildByName("4").getComponent(UIOpacity).opacity=255;
            },1.5);
            let blockNew=this.blockNode.getChildByName("4");
            this.scheduleOnce(()=>{
                tween(blockNew)
                    .to(0.3,{position:new Vec3(0,0,0)})
                    .start();
                
                // tween(this.nextButton.getComponent(UIOpacity))
                //     .to(1,{opacity:255})
                //     .start();
            },2);
            // console.log(this.nextButton.getComponent(UIOpacity).opacity);
            // if(this.nextButton.getComponent(UIOpacity).opacity==255){
            //     this.nextButton.interactable=true;
            // }
            
        },4.5);
        this.scheduleOnce(()=>{
            this.nextButton.getComponent(UIOpacity).opacity=255;
            this.nextButton.interactable=true;
        },8);
    }
    // update(deltaTime: number) {
        
    // }
}



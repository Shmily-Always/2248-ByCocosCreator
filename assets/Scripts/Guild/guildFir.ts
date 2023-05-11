import { _decorator, Component, Node, UITransform, Vec3, instantiate, NodePool, Prefab, EventTouch, v3, Vec2, Sprite, director, Camera, error, Color, Tween, tween, Animation, UIOpacity, AnimationState, Label, Button } from 'cc';
import { blockSetting } from '../blockSetting';
import { clearEffect } from '../Common/Enum';
import { my2DArray } from '../Common/my2DArray';
import { Skill } from '../Common/Skill';
import tools from '../Common/Tools';
import { guildLayer } from '../Layer/guildLayer';
import gameInitManager from '../Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('guildFir')
export class guildFir extends Component {

    @property(Prefab)
    guildEffectPrefab:Prefab=null;

    clearNodePool: NodePool;   
    clearNodeList: Node[] = [];
    @property(Node)
    guildFirNode:Node=null;
    @property(Node)
    blockNode:Node=null;

    @property(Label)
    labelFir:Label|null=null;

    @property(Label)
    intro:Label|null=null;

    @property(Button)
    nextButton:Button=null;

    start(){
        this.node.setSiblingIndex(99);
        this.clearNodePool=new NodePool();
        for(let i=0;i<2;i++){
            let guildEffect=instantiate(this.guildEffectPrefab);
            this.clearNodePool.put(guildEffect);
        }
    }

    playAnimation(){
        this.node.parent.getComponent(guildLayer).guildStep=2;
        
        tween(this.labelFir.getComponent(UIOpacity))
            .to(1,{opacity:255})
            .start();
        this.scheduleOnce(()=>{
            tween(this.intro.getComponent(UIOpacity))
                .to(1,{opacity:255})
                .start();
        },1.5);
        this.scheduleOnce(()=>{
            tween(this.guildFirNode.getComponent(UIOpacity))
                .to(0.3,{opacity:255})
                .start();
        },2.5);
        this.scheduleOnce(()=>{
            // this.node.active=true;
            let children=this.blockNode.children;
            let anim=this.guildFirNode.getComponent(Animation);
            anim.play("guildFir");
            this.scheduleOnce(()=>{
                for(let i=0;i<2;i++){
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
                    // if(i==children.length-2){
                        // console.log("i==chidren.length-2");
                        anim.play("blockDestoryGuild");
                    // }else if(i==children.length-3){
                        // console.log("i==children.length-3");
                        // anim.play("blockDestoryGuild");
                    // }
                }
            },1);
            this.scheduleOnce(()=>{
                this.blockNode.getChildByName("1").getComponent(UIOpacity).opacity=0;
                this.blockNode.getChildByName("2").getComponent(UIOpacity).opacity=0;
                this.blockNode.getChildByName("3").getComponent(UIOpacity).opacity=255;
            },1.5);
            let blockNew=this.blockNode.getChildByName("3");
            this.scheduleOnce(()=>{
                tween(blockNew)
                    .to(0.3,{position:new Vec3(0,0,0)})
                    .start();
                
                // tween(this.nextButton.getComponent(UIOpacity))
                //     .to(1,{opacity:255})
                //     .start();
            },2);
           
            // if(this.nextButton.getComponent(UIOpacity).opacity==255){
            
            // }
        },4.5);
        this.scheduleOnce(()=>{
            this.node.parent.getChildByName("button").active=true;
            this.nextButton.getComponent(UIOpacity).opacity=255;
            this.nextButton.interactable=true;
        },8);
        
    }
}



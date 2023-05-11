import { _decorator, Component, Node, Sprite, Color, tween } from 'cc';
import { clearEffect } from './Enum';
import tools from './Tools';
const { ccclass, property } = _decorator;

@ccclass('Skill')
export class Skill extends Component {
    
    setColor(color:string){
        for(let i=0;i<this.node.children.length;i++){
            this.node.children[i].getComponent(Sprite).color=tools.hexToRgb(color);
        }
    }

    changeColor(finalColor:Color){
        for(let i=0;i<this.node.children.length;i++){
            let sprite=this.node.children[i].getComponent(Sprite);
            let color=new Color(sprite.color);
            tween(color)
                .to(clearEffect.colorTime,{r:finalColor.r,g:finalColor.g,b:finalColor.b},
                {
                    onUpdate:(target:Color)=>{
                        sprite.color=target;
                    }
                }
                )
                .start();
        }
    }
}



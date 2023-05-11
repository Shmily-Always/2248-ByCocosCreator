import { _decorator, Component, Node, Label, Sprite, tween, UITransform, UIOpacity, Vec3, Animation, Prefab, instantiate, Vec2 } from 'cc';
import { blockScaleAnimation } from './Common/Enum';
import tools from './Common/Tools';
import { GameMainDataManager } from './Manager/GameMainDataManager';
import gameInitManager from './Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('blockSetting')
export class blockSetting extends Component {
    @property(Label)  //数字
    value:Label|null=null; //空时则为白块

    @property(Node)   //背景颜色
    bg:Node=null;

    @property(Node)   //皇冠
    crown:Node=null;

    @property(Node)   //金边
    blockMaxSize:Node=null;

    @property(Node)   //技能
    skill:Node=null;
    
    // @property(Node)   //宝箱
    // treasure:Node=null;

    // @property(Node)   //tips
    // tip:Node=null;

    // @property(Prefab)
    // starPrefab:Prefab=null;  
    
    // @property(Node)
    // starNode:Node|null=null;  //动画

    //在容器中的位置,-1则不在容器中
    x_cols:number=0;
    y_rows:number=0;

    powerOfTwo:number;
    color:string;
    inTouch:boolean=false;  //是否被点击
    
    initBlock(x:number,y:number,value:number,color:string){
        // this.setBlockInContainer(x,y);
        this.powerOfTwo=value;
        
        this.color=color;
        this.bg.getComponent(Sprite).color=tools.hexToRgb(color);
        this.value.color=tools.hexToRgb(gameInitManager.getGameMainDataManager().getText(value));
        let string = gameInitManager.getGameMainDataManager().blockNumber(value);
        this.value.string=string;
        if(string.length==4){  //5位
            this.value.node.scale=new Vec3(0.8,0.8,0.8);
        }else if(string.length==5){
            this.value.node.scale=new Vec3(0.7,0.7,0.7);
        }else{
            this.value.node.scale=new Vec3(1.0,1.0,1.0)
        }
        if(this.crown && this.blockMaxSize){  //初始化生成方块的时候需要将方块的这些节点置为false状态，否则会出现错位的问题
            this.crown.active=false;
            this.blockMaxSize.active=false;
        }
    }

    getBlockInContainer(): Vec2 {
        return new Vec2(this.x_cols, this.y_rows);
    }

    // setBlockInContainer(x:number,y:number){
    //     this.x_cols=x;
    //     this.y_rows=y;
    // }
    setCrownInMax(bool:boolean){
        // this.starNode=instantiate(this.starPrefab);
        // this.starNode.parent=this.node;
        this.crown.active=bool;
        this.blockMaxSize.active=bool;
        //TODO:动画有问题，延后处理
        
        // let anim=this.starNode.getComponent(Animation);
        // if(bool){
        //     this.starNode.active=true;
        //     anim.play("starAnimation");
        // }else{
        //     this.starNode.active=false;
        //     anim.stop();
        // }
       
    }

    // //设置宝箱状态为激活
    // setTreasureByRandomGain(bool:boolean){
    //     this.treasure.active=bool;
    // }

    // //设置提示（因为只有前三次提示，所以分开做）
    // setTipsInBlock(){
    // let opacity=this.tip.getComponent(UIOpacity);
    //     tween(opacity)
    //         .to(1,{opacity:255})
    //         .delay(2)
    //         .to(1,{opacity:0})
    //         .start();
    // }
    
    //格子被点击
    setIsInTouch(intouch:boolean){
        let touchAgain=this.inTouch==intouch;  
        this.inTouch=intouch;   //改回初始值
        return touchAgain;      //返回保存值
    }

     //点击位置是否在格子上
     isTouchBlock(touchPos:Vec3):boolean{

        let pos=this.node.getPosition();
        let contentSize=this.node.getComponent(UITransform).contentSize;

        let maxPosX=pos.x+contentSize.width/2;   //从锚点出发，往x轴正方向
        let minPosX=pos.x-contentSize.width/2;   //从锚点出发，往x轴反方向

        let maxPosY=pos.y+contentSize.height/2;   //从锚点出发，往y轴正方向
        let minPosY=pos.y-contentSize.height/2;   //从锚点出发，往y轴反方向

        let touchPosX=touchPos.x;   //点击位置的x,y
        let touchPosY=touchPos.y;
        if(touchPosX<maxPosX && touchPosX>minPosX && touchPosY<maxPosY && touchPosY>minPosY){
            return true;
        }else{
            return false;
        }
    }
    
    getColor(){
        return this.color;
    }

    //点击格子缓动
    playAnimation(){
        tween(this.node)
        .set({scale:new Vec3(1,1,0)})
        .by(blockScaleAnimation.time/2,{scale:new Vec3(blockScaleAnimation.scale,blockScaleAnimation.scale,1)})
        .by(blockScaleAnimation.time/2,{scale:new Vec3(-blockScaleAnimation.scale,-blockScaleAnimation.scale,1)})
        .start();
    }

    getValue(){
        return this.powerOfTwo;
    }

    getIsInTouched(){
        return this.inTouch;
    }

    //二倍界面当前块
    createNowBlock(){
        this.bg.scale=new Vec3(1.4,1.4,1.4);
        this.value.getComponent(UIOpacity).opacity=120;
        this.value.fontSize=55;
        this.value.lineHeight=55;
    }

    //二倍界面下一个块
    CreateNextBlock(){
        this.bg.scale=new Vec3(1,1,1);
        this.value.getComponent(UIOpacity).opacity=255;
        this.value.fontSize=42;
        this.value.lineHeight=42;
    }

    //突破界面正中间块
    CreateBigBlock(){
        this.bg.scale=new Vec3(1.8,1.8,1.8);
        this.value.getComponent(UIOpacity).opacity=255;
        this.value.fontSize=80;
        this.value.lineHeight=80;
    }

    showDoubleAnimation(touchedX,touchedY,value,color){
        tween(this.node)
            .to(blockScaleAnimation.time / 2, { scale: new Vec3(0, 0, 1) })
            .call(() => {
                this.initBlock(touchedX, touchedY, value, color);
                this.setCrownInMax(true);
            })
            .to(blockScaleAnimation.time / 2, { scale: new Vec3(1, 1, 1) })
            .start();
    }
}



import { _decorator, Component, Node, Prefab, NodePool, instantiate, Vec2, UITransform, find, EventTouch, director, Camera, v3, Vec3, Sprite, game, color, tween } from 'cc';
import { blockSetting } from '../blockSetting';
import { clearEffect, effectActioin, propType } from '../Common/Enum';
// import { clearEffect } from '../Common/Enum';
import tools from '../Common/Tools';
import { GameMain } from '../GameMain';
import { exchangeLayer } from '../Layer/exchangeLayer';
import { hammerLayer } from '../Layer/hammerLayer';
import gameInitManager from '../Manager/GameManager';
import { blockControler } from './blockControler';
import { skillControler } from './skillControler';
import { AdLogUtil } from '../../Extend/Ad/Util/AdLogUtil';
const { ccclass, property } = _decorator;

@ccclass('touchControler')
export class touchControler extends Component {

    @property(Prefab)  //连接线
    line:Prefab=null;

    // lineCount:number=0;  //连接n条线奖励钻石/道具  //暂时无用，使用lineCount替代

    // addDiamond:number=0;   //给多少钻石  //暂时无用，使用diamond替代

    linePool:NodePool;  //连线节点池

    canTouchContainer:boolean=true;  //画布能否操作
    touchedBlock:boolean=false;      //格子有无被点击

    lastBlockPos :Vec2;   //方块合成后，最后生成的位置
    touchedBlockList :Vec2[]=[];  //存储点击过的方块坐标的临时列表

    lineList:Node[]=[]; //在此暂存生成的线
    lineListIndex:number =0;  //键值

    lastMaxNumber:number=0;   //消除前的最大值

    beenDestory:boolean=false;  //是否摧毁格子
    beenExchange:boolean=false;  //是否交换

    closeWindowExchange:boolean=false;  //用于判断是否退出了交换界面

    // clearNum:number=0;  //消除的次数

    // lineNumListHammer:Number[]=[];  //锤子奖励
    // lineNumListExchange:Number[]=[];  //交换奖励
    // lineNumListRefresh:Number[]=[];  //刷新奖励

    // firstComboCount:boolean=true;   //达到n次连击奖励后不继续向下寻找

    start() {
        this.linePool =new NodePool();
        for(let i=0;i<5*8-1;i++){
            let line=instantiate(this.line);
            this.linePool.put(line);
        }
        //挂载在节点上
        this.node.on(Node.EventType.TOUCH_START,this.touchStart,this);  //点击事件、回调、对象
        this.node.on(Node.EventType.TOUCH_MOVE,this.touchMove,this);
        this.node.on(Node.EventType.TOUCH_END,this.touchEnd,this);
        this.node.on(Node.EventType.TOUCH_CANCEL,this.touchEnd,this);
    }

    touchStart(event:EventTouch){
        // this.firstComboCount=true;
        //重置不在块上进行操作，所以不需要在touchStart里面进行重写

        if(!this.canTouchContainer){
            return;
        }
        this.initNode(true);

        //动画、金币控制
        let gameMainNode=find("Canvas/GameMain");   //主控
        let controlGameMainNode=gameMainNode.getComponent(GameMain);

        //方块连接控制
        let blockContainer=find("Canvas/GameMain/blockContainer");  //生成方块
        let controlBlockContainer=blockContainer.getComponent(blockControler);
        
        //技能控制
        let skillNode=find("Canvas/GameMain/blockContainer/skill");
        let controlSkillNode=skillNode.getComponent(skillControler);

        controlGameMainNode.isShowCombo=false;   //连击状态置为初始值

        let location=event.getLocation();
        let camera=director.getScene().getComponentInChildren(Camera);
        //世界坐标与本地坐标：https://betheme.net/news/txtlist_i145133v.html?action=onClick
        let worldPos=camera.screenToWorld(v3(location.x,location.y));   //世界坐标（左上角为原点）
        let gridPos=blockContainer.getComponent(UITransform).convertToNodeSpaceAR(worldPos);  //本地坐标（转锚点为原点计算）
        let beenTouchedNode = controlBlockContainer.getTouchedBlock(gridPos);  //被触摸的格子坐标(以锚点为原点，数组从左上角开始算值，所以左上角为0,0)

        if(!beenTouchedNode){  //未被触摸
            this.touchedBlock=false;
            return;
        }

        //技能-敲碎方块
        if(this.beenDestory){
            this.beenDestory=false;
            this.touchedBlock=false;
            let maxValue=gameInitManager.getGameMainDataManager().getCurrentMaxValue();
            let value=gameInitManager.getGameMainDataManager().blockDataList.getValue(beenTouchedNode.y,beenTouchedNode.x);
            if(value>=maxValue){  //最大的方块不能敲
                return;
            }
            let color=gameInitManager.getGameMainDataManager().getBlockColor(value);
            let touchPos=controlBlockContainer.vecPos(beenTouchedNode.x,beenTouchedNode.y);
            controlBlockContainer.destroyBlockAnimation(beenTouchedNode.x,beenTouchedNode.y);  //直接回收点击的方块
            controlSkillNode.skillDestoryBlock(touchPos,color);   //播放敲碎砖块的动画
            this.scheduleOnce(()=>{
                controlSkillNode.fillNode();  //填充空缺(从上往下)
                controlBlockContainer.prepareBlock();  //生成最上面一行的方块
            },effectActioin.hammerTime+clearEffect.destoryTime2);

            // gameInitManager.getDiamondManager().subDiamond(-gameInitManager.getLocalDataManager().getDiamondByItemName("delete"));
            gameInitManager.getDiamondManager().subDiamond(-100);
            // gameInitManager.getLocalDataManager().setDiamondByItemName("delete");
            gameInitManager.getLocalDataManager().setTimesByItemName("deleteTimes",false);
            controlGameMainNode.setDiamondLabel();            
            controlGameMainNode.setLabelTimes("deleteTimes",gameInitManager.getLocalDataManager().getTimesByItemName("deleteTimes"));
            controlGameMainNode.isPropEnough(propType.hammer);
            let controlHammerLayer=controlGameMainNode.hammerLayer.getComponent(hammerLayer);
            controlHammerLayer.hideLayer();
            return;
        }
        //技能-交换方块
        if(this.beenExchange){
            let exchangeList=[];
            let canPush:boolean=true;
            for(let i=0;i<this.touchedBlockList.length;i++){
                if(this.touchedBlockList[i].x==beenTouchedNode.x && this.touchedBlockList[i].y==beenTouchedNode.y){
                    controlSkillNode.showOrCloseChooseAnimation(controlBlockContainer.vecPos(beenTouchedNode.x,beenTouchedNode.y),false);
                    canPush=false;
                }else{
                    exchangeList.push(this.touchedBlockList[i]);  
                }
            }
            if(canPush){
                controlSkillNode.showOrCloseChooseAnimation(controlBlockContainer.vecPos(beenTouchedNode.x,beenTouchedNode.y),true);
                this.touchedBlockList.push(beenTouchedNode);  //不然就把该点加入list
            }else{
                this.touchedBlockList=exchangeList;
                return;
            }
            if(this.touchedBlockList.length>1){  //list里已有两个点
                this.beenExchange=false;  //初始化下次接着用
                let fristNodeGridPos=this.touchedBlockList[0];
                let secondNodeGridPos=this.touchedBlockList[1];

                let firstNode=gameInitManager.getGameMainDataManager().blockNodeList.getValue(fristNodeGridPos.y,fristNodeGridPos.x);
                let secondNode=gameInitManager.getGameMainDataManager().blockNodeList.getValue(secondNodeGridPos.y,secondNodeGridPos.x);

                // let controlFirNode=firstNode.getComponent(blockSetting);
                // let controlSecNode=secondNode.getComponent(blockSetting);

                let fristNodePos=firstNode.getPosition();  //获取它的真实坐标
                let secondNodePos=secondNode.getPosition();

                gameInitManager.getGameMainDataManager().blockNodeList.setValue(fristNodeGridPos.y,fristNodeGridPos.x,secondNode);  //交换数值
                gameInitManager.getGameMainDataManager().blockNodeList.setValue(secondNodeGridPos.y,secondNodeGridPos.x,firstNode);

                // controlFirNode.setBlockInContainer(secondNode.x,secondNode.y);  //交换位置
                // controlSecNode.setBlockInContainer(firstNode.x,firstNode.y);

                gameInitManager.getGameMainDataManager().setAllBlockDataByNodeList();
                
                this.touchedBlockList=[];   //交换后把列表置空,下次再用

                this.scheduleOnce(()=>{
                    tween(firstNode)
                        .parallel(
                            tween(firstNode).to(effectActioin.exchangeTime,{position:secondNodePos}),
                            tween(firstNode).by(effectActioin.exchangeTime,{angle:-360})
                        )
                        .start();
                    tween(secondNode)
                        .parallel(
                            tween(secondNode).to(effectActioin.exchangeTime,{position:fristNodePos}),
                            tween(secondNode).by(effectActioin.exchangeTime,{angle:-360})
                        )
                        .start();
                        controlSkillNode.closeAnimaion();
                },effectActioin.exchangeTime);

                gameInitManager.getDiamondManager().subDiamond(-100);
                // gameInitManager.getDiamondManager().subDiamond(-gameInitManager.getLocalDataManager().getDiamondByItemName("exchange"));
                // gameInitManager.getLocalDataManager().setDiamondByItemName("exchange");
                gameInitManager.getLocalDataManager().setTimesByItemName("exchangeTimes",false);
                controlGameMainNode.setDiamondLabel();            
                controlGameMainNode.setLabelTimes("exchangeTimes",gameInitManager.getLocalDataManager().getTimesByItemName("exchangeTimes"));
                controlGameMainNode.isPropEnough(propType.exchange);
                let controlExchangeLayer=controlGameMainNode.exchangeLayer.getComponent(exchangeLayer);
                controlExchangeLayer.hideLayer();
            }
            this.touchedBlock=false;
            
            return;
        }
        
        this.touchedBlock=true;
        
        this.lastBlockPos=beenTouchedNode;
        this.touchedBlockList.push(beenTouchedNode);   //存放被触摸的格子坐标

        let line=this.createLine();
        let touchedBlockPos = controlBlockContainer.vecPos(beenTouchedNode.x,beenTouchedNode.y);  //触摸方块的坐标
        this.createConnectLine(touchedBlockPos,touchedBlockPos,line);   //从格子创建新连线

        AdLogUtil.Log(`点击的格子坐标 :${beenTouchedNode}`);
        AdLogUtil.Log(`触碰的格子的坐标:${touchedBlockPos}`);

        controlBlockContainer.touchedAnimation(beenTouchedNode);  //触摸时放大
    }

    initNode(setTouch:boolean=false){
        
        if(setTouch){  //可控
            let rows=gameInitManager.getGameMainDataManager().rows;
            let cols=gameInitManager.getGameMainDataManager().cols;
            for(let y=0;y<rows;y++){
                for(let x=0;x<cols;x++){
                    let node=gameInitManager.getGameMainDataManager().blockNodeList.getValue(y,x);   //获取节点值
                    let controlNode=node.getComponent(blockSetting);
                    controlNode.setIsInTouch(false);  //改回初始值下次用
                }
            }
        }
        for(let i=0;i<this.lineList.length;i++){
            let line=this.lineList[i];
            line.getComponent(UITransform).width=0;
            line.angle=0;   //回收,不然重复点击出错
            this.linePool.put(this.lineList[i]);
        }
        this.lastBlockPos=null;
        this.lineListIndex=0;
        this.lineList=[];
    }
    
    touchMove(event){
        if(!this.canTouchContainer){
            return;
        }
        if(!this.touchedBlock){
            return;
        }
        if(!this.lastBlockPos){
            return;
        }

        //方块连接控制
        let blockContainer=find("Canvas/GameMain/blockContainer");  //生成方块
        let controlBlockContainer=blockContainer.getComponent(blockControler);

        let beginPos=controlBlockContainer.vecPos(this.lastBlockPos.x,this.lastBlockPos.y);  //起始连线位置：最后一次触碰到的格子坐标（x,y)
        let location=event.getLocation();
        let camera=director.getScene().getComponentInChildren(Camera);  

        let worldPos=camera.screenToWorld(v3(location.x,location.y));   //获取当前动作所在位置的世界坐标（左上角为原点）
        let endPos=blockContainer.getComponent(UITransform).convertToNodeSpaceAR(worldPos);  //转锚点为原点计算，AR取到的坐标为锚点坐标
        let beenTouchedNode=controlBlockContainer.beInNineBlock(this.lastBlockPos.x,this.lastBlockPos.y,endPos);
        if(beenTouchedNode){  //周围8个方块存在
            if(this.lastBlockPos.x==beenTouchedNode.x && this.lastBlockPos.y==beenTouchedNode.y){
                this.createConnectLine(beginPos,endPos);
                return;
            }
           
        if (this.touchedBlockList[this.touchedBlockList.length - 1].x == beenTouchedNode.x
                && this.touchedBlockList[this.touchedBlockList.length - 1].y == beenTouchedNode.y) {//连线没连过去或者取消连线
                controlBlockContainer.setIsBeenTouchedByPos(this.lastBlockPos.x, this.lastBlockPos.y, false);
                let length = this.lineList.length;
                this.lineList[length - 1].setPosition(9999, 9999);  //坐标最大值为数组长度-1
                this.lineList[length - 1].getComponent(UITransform).width = 0;
                this.lineList[length - 1].angle = 0;//被对象池回收时，不会修改节点的相关值，需要手动初始化
                this.linePool.put(this.lineList[length - 1]);
                this.lineList.pop();   //lineList管理已经连出去的连线，因为取消连线了，所以line出栈（表示未连接），节点池入池
                if (length > 1) {  //已有生成的节点
                    this.lineList[length - 2].setPosition(9999, 9999);
                    this.lineList[length - 2].getComponent(UITransform).width = 0;
                    this.lineList[length - 2].angle = 0;//被对象池回收时，不会修改节点的相关值，需要手动初始化
                    this.linePool.put(this.lineList[length - 2]);   //节点池回收(>第一次以上的连接)
                    this.lineList.pop();
                }
            controlBlockContainer.touchedAnimation(this.lastBlockPos); 
            this.lineListIndex = this.lineListIndex - 1 < 0 ? 0 : this.lineListIndex - 1;  //如果是第一次连接取消，就直接让线不要
            this.lastBlockPos=this.touchedBlockList[this.touchedBlockList.length-1];  //最后一次点击的方块入栈
            if(this.touchedBlockList[0].x!=this.lastBlockPos.x || this.touchedBlockList[0].y!=this.lastBlockPos.y){  //第一次连接时，就算没有连上也不要删掉
                this.touchedBlockList.pop();  //只出栈，不回收
            }
            this.createSumBlock(this.touchedBlockList,this.lastBlockPos);  //创建最大值方块

            let line=this.createLine();
            let touchBlockPos=controlBlockContainer.vecPos(beenTouchedNode.x,beenTouchedNode.y); //触摸到的当前节点坐标
            this.createConnectLine(touchBlockPos,touchBlockPos,line);  //创建新连线
            return;
        }
            let currentNumber=controlBlockContainer.getNumberByPos(this.lastBlockPos.x,this.lastBlockPos.y);  //当前值
            let nextNumber=controlBlockContainer.getNumberByPos(beenTouchedNode.x,beenTouchedNode.y);  //碰到的值
            if ((nextNumber == currentNumber || (nextNumber == currentNumber + 1 && this.lineListIndex > 0))
                && (!controlBlockContainer.getIsBeenTouchedByPos(beenTouchedNode.x, beenTouchedNode.y))) {//判断是否能连
                //连接条件：1、下个数字与当前数字相同(第一次-第n次)  2、下个数字比当前数字大(如果是第一个数字与第二个数字相连，则还需要一个相同的数字)  3、下个要被连接的数字还未被连接过
                let endPos=controlBlockContainer.vecPos(beenTouchedNode.x,beenTouchedNode.y);
                let line=this.createLine();
                let touchedBlockPos=controlBlockContainer.vecPos(beenTouchedNode.x,beenTouchedNode.y); //触碰到的格子坐标

                controlBlockContainer.touchedAnimation(beenTouchedNode);
                controlBlockContainer.setIsBeenTouchedByPos(this.lastBlockPos.x,this.lastBlockPos.y,true);   //上个被触摸格子，设置为true
                controlBlockContainer.setIsBeenTouchedByPos(beenTouchedNode.x,beenTouchedNode.y,true);  //这次被触摸格子，设置为true，连接

                if(this.touchedBlockList[0].x!=this.lastBlockPos.x || this.touchedBlockList[0].y!=this.lastBlockPos.y){  //第一次连接时，只有一个方块，要避免存两次
                    this.touchedBlockList.push(this.lastBlockPos);
                }
                this.lastBlockPos=beenTouchedNode;
                this.createConnectLine(beginPos,endPos);
                this.createSumBlock(this.touchedBlockList,this.lastBlockPos);
                this.createConnectLine(touchedBlockPos,touchedBlockPos,line);
                this.lineListIndex+=1;
            }else{
                this.createConnectLine(beginPos,endPos);
            }
        }else{
            this.createConnectLine(beginPos,endPos);
        }
        
    }

    touchEnd(event){
        if(!this.canTouchContainer){
            return;
        }
        if(!this.touchedBlock){
            return;
        }
        if(!this.lastBlockPos){
            return;
        }

        this.touchedBlock=false;  //要将格子的状态改为未被点击

         //动画、金币控制
         let gameMainNode=find("Canvas/GameMain");   //主控
         let controlGameMainNode=gameMainNode.getComponent(GameMain);
 
         //方块连接控制
         let blockContainer=find("Canvas/GameMain/blockContainer");  //生成方块
         let controlBlockContainer=blockContainer.getComponent(blockControler);

         controlGameMainNode.setSumBlock(false);  //开始时不展示连接的block
         
         if(this.lineListIndex>0){
            
            // if(this.lineListIndex<=9){
            if(this.lineListIndex>=4 && this.lineListIndex<=8){
                //废弃
                //look-up表：https://www.gxlcms.com/JavaScript-253117.html,look-up表需要从高向低排
                // let lineCount=[9,4];
                // let diamond=[5,1];
                // for(let i=0;i<lineCount.length;i++){
                //     if(this.lineListIndex>=lineCount[i]){
                //         //加钻石算法
                //         console.log("this.lineListIndex ",this.lineListIndex);
                //         console.log("lineCount[i] ",lineCount[i]);
                //         gameInitManager.getDiamondManager().subDiamond(diamond[i]);
                //         // this.firstComboCount=false;
                //         this.scheduleOnce(()=> {
                //             controlGameMainNode.showAddDiamondAnimation();
                //         },clearEffect.actionTime);
                //         // }
                //         controlGameMainNode.showComboText(this.lineListIndex);
                //         this.scheduleOnce(()=>{
                //             gameInitManager.getSoundManager().playSound("combo");
                //         },0.5);
                //         break;
                        
                //     }
                // }
                gameInitManager.getDiamondManager().subDiamond(1);
                this.scheduleOnce(()=>{
                    controlGameMainNode.showAddDiamondAnimation();
                },clearEffect.actionTime);
                controlGameMainNode.showComboText(this.lineListIndex);
                this.scheduleOnce(()=>{
                    gameInitManager.getSoundManager().playSound("combo");
                },0.5);
            }else if(this.lineListIndex>=9 && this.lineListIndex<=13){
                switch(this.lineListIndex){
                    case 9:
                        controlGameMainNode.showCombo10Layer();
                        break;
                    case 10:
                        controlGameMainNode.showCombo11Layer();
                        break;
                    case 11:
                        controlGameMainNode.showCombo12Layer();
                        break;
                    case 12:
                        controlGameMainNode.showCombo13Layer();
                        break;
                    case 13:
                        controlGameMainNode.showCombo14Layer();
                        break;
                }
            }else if(this.lineListIndex>=14){
                this.randomGainReward();
            }

            // //暂时用分开的数组计算，找到算法或性能有问题时优化
            // this.lineNumListHammer.push(this.lineListIndex);
            // this.lineNumListExchange.push(this.lineListIndex);
            // this.lineNumListRefresh.push(this.lineListIndex);

            // if(this.lineNumListHammer.every((line:number)=>line>=8) && this.lineNumListHammer.length==6){
            //     console.log("here");
            //     controlGameMainNode.showRewardHammerLayer();
            //     this.lineNumListHammer=[];
            // }else if(!(this.lineNumListHammer.every((line:number)=>line>=8))){
            //     this.lineNumListHammer=[];
            // }
            // if(this.lineNumListExchange.every((line:number)=>line>=9) && this.lineNumListExchange.length==4){
            //     console.log("here1");
            //     controlGameMainNode.showRewardExchangeLayer();
            //     this.lineNumListExchange=[];
            // }else if(!(this.lineNumListExchange.every((line:number)=>line>=9))){
            //     this.lineNumListExchange=[];
            // }
            // if(this.lineNumListRefresh.every((line:number)=>line>=11) && this.lineNumListRefresh.length==3){
            //     console.log("here2");
            //     controlGameMainNode.showRewardRefreshLayer();
            //     this.lineNumListRefresh=[];
            // }else if(!(this.lineNumListRefresh.every((line:number)=>line>=11))){
            //     this.lineNumListRefresh=[];
            // }

            this.canTouchContainer=false;
            this.lastMaxNumber=gameInitManager.getGameMainDataManager().getCurrentMaxValue();
            this.scheduleOnce(()=>{
                this.canTouchContainer=true;
                let currentMaxNumber=gameInitManager.getGameMainDataManager().getCurrentMaxValue();
                if(this.lastMaxNumber<currentMaxNumber && currentMaxNumber>=9){
                    controlGameMainNode.showUnlockLayer(currentMaxNumber);
                }
            },clearEffect.clear);
            if(this.lastBlockPos!=this.touchedBlockList[0]){
                //宝箱部分,暂时去除
                //TODO:在这里判断是否+1
                // let clearNum=gameInitManager.getLocalDataManager().getClearNumByLocalData();
                // // console.log("clearNum is ",clearNum);
                // gameInitManager.getLocalDataManager().setClearNumToLocalData(clearNum+1);
                // // console.log(this.lastBlockPos.y,this.lastBlockPos.x);
                // let node=gameInitManager.getGameMainDataManager().blockNodeList.getValue(this.lastBlockPos.y,this.lastBlockPos.x);
                // let nodeT:Node=node.getChildByName("treasure");
                // if(nodeT.active){
                //     //展示宝箱激励
                //     controlGameMainNode.showTreasureLayer();
                //     nodeT.active=false;
                // }
                this.destoryBlock(this.touchedBlockList,this.lastBlockPos);
                controlBlockContainer.subAndClearBlock(this.lastBlockPos);
            }
            if(this.lineListIndex>4){
                gameInitManager.getSoundManager().playSound("compose3");  
            }
         }else{  
            controlBlockContainer.setIsBeenTouchedByPos(this.lastBlockPos.x,this.lastBlockPos.y,false);  //如果松开手时没有线,就把点击状态改为初始值
         }
         this.initControlData();
         this.touchedBlockList=[];
    }

    randomGainReward(){
        let windowCount=Math.floor((Math.random()*(3-1+1)+1));
        let node=find("Canvas/GameMain");
        let controlNode=node.getComponent(GameMain);
        switch(windowCount){
            case 1:
                controlNode.showRewardHammerLayer();
                break;
            case 2:
                controlNode.showRewardExchangeLayer();
                break;
            case 3:
                controlNode.showRewardRefreshLayer();
                break;
        }
    }

    createLine(){
        let line:Node=null;
        if(this.linePool.size()>0){
            line=this.linePool.get();   //有则从节点池中取
        }else{
            line=instantiate(this.line);  //无则生成
        }
        line.parent=this.node;
        this.lineList.push(line);
        return line;
    }
    
    //创建连线
    createConnectLine(beginPos:Vec3,endPos:Vec3,line?:Node){  //line可为空，第一个方块被触碰时不需要生成线
        let beginX=beginPos.x;
        let beginY=beginPos.y;
        let endX=endPos.x;
        let endY=endPos.y;

        if(!line){ //生成线
            line=this.lineList[this.lineListIndex];
            let pos=new Vec3((beginX+endX)/2,(beginY+endY)/2,0);  //因为Line要连接8个方向方块，所以将Line的中点置于两个方块间距的中点
            line.setPosition(pos);
        }

        let lineWidth=Math.sqrt((endX-beginX)*(endX-beginX)+(endY-beginY)*(endY-beginY));  //勾股定理，因为连接斜向时为斜边
        if(!lineWidth){
            return;
        }
        line.getComponent(UITransform).width=lineWidth;

        let angle:number=0;
        if((beginX-endX)*(beginY-endY)>0){  //往左上或者右下角挪
                angle=360*Math.atan(Math.abs(beginY-endY)/Math.abs(beginX-endX))/(2*Math.PI);  //弧转角
            }else{
                angle=180-(360*Math.atan(Math.abs(beginY-endY)/Math.abs(beginX-endX))/(2*Math.PI));
            }
            line.angle=angle;
            let lastBlockPos=this.lastBlockPos;  //最后一个触摸的格子
            let block=gameInitManager.getGameMainDataManager().blockNodeList.getValue(lastBlockPos.y,lastBlockPos.x);
            let controlBlock=block.getComponent(blockSetting);
            let color:string=controlBlock.getColor();
            line.getComponent(Sprite).color=tools.hexToRgb(color);   //将线的颜色设置为连接前的格子颜色
    }

    //创建合成的最大方块值
    createSumBlock(touchedBlockList:Vec2[],touchedBlockPos:Vec2){
        let node=find("Canvas/GameMain");
        let controlNode=node.getComponent(GameMain);
        if(touchedBlockList[0].x ==touchedBlockPos.x && touchedBlockList[0].y==touchedBlockPos.y){  //连回只剩一个时，没有线，取消block显示
            controlNode.setSumBlock(false);
        }else{
            let list:Vec2[]=[];
            for(let i=0;i<touchedBlockList.length;i++){
                list.push(touchedBlockList[i]);  //push了位置信息(x,y)
            }
            list.push(touchedBlockPos);  //push了位置中的坐标信息(x,y)
            controlNode.setSumBlock(true,list);  //list用于获取value最大值
        }
    }

    //摧毁方块
    destoryBlock(touchedBlockList:Vec2[],touchedBlockPos:Vec2){
        let blockList:Vec2[]=[]; //用于存储方块在数组中的位置坐标
        let gridPosList:Vec3[]=[];  //用于存储方块在容器中的位置信息
        let colorList:string[]=[];  //颜色信息
        let sumScore=0;
        let nodeBlockContainer =find("Canvas/GameMain/blockContainer");
        let controlNode=nodeBlockContainer.getComponent(blockControler);
        for(let i=0;i<touchedBlockList.length;i++){
            blockList.push(touchedBlockList[i]);
        }
        blockList.push(touchedBlockPos);
        for(let i=0;i<blockList.length;i++){
            gridPosList.push(controlNode.vecPos(blockList[i].x,blockList[i].y));  //获取方块在容器中的位置坐标
            let value=gameInitManager.getGameMainDataManager().blockNodeList.getValue(blockList[i].y,blockList[i].x);  //通过坐标取得value值
            let conrtrolBlockSetting = value.getComponent(blockSetting);
            sumScore+=Math.pow(2,conrtrolBlockSetting.getValue());   //取到value值
            colorList.push(conrtrolBlockSetting.getColor());         //根据value值不断改变颜色
        }
        let id=Math.ceil(Math.log2(sumScore));
        let color=tools.hexToRgb(gameInitManager.getGameMainDataManager().getBlockColor(id));
        let skillNode=find("Canvas/GameMain/blockContainer/skill");
        let controlSkillNode=skillNode.getComponent(skillControler);
        controlSkillNode.destoryBlock(gridPosList,colorList,color);
    }

    //控制格子初始化
    initControlData(setTouch:boolean=false){  //初始的点击值一定为false
        if(setTouch){  //被点击过的格子相加后一定要改回初始值
            let rows=gameInitManager.getGameMainDataManager().rows;
            let cols=gameInitManager.getGameMainDataManager().cols;
            for(let y=0;y<rows;y++){
                for(let x=0;x<cols;x++){
                    let value=gameInitManager.getGameMainDataManager().blockNodeList.getValue(y,x);
                    let controlValue=value.getComponent(blockSetting);
                    controlValue.setIsInTouch(false);
                }
            }
        }
        for(let i=0;i<this.lineList.length;i++){
            let line=this.lineList[i];
            line.setPosition(8888,8888);
            line.getComponent(UITransform).width=0;
            line.angle=0;
            this.linePool.put(this.lineList[i]);  //回收节点
        }
        this.lastBlockPos=null;
        this.lineListIndex=0;
        this.lineList=[];
    }

    //方块是否被摧毁
    setIsBeenDestory(){
        this.beenDestory=!this.beenDestory;
        this.beenExchange=false;
        this.touchedBlockList=[];
    }

    //方块是否被交换
    setIsBeenExchange(){
        this.beenExchange=!this.beenExchange;
        this.beenDestory=false;
        this.touchedBlockList=[];
    }
}



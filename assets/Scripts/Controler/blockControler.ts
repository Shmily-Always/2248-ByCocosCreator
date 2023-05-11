import { _decorator, Component, Node, Prefab, NodePool, instantiate, UITransform, Vec3, log, Vec2, game, error, find, TERRAIN_MAX_LEVELS, tween, UIOpacity, Label, view, Widget } from 'cc';
import { clearEffect, doubleArrInfo } from '../Common/Enum';
import { my2DArray } from '../Common/my2DArray';
import { GameMain } from '../GameMain';
import gameInitManager from '../Manager/GameManager';
import { LocalDataManager } from '../Manager/LocalDataManager';
import { skillControler } from './skillControler';
import { AdLogUtil } from '../../Extend/Ad/Util/AdLogUtil';
import { touchControler } from './touchControler';
import { blockSetting } from '../blockSetting';
const { ccclass, property } = _decorator;

@ccclass('blockControler')
export class blockControler extends Component {
    @property(Prefab)
    blockPrefab: Prefab = null;

    @property(Prefab)
    blockBigPrefab: Prefab = null;

    @property(Node)
    blockContainer: Node | null = null;

    @property({ tooltip: "方块下落的速度" })
    blockFallSpeed: number = 0;

    blockGapW: number = 0;  //间隔距离宽（只计算格子内部的间隔距离，与容器的边间隔距离不考虑）
    blockGapH: number = 0;  //间隔距离长（同上）
    blockSize: number = 0;   //格子宽高(正方形宽高一致)

    blockPool: NodePool;
    fallingBlockList: my2DArray;  //未掉落方块，用于消除时填充

    // canShowDoubleLayer:boolean=true;      //是否可展示x2界面
    beforeMaxValue: number = 0;  //上一次取得的最大值

    minValue: number = 1;  //最小值
    doubleGetArr: number[] = [];
    notTresure:boolean=true;
    start() {
        //在start的时候创造节点池用于回收方块:https://www.zhiu.cn/68200.html
        this.blockPool = new NodePool();
        this.scaleBlockContainer();
        this.fallingBlockList = new my2DArray(9, 5, null);  //多生成一行，作为补充

    }

    scaleBlockContainer() {
        let block = instantiate(this.blockPrefab);
        this.blockSize = block.getComponent(UITransform).contentSize.width; //格子组件宽
        let blockTransform = this.blockContainer.getComponent(UITransform);
        let blockGapW = (blockTransform.contentSize.width - this.blockSize * 5) / 4;
        let blockGapH = (blockTransform.contentSize.height - this.blockSize * 8) / 7;
        if (blockGapH > 40) {
            let nodeTop = find("Canvas/GameMain/gameTop/left");
            nodeTop.getComponent(Widget).bottom = -30;
            let block1 = instantiate(this.blockBigPrefab);
            this.blockSize = block1.getComponent(UITransform).contentSize.width;
            for (let i = 0; i < gameInitManager.getGameMainDataManager().rows * gameInitManager.getGameMainDataManager().cols; i++) {
                let block1 = instantiate(this.blockBigPrefab);
                this.blockPool.put(block1);  //填充节点池
            }
            this.blockGapW = (blockTransform.contentSize.width - 90 * 5) / 4;
            this.blockGapH = (blockTransform.contentSize.height - 90 * 8) / 9;
            this.blockContainer.parent.getComponent(UITransform).height = this.blockContainer.parent.getComponent(UITransform).height - this.blockGapH * 2;
            this.blockContainer.getComponent(UITransform).height = this.blockContainer.parent.getComponent(UITransform).height - 40 - this.blockGapH * 2;
            this.blockContainer.getComponent(Widget).top = 20;
            this.blockContainer.getComponent(Widget).bottom = 20;
        } else {
            for (let i = 0; i < gameInitManager.getGameMainDataManager().rows * gameInitManager.getGameMainDataManager().cols; i++) {
                let block = instantiate(this.blockPrefab);
                this.blockPool.put(block);  //填充节点池
            }
            this.blockGapW = blockGapW;
            this.blockGapH = blockGapH;

        }
    }

    createBlock(cols: number, rows: number, id: number, color: string) {
        let block: Node = null;
        if (this.blockPool.size() > 0) {
            block = this.blockPool.get();
        } else {
            block = instantiate(this.blockPrefab);
        }
        this.blockContainer.addChild(block);  //将生成的方块添加到容器
        block.getComponent(blockSetting).initBlock(cols, rows, id, color);
        return block;
    }

    //格子坐标转坐标
    vecPos(cols: number, rows: number): Vec3 {
        let offsetX = (this.blockContainer.getComponent(UITransform).contentSize.width) / 2;
        let offsetY = (this.blockContainer.getComponent(UITransform).contentSize.height) / 2;  //计算中点位置：(x/2,y/2)
        let blockSize = this.blockSize;
        let blockGapW = this.blockGapW;
        let blockGapH = this.blockGapH;
        let x = (blockSize + blockGapW) * (cols + 1) - (blockSize * 0.5 + blockGapW) - offsetX;  //列，横坐标
        let y = 0;
        if (rows < 0) {
            y = this.getFallingBlock(-rows);
        } else {
            y = this.blockContainer.getComponent(UITransform).contentSize.height - ((blockSize + blockGapH) * (rows + 1) - (blockSize * 0.5 + blockGapH)) - offsetY; //行，纵坐标
        }
        return new Vec3(x, y, 0);
    }

    //未下落的方块y值
    getFallingBlock(num: number) {
        let topY = this.vecPos(0, 0).y;
        return topY + (this.blockGapH + this.blockSize) * num;
    }

    //获取容器中所有被触摸到的格子坐标
    getTouchedBlock(touchPos: Vec3) {
        let rows = gameInitManager.getGameMainDataManager().rows;
        let cols = gameInitManager.getGameMainDataManager().cols;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let node = gameInitManager.getGameMainDataManager().blockNodeList.getValue(y, x);  //取节点坐标(数组排列：从左上角作为第一个坐标开始算坐标)
                let controlNode = node.getComponent(blockSetting);
                if (controlNode.isTouchBlock(touchPos)) {
                    return new Vec2(x, y);
                }
            }
        }
        return null;
    }

    //获取容器中所有格子的值(总分)
    getTotalNumberBlock() {
        let rows = gameInitManager.getGameMainDataManager().rows;
        let cols = gameInitManager.getGameMainDataManager().cols;
        let totalScore = 0;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let score = Math.pow(2, gameInitManager.getGameMainDataManager().blockDataList.getValue(y, x));
                totalScore = totalScore + score;
            }
        }
        return totalScore;
    }

    //格子的缩放动画
    touchedAnimation(lastBlockPos: Vec2) {
        gameInitManager.getSoundManager().playBlockSound();
        let rows = gameInitManager.getGameMainDataManager().rows;
        let cols = gameInitManager.getGameMainDataManager().cols;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (lastBlockPos.x === x && lastBlockPos.y === y) {
                    let node = gameInitManager.getGameMainDataManager().blockNodeList.getValue(y, x);
                    let controlNode = node.getComponent(blockSetting);
                    controlNode.playAnimation();
                }
            }
        }
    }

    //是否在触碰的格子周围
    beInNineBlock(centerX: number, centerY: number, touchBlock: Vec3) {  //触碰的格子x,y,坐标值
        let rows = gameInitManager.getGameMainDataManager().rows;
        let cols = gameInitManager.getGameMainDataManager().cols;
        for (let y = 0; y < rows; y++) { //循环内找的是该格子周围有几个可被连接的格子
            for (let x = 0; x < cols; x++) {
                if (y > centerY + 1 || y < centerY - 1 || x > centerX + 1 || x < centerX - 1) {  //从最中间的格子坐标开始（数组坐标），大不超过1，小也不小于1
                    continue;  //在范围之外的话就跳过，继续往下找在9格内的坐标
                }
                let node = gameInitManager.getGameMainDataManager().blockNodeList.getValue(y, x);
                let controlNode = node.getComponent(blockSetting);
                if (controlNode.isTouchBlock(touchBlock)) {//这里判断的是触点是否在容器内，如果不在的话就不做相应
                    return new Vec2(x, y);
                }
            }
        }
        return null;

    }

    /**通过坐标设置某个格子的点击状态(true/false)*/
    setIsBeenTouchedByPos(blockX: number, blockY: number, isBeenTouch: boolean) {
        let node = gameInitManager.getGameMainDataManager().blockNodeList.getValue(blockY, blockX);
        if (node) { //如果存在这个节点
            let controlNode = node.getComponent(blockSetting);
            if (!controlNode.setIsInTouch(isBeenTouch)) {
                AdLogUtil.Log(`set grid(${blockX},${blockY}) block isBeenTouch? to ${isBeenTouch}`);
            }
        }
    }

    //通过坐标获取某个格子的值
    getNumberByPos(blockX: number, blockY: number) {
        let value = gameInitManager.getGameMainDataManager().blockNodeList.getValue(blockY, blockX);
        if (value) {
            let controlNode = value.getComponent(blockSetting);
            return controlNode.getValue();
        }
        AdLogUtil.Error("can't find value,maybe the block is empty?pos(%s,%s)" + blockX + blockY);
    }

    /**通过坐标获取某个格子的点击状态(true/false)*/
    getIsBeenTouchedByPos(blockX: number, blockY: number) {
        let node = gameInitManager.getGameMainDataManager().blockNodeList.getValue(blockY, blockX);
        if (node) {
            let controlNode = node.getComponent(blockSetting);
            return controlNode.getIsInTouched();
        }
    }

    //合成、消除方块
    subAndClearBlock(beenTouchedNode: Vec2) {
        let rows = gameInitManager.getGameMainDataManager().rows;
        let cols = gameInitManager.getGameMainDataManager().cols;
        let sumScore = 0;  //合成后的值

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let node = gameInitManager.getGameMainDataManager().blockNodeList.getValue(y, x);
                let controlNode = node.getComponent(blockSetting);
                if (controlNode.getIsInTouched()) {
                    controlNode.setIsInTouch(false);  //对象池回收，手动改回初始值
                    sumScore += Math.pow(2, controlNode.getValue());  //合成后的值为2^n+2^n+2^n
                    this.blockPool.put(node); //回收节点
                    gameInitManager.getGameMainDataManager().blockNodeList.setValue(y, x, null);  //置方块为空
                }
            }
        }
        let id = Math.ceil(Math.log2(sumScore));   //当前合成值
        let maxValue = gameInitManager.getGameMainDataManager().getCurrentMaxValue();  //当前最大值
        let mainNode = find("Canvas/GameMain");
        let controlMainNode = mainNode.getComponent(GameMain);
        let color = gameInitManager.getGameMainDataManager().getBlockColor(id);

        gameInitManager.getGameMainDataManager().setSumScore(id);  //刷新并保存最大值
        gameInitManager.getLocalDataManager().setScoreToLocalData(gameInitManager.getGameMainDataManager().getSumScore());   //在此处存了最高分
        gameInitManager.getLocalDataManager().setNowScoreToLocalData(gameInitManager.getGameMainDataManager().getTotalScore().toString());
        controlMainNode.setScoreLabel(gameInitManager.getGameMainDataManager().getSumScore());
        controlMainNode.setNowScore(gameInitManager.getGameMainDataManager().getTotalScore());
        let nowScore = Number(gameInitManager.getLocalDataManager().getNowScoreByLocalData());
        let totalScore = Number(gameInitManager.getLocalDataManager().getTotalScoreByLocalData()) / 2;   //TODO:在此修改通关规则
        if (nowScore >= totalScore) {
            // this.scheduleOnce(() => {
                controlMainNode.showPassLayer();
            // }, 1);
        }
        controlMainNode.setHighScoreLabel(Number(gameInitManager.getLocalDataManager().getMaxScoreByLocalData()));

        this.scheduleOnce(() => {
            let skillNode = find("Canvas/GameMain/blockContainer/skill");
            let controlSkill = skillNode.getComponent(skillControler);
            controlSkill.fillNode();

            let node = this.createBlock(beenTouchedNode.x, beenTouchedNode.y, id, color);
            node.setPosition(this.vecPos(beenTouchedNode.x, beenTouchedNode.y));
            gameInitManager.getGameMainDataManager().blockNodeList.setValue(beenTouchedNode.y, beenTouchedNode.x, node);
            this.prepareBlock();
            // if(maxValue>=9 &&id==maxValue &&this.canShowDoubleLayer){
            //     controlMainNode.showDoubleEffectLayer(beenTouchedNode);
            //     this.canShowDoubleLayer=false;
            //     this.beforeMaxValue=id;
            // }

            // if(id>this.beforeMaxValue){
            //     this.canShowDoubleLayer=true;
            // }

            if (id >= 9 && id >= this.beforeMaxValue) {
                this.beforeMaxValue = maxValue > id ? maxValue : id;
                // let doubleInfo:number[]=[];
                // doubleInfo.push(id);
                gameInitManager.getLocalDataManager().setDoubleInfoToLocalData(this.beforeMaxValue > id ? this.beforeMaxValue : id);
                let getValue = gameInitManager.getLocalDataManager().getDoubleInfoByLocalData();
                this.doubleGetArr = JSON.parse(getValue);
                if (this.doubleGetArr.length == 2) {
                    // for(let i=0;i<this.doubleGetArr.length;i++){
                    if (this.doubleGetArr[0] == this.doubleGetArr[1]) {  //有两个相同数时
                        controlMainNode.showDoubleEffectLayer(beenTouchedNode);
                        // doubleInfo.splice(0,doubleInfo.length);
                        gameInitManager.getLocalDataManager().setDoubleInfoToLocalData(doubleArrInfo.empty);
                    } else if (this.doubleGetArr[0] != this.doubleGetArr[1]) {
                        // doubleGetArr.shift();
                        gameInitManager.getLocalDataManager().setDoubleInfoToLocalData(doubleArrInfo.delete);
                        // }
                    }
                }
            }
        }, clearEffect.actionTime);
    }
    prepareBlock() {
        let rows = gameInitManager.getGameMainDataManager().rows;
        let cols = gameInitManager.getGameMainDataManager().cols;
        let isChange = false;  //数据合成
        let isHaveEmptyBlock = false; //有没有空白的格子
        let haveEmptyNum = 0;
        let emptyList: Vec2[] = [];
        let downList: Vec2[] = [];

        for (let x = 0; x < cols; x++) {
            isHaveEmptyBlock = false;
            haveEmptyNum = 0;
            emptyList = [];
            downList = [];

            for (let y = rows - 1; y >= 0; y--) {  //坐标从0开始
                if (gameInitManager.getGameMainDataManager().blockNodeList.getValue(y, x) == null) {//有空节点
                    isHaveEmptyBlock = true;
                    haveEmptyNum += 1;
                    emptyList.push(new Vec2(x, y));  //存下来空节点的坐标
                }
            }
            if (isHaveEmptyBlock) {
                isChange = true;
                let fillList: Vec2[] = [];
                for (let y = emptyList[0].y; y >= 0; y--) {
                    fillList.push(new Vec2(x, y));
                    if (gameInitManager.getGameMainDataManager().blockNodeList.getValue(y, x) != null) {  //如果是可以合成的
                        downList.push(new Vec2(x, y));  //填充新的值
                    }
                }
                for (let i = 1; i <= haveEmptyNum; i++) { //有空余的方块就随机填充
                    let id = gameInitManager.getGameMainDataManager().randomGain();
                    let color = gameInitManager.getGameMainDataManager().getBlockColor(id);
                    let node = this.createBlock(x, -i, id, color);  //哪一列空了就在哪一列进行填充
                    node.setPosition(this.vecPos(x, -i));
                    this.fallingBlockList.setValue(i, x, node); //fallingBlockList:未掉落方块，用于消除时填充
                    downList.push(new Vec2(x, -i));
                }
                this.downAction(fillList, downList, x);
            }
        }
        if (isChange) {  //下落时改变了值
            gameInitManager.getGameMainDataManager().setAllBlockDataByNodeList();
            gameInitManager.getGameMainDataManager().initMaxBlock();
            //TODO:看看需不需要在此存放宝箱位置
            let blockDataList: my2DArray = gameInitManager.getGameMainDataManager().blockDataList;
            gameInitManager.getLocalDataManager().setBlockDataToLocalData(blockDataList);
        } else {
            error("blockNodeList cannot find empty blocks");
        }
    }


    /**传参列表：
     * @param fillList:下落目标位置
     * @param downList:未下落的方块位置
     * @param cols：准备下落的列位置
     */
    downAction(fillList: Vec2[], downList: Vec2[], cols?: number) {
        if (fillList.length != downList.length) { //需要填充的方块数量！=下落的方块数量
            // error(`fillList.length ${fillList.length}!=downLlist.length${downList.length}`);
            return;
        }
        let x = cols ? cols : fillList[0].x || downList[0].x;
        for (let i = 0; i < downList.length; i++) { //未下落block数组长度

            let targetFillPos = fillList[i];
            let downListPos = downList[i];

            let beginPos = this.vecPos(x, downListPos.y);   //垂直下落时x值不发生改变，y值改变
            let endPos = this.vecPos(x, targetFillPos.y);

            let downActionTime = (beginPos.y - endPos.y) / this.blockFallSpeed;  //下落时间

            let node: Node = null;
            if (downListPos.y < 0) {  //如果未下落的方块还未在容器中
                node = this.fallingBlockList.getValue(-downListPos.y, x);
                let conrtorlNode = node.getComponent(blockSetting);
                // conrtorlNode.setBlockInContainer(x, targetFillPos.y);
                gameInitManager.getGameMainDataManager().blockNodeList.setValue(targetFillPos.y, x, null);
                gameInitManager.getGameMainDataManager().blockNodeList.setValue(targetFillPos.y, x, node);
                tween(node)
                    .to(downActionTime, { position: endPos })
                    .start();
            } else { //如果未下落的方块已经在容器中，直接下落
                node = gameInitManager.getGameMainDataManager().blockNodeList.getValue(downListPos.y, x);    //取下落方块的数值
                gameInitManager.getGameMainDataManager().blockNodeList.setValue(targetFillPos.y, x, node);  //填充
                tween(node)
                    .to(downActionTime, { position: endPos })
                    .start();
            }
        }
        // let haveTreasure=gameInitManager.getLocalDataManager().getHaveTreasure();
        // let clearNum=gameInitManager.getLocalDataManager().getClearNumByLocalData();
        // if(!haveTreasure && clearNum==12){
        //     this.randomSetTreasure();
        // }
        this.fallingBlockList = new my2DArray(9, 5, null); //多生成一行，值置空
    }

    // //增加宝箱
    // randomSetTreasure(){
    //     // let rows=gameInitManager.getGameMainDataManager().rows-1;
    //     // let cols=gameInitManager.getGameMainDataManager().cols-1;
    //     let randomRows=0;
    //     let randomCols=0;
    //     let node:Node;
    //     // console.log("notTreasure?",this.notTresure);
    //     while(this.notTresure){
    //         randomRows=Math.floor(Math.random()*(7-0+1))+0;
    //         randomCols=Math.floor(Math.random()*(4-0+1))+0;
    //         // console.log("randomRows is ",randomRows);
    //         // console.log("randomCols is ",randomCols);
    //         node=gameInitManager.getGameMainDataManager().blockNodeList.getValue(randomRows,randomCols);
    //         //TODO:node在此处可能出现为空的问题，暂时判空解决，日后再改
    //         // console.log("node is ",node);
    //         if(node){
    //             let crown=node.getChildByName("max");
    //             // console.log("active is ",crown.active);
    //             if(crown.active==false && node!=null){  //如果宝箱生成的地方不在最大值上
    //                 let setBlock=node.getComponent(blockSetting);
    //                 setBlock.setTreasureByRandomGain(true);
    //                 let tipNum=gameInitManager.getLocalDataManager().getTipNum();
    //                 // console.log("tipNum is ",tipNum);
    //                 if(tipNum<=3){
    //                     // console.log("siblingdex ",node.getSiblingIndex());
    //                     node.setSiblingIndex(99);
    //                     setBlock.setTipsInBlock();
    //                     tipNum+=1;
    //                     // console.log("tipNum is ",tipNum);
    //                     gameInitManager.getLocalDataManager().setTipNum(tipNum); 
    //                 }
    //                 gameInitManager.getLocalDataManager().setHaveTreasure(1);
    //                 this.notTresure=false;
    //                 gameInitManager.getLocalDataManager().setTreasurePos(randomRows,randomCols);
    //             }
    //         }
    //     }
    // }

    //敲碎方块(节点回收)
    destroyBlockAnimation(x: number, y: number) {
        let node = gameInitManager.getGameMainDataManager().blockNodeList.getValue(y, x);
        this.blockPool.put(node);  //回收节点
        gameInitManager.getGameMainDataManager().blockNodeList.setValue(y, x, null);  //置该方块值为空
    }

    //刷新动画
    refreshAnimation() {
        let rows = gameInitManager.getGameMainDataManager().rows;
        let cols = gameInitManager.getGameMainDataManager().cols;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let node = gameInitManager.getGameMainDataManager().blockNodeList.getValue(y, x);
                let conrtorlNode = node.getComponent(blockSetting);
                let value = gameInitManager.getGameMainDataManager().blockDataList.getValue(y, x);  //随机后的值
                let color = gameInitManager.getGameMainDataManager().getBlockColor(value);
                tween(node)
                    .to(0.5, { position: new Vec3(0, 0, 0) })
                    .by(0.5, { angle: -360 })
                    .call(() => {
                        conrtorlNode.initBlock(x, y, value, color);
                        gameInitManager.getGameMainDataManager().initMaxBlock();
                    })
                    .to(0.5, { position: this.vecPos(x, y) })
                    .start();
            }
        }
    }

    //摧毁小于最小值的块
    destroyAllMinBlock() {
        let maxValue = gameInitManager.getGameMainDataManager().getCurrentMaxValue();
        if (maxValue >= 9 && maxValue < 13) {
            this.minValue = Math.floor((maxValue - 9) / 2 + 1);
        } else if (maxValue >= 13 && maxValue < 16) {
            this.minValue = Math.floor((maxValue - 10) / 2 + 1);
        } else if (maxValue >= 16) {
            this.minValue = maxValue - 12;
        }
        let beenDelete = false;
        let blockPosList: Vec3[] = [];
        let colorList: string[] = [];
        let rows = gameInitManager.getGameMainDataManager().rows;
        let cols = gameInitManager.getGameMainDataManager().cols;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let value = gameInitManager.getGameMainDataManager().blockDataList.getValue(y, x);
                if (value < this.minValue) {
                    beenDelete = true;
                    let pos = this.vecPos(x, y);
                    let block = gameInitManager.getGameMainDataManager().blockNodeList.getValue(y, x);
                    let controlBlock = block.getComponent(blockSetting);
                    let color = controlBlock.getColor();

                    this.destroyBlockAnimation(x, y);  //摧毁所有小于当前最小值的的方块
                    blockPosList.push(pos);
                    colorList.push(color);
                }
            }
        }

        if (beenDelete) {
            let skillNode = find("Canvas/GameMain/blockContainer/skill");
            let controlSkillNode = skillNode.getComponent(skillControler);
            controlSkillNode.showDeleteBlockAnimation(blockPosList, colorList);

            this.scheduleOnce(() => {
                controlSkillNode.fillNodeBeenDelete();
                this.prepareBlock();
            }, clearEffect.destoryTime);
        }
    }
}



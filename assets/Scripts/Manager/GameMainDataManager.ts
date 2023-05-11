import { _decorator, Component, Node, TextAsset, find, tween, warn } from 'cc';
import { blockSetting } from '../blockSetting';
import { colorData, rankingData } from '../Common/Enum';
// import { colorData, lastInterface } from '../Common/Enum';
import { my2DArray } from '../Common/my2DArray';
import tools from '../Common/Tools';
import { blockControler } from '../Controler/blockControler';
import gameInitManager from './GameManager';
const { ccclass, property } = _decorator;

export class GameMainDataManager {
    /**用于生成特殊数值 */
    specialValueList = ["K", "M", "B", "T",];
    dic = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "z", "u", "v", "w", "x", "y", "z",];

    /**方块值数据 */
    blockDataList: my2DArray;

    /**方块节点容器 */
    blockNodeList: my2DArray;

    /**方块颜色 */
    colorTable: [colorData];

    /**容器的行数 */
    rows = 8;

    /**容器的列数 */
    cols = 5;

    /**排行榜数据 */
    rankingTable: [rankingData];

    sumScore: number = 0;  //合成后总数
    max: number = 0;
    min: number = 0;  //当前可生成最小的n值(用于1024后的消除)

    totalScore: number = 0;  //用于判断是否过关



    constructor() {
        this.blockNodeList = new my2DArray(this.rows, this.cols, null);  //空的block不需要值，方块list
        this.blockDataList = new my2DArray(this.rows, this.cols, 0);    //value值初始为0,数值list
    }

    //async:https://blog.csdn.net/fuchang1/article/details/121182598
    //       https://es6.ruanyifeng.com/#docs/async
    async initGameData() {
        this.initBlockData();
        this.refresh();
        this.sumScore = gameInitManager.getLocalDataManager().getSumScoreByLocalData();
        //异步任务
        await this.getColorData(gameInitManager.getLocalDataManager().getBlockBg());
        await this.CreateBlock();
        await this.initMaxBlock();
        // await this.initTreasurePos();
    }

    //获取最大值
    getMaxValue() {
        return this.max;
    }

    getMinValue() {
        return this.min;
    }


    //随机  初始化方块二维数组数据
    initBlockData() {
        let list = new my2DArray(this.rows, this.cols, 0);
        //是否有本地数据
        let localStorage = gameInitManager.getLocalDataManager().getBlockDataByLocalData();
        if (localStorage) {
            let blockInfo = JSON.parse(localStorage);
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    list.setValue(y, x, blockInfo[y][x]);
                }
            }
        } else {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    let n = Math.floor(Math.random() * 6 + 1);  //版面最大值,2^6次方(第一次进游戏)
                    list.setValue(y, x, n);
                }
            }
        }
        return this.blockDataList = list;
    }


    /**1、刷新 合成后 当前最大值和可生成最小值，return最小值 
     * 2、2048时消除2，16K时消除4
     * 
    */
    refresh() {
        let max = this.getCurrentMaxValue();
        let min = 1;
        if (max >= 9 && max < 13) {
            min = Math.floor((max - 9) / 2 + 1);
        } else if (max >= 13 && max < 16) {
            min = Math.floor((max - 10) / 2 + 1);
        } else if (max >= 16) {
            min = max - 12;
        }
        return this.min = min;
    }

    //获取当前最大值
    getCurrentMaxValue() {
        let maxValue = 0;
        for (let rows = 0; rows < this.rows; rows++) {
            for (let cols = 0; cols < this.cols; cols++) {
                let value = this.blockDataList.getValue(rows, cols);  //获取方块中的最大倍数
                if (value > maxValue) {  //如果方块中的最大倍数>上次获得的最大倍数
                    maxValue = value;
                }
            }
        }
        gameInitManager.getLocalDataManager().setMaxBlockData(maxValue);
        return this.max = maxValue;
    }

    // //获取colorData中的颜色信息(原)
    // async getColorData(){  //有异步操作
    //     try{
    //         let textAsset:TextAsset=await tools.createLoadPromise("Config/colorDataNormal",TextAsset,false);
    //         if(!textAsset.text){
    //             console.log("not data in here!tableName:%s","Config/colorDataNormal");
    //             textAsset.text="";
    //         }
    //         let text=textAsset.text;
    //         let colorDataList=tools.TransformTextToDic("colorData",text);
    //         this.colorTable = colorDataList;
    //         return true;
    //     }catch(error){
    //         warn("error",error);
    //         return;
    //     }
    // }

    //获取colorData中的颜色信息(现)
    async getColorData(id: number) {  //有异步操作
        try {
            let textAsset: TextAsset;
            switch (id) {
                case 0:  //默认
                    textAsset = await tools.createLoadPromise("Config/colorDataNormal", TextAsset, false);
                    break;
                case 1:  //经典
                    textAsset = await tools.createLoadPromise("Config/ColorClassic", TextAsset, false);
                    break;
                case 2:  //热情
                    textAsset = await tools.createLoadPromise("Config/ColorHot", TextAsset, false);
                    break;
                case 3:  //云
                    textAsset = await tools.createLoadPromise("Config/ColorCloud", TextAsset, false);
                    break;
                case 4:  //珊瑚雾
                    textAsset = await tools.createLoadPromise("Config/ColorFog", TextAsset, false);
                    break;
            }
            if (!textAsset.text) {
                textAsset.text = "";
            }
            let text = textAsset.text;
            let colorDataList = tools.ChangeTxt("colorData", text);
            this.colorTable = colorDataList;
            return true;
        } catch (error) {
            warn("error", error);
            return;
        }
    }

    //获取ranking信息
    async getRankingData() {
        try {
            let textAsset: TextAsset = await tools.createLoadPromise("Config/rankingData", TextAsset, false);
            if (!textAsset.text) {
                textAsset.text = "";
            }
            let text = textAsset.text;
            let rankingDataList = tools.ChangeTxt("rankingData", text);
            this.rankingTable = rankingDataList;
            return true;
        } catch (error) {
            warn("error", error);
            return;
        }
    }

    //生成方块
    CreateBlock() {
        let blockDataList = this.blockDataList;
        let rows = this.rows;
        let cols = this.cols;
        let containerNode = find("Canvas/GameMain/blockContainer");
        let controlNode = containerNode.getComponent(blockControler);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let id = blockDataList.getValue(r, c);
                let color = this.getBlockColor(id);
                let node = controlNode.createBlock(c, r, id, color);
                node.setPosition(controlNode.vecPos(c, r));
                this.blockNodeList.setValue(r, c, node);
            }
        }
    }

    //获取方块颜色
    getBlockColor(num: number) {
        if (num > this.colorTable.length) {
            num = num % this.colorTable.length;
        }
        for (let i = 0; i < this.colorTable.length; i++) {
            if (this.colorTable[i].id == num) {
                return this.colorTable[i].color;
            }
        }
    }

    //获取字体颜色
    getText(id: number) {
        if (id > this.colorTable.length) {
            id = id % this.colorTable.length;
        }
        for (let i = 0; i < this.colorTable.length; i++) {
            if (this.colorTable[i].id == id) {
                return this.colorTable[i].fontColor;
            }
        }
    }

    //方块数字

    blockNumber(n: number): string {
        let currentNumber = Math.pow(2, n);
        return this.specialValue(currentNumber);
    }

    //特殊值
    specialValue(currentNumber: number): string {
        let string = "";
        let tempCount = 0;   //标记数字数量级
        let cr = "";  //特殊数值
        let suffix = "";  //后缀
        let alp = this.getDic();
        let originValue = currentNumber;   //存档原始值
        while (currentNumber / 1000 > 1) {  //1024以上,计数以判断状态
            currentNumber = Math.floor(currentNumber / 1000);
            tempCount += 1;
        }
        if (tempCount == 0 || (tempCount == 1 && currentNumber < 10)) {  //1024以下或8192内
            string = originValue.toString();
        } else if (tempCount <= 4) {  //8192以内
            cr = currentNumber.toString();
            suffix = this.getSuffix(tempCount - 1);
            string = cr + suffix;
        } else if (tempCount <= 4 + 26) {  //8192以上,KTMB以内
            cr = currentNumber.toString();
            suffix = alp[tempCount - 4 - 1];
            string = cr + suffix;
        } else if (tempCount > 4 + 26 && tempCount <= 4 + 26 * 26) {
            cr = currentNumber.toString();
            suffix = alp[Math.floor((tempCount - 4) / 26) - 1] + alp[(tempCount - 4) % 26 - 1];
            string = cr + suffix;
        } else {
            tempCount = (tempCount - 4) % (26 * 26) + 26;
            cr = currentNumber.toString();
            suffix = alp[Math.floor(tempCount / 26) - 1] + alp[tempCount % 26 - 1];
            string = cr + suffix;
        }
        return string;
    }
    
    getDic() {
        return this.dic;
    }

    getSuffix(key: number): string {
        return this.specialValueList[key];
    }

    getSpecivalValueKey(specialString: string): number {
        for (let i = 0; i < this.specialValueList.length; i++) {
            if (specialString == this.specialValueList[i]) {
                return i;
            }
        }
    }
    /**最大值图案 */
    initMaxBlock() {
        let maxValue = this.getCurrentMaxValue();
        if (maxValue < 9) {
            return;
        } //512以上出现皇冠/金边(TODO:动画未做！！)
        for (let rows = 0; rows < this.rows; rows++) {
            for (let cols = 0; cols < this.cols; cols++) {
                let node = this.blockNodeList.getValue(rows, cols);
                let blockSettingScript = node.getComponent(blockSetting);
                let value = this.blockDataList.getValue(rows, cols);
                if (value == maxValue) {
                    blockSettingScript.setCrownInMax(true);
                } else {
                    blockSettingScript.setCrownInMax(false);
                }
            }
        }
    }

    // //初始化宝箱位置
    // initTreasurePos(){
    //     let treasurePos=gameInitManager.getLocalDataManager().getTreasurePos();
    //     if(treasurePos){
    //         let treasure = JSON.parse(treasurePos);
    //         // console.log("treasure[0]",treasure[0]);
    //         // console.log("treasure[1]",treasure[1]);
    //         if(treasure[0]==0 && treasure[1]==0){
    //             return;
    //         }else{
    //             let node=this.blockNodeList.getValue(treasure[0],treasure[1]);
    //             let setNode=node.getComponent(blockSetting);
    //             // console.log("set true");
    //             setNode.setTreasureByRandomGain(true);
    //         }
    //     }
    // }
    //取合成后的值，进行本地保存
    getSumScore() {
        return this.sumScore;
    }

    //合成后总数
    setSumScore(number: number) {
        if (number < 0) {
            this.sumScore = 0;
            return;
        }
        this.totalScore += Math.pow(2, number);
        this.sumScore += Math.pow(2, number);
    }

    //取每次合成的数
    getTotalScore() {
        return this.totalScore;
    }

    //TODO:随机获取，可能需要更改
    randomGain() {
        let n = 0;
        let maxValue = this.getCurrentMaxValue();
        let minPower = 1;
        let maxPower = 1;
        if (maxValue < 9) {
            n = Math.floor(Math.random() * 4 + 1);  //<512,最大块是32
        } else if (maxValue >= 9 && maxValue < 13) {
            maxPower = maxValue - 4 > 7 ? 7 : maxValue - 4; //当前可生成最大值
            minPower = Math.floor((maxValue - 9) / 2 + 1); //当前可生成最小值
            n = Math.floor(Math.random() * (maxPower - minPower + 1) + minPower);
        }
        else if (maxValue >= 13 && maxValue < 16) {
            maxPower = maxValue - 6 > 8 ? 8 : maxValue - 6;
            minPower = Math.floor((maxValue - 10) / 2 + 1);
            n = Math.floor(Math.random() * (maxPower - minPower + 1) + minPower);
        } else if (maxValue >= 16) {
            maxPower = maxValue - 7;
            minPower = maxValue - 12;
            n = Math.floor(Math.random() * (maxPower - minPower + 1) + minPower);
        }
        return n;
    }

    //根据节点数组刷新数据数组
    setAllBlockDataByNodeList() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let node = this.blockNodeList.getValue(y, x);
                let controlNode = node.getComponent(blockSetting);
                this.blockDataList.setValue(y, x, controlNode.getValue());
            }
        }
    }

    //技能-刷新所有方块
    refreshAllBlocks() {
        let node = find("Canvas/GameMain/blockContainer");
        let controlNode = node.getComponent(blockControler);
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let randomY = Math.floor(Math.random() * 8);
                let randomX = Math.floor(Math.random() * 5);
                let originValue = this.blockDataList.getValue(y, x);
                let changeValue = this.blockDataList.getValue(randomY, randomX);
                this.blockDataList.setValue(y, x, changeValue);
                this.blockDataList.setValue(randomY, randomX, originValue);
            }
        }
        gameInitManager.getLocalDataManager().setBlockDataToLocalData(this.blockDataList);  //保存换过后的新格子内容
        controlNode.refreshAnimation();
    }



    /**测试用：回收所有格子节点 */
    RecoveryAllBlockNode() {
        let containerCtrNode = find("Canvas/GameMain/blockContainer");
        let containerCtrTS = containerCtrNode.getComponent(blockControler);
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let blockNode = this.blockNodeList.getValue(y, x);
                containerCtrTS.blockPool.put(blockNode);
            }
        }
    }
}

var gameManager = null;
export var getGameMainDataManagerInstance = function () {
    if (!gameManager) {
        gameManager = new GameMainDataManager();
    }
    return gameManager;
}




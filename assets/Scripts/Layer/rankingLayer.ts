import { _decorator, Component, Node, Prefab, ScrollView, Sprite, SpriteFrame, instantiate, Label, UIOpacityComponent, UIOpacity, find } from 'cc';
import { rankingData } from '../Common/Enum';
import { layerControler } from '../Controler/layerControler';
import gameInitManager from '../Manager/GameManager';
import { MenuMain } from '../MenuMain';
const { ccclass, property } = _decorator;

@ccclass('rankingLayer')
export class rankingLayer extends layerControler {
    @property(Node)
    content: Node = null;  //内容域

    @property(Prefab)
    item: Prefab = null;  //单条记录

    @property(ScrollView)
    scorllGameList = null;  //滚动节点

    @property([SpriteFrame])
    rankingImg: SpriteFrame[] = [];  //1、2、3名标识

    @property(Node)
    myself: Node = null;  //玩家节点

    isEnd: boolean;  //判断一页是否到底

    rankingTable: [rankingData];

    //page页limit数量
    page: number;
    limit: number;

    rankingLength: number = 9;

    result: boolean;  //返回true，数组值大;false，自己值大

    compareResult = [];  //收集比较信息
    myIndex = 0;  //当前积分所在的位置

    newArr = [];  //使用新数组存放rankingTable+self数据

    lastMyScore: number = 0;   //上一次分数

    initGameData() {
        this.page = 1;    //页数
        this.limit = 10;  //限制数量

        this.isEnd = true;  //结尾？
        this.getGameList();
    }
    nodeItem: Node;

    getGameList() {
        if (this.rankingLength < this.limit) {
            this.isEnd = false;

        }
        if (this.rankingLength != 0) {
            for (let i = 0; i < this.rankingLength + 1; i++) {
                this.gameRankingList(this.newArr[i], i + 1);
            }
        }

        this.scorllGameList.node.on('scroll-to-bottom', this.callBack, this);


    }

    callBack() {
        // let limit=gameInitManager.getLocalDataManager().getLimit();  
        if (this.isEnd) {
            this.page++;
            this.rankingLength = this.newArr.length - 10;
            // if(limit>0){   
            // if(this.limit>0){  
            // this.limit-=this.rankingTable.length;   
            // gameInitManager.getLocalDataManager().setLimit(this.limit);  
            // }
            this.getGameList();

        }
    }

    gameRankingList(user: any, i: number) {
        this.nodeItem = instantiate(this.item);

        //排名
        let sortNumber = this.nodeItem.getChildByName("rank_number").getComponent(Label);
        sortNumber.string = i.toString();

        let rankSprite = this.nodeItem.getChildByName("rank").getComponent(Sprite);

        if (i <= 3) {
            rankSprite.spriteFrame = this.rankingImg[i - 1];
            sortNumber.getComponent(UIOpacity).opacity = 0;
        } else {
            this.nodeItem.getChildByName("rank").getComponent(UIOpacity).opacity = 0;
        }

        //名字
        let name = this.nodeItem.getChildByName("name").getComponent(Label);
        if (name) {
            name.string = user.name;
        }


        //分数
        let score = this.nodeItem.getChildByName("score").getComponent(Label);
        score.string = user.score;

        //将循环的数据添加到Content节点显示
        this.content.addChild(this.nodeItem);
    }

    refreshRanking() {

        let score = this.myself.getChildByName("score").getComponent(Label);   //分数组件
        let intro = this.myself.getChildByName("Label");  //暂未上榜
        let sortNumber = this.myself.getChildByName("rank_number").getComponent(Label);  //排名
        let rankSprite = this.myself.getChildByName("rank").getComponent(Sprite);  //排名前三图标
        let localScore = gameInitManager.getLocalDataManager().getSumScoreByLocalData();   //本地最高分
        let myScore = gameInitManager.getGameMainDataManager().specialValue(localScore).toString();  //最高分特殊值
        score.string = myScore;  //显示的分数
        // this.rankingTable=gameInitManager.getGameMainDataManager().rankingTable;   //原始排名表
        this.newArr = gameInitManager.getGameMainDataManager().rankingTable;

        let rankingScore = [];

        for (let i = 0; i < this.newArr.length; i++) {
            let customScore = this.newArr[i].score;
            rankingScore[i] = customScore;
            this.compareResult.push(this.compareTwoScore(rankingScore[i], myScore));  //比较值是否上榜
        }
        if (this.compareResult.every(elem => elem == true)) {   //未上榜，随机数生成(11-1000)的随机排名
            sortNumber.string = (Math.floor(Math.random() * (999 - 11 + 1) + 11)).toString();
            this.myself.getChildByName("rank").getComponent(UIOpacity).opacity = 0;
            // this.compareResult=[];

        } else {   //上榜
            intro.getComponent(UIOpacity).opacity = 0;
            let foundIndex = this.compareResult.findIndex(function (item) {
                return item == false;
            })

            this.myIndex = foundIndex + 1;
            sortNumber.string = this.myIndex.toString();
            let id = this.myIndex;
            let name = this.myself.getChildByName("name").getComponent(Label).string;
            let score = myScore;
            let myData: rankingData = { id, name, score };
            this.newArr[this.newArr.length - 1] = myData;

            this.newArr.splice(foundIndex, 0, myData);
            for (let n = 0; n < this.newArr.length - 1 - this.myIndex; n++) {
                this.newArr[this.myIndex + n].id += 1;
            }

            if (this.myIndex <= 3) {
                rankSprite.spriteFrame = this.rankingImg[this.myIndex - 1];
                sortNumber.getComponent(UIOpacity).opacity = 0;
            } else {
                this.myself.getChildByName("rank").getComponent(UIOpacity).opacity = 0;
            }
        }
        this.initGameData();
        this.compareResult = [];
        this.newArr = [];
    }
    compareTwoScore(customScore: string, myScore: string) {

        let lastStringCustom = customScore.slice(customScore.length - 1);
        let lastStringMyscore = myScore.slice(myScore.length - 1);
        let specialValueList = gameInitManager.getGameMainDataManager().specialValueList;
        for (let i = 0; i < specialValueList.length; i++) {
            if (lastStringCustom == specialValueList[i] && lastStringMyscore == specialValueList[i]) {
                let key1 = gameInitManager.getGameMainDataManager().getSpecivalValueKey(lastStringCustom);
                let key2 = gameInitManager.getGameMainDataManager().getSpecivalValueKey(lastStringMyscore);
                if (key1 > key2) { //特殊值数组值大
                    this.result = true;
                } else if (key1 < key2) {  //我的特殊值大
                    this.result = false;
                } else if (key1 == key2) {
                    let originNumCus = customScore.slice(0, customScore.length - 1);
                    let myNum = myScore.slice(0, myScore.length - 1);
                    this.compareOrginNumber(originNumCus, myNum);
                }
            } else if (lastStringCustom == specialValueList[i] && lastStringMyscore != specialValueList[i]) {  //我没有特殊值，数组里有
                this.result = true;
            } else if (lastStringCustom != specialValueList[i] && lastStringMyscore == specialValueList[i]) {  //数组没有特殊值，我有
                this.result = false;
            }
        }
        return this.result;
    }

    compareOrginNumber(customScore: string, myScore: string) {  //比较数字值
        let customScoreNum = Number(customScore);
        let myScoreNum = Number(myScore);
        if (customScoreNum > myScoreNum) {
            this.result = true;
        } else {
            this.result = false;
        }
    }

    onClickClose() {
        super.onClickCloseButton();
        this.rankingLength = 9;
        this.content.removeAllChildren();
        this.newArr = [];
        let node = find("Canvas/MainMenu");
        let controlNode = node.getComponent(MenuMain);
        controlNode.getRankingData();
    }
}



import { _decorator, Component, Node, Prefab, Button, Label, NodePool, instantiate, tween, Vec3, find, UIOpacity } from 'cc';
import { blockSetting } from '../blockSetting';
import { blockScaleAnimation, rewardType } from '../Common/Enum';
import { layerControler } from '../Controler/layerControler';
import { GameMain } from '../GameMain';
import gameInitManager from '../Manager/GameManager';
import AdManager from '../../Extend/Ad/Platforms/AdManager';
import AdsIdConfig, { EPlatform } from '../../Extend/Ad/Platforms/AdsIdConfig';
const { ccclass, property } = _decorator;

@ccclass('unlockLayer')
export class unlockLayer extends layerControler {

    @property(Prefab)
    blcokPrefab: Prefab = null;  //block预制体

    @property(Node)
    createNode: Node = null;   //三个方块的生成节点

    @property(Node)
    sliderNode: Node = null;  //滑动方块节点

    @property(Button)    //激励视频Button
    rewardButton: Button = null;

    @property(Label)
    multiple: Label | null = null;  //激励倍数

    @property(Label)
    gold: Label | null = null;  //显示的钻石数

    @property({ tooltip: "滑块初始速度" })
    sliderInitSpeed: number = 0;

    @property({ tooltip: "滑块加速度" })
    sliderAddSpeed: number = 0;

    blockPool: NodePool;
    blockList: Node[] = [];  //存储三个方块
    maxValue: number = 0;  //中间的最大值

    beenUpdate: boolean = false;  //用于条的滑动
    sliderPos: number = 1;  //-1为最左，1为最右

    sliderSpeed: number = 0;

    lastmaxPower: number = 0;  //控制最大值窗口显示

    start() {
        this.blockPool = new NodePool();
        for (let i = 0; i < 3; i++) {  //实例化三个方块
            let block = instantiate(this.blcokPrefab);
            this.blockPool.put(block);
        }
    }

    //关闭按钮延时
    // showDelay(){
    //     let opacity=this.node.getChildByName("Top").getChildByName("guanbi").getComponent(UIOpacity);
    //     this.scheduleOnce(()=>{
    //         tween(opacity)
    //             .to(0.1,{opacity:0})
    //             .delay(0.1)
    //             .to(1,{opacity:255})
    //             .start();
    //     },2.5);
    // }
    
    //金币增长判断
    goldUpdate(maxValue: number) {
        let gold = 0;
        if (maxValue >= 9 && maxValue < 16) {
            let curMaxValue = [14, 13, 11, 10, 9];
            let curGold = [34, 33, 32, 31, 20];
            for (let i = 0; i < curMaxValue.length; i++) {
                if (maxValue >= curMaxValue[i]) {
                    gold = curGold[i];
                    this.gold.string = gold.toString();
                    break;
                }
            }
        } else if (maxValue >= 16) {
            let curGold = (maxValue - 16) + 1;
            let minGold = 34;
            gold = minGold + curGold;
            this.gold.string = gold.toString();
        }
    }

    //展示中间方块的最大值动画
    showAnimation(maxValue: number) {
        //TODO:烟花特效未做
        this.maxValue = maxValue;
        for (let i = 0; i < 3; i++) {
            let block: Node = null;
            if (this.blockPool.size() > 0) {
                block = this.blockPool.get();
            } else {
                block = instantiate(this.blcokPrefab);
            }
            let controlBlock = block.getComponent(blockSetting);
            let color = gameInitManager.getGameMainDataManager().getBlockColor(maxValue - 1 + i);  //获取三个方块应有的颜色
            controlBlock.initBlock(-1, -1, maxValue - 1 + i, color);  //生成方块配置
            block.parent = this.createNode;  //把方块放在生成栏里
            this.blockList.push(block);
            if (i == 0) {
                controlBlock.CreateBigBlock();
                block.setPosition((i + 1) * 200, 20);
                tween(block)
                    .delay(0.1)
                    .call(() => {
                        controlBlock.createNowBlock();
                    })
                    .to(0.2, { position: new Vec3(-200, 0, 0) })
                    .start();
            } else if (i == 1) {
                controlBlock.createNowBlock();
                block.setPosition((i + 1) * 200, 0);
                tween(block)
                    .delay(0.1)
                    .to(0.2, { position: new Vec3(0, 20, 0) })
                    .call(() => {
                        // this.scheduleOnce(()=>{
                        controlBlock.CreateBigBlock();
                        // },0.3)
                        // })
                    })
                    .start();
            } else {
                controlBlock.createNowBlock();
                block.setPosition((i + 1) * 200, 0);
                tween(block)
                    .delay(0.1)
                    .to(0.2, { position: new Vec3(200, 0, 0) })
                    .start();
            }
        }
    }

    onUpdate() {
        this.beenUpdate = true;
    }

    /**关闭按钮、普通领取
     * 1、关闭的时候需要把方块变小，不然动画不丝滑
     * 2、关闭的时候需要把滑块放到-215，不然会出问题 
     * 3、激励领取类型为多倍领取，单倍领取不开放;为单倍领取，多倍领取不开放
     */
    onClickClose() {
        let gameNode = find("Canvas/GameMain");
        let controlGameNode = gameNode.getComponent(GameMain);
        // if(controlGameNode.showShare==true){
        //     this.node.getChildByName("Bot").getChildByName("button").getComponent(Button).interactable=false;
        //     this.node.getChildByName("Top").getChildByName("guanbi").getComponent(Button).interactable=false;
        // }else{
        super.onClickCloseButton();
        if ((AdsIdConfig.platform == EPlatform.TikTok)) {
            // console.log("can't share ");
            AdManager.getInstance().stopRecordScreen();
            controlGameNode.gameTime = 0;
            controlGameNode.inPlayGame = true;
            AdManager.getInstance().StartRecorder();

        }
        if (gameInitManager.getAdManager().getRewardType() == rewardType.addDiamond) {
            let gold = Number(this.gold.string);
            gameInitManager.getDiamondManager().subDiamond(gold);
            controlGameNode.showAddDiamondInUnlockLayer(gold);
        }

        for (let i = 0; i < 3; i++) {
            let block = this.blockList[i];  //找三个方块中的哪个
            let controlBlock = block.getComponent(blockSetting);
            controlBlock.createNowBlock();  //状态还原
            block.setPosition(800, 0);
            this.blockPool.put(block);  //回收方块节点
        }
        this.sliderNode.setPosition(-215, 0);  //浮标归位
        this.sliderPos = 1;
        this.beenUpdate = false;

        //展示最大值界面
        if (this.maxValue >= 11) {
            let maxPower = 1;
            let maxValue = this.maxValue;
            if (maxValue >= 9 && maxValue < 13) {
                maxPower = maxValue - 4 > 7 ? 7 : maxValue - 4; //当前可生成最大值
            }
            else if (maxValue >= 13 && maxValue < 16) {
                maxPower = maxValue - 6 > 8 ? 8 : maxValue - 6;
            } else if (maxValue >= 16) {
                maxPower = maxValue - 7;
            }

            if (maxPower > this.lastmaxPower) {
                controlGameNode.showAddMaxBlockLayer(maxPower);
                this.lastmaxPower = maxPower;
            }

        }
        // }

        // if(AdsIdConfig.platform==EPlatform.VIVO){
        //     let opacity=this.node.getChildByName("Top").getChildByName("guanbi").getComponent(UIOpacity);
        //     opacity.opacity=0;
        // }

    }

    onClickVideoButton() {
        this.beenUpdate = false;
        let gold = Number(this.gold.string);
        let multiple = Number(this.multiple.string);
        let allGold = gold * multiple;
        gameInitManager.getAdManager().setRewardDiamond(allGold);
        gameInitManager.getAdManager().setRewardType(rewardType.addDiamondTimes);

        this.scheduleOnce(() => {
            gameInitManager.getAdManager().onReward(this.node);
        }, 0.5);
    }

    //判断激励条落在了哪里
    update(deltaTime) {
        if (!this.beenUpdate) {  //false时
            return;
        }
        gameInitManager.getVibrateManager().vibrate();
        let pos = this.sliderNode.getPosition();
        if (pos.x >= 215 || pos.x <= -215) {
            if (pos.x > 215) {
                this.sliderPos = -1;
            } else {
                this.sliderPos = 1;
            }
            this.sliderSpeed = this.sliderInitSpeed;
        }
        if (pos.x > 0) {
            this.sliderSpeed += (-this.sliderAddSpeed) * this.sliderPos;
        } else {
            this.sliderSpeed += this.sliderAddSpeed * this.sliderPos;
        }
        let move = deltaTime * this.sliderSpeed * this.sliderPos;  //移动了多远的位置:每秒 sliderSpeed*（正或负方向移动）  
        let moveX = pos.x + move;
        this.sliderNode.setPosition(moveX, pos.y);
        if (Math.abs(moveX) <= 50) {
            this.multiple.string = "5";
        } else if (Math.abs(moveX) <= 110) {
            this.multiple.string = "4";
        } else if (Math.abs(moveX) <= 165) {
            this.multiple.string = "3";
        } else if (Math.abs(moveX) <= 215) {
            this.multiple.string = "2";
        }
    }


}



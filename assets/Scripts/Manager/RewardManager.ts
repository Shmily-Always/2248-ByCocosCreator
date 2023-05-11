import { _decorator, Component, Node, find, tween, Vec3, Button, UIOpacity, Vec2 } from 'cc';
import { blockSetting } from '../blockSetting';
import { rewardType, rewardLayer, addMoney } from '../Common/Enum';
import { my2DArray } from '../Common/my2DArray';
import { blockControler } from '../Controler/blockControler';
import { GameMain } from '../GameMain';
import { clothesLayer } from '../Layer/clothesLayer';
import { doubleLayer } from '../Layer/doubleLayer';
import { MenuMain } from '../MenuMain';
import gameInitManager from './GameManager';
import { registLayer } from '../Layer/registLayer';
import AdManager from '../../Extend/Ad/Platforms/AdManager';
// import AdManager from '../../resources/Extend/Ad/Platforms/AdManager';
const { ccclass, property } = _decorator;

@ccclass('RewardManager')
export class RewardManager {
    rewardType: rewardType =rewardType.addDiamond;
    rewardDiamond:number;
    rewardProp:string;
    rewardLayer:rewardLayer=rewardLayer.mainGame;
    addLayer:addMoney=addMoney.storeLayer;

    setRewardLayer(rewardLayer:rewardLayer){
        this.rewardLayer=rewardLayer;
    }

    getRewardLayer(){
        return this.rewardLayer;
    }

    setRewardType(rewardType:rewardType){
        this.rewardType=rewardType;
    }

    getAddLayer(){
        return this.addLayer;
    }

    setAddLayerType(addLayer:addMoney){
        this.addLayer=addLayer;
    }

    getRewardType(){
        return this.rewardType;
    }

    setRewardDiamond(diamond:number){
        this.rewardDiamond=diamond;
    }

    getPropType(){
        return this.rewardProp;
    }
    setPropType(item:string){
        this.rewardProp=item;
    }

    setIsRegistLayer:boolean=false;

    onReward(layerNode?:Node){
        if(this.rewardLayer==rewardLayer.mainGame){
            let node=find("Canvas/GameMain");
            let controlNode=node.getComponent(GameMain);
            switch(this.rewardType){
                case rewardType.addDiamond:
                    // console.log("addDimaond");
                    // AdManager.getInstance().showVideo((param);
                    AdManager.getInstance().showVideo(function(str){
                        // console.log("str is ",str);
                        if(str==1){
                            gameInitManager.getDiamondManager().subDiamond(100);
                            if(this.getAddLayer()==addMoney.storeLayer){
                                controlNode.closeLayer("storeLayer");
                            }else{
                                controlNode.closeLayer("notEnoughLayer");
                                this.addLayer=addMoney.storeLayer;
                            }
                            
                            controlNode.showAddDiamondInUnlockLayer(100);
                        }else if(str==2){
                                // console.log("this.node in reward is ",layerNode);
                                gameInitManager.getTipsManager().create('观看视频失败!',layerNode);
                        }
                    }.bind(this));
                break;

                case rewardType.addDiamondTimes:
                    // console.log("addDiamondTimes");
                    AdManager.getInstance().showVideo(function(str){
                        if(str==1){
                            gameInitManager.getDiamondManager().subDiamond(this.rewardDiamond);
                            controlNode.closeLayer("unlockLayer");
                            controlNode.showAddDiamondInUnlockLayer(this.rewardDiamond);
                        }else if(str==2){
                            gameInitManager.getTipsManager().create('观看视频失败!',layerNode);
                        }
                    }.bind(this));
                break;

                case rewardType.changeBlock:
                    //突破block，不需要花费金币
                    // console.log("changeBlock");
                    AdManager.getInstance().showVideo(function(str){
                        if(str==1){
                            let curMaxValue=gameInitManager.getGameMainDataManager().getMaxValue();
                            let beenTouchedNode=controlNode.doubleLayer.getComponent(doubleLayer).beenTouchedNode;
                            let block=gameInitManager.getGameMainDataManager().blockNodeList.getValue(beenTouchedNode.y,beenTouchedNode.x);
                            let controlBlock=block.getComponent(blockSetting);
                            let color=gameInitManager.getGameMainDataManager().getBlockColor(curMaxValue+1);
                            controlBlock.showDoubleAnimation(beenTouchedNode.x,beenTouchedNode.y,curMaxValue+1,color);
                            gameInitManager.getGameMainDataManager().blockDataList.setValue(beenTouchedNode.y,beenTouchedNode.x,curMaxValue+1);
                            let newBlock=gameInitManager.getGameMainDataManager().blockDataList.getValue(beenTouchedNode.y,beenTouchedNode.x);
                            let blockDataList:my2DArray=gameInitManager.getGameMainDataManager().blockDataList;
                            gameInitManager.getLocalDataManager().setBlockDataToLocalData(blockDataList);
                
                            gameInitManager.getGameMainDataManager().initMaxBlock();  //更改MAX标志所在处
                
                            if(newBlock>9){  //512以上弹出过关
                                controlNode.showUnlockLayer(newBlock);
                            }
                
                            let blcokNode=find("Canvas/GameMain/blockContainer");
                            let controlBlockNode=blcokNode.getComponent(blockControler);
                            // controlBlockNode.canShowDoubleLayer=true;   //可展示状态为true
                            controlNode.closeLayer("doubleLayer")
                        }else if(str==2){
                            gameInitManager.getTipsManager().create('观看视频失败!',layerNode);
                        }
                    }.bind(this));
                break;

                case rewardType.addProp:
                    // console.log("addProp");
                    AdManager.getInstance().showVideo(function(str){
                        if(str==1){
                            if(this.getPropType()=="hammer"){
                                for(let i=0;i<2;i++){
                                    gameInitManager.getLocalDataManager().setTimesByItemName("deleteTimes",true);
                                }
                                controlNode.setLabelTimes("deleteTimes",gameInitManager.getLocalDataManager().getTimesByItemName("deleteTimes"));  
                                controlNode.closeLayer("rewardHammerLayer");
                            }else if(this.getPropType()=="exchange"){
                                for(let i=0;i<2;i++){
                                    gameInitManager.getLocalDataManager().setTimesByItemName("exchangeTimes",true);
                                }
                                controlNode.setLabelTimes("exchangeTimes",gameInitManager.getLocalDataManager().getTimesByItemName("exchangeTimes"));    
                                controlNode.closeLayer("rewardExchangeLayer");
                
                            }else if(this.getPropType()=="refresh"){
                                for(let i=0;i<2;i++){
                                    gameInitManager.getLocalDataManager().setTimesByItemName("refreshTimes",true);
                                }
                                controlNode.setLabelTimes("refreshTimes",gameInitManager.getLocalDataManager().getTimesByItemName("refreshTimes"));  
                                controlNode.closeLayer("rewardRefreshLayer");
                            }
                            this.rewardType=rewardType.addDiamond; //恢复默认值
                        }else if(str==2){
                            gameInitManager.getTipsManager().create('观看视频失败!',layerNode);
                        }
                    }.bind(this));
                    break;

                    case rewardType.addSkill:
                    // console.log("addProp");
                    AdManager.getInstance().showVideo(function(str){
                        if(str==1){
                            if(this.getPropType()=="hammer"){
                                // for(let i=0;i<2;i++){
                                    
                                    gameInitManager.getLocalDataManager().setTimesByItemName("deleteTimes",true);
                                // }
                                controlNode.setLabelTimes("deleteTimes",gameInitManager.getLocalDataManager().getTimesByItemName("deleteTimes"));  
                                // controlNode.closeLayer("rewardHammerLayer");
                                let node=find("Canvas/GameMain/gameBottom/Skill/delete");
                                let nodeRemain=node.getChildByName("remain");
                                let nodeReward=node.getChildByName("reward");
                                // nodeRemain.getComponent(UIOpacity).opacity=255;
                                // nodeReward.getComponent(UIOpacity).opacity=0;
                                nodeRemain.active=true;
                                nodeReward.active=false;
                            }else if(this.getPropType()=="exchange"){
                                // for(let i=0;i<2;i++){
                                    gameInitManager.getLocalDataManager().setTimesByItemName("exchangeTimes",true);
                                // }
                                controlNode.setLabelTimes("exchangeTimes",gameInitManager.getLocalDataManager().getTimesByItemName("exchangeTimes"));    
                                // controlNode.closeLayer("rewardExchangeLayer");
                                let node=find("Canvas/GameMain/gameBottom/Skill/exchange");
                                let nodeRemain=node.getChildByName("remain");
                                let nodeReward=node.getChildByName("reward");
                                // nodeRemain.getComponent(UIOpacity).opacity=255;
                                // nodeReward.getComponent(UIOpacity).opacity=0;   
                                nodeRemain.active=true;
                                nodeReward.active=false;
                            }else if(this.getPropType()=="refresh"){
                                // for(let i=0;i<2;i++){
                                    gameInitManager.getLocalDataManager().setTimesByItemName("refreshTimes",true);
                                // }
                                controlNode.setLabelTimes("refreshTimes",gameInitManager.getLocalDataManager().getTimesByItemName("refreshTimes"));  
                                // controlNode.closeLayer("rewardRefreshLayer");
                                let node=find("Canvas/GameMain/gameBottom/Skill/refresh");
                                let nodeRemain=node.getChildByName("remain");
                                let nodeReward=node.getChildByName("reward");
                                // nodeRemain.getComponent(UIOpacity).opacity=255;
                                // nodeReward.getComponent(UIOpacity).opacity=0;
                                nodeRemain.active=true;
                                nodeReward.active=false;
                            }
                            this.rewardType=rewardType.addDiamond; //恢复默认值
                        }else if(str==2){
                            gameInitManager.getTipsManager().create('观看视频失败!',layerNode);
                        }
                    }.bind(this));
                    break;

                case rewardType.unlockClothes:
                    // console.log("unlockClothes");
                    AdManager.getInstance().showVideo(function(str){
                        // console.log("str in 4399 is ",str);
                        if(str==1){
                            let controlClothesLayer=controlNode.clothesLayer.getComponent(clothesLayer);
                            if(controlClothesLayer.mainGameBg.active==true){  //如果是背景界面
                                tween(controlClothesLayer.mainGameBg.children[controlClothesLayer.countButton])
                                .to(0,{scale:new Vec3(1,1,1)})
                                .start();
                                if((controlClothesLayer.countButton!=0) && (controlClothesLayer.getIsBeenUnlock(controlClothesLayer.countButton))){   //选了款式，且未解锁过
                                    controlClothesLayer.setIsBeenUnlock(controlClothesLayer.countButton);  //解锁
                                    let arrGameBg=gameInitManager.getLocalDataManager().getUnlockBg();
                                    arrGameBg[controlClothesLayer.countButton]=1;
                                    // this.gameBgArr[this.countButton]=1;
                                    gameInitManager.getLocalDataManager().setUnlockBg(arrGameBg);   //true是unlock
                                    gameInitManager.getBgManager().changeBg(controlClothesLayer.countButton);  //换背景
                                    controlClothesLayer.refreshButton();
                                }
                            }else if(controlClothesLayer.mainBlockBg.active==true){   //如果是方块背景界面
                                tween(controlClothesLayer.mainBlockBg.children[controlClothesLayer.countButtonBlock])
                                .to(0,{scale:new Vec3(1,1,1)})
                                .start();
                                if((controlClothesLayer.countButtonBlock!=0) && (controlClothesLayer.getIsBeenUnlockBlock(controlClothesLayer.countButtonBlock))){   //选了款式，且未解锁过
                                    controlClothesLayer.setIsBeenUnlockBlock(controlClothesLayer.countButtonBlock);  //解锁
                                    let arrBlockBg=gameInitManager.getLocalDataManager().getUnlockBlockBg();
                                    arrBlockBg[controlClothesLayer.countButtonBlock]=1;
                                    gameInitManager.getLocalDataManager().setUnlockBlockBg(arrBlockBg);   //true是unlock
                                    controlClothesLayer.refreshButtonBlock();
                                    controlClothesLayer.onClickClose();
                                    gameInitManager.getBgManager().changeBlockBg(controlClothesLayer.countButtonBlock);  //换背景
                                }
                            }
                        }else if(str==2){
                            gameInitManager.getTipsManager().create('观看视频失败!',layerNode);
                        }
                    }.bind(this));
                    break;

                case rewardType.pass:
                    AdManager.getInstance().showVideo(function(str){
                        if(str==1){
                            let curMaxValue=gameInitManager.getGameMainDataManager().getMaxValue();
                            let rows=gameInitManager.getGameMainDataManager().rows;
                            let cols=gameInitManager.getGameMainDataManager().cols;
                            let blockTempList:Vec2[]=[];  //用于存放所有最大值方块的所在位置
                            for(let y=0;y<rows;y++){
                                for(let x=0;x<cols;x++){
                                    let blockNum=gameInitManager.getGameMainDataManager().blockDataList.getValue(y,x);
                                    if(blockNum==curMaxValue){
                                        blockTempList.push(new Vec2(x,y));
                                    }
                                }
                            }
                            let randomElement=blockTempList[Math.floor(Math.random()*blockTempList.length)];
                            let block=gameInitManager.getGameMainDataManager().blockNodeList.getValue(randomElement.y,randomElement.x);
                            let controlBlock=block.getComponent(blockSetting);
                            let color=gameInitManager.getGameMainDataManager().getBlockColor(curMaxValue+1);
                            controlBlock.showDoubleAnimation(randomElement.x,randomElement.y,curMaxValue+1,color);
                            gameInitManager.getGameMainDataManager().blockDataList.setValue(randomElement.y,randomElement.x,curMaxValue+1);
                            let newBlock=gameInitManager.getGameMainDataManager().blockDataList.getValue(randomElement.y,randomElement.x);
                            let blockDataList:my2DArray=gameInitManager.getGameMainDataManager().blockDataList;
                            gameInitManager.getLocalDataManager().setBlockDataToLocalData(blockDataList);
                
                            gameInitManager.getGameMainDataManager().initMaxBlock();  //更改MAX标志所在处
                            let node=find("Canvas/GameMain");
                            let controlNode=node.getComponent(GameMain);
                            if(newBlock>9){  //512以上弹出过关
                                controlNode.showUnlockLayer(newBlock);
                            }
            
                            let blcokNode=find("Canvas/GameMain/blockContainer");
                            let controlBlockNode=blcokNode.getComponent(blockControler);
                            // controlBlockNode.canShowDoubleLayer=true;   //可展示状态为true
                            controlNode.closeLayer("passLayer");
                        }else if(str==2){
                            gameInitManager.getTipsManager().create('观看视频失败!',layerNode);
                        }
                    }.bind(this));
                    break;
                }
                // console.log("enter here");
                this.rewardType=rewardType.addDiamond;  //恢复初始值
        }else if(this.rewardLayer==rewardLayer.mainMenu){
            let node=find("Canvas/MainMenu");
            let controlNode=node.getComponent(MenuMain);
            if(this.rewardType==rewardType.addDiamond){
                AdManager.getInstance().showVideo(function(str){
                    if(str==1){
                        gameInitManager.getDiamondManager().subDiamond(100);
                        controlNode.closeLayer("storeLayer");
                        controlNode.setDiamondLabel();
                        gameInitManager.getSoundManager().playSound("adddiamond");
                    }else if(str==2){
                        gameInitManager.getTipsManager().create('观看视频失败!',layerNode);
                    }
                }.bind(this));
            }else if(this.rewardType==rewardType.addDiamondTimes){
                AdManager.getInstance().showVideo(function(str){
                    if(str==1){
                        gameInitManager.getDiamondManager().subDiamond(this.rewardDiamond);
                        controlNode.closeLayer("unlockLayer");
                        controlNode.setDiamondLabel();
                    }else if(str==2){
                        gameInitManager.getTipsManager().create('观看视频失败!',layerNode);
                    }
                }.bind(this));
            }
                // console.log("enterinit");
                this.rewardLayer=rewardLayer.mainGame;
                this.rewardType=rewardType.addDiamond;  //恢复初始值
        }     
    }

    onRewardMainMenu(layerNode:Node){
        if(this.rewardType==rewardType.addDiamond){
            AdManager.getInstance().showVideo(function(str){
                let nodeMainMenu=find("Canvas/MainMenu");
                let controlNodeMainMenu=nodeMainMenu.getComponent(MenuMain);
                if(str==1){
                    gameInitManager.getLocalDataManager().setIsCanSigning(0);  //点击了按钮就是签到过了
                    let alreadySigningDay=gameInitManager.getLocalDataManager().getSigningDay();
                    let day=alreadySigningDay+1;
                    // console.log("day in reward is ",day);
                    let registNode=controlNodeMainMenu.registLayer.getComponent(registLayer);
                    registNode.signingNode.children[alreadySigningDay-1].getComponent(Button).interactable=false;
                    registNode.signingNode.children[alreadySigningDay-1].getChildByName("yes").active=true;
                    registNode.signingNode.children[alreadySigningDay-1].getChildByName("button").getComponent(UIOpacity).opacity=130;
                    registNode.rewardButton.getComponent(Button).interactable=false;

                    
                    let gold=controlNodeMainMenu.registLayer.getComponent(registLayer).getGold();

                    gameInitManager.getDiamondManager().subDiamond((2*gold));
                    controlNodeMainMenu.closeLayer("registLayer");
                    controlNodeMainMenu.setDiamondLabel();
                    if(day>7){
                        this.isDaySeven=true;
                        this.scheduleOnce(()=>{
                            for(let i=0;i<7;i++){
                                this.signingNode.children[i].getChildByName("yes").active=false;
                                this.signingNode.children[i].getChildByName("button").getComponent(UIOpacity).opacity=255;
                            }   
                        },2);
                    }
                    gameInitManager.getLocalDataManager().setSigningDay(day);     
                    gameInitManager.getLocalDataManager().setSigningDate(new Date().getDate());
                    this.setIsRegistLayer==false;
                }else if(str==2){
                    gameInitManager.getTipsManager().create('观看视频失败!',layerNode);
                }
            }.bind(this));
        }
        this.rewardType=rewardType.addDiamond;  //恢复初始值
    }

}

    
var adManager=null;
export var getAdManagerInstance=function(){

    
    if(!adManager){
        adManager=new RewardManager();
    }
    return adManager;
}



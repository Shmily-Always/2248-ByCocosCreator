import { _decorator, Component, Node, TextAsset, warn, Sprite, SpriteFrame, ImageAsset, find, tween, Vec3 } from 'cc';
import { blockSetting } from '../blockSetting';
import { bgData, bgTextData, colorData } from '../Common/Enum';
import tools from '../Common/Tools';
import { blockControler } from '../Controler/blockControler';
import { GameMain } from '../GameMain';
import { MenuMain } from '../MenuMain';
import gameInitManager from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('BgManager')
export class BgManager  {
    bgTable:bgData[]=[];
    bgTextTable:[bgTextData];
    // /**方块颜色 */
    // colorTable: [colorData];

    constructor(){
        // this.getBgTextData();
        this.initBgData();
    }

    async initBgData(){
        let node=find("Canvas/GameMain");
        if(node){   //控制了判断，主页背景与皮肤无关
            let controlNode=node.getComponent(GameMain);
            this.getBgTextData().then(()=>{
                controlNode.setBg();
            })
        }else{
            this.getBgTextData();
        }
        // await this.getBgTextData()
        // controlNode.setBg();
        
    }


    async getBgTextData(){
        try{
            let textAsset:TextAsset = await tools.createLoadPromise("Config/gameBgData",TextAsset,false);
            if(!textAsset.text){
                // console.log("tableName:%s not textData", "Config/gameBgData");
                textAsset.text="";
            }
            let textData=textAsset.text;
            let bgTextTable=tools.ChangeTxt("bgData",textData);
            this.bgTextTable=bgTextTable;
            await this.getBgData();
        }catch(error){
            warn("error",error);
            return;
        }
    }

    async getBgData(){
        for(let i=0;i<this.bgTextTable.length;i++){
            let id=i;
            let name=this.bgTextTable[i].name;
            let bgData:SpriteFrame=await tools.createLoadPromise(this.bgTextTable[i].path,SpriteFrame);
            let bg:bgData={id,name,bgData};
            this.bgTable.push(bg);
        }
    }

    changeBg(bgId:number){
        // let bgGameMain=find("Canvas/GameMain/bg");
        let bgGameMain=find("Canvas/GameMain/bg");
        // console.log("this.bgTable.length",this.bgTable.length);
        for(let i=0;i<this.bgTable.length;i++){
            if(this.bgTable[i].id==bgId){
                bgGameMain.getComponent(Sprite).spriteFrame=this.bgTable[i].bgData;
                // console.log("this.bgTable[i].id",this.bgTable[i].id);
                gameInitManager.getLocalDataManager().setBgNumber((this.bgTable[i].id).toString());
            }
        }
    }

    async changeBlockBg(bgId:number){
        gameInitManager.getLocalDataManager().setBlockBg(bgId);
        // gameInitManager.getGameMainDataManager().getColorData(bgId);
        await gameInitManager.getGameMainDataManager().getColorData(bgId).then(()=>{
            let rows=gameInitManager.getGameMainDataManager().rows;
            let cols=gameInitManager.getGameMainDataManager().cols;
        for(let y=0;y<rows;y++){
            for(let x=0;x<cols;x++){
                let node =gameInitManager.getGameMainDataManager().blockNodeList.getValue(y,x);
                let conrtorlNode=node.getComponent(blockSetting);
                let value=gameInitManager.getGameMainDataManager().blockDataList.getValue(y,x);
                let color=gameInitManager.getGameMainDataManager().getBlockColor(value);
                let containerNode=find("Canvas/GameMain/blockContainer");
                let controlNode=containerNode.getComponent(blockControler);
                tween(node)
                    .to(0.5,{position:new Vec3(0,0,0)})
                    .by(0.5,{angle:360})
                    .call(()=>{
                        conrtorlNode.initBlock(x,y,value,color);
                        gameInitManager.getGameMainDataManager().initMaxBlock();
                    })
                    .to(0.5,{position:controlNode.vecPos(x,y)})
                    .start();
            }
        }
        })    
    }
}

var bgManager=null;
export var getBgManagerInstance=function(){
    if(!bgManager){
        bgManager=new BgManager();
    }
    return bgManager;
}


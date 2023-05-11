import { _decorator, Component, Node, sys, error, log, find } from 'cc';
import { my2DArray } from '../Common/my2DArray';
import { AdLogUtil } from '../../Extend/Ad/Util/AdLogUtil';
import { blockControler } from '../Controler/blockControler';
import { doubleArrInfo } from '../Common/Enum';
const { ccclass, property } = _decorator;

export class LocalDataManager {
    //关于localData存储数据：https://blog.csdn.net/qq_44317018/article/details/105772145
    //存储类型为string，需强转为number使用
    
    arrBlockBg=[1,0,0,0,0];
    gameBgArr=[1,0,0,0,0,0,0,0,0];
    doubleInfo:number[]=[];
    treasure=[0,0];


    /**首次启动时间存储 */
    setFirstStartTime(time:number){
        sys.localStorage.setItem("firstTime",time.toString());
    }

    getFirstStartTime(){
        return sys.localStorage.getItem("firstTime");
    }

    /**方块本地数据存储 */
    
    /**获取本地存储的上次double数组信息 */
    getDoubleInfoByLocalData(){
        return sys.localStorage.getItem("doubleInfo");
    }

    /**存储double数组信息 */
    setDoubleInfoToLocalData(maxValueInfo:number){
        if(maxValueInfo==doubleArrInfo.empty){
            this.doubleInfo.splice(0,this.doubleInfo.length);
        }else if(maxValueInfo==doubleArrInfo.delete){
            this.doubleInfo.sort((a,b)=>a-b);
            this.doubleInfo.shift();
        }else{
            this.doubleInfo.push(maxValueInfo);
        }
        sys.localStorage.setItem("doubleInfo",JSON.stringify(this.doubleInfo));
    }

    //获取本地存储的数组信息
    getBlockDataByLocalData(){
        return sys.localStorage.getItem("blockDataList");
    }

    //存储本地数据，下次打开时读取
    setBlockDataToLocalData(blockDataList:my2DArray){
        let configInfo={}
        for(let y=0;y<8;y++){
            configInfo[y]={};
            for(let x=0;x<5;x++){
                configInfo[y][x]=blockDataList.getValue(y,x);
            }
        }
        //因为在本地存储的时候，只能存储基本的数据类型，数组和对象等类型存入对话会是[object,object]，所以需要转换为json文件
        sys.localStorage.setItem("blockDataList", JSON.stringify(configInfo));
    }

    //获取本地记录的分数总和
    getSumScoreByLocalData(){
        return Number(sys.localStorage.getItem("score"));
    }

    //关卡数
    getLevelByLocalData(){
        let level=sys.localStorage.getItem("level");
        if(level){
            return level;
        }else{
            sys.localStorage.setItem("level","1");
            AdLogUtil.Log("没有初始关卡，设置为第一关");
            return 1;
        }
    }

    setLevelToLocalData(level:string){
        sys.localStorage.setItem("level",level);
    }

    //获取上次保存的通关分数
    getNowScoreByLocalData(){
        let myScore=sys.localStorage.getItem("myScore");
        if(myScore){
            return myScore;
        }else{
            sys.localStorage.setItem("myScore","0");
            return 0;
        }
    }

    setNowScoreToLocalData(nowScore:string){
        sys.localStorage.setItem("myScore",nowScore);
    }
    //获取本地记录的关卡所需分数
    getTotalScoreByLocalData(){
        let totalScore=sys.localStorage.getItem("totalScore");
        if(totalScore){
            return totalScore;
        }else{
            let blockContainer=find("Canvas/GameMain/blockContainer");  
            let controlBlockContainer=blockContainer.getComponent(blockControler);
            totalScore=(controlBlockContainer.getTotalNumberBlock()).toString();
            sys.localStorage.setItem("totalScore",totalScore);
            return totalScore;
        }
    }

    setTotalScoreToLocalData(totalScore:string){
        sys.localStorage.setItem("totalScore",totalScore);
    }

    //获取本地记录的最高分
    getMaxScoreByLocalData(){
        return sys.localStorage.getItem("maxScore");
    }

    //存放maxScore信息
    setScoreToLocalData(sumScore:number){
        sys.localStorage.setItem("score",sumScore.toString());
        let maxScore=Number(sys.localStorage.getItem("maxScore"));
        if(maxScore){
            if(sumScore>maxScore){
                sys.localStorage.setItem("maxScore",sumScore.toString());
            }
        }else{
            sys.localStorage.setItem("maxScore",sumScore.toString());
        }
    }

    // setBeforeMaxValueToLocalData(number:number){
    //     sys.localStorage.setItem("beforeMaxValue",number.toString());
    // }

    // //存放doubleLayer所需beforeMaxValue
    // getBeforeMaxValueByLocalData(){
    //     return sys.localStorage.getItem("beforeMaxValue");
    // }

    //存放本地最大方块信息
    setMaxBlockData(maxValue:number){
        sys.localStorage.setItem("maxBlock",maxValue.toString());
    }

    //获取本地最大方块信息
    getMaxBlockData(){
        let maxBlock=sys.localStorage.getItem("maxBlock");
        if(maxBlock){
            return Number(maxBlock);
        }else{
            sys.localStorage.setItem("maxBlock","1");
            // console.log("没有本地最大信息，设置倍数为1");
            return 1;
        }
    }

    // //TODO:获取已连接次数,后续可能会修改
    // getClearNumByLocalData(){
    //     let clearNum=sys.localStorage.getItem("clearNum");
    //     if(clearNum){
    //         return Number(clearNum);
    //     }else{
    //         sys.localStorage.setItem("clearNum","0");
    //         return 0;
    //     }
    // }

    // setClearNumToLocalData(clearNum:number){
    //     sys.localStorage.setItem("clearNum",clearNum.toString());
    // }

    // //获取提示次数
    // getTipNum(){
    //     let tipNum=sys.localStorage.getItem("tipNum");
    //     if(tipNum){
    //         return Number(tipNum);
    //     }else{
    //         sys.localStorage.setItem("tipNum","0");
    //         return 0;
    //     }
    // }

    // setTipNum(tipNum:number){
    //     sys.localStorage.setItem("tipNum",tipNum.toString());
    // }

    // //获取是否存在宝箱的信息
    // getHaveTreasure(){
    //     let haveTreasure=sys.localStorage.getItem("haveTreasure");
    //     if(haveTreasure){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }

    // setHaveTreasure(haveTreasure:number){
    //     if(haveTreasure==1){
    //         sys.localStorage.setItem("haveTreasure",haveTreasure.toString());
    //     }else{
    //         sys.localStorage.removeItem("haveTreasure");
    //     }
    // }

    // //获取宝箱位置
    // getTreasurePos(){
    //     return sys.localStorage.getItem("treasurePos");
    // }

    // setTreasurePos(x:number,y:number){
    //     this.treasure[0]=x;
    //     this.treasure[1]=y;
    //     sys.localStorage.setItem("treasurePos",JSON.stringify(this.treasure));
    // }

    /**钻石信息本地数据存储 */
    

    getDiamondDataByLocalData(){
        let diamond=sys.localStorage.getItem("diamond");
        if(diamond){
            return Number(diamond); //有存储信息就返回存储信息
        }else{
            sys.localStorage.setItem("diamond","100");  //无存储信息，则初始值为100
            return 100;
        }
        // return Number(sys.localStorage.getItem("diamond"));
    }

    setDiamondDataToLocalData(diamond:number){
        sys.localStorage.setItem("diamond",diamond.toString());
    }

    /**道具次数本地数据存储 */

    // //存储钻石信息
    // setDiamondByItemName(item:string){   //三个道具固定用一次100
    //     if(item!="refresh"  &&  item!="delete" && item!="exchange"){  //本地存储3个道具名称，重组、删除、交换
    //         error("没有这个道具！");
    //         return null;
    //     }
    //     sys.localStorage.setItem(item,"100");
    // }

    // getDiamondByItemName(item:string){
    //     if(item!="refresh"  &&  item!="delete" && item!="exchange"){  //本地存储3个道具名称，重组、删除、交换
    //         error("没有这个道具！");
    //         return null;
    //     }
    //     let gold=sys.localStorage.getItem(item);
    //     if(gold){
    //         return Number(gold);
    //     }else{
    //         sys.localStorage.setItem(item,"100");
    //         console.log("还未存该道具钻石信息，设为100");
    //         return 100;
    //     }
    // }

    //存储次数信息
    setTimesByItemName(itemTimes:string,bool?:boolean){
        if(itemTimes!="refreshTimes"  &&  itemTimes!="deleteTimes" && itemTimes!="exchangeTimes"){  //本地存储3个道具名称，重组、删除、交换
            error("没有这个道具！");
            return null;
        }
        let times=sys.localStorage.getItem(itemTimes);   //本地保存次数
        // if(typeof times=='string'){
                let a = bool?1:-1
                let itemNumber=Number(times);
                sys.localStorage.setItem(itemTimes,((itemNumber+a)>=0?(itemNumber+a):0).toString());   //用一次少一次或者获取一次多一次
    }

    getTimesByItemName(itemTimes:string){
        if(itemTimes!="refreshTimes"  &&  itemTimes!="deleteTimes" && itemTimes!="exchangeTimes"){  //本地存储3个道具名称，重组、删除、交换
            error("没有这个道具！");
            return null;
        }
        let times=sys.localStorage.getItem(itemTimes);
        if(times){
            return Number(times);  //如果本地存储了上次保存的次数信息，则将lb的数字信息改为本地存储的的信息
        }else{
            sys.localStorage.setItem(itemTimes,"1"); 
            // console.log("没有该道具的信息，初始给1次");
            return 1;
        }
    }

    /**签到天数本地数据存储 */

    //设置是否可签到状态
    setIsCanSigning(isCanSigning:number){ 
        sys.localStorage.setItem("isSigning",isCanSigning.toString());  
    }

    //获取是否可签到状态
    getIsCanSigning(){
        let isCanSigning=sys.localStorage.getItem("isSigning") || 1;
        if(isCanSigning==1){
            return true;
        }else{
            // console.log("在此断签或未到时间");
            return false;
        }
    }

    //记录签到天数
    setSigningDay(day){
        sys.localStorage.setItem("day",day>7?1:day);
    }

    //获取签到天数
    getSigningDay(){
        let day=sys.localStorage.getItem("day") || 1;
        return Number(day);
    }

    //设置签到时间
    setSigningDate(date){
        sys.localStorage.setItem("date",date);
    }

    //获取签到时间
    getSigningDate(){
        let date=sys.localStorage.getItem("date") || 0;
        return date;
    }

    //是否断签
    getNotSign(){   //未处理getDate()问题
        let date=Number(sys.localStorage.getItem("date"));
        if(date){  //存在上次签到时间需要判断是否断签
            let todayDate=new Date().getDate();
            let gapDay=todayDate-date;
            if(gapDay>1){
                return true;
            }else{
                return false;
            }
        }else{  //不存在上次签到时间则直接返回可签到
            // console.log("not exist!");
            return true;
        }
    }

    /**设置内容本地数据存储 */

    setMenuDataToLocalData(isOpenSound:boolean,isOpenVibrate:boolean){
        let openSound=isOpenSound?1:0;
        let openVibrate=isOpenVibrate?1:0;
        sys.localStorage.setItem("isOpenSound",openSound.toString());
        sys.localStorage.setItem("isOpenVibrate",openVibrate.toString());
        
    }

    getOpenSoundByLocalData(){
        let openSound=sys.localStorage.getItem("isOpenSound");
        if(openSound){
            return Number(sys.localStorage.getItem("isOpenSound"));
        }else{
            sys.localStorage.setItem("isOpenSound","1");
            return 1;
        }
    }

    getOpenVibrateByLocalData(){
        let openVibrate=sys.localStorage.getItem("isOpenVibrate");
        if(openVibrate){
            return Number(sys.localStorage.getItem("isOpenVibrate"));
        }else{
            sys.localStorage.setItem("isOpenVibrate","1");
            return 1;
        }
    }


    /**皮肤内容本地数据存储 */

    //当前所展示的bg
    setBgNumber(number:string){
        sys.localStorage.setItem("bgNumber",number);
    }

    //获取上次存储的展示bg
    getBgNumber(){
        let number=sys.localStorage.getItem("bgNumber");
        if(number){
            return Number(number);
        }else{
            return 0;
        }
    }

    //设置当前所展示的方块皮肤
    setBlockBg(id:number){
        sys.localStorage.setItem("blockBg",id.toString());  
    }

    //获取上次存储的展示blockBg
    getBlockBg(){
        let blockBgNum=sys.localStorage.getItem("blockBg");  
        if(blockBgNum){
            return Number(blockBgNum);
        }else{
            return 0;
        }
    }

    //记录已被解锁的背景
    setUnlockBg(arr){
        sys.localStorage.setItem("gameArr",JSON.stringify(arr));   
    }

    //获取已被解锁的背景
    getUnlockBg(){
        // let arr=JSON.parse(sys.localStorage.getItem("gameArr"));
        let gameArr=sys.localStorage.getItem("gameArr");
        if(gameArr){
            let arr=JSON.parse(sys.localStorage.getItem("gameArr"));
            this.gameBgArr=arr;
            return this.gameBgArr;
        }else{
            return this.gameBgArr;
        }
    }

    //记录已被解锁的方块背景
    setUnlockBlockBg(arr){
        sys.localStorage.setItem("blockArr",JSON.stringify(arr));
    }

     //获取已被解锁的背景
     getUnlockBlockBg(){
        let blockArr=sys.localStorage.getItem("blockArr");
        // let arr=JSON.parse(sys.localStorage.getItem("blockArr")) ;
        if(blockArr){
            let arr=JSON.parse(sys.localStorage.getItem("blockArr"));
            this.arrBlockBg=arr;
            return this.arrBlockBg;
        }else{
            return this.arrBlockBg;
        }
    }

    /**新手引导本地数据存储 */
    setIsFirstTime(firstTime){
        sys.localStorage.setItem("firstEnter",firstTime);
    }

    getIsFirstTime(){
        let firstTime=sys.localStorage.getItem("firstEnter");
        if(!firstTime){
            return true;
        }else{
            return false;
        }
    }

    setGuildStep(step:number){  //获取引导的步数
        sys.localStorage.setItem("guildStep",step.toString());
    }

    getGuildStep(){
        let step=sys.localStorage.getItem("guildStep");
        if(step){
            return Number(step);
        }else{
            return 1;  //没有的话前往第一步新手引导
        }
    }

    removeAllLocalData() {
        // sys.localStorage.removeItem("score");
        // sys.localStorage.removeItem("level");
        // sys.localStorage.removeItem("myScore");
        // sys.localStorage.removeItem("doubleInfo");
        // sys.localStorage.removeItem("blockDataList");
        // sys.localStorage.removeItem("totalScore");
        // sys.localStorage.removeItem("maxScore");
        // sys.localStorage.removeItem("maxBlock");
        // sys.localStorage.removeItem("refreshTimes");
        // sys.localStorage.removeItem("deleteTimes");
        // sys.localStorage.removeItem("exchangeTimes");
        // sys.localStorage.removeItem("diamond");
        // sys.localStorage.removeItem("guildStep");
        sys.localStorage.clear();
    }

}

var localDataManager=null;
export var GetLocalDataMgrInstance=function(){
    if(!localDataManager){
        localDataManager=new LocalDataManager();
    }
    return localDataManager;
}



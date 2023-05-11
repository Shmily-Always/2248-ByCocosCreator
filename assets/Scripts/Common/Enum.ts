import { _decorator, Component, Node, AudioClip, Sprite, SpriteFrame, ImageAsset } from 'cc';
const { ccclass, property } = _decorator;

export interface colorData{
    id:number;  //ID
    color:string ; //格子颜色
    fontColor:string;  //数字颜色
}

export interface rankingData{
    id:number;  //排名
    name:string ; //名字
    score:string;  //分数
}

export interface bgData{  //图片信息
    id:number;
    name:string;
    bgData:SpriteFrame;
}

export interface bgTextData{  //图片来源
    id:number;  //ID
    name:string , //图片名
    path:string ,  //路径
}

export interface soundData{   //声音信息
    id:number;
    name:string;
    soundData:AudioClip;
}

export interface soundTextData{  //音效来源
    id:number;  //ID
    soundName:string,  //音效名
    path: string,    //路径
}

// export enum lastInterface{
//     none=0,
//     doubleLayer=1
// }

/**
 * @param 0:加金币
 * @param 1:按倍数加金币
 * @param 2:突破（x2) 
 * @param 3:加道具（x2）
 * @param 4:加道具（主页激励）
 * @param 5:解锁皮肤
 * @param 6:过关
 */
export enum rewardType{ 
    addDiamond=0,  
    addDiamondTimes=1,   
    changeBlock=2,   
    addProp=3,  
    addSkill=4,
    unlockClothes=5,  
    pass=6,
}

/**
 * @param 1:锤子
 * @param 2:交换
 * @param 3:刷新 
 */
export enum propType{ 
    hammer=1,  
    exchange=2,   
    refresh=3,   
}


/**
 * @param -1:清空数组
 * @param -2：第一个值出数组
 */
export enum doubleArrInfo{ 
    empty=-1,
    delete=-2,   
}

/**
 * 激励所在位置
 * @param 0:主页
 * @param 1:游戏内部
 */
export enum rewardLayer{  
    mainMenu=0, 
    mainGame=1,  
}

/**
 * 加宝石所在位置
 * @param 0:商店
 * @param 1:宝石不足
 */
export enum addMoney{
    storeLayer=0,
    notEnoughLayer=1,
}

export class blockScaleAnimation{
    static readonly time=0.3;  //放大总时间，可调
    static readonly scale=0.2;  //放大倍数，可调
}

export class effectActioin {
    static readonly exchangeTime = 0.3;
    static readonly doubleTime = 0.3;
    static readonly hammerTime = 1;
    static readonly addMoneyTime = 0.5;
    static readonly addDiamondTimeLayer=1.0;
}

export class clearEffect {
    static readonly clear = 1.0;//每次操作间隔，判断是否突破,大于动画播放时间
    static readonly actionTime = 0.8;//动画播放时间，播放完后，合成再下落
    static readonly biggerTime = 0.5;
    static readonly moveTime = 0.3;
    static readonly colorTime = 0.2;  //变换颜色的时间
    static readonly destoryTime = 0.8;//消除可生成最小值花费时间
    static readonly destoryTime2 = 0.5;//砖块被击碎时间
}


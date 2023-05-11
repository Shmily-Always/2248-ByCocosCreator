import { _decorator, Component, Node, TextAsset, warn, AudioClip, AudioSource } from 'cc';
import { soundData, soundTextData } from '../Common/Enum';
import tools from '../Common/Tools';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager {

    soundTable:soundData[]=[];
    soundTextTable:[soundTextData];
    musicTable:soundData[]=[];
    musicTextTable:[soundTextData];

    isOpenSound:boolean=true;

    _audioSource:AudioSource;

    connectSoundNum:number=1;

    constructor(){
        this.getSoundTexData();
        this.getMusicTexData();
    }

    getSound(audioSource:AudioSource){
        this._audioSource=audioSource;
    }

    async getSoundTexData(){
        try{
            let textAsset:TextAsset = await tools.createLoadPromise("Config/soundData",TextAsset,false);
            if(!textAsset.text){
                // console.log("tableName:%s not textData", "Config/soundData");
                textAsset.text="";
            }
            let textData=textAsset.text;
            let soundTextTable=tools.ChangeTxt("soundData",textData);
            this.soundTextTable=soundTextTable;
            this.getSoundData();
        }catch(error){
            warn("error",error);
            return;
        }
    }

    async getMusicTexData(){
        try{
            let textAsset:TextAsset= await tools.createLoadPromise("Config/musicData",TextAsset,false);
            if(!textAsset){
                // console.log("tableName:%s not textData", "Config/musicData");
                textAsset.text="";
            }
            let textData=textAsset.text;
            let musicTextTable=tools.ChangeTxt("musicData",textData);
            this.musicTextTable=musicTextTable;
            this.getMusicData();
        }catch(error){
            warn("error",error);
            return;
        }
    }

    async getSoundData(){
        for(let i=0;i<this.soundTextTable.length;i++){
            let id=i;
            let name=this.soundTextTable[i].soundName;
            let soundData:AudioClip=await tools.createLoadPromise(this.soundTextTable[i].path,AudioClip);
            let sound:soundData={id,name,soundData};
            this.soundTable.push(sound);
        }
    }

    async getMusicData(){
        for(let i=0;i<this.musicTextTable.length;i++){
            let id=i;
            let name=this.musicTextTable[i].soundName;
            let soundData:AudioClip=await tools.createLoadPromise(this.musicTextTable[i].path,AudioClip);
            let music:soundData={id,name,soundData};
            this.musicTable.push(music);
        }
    }

    playSound(soundName:string){
        let volume=this.isOpenSound?1:0;
        for(let i=0;i<this.soundTable.length;i++){
            if(this.soundTable[i].name==soundName){
                this._audioSource.playOneShot(this.soundTable[i].soundData,volume);
            }
        }
    }

    playMusic(musicName:string){
        let volume=this.isOpenSound?1:0;
        for(let i=0;i<this.musicTable.length;i++){
            if(this.musicTable[i].name==musicName){
                this._audioSource.playOneShot(this.musicTable[i].soundData,volume);
            }
        }
    }

    playBlockSound(){  //格子音乐
        if(this.connectSoundNum>this.musicTable.length){  //播放到最后一个音乐时从第一个音乐开始播放
            this.connectSoundNum=1;
        }
        if(this.connectSoundNum<1){
            // console.error("连线声音出错");
        }
        let name=this.musicTable[this.connectSoundNum-1].name;  //转成的数组数据从0开始
        this.playMusic(name);
        this.connectSoundNum+=1;
    }

    setIsOpenSound(isOpen:boolean){
        this.isOpenSound=isOpen;
    }

    
}

var soundManager=null;
export var getSoundManagerInstance=function(){
    if(!soundManager){
        soundManager=new SoundManager();
    }
    return soundManager;
}



import { _decorator, Component, Node, Asset, assetManager, error, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tools')
class Tools {

   /**异步加载资源 
    * @param resPath  资源路径
    * @param resType  类型
    * @param isRecord 是否记录资源
   */
    
   createLoadPromise<T extends Asset>(resPath : string,resType:typeof Asset , isRecord=true):Promise<T>{
        let promiseFunc = (resolve:Function,reject:Function)=>{
            assetManager.resources.load(resPath,resType,(error:Error,loadData:T)=>{
                if(error){
                    reject(error);
                    return;
                }
                resolve(loadData);
            });
        };
        return new Promise<T>(promiseFunc);  //成功时返回promise
            
    }   

    //转换表为字典
    ChangeTxt(tableName:string,text:any){
        let textDataList=text.split("\n");  //以\n分割字符串，返回数组
        let lineCount=textDataList.length;
        if(!lineCount){
            error("配置数据为空(%s)没有配置数据",tableName);
            return null;
        }
        let lineNum=-1;//第三行起为数据
        let fileNameList=null;
        let fileCount=null;
        let txtData:any=[];  //字典

        //存行数据
        for(let index=0;index<lineCount;index++){
            let textStr=textDataList[index];
            //替换，正则表达式：https://blog.csdn.net/weixin_30342827/article/details/98741969
            textStr=textStr.replace(/(\s*$)/g,""); //去除所有空格
            if(!textStr){ //最后一行或者空行跳过
                continue
            }
            //存列数据
            lineNum+=1;
            let txtContain=textStr.split("\t");
            if(lineNum===1){//从此起为数据行
                fileNameList=txtContain;  //保存数据
                fileCount=fileNameList.length;
            }else if(lineNum>1){
                let rows=txtContain.length;
                if(rows!=fileCount){   //配置列数与需求列数不等
                    // error("读取数据失败(%s),第(%s)行, 配置数据:%s 配置列数(%s)!=需求列数(%s)"
                    //     , tableName, lineNum, JSON.stringify(textStrList), rows, fileCount);
                    return null;
                }
            let key=txtContain[0];  //添加字典的键值
            let rowsData:any={};
            for(var j=0;j<fileCount;j++){
                let value=txtContain[j].trim();
                let fileName=fileNameList[j].trim();
                try{
                    value=this.GetTransformValue(value);
                }catch(error){
                    // error("GetTransformValue(%s,%s)(%s),error:%s",tableName,fileName,value,error.stack);
                    value=undefined;
                }
                rowsData[fileName]=value;
             }
             txtData[key-1]=rowsData;
            }
        }
        // console.log("tableDataDic is ",tableDataDic);
        return txtData;
    }

    GetTransformValue(value: any) {
        let beginString = value[0];
        let endString = value[value.length - 1];
        let lowerCase = value.toLowerCase();
        if (lowerCase === "false") {
            return false;
        } else if (lowerCase === "true") {
            return true;
        }
        if (beginString === "[" && endString === "]") {//如果是列表
            try {
                return JSON.parse(value);
            } catch (e) {
                // error("转换数组配置错误(%s,%s)(%s)  第(%s)行", tableName, fieldName, valueStr, lineNum);
                return value;
            }
        } else if (beginString === "{" && endString === "}") {
            try {
                return JSON.parse(value);
            } catch (e) {
                // error("转换数组配置错误(%s,%s)(%s)  第(%s)行", tableName, fieldName, valueStr, lineNum);
                return value;
            }
        }
        else if (value.indexOf("return") != -1) {
            return new Function(value);
        } else {
            if (value == "") {
                return value;
            }
            //取整
            //如果不是纯数字,则为字符串
            else if (isNaN(value)) {
                return value;
            } else {
                return Number(value);
            }
        }
    }

    //hex转rgb：
    hexToRgb(color:string):Color{
        if(color==null||color.length!=7){
            return null;
        }
        let colorString=color.toLowerCase();
        if(colorString.charAt(0)!="#"){  //charAt()是方法！
            return;
        }
        colorString=colorString.slice(1);
        // let colorChange=[];
        // for(let i=1;i<7;i+=2){
        //     colorChange.push(parseInt("0x"+color.slice(i,i+2)));
        // }
        // let r=colorChange[0];
        // let g=colorChange[1];
        // let b=colorChange[2];
        // return new Color(r,g,b,255);
        let r=parseInt(colorString[0]+colorString[1],16);
        let g=parseInt(colorString[2]+colorString[3],16);
        let b=parseInt(colorString[4]+colorString[5],16);
        return new Color(r,g,b,255);
    }

        
}
var tools = new Tools();
export default tools;



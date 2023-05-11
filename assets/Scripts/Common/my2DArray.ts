import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export class my2DArray {

/**
 * @author 杨松恺
 * @date 2018-12-05 15:45:08
 * 定义二维数组，提供相关操作
 */

//https://blog.csdn.net/qq_41089021/article/details/84837966?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-84837966-blog-80997799.pc_relevant_default&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-84837966-blog-80997799.pc_relevant_default&utm_relevant_index=2

    my2DArray : Array<Array<number>> = new Array<Array<any>>;
    rows : number;
    cols : number;

    //初始化数组，构造函数

    constructor(rows:number,cols:number,value:any){
        this.rows=rows;
        this.cols=cols;
        this.initRows(rows);
        this.initCols(cols,value);
    }
    
    //取数组坐标
    getValue(rows: number , cols : number):any{
        if(rows<0 || cols<0 || rows>=this.rows || cols>=this.cols){
            // console.log(`cols is${cols},rows is${rows}`);
            return null;
        }
        return this.my2DArray[rows][cols];
    }

    //为数组赋值,行数/列数/rows列cols行的值设置为value
    setValue(rows: number , cols : number,value:any){
        if(rows<0 || cols<0 || rows>=this.rows || cols>=this.cols){
            return null;
        }
         this.my2DArray[rows][cols]=value;
    }

    //初始化行数
    initRows(rows:number){
        if(rows<1){
            return;
        }
        for(let i=0;i<rows;i++){
            this.my2DArray.push(new Array<any>());
        }
    }

    //初始化列数
    initCols(cols:number,value:any){
        if(cols<1){
            return;
        }
        for(let i=0;i<this.my2DArray.length;i++){
            for(let j=0;j<cols;j++){
                this.my2DArray[i].push(value);
            }
        }
    }

    //获取数组
    getArray():Array<Array<any>>{
        return this.my2DArray;
    }
}



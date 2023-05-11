/**
 * 
 * AdLogUtil
 * Describe: control log
 * Thu Dec 01 2022 12:05:14 GMT+0800 (中国标准时间)
 * AdLogUtil.ts
 * db://assets/Scripts/FrameWork/Util/AdLogUtil.ts
 * https://docs.cocos.com/creator/3.6/manual/zh/
 *
 */

export class AdLogUtil {
    private static isOpenLg = true;
    private static readonly logTag = "SDKWapper";

    /**
     * init log system
     * @param isOpenGameLog 
     */
    public static InitLogUtil(isOpenGameLog:boolean):void{
        AdLogUtil.isOpenLg =isOpenGameLog;
    }
    

    /**
     * show log
     * @param content log content
     * @returns 
     */
    public static Log(content: string): void {
        if (!AdLogUtil.isOpenLg) {
            return;
        }
        let log = AdLogUtil.logTag + ":" + content;
        console.log(log);
    }


    public static LogObj(...data: any[]):void{
        if (!AdLogUtil.isOpenLg) {
            return;
        }
        console.log(data);
    }


    /**
     * show log error
     * @param content content
     * @returns 
     */
    public static Error(content: string): void {
        if (!AdLogUtil.isOpenLg) {
            return;
        }
        let log = AdLogUtil.logTag + ":" + content;
        console.error(log);
    }
    
}



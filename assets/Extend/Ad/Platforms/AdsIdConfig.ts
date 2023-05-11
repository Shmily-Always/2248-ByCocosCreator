export enum EPlatform {
    'test' = 0,
    'VIVO' = 10003702,
    "OPPO" = 10003767,
    "TikTok" = 10003711,
    "QQ" = 4,
    "WX" = 5,
    'KS' = 7,
    "HUAWEI" = 10002553, //测试id 10002553
    "XiaoMi" = 10003494, 
    "UC" = 1,
    "Close" = 2,
    "Platform4399"=10003785,
}

export enum AdType {
    '开屏' = 1,
    'Banner' = 2,
    '插屏' = 3,
    '激励视频' = 4,
    '全屏视频' = 5, //原生icon
    '原生插屏' = 12,//后台的信息流
    '浮标' = 13,  //互推banner
    '原生Banner' = 14,  //友盟-原生banner
    '原生开屏' = 24, //后台的插全屏-半屏 oppo互推九宫格 微信的九宫格
    '原生模板' = 25, //后台的信息流-互推 oppo原生模板广告
}

export default class AdsIdConfig {
    private static serverRootUrl = 'https://api.iweisesz.com/api/client/mini?pid=';
    public static adConfig = null;

    private static _platform: EPlatform;
    static set platform(v: EPlatform) {
        this._platform = v;
    }
    static get platform(): EPlatform {
        return this._platform;
    }

    static getAdConfigWeb(callback:any) {
        if (AdsIdConfig.platform == EPlatform.test || AdsIdConfig.platform == EPlatform.Close) {
            AdsIdConfig.serverRootUrl += '10002483';
        } else {
            AdsIdConfig.serverRootUrl += AdsIdConfig.platform;
        }

        this.httpCall({ url: AdsIdConfig.serverRootUrl, callback: callback });
    }

    static async httpCall(data) {
        let ADData = await AdsIdConfig.httpSend({
            url: data.url,
        });
        // console.log('ad====>', ADData);
        AdsIdConfig.adConfig = ADData;
        data.callback && data.callback();
    }

    static httpSend(options) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                    var res = JSON.parse(xhr.responseText);
                    resolve(res);
                }
            };
            xhr.timeout = options.timeout || 50000; // 5 seconds for timeout
            let method = options.method || 'GET';
            let url = options.url;
            options.data = options.data || {};
            if (method == 'get' || method == "GET") {
                // console.log('url===>',url);
                xhr.open(method, url, true);
                xhr.send();
            } else {
                xhr.open(method, options.url, true);
                xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
                xhr.send(JSON.stringify(options.data));
            }
        });
    };

    /**
     * 判断字符串中是否有空格,适用于检查后台填写的广告ID
     */
     static stringHasSpace(str: string) {
        if (str == null) return true;
        let num = str.indexOf(" ");
        if (num == -1) {
            return false;
        } else {
            return true;
        }
    }
}

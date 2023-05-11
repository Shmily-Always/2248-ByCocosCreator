
import { _decorator, Component, Node, Sprite, SpriteFrame, assetManager } from 'cc';
import AdManager from '../AdManager';
const { ccclass, property } = _decorator;

@ccclass('AdIconInfo')
export class AdIconInfo extends Component {

    @property(Node)
    icon: Node = null;

    @property(Node)
    close_btn: Node = null;

    @property(Node)
    click: Node = null!;

    private nativeInfo: any = null;
    onEnable() {
        this.initView();
        this.addEvent();
    }

    private initView() {
        this.nativeInfo = AdManager.getInstance().showNativeIconAd();
        // console.log("原生icon=====>");
        this.click && (this.click.active = false);
        if (this.nativeInfo && this.nativeInfo.adId && (this.nativeInfo.Native_icon_url || this.nativeInfo.Native_BigImage_url)) {
            AdManager.getInstance().reportNativeIconShow(this.nativeInfo.adId);
            let icon_image_url = this.nativeInfo.Native_icon_url;
            if (!icon_image_url) {
                icon_image_url = this.nativeInfo.Native_BigImage_url;
            }
            this.loadAdSprite(this.icon.getComponent(Sprite), icon_image_url);
            this.click && (this.click.active = true);
        } else {
            this.node.active = false;
        }
        setTimeout(() => {
            if (this.node && this.node.active) {
                AdManager.getInstance().loadNativeIcon();
                this.initView();
            }
        }, 30000);
    }
    private addEvent() {
        this.node.on("click", this.nativeClick, this);
        this.click && (this.click.on("click", this.nativeClick, this));
        this.close_btn.on("click", this.closeThisNode, this);
    }
    public nativeClick() {
        AdManager.getInstance().reportNativeIconClick(this.nativeInfo.adId);
        this.node.active = false;
    }
    private closeThisNode() {
        this.node.active = false;
        this.click && (this.click.active = false);
    }
    onDisable() {
        AdManager.getInstance().loadNativeIcon();
    }
    private loadAdSprite(nodesprite, url) {
        if (url.indexOf('.png') > -1 || url.indexOf('.jpg') > -1) {
            assetManager.loadRemote(url, function (err, texture) {
                if (err != null || texture == null) {
                    return;
                }
                // console.log('====>', texture);
                nodesprite.spriteFrame = SpriteFrame.createWithImage(texture);
            }.bind(this));
            return;
        }
        assetManager.loadRemote(url, { ext: '.png' }, function (err, texture) {
            if (err != null || texture == null) {
                return;
            }
            // console.log('====>', texture);
            nodesprite.spriteFrame = SpriteFrame.createWithImage(texture);
        }.bind(this));
    }
}

import { _decorator, Component, Node, CameraComponent, systemEvent, SystemEvent, EventMouse, math, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends Component {
    @property(CameraComponent)
    camera: CameraComponent = null;

    private rotationTime: number = 0;
    private rotationDT: number = 100;

    update(dt: number) {
        this.playTrans();
    }


    start () {
        this.rotationTime = 0;
        systemEvent.on(SystemEvent.EventType.MOUSE_WHEEL, this.onMoushWheel, this);
    }

    private playTrans(): void {
        if (this.rotationTime !== 0) {
            let scrollY = this.getScrollY();
            if (scrollY != 0) {
                const PI = 3.1415926535;
                const rotationX = this.node.getRotation();
                math.Quat.rotateAround(rotationX, rotationX, this._getDirection(0, -1, 0), scrollY / 5 / 360.0 * PI);
                this.node.setRotation(rotationX);
            }
        }
    }

    private getScrollY(): number {
        if (Math.abs(this.rotationTime) < 100) {
            this.rotationDT = 16;
        } else if (Math.abs(this.rotationTime) < 1000) {
            this.rotationDT = 30;
        } else if (Math.abs(this.rotationTime) < 3000) {
            this.rotationDT = 60;
        } else if (Math.abs(this.rotationTime) < 6000) {
            this.rotationDT = 100;
        } else if (Math.abs(this.rotationTime) < 10000) {
            this.rotationDT = 200;
        } else {
            this.rotationDT = 150;
        }
        // console.log(this.rotationTime, this.rotationDT);
        let res = 0;
        if (this.rotationTime > 0) {
            let dec = this.rotationTime - this.rotationDT;
            if (dec > 0) {
                this.rotationTime = dec;
                res = this.rotationDT;
            } else {
                this.rotationTime = 0;
                res = this.rotationTime;
            }
        } else {
            let dec = this.rotationTime + this.rotationDT;
            if (dec < 0) {
                this.rotationTime = dec;
                res = -this.rotationDT;
            } else {
                this.rotationTime = 0;
                res = this.rotationTime;
            }
        }
        return res;
    }

    private onMoushWheel(event: EventMouse) {
        /**
         * 往上滚是正
         * 往下滚是负
         */
        let scrollY =  event.getScrollY();
        this.rotationTime += scrollY * 10;
    }

    // 根据自身方向，转化方向
    private _getDirection (x: number, y: number, z: number) {
        const result = new Vec3(x, y, z);
        math.Vec3.transformQuat(result, result, this.node.getRotation());
        return result;
    }
}

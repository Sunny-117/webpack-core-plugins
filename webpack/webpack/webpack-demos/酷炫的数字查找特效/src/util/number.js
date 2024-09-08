import isPrime from "./isPrime"
/* export default {
    start() {
    },
    stop() {
    }
} */
export default class NumberTimer {

    constructor(duration = 500) { //不传时间默认500
        this.duration = duration;
        this.number = 1; //当前的数字
        this.onNumberCreated = null; //当一个数字产生的时候，要调用的回调函数
        this.timerId = null;
    }

    start() {
        if (this.timerId) { //正在产生数字，啥都不做
            return;
        }
        this.timerId = setInterval(() => { //没有在产生数字，我让你产生数字
            this.onNumberCreated && this.onNumberCreated(this.number, isPrime(this.number))
            this.number++;
        }, this.duration)
    }

    stop() {
        clearInterval(this.timerId);
        this.timerId = null;
    }
}
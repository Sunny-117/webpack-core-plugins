/**
 * 判断n是否是素数
 * 素数：仅能被1和自身整除
 * 6    2，5
 * @param {*} n     
 */
export default function (n) {
    if (n < 2) {
        return false;
    }
    for (let i = 2; i <= n - 1; i++) { //2和自身之前有没有能整除的
        if (n % i === 0) {
            //发现，2到n-1之间，有一个数能整除n
            return false;
        }
    }
    return true;
}
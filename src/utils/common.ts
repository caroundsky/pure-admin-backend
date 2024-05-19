export function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(void 0)
        }, time)
    })
}

// 洗牌
export const shuffle = arr => {
    let len = arr.length, random
    while(len != 0){
        random = (Math.random() * len--) >>> 0; // 无符号右移位运算符向下取整(注意这里必须加分号，否则报错)
        [arr[len], arr[random]] = [arr[random], arr[len]] // ES6的结构赋值实现变量互换
    }
    return arr
}
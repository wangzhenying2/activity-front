import { getExternalInfo } from 'api/auth'

export const UA = window.navigator.userAgent.toLowerCase()
export const isApp = UA.match(/aym=({.*})/)
// export const isApp = true
export const isAndroid = UA && UA.indexOf('android') > 0
export const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA)
export function getUA(key) {
    const aym = navigator.userAgent.match(/aym=({.*})/)
    if (aym) {
        const result = JSON.parse(aym[1])
        return result[key]
    }
    return ''
}

export const appVersion = getUA('version')

export const newerVersionThan = (verison) => {
    if (!verison) return false
    const curr = appVersion.split('.')
    const target = verison.split('.')
    for (let i = 0; i < curr.length; i++) {
        if (~~curr[i] < ~~target[i]) {
            return false
        }
        if (~~curr[i] > ~~target[i]) {
            return true
        }
    }
    return true
}
/**
 * [格式化日期]
 * @param  dt = dateTime: type string || number || date object
 * @return type string
*/
export function datetimeFormat(dt, fmt = 'yyyy-MM-dd hh:mm:ss') {
    let newDate = dt
    if (!dt) {
        return ''
    }
    if (typeof dt === 'string') {
        // dt = dt.replace(/-/g, '/') // IOS上只支持yyyy/MM/dd这种标准格式
        dt = /^\d+$/.test(dt) ? parseInt(dt) : dt.replace(/-/g, '/') // 传入的日期可能是个纯数字组成的字符串，如"1511107200000"
    }
    if (dt instanceof Date === false) {
        dt = new Date(dt)
    }
    if (!dt.getTime()) {
        return newDate
    }

    let opt = {
        'y+': dt.getFullYear().toString(), // 年
        'M+': (dt.getMonth() + 1).toString(), // 月
        'd+': dt.getDate().toString(), // 日
        'h+': dt.getHours().toString(), // 时
        'm+': dt.getMinutes().toString(), // 分
        's+': dt.getSeconds().toString() // 秒
    }

    for (const k in opt) {
        const ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
            if (/(y+)/.test(k)) {
                fmt = fmt.replace(ret[1], opt[k].substring(4 - ret[1].length))
            } else {
                fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
            }
        }
    }
    return fmt
}

// 金额除以一千
export const formatMoneyK = (num, count = 2) => {
    if (isNaN(parseFloat(num))) {
        return num
    }
    return (parseFloat(num) / 1000).toFixed(count)
}

/**
 * [全局唯一编码生成(UUID)]
 * @param  {[string]} len   [uuid生成长度]
 * @param  {[string]} radix [基数: 2、10、16进制]
 * @return {[string]}       [生成uuid]
 */
export function uuid(len, radix) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    let uuid = []; let i
    radix = radix || chars.length
    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
    } else {
        let r
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | (Math.random() * 16)
                uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
            }
        }
    }
    return uuid.join('')
}

// 联系客服
export const goService = replace => {
    if (isApp) {
        getExternalInfo().then(res => {
            const { serverId, nickName } = res
            const fromUrl = encodeURIComponent(location.href)
            const customField = encodeURIComponent(`{"昵称":"${nickName}","外部ID":"${serverId}"}`)
            const sobotUrl = `https://ykf-webchat.7moor.com/wapchat.html?accessId=170903b0-1186-11ed-9e88-11008ac11379&fromUrl=${fromUrl}&urlTitle=淘逛逛&language=ZHCN`
            const serviceUrl = sobotUrl + `&clientId=${serverId}&otherParams={"nickName":"TGG-${nickName}-${serverId}"}&customField=${customField}`
            window.axdApp.send({
                module: 'webview',
                method: 'configNavigationBar',
                params: {
                    visible: true
                }
            })
            if (replace) {
                location.replace(serviceUrl)
            } else {
                location.href = serviceUrl
            }
        })
    } else {
        location.href = '/pages/user/customerService'
    }
}

/**
 * [css引用]
 * @param  {[string]} filename [filename]
 */
export const includeCss = (filename) => {
    const head = document.getElementsByTagName('head')[0]

    const link = document.createElement('link')
    link.href = filename
    link.rel = 'stylesheet'

    head.appendChild(link)
}
// 姓名脱敏
export function nameReplace(val = '') {
    if (val && val.indexOf('*') < 0 && val.length > 1) {
        const len = val.length
        const firstStr = len > 2 ? val.charAt(0) : ''
        return firstStr + '*' + val.charAt(len - 1)
    } else {
        return val
    }
}
// 18位身份证 隐藏中间 331022 ******** 1279
export function IDcardReplace(val) {
    if (val) {
        let n = (val + '').toUpperCase()
        let o = '$1********$2'
        if (n.length === 18) {
            return n.replace(/(\d{6})\d{8}(\d{3})/, o)
            // if (val.indexOf('x') > 0) {
            // } else {
            //     return n.replace(/(\d{6})\d{8}(\d{3})/, o)
            // }
        }
    }
}

/**
 * goBankCard
 * 跳绑卡页统一新开webview, 绑卡氛围 h5 + api两种形式，
 * h5绑卡会跳招商等页面，为了防止后退回退到第三方页面，回退地址为中间页，该页面关闭webview，原页面刷新
 * 此处因为是弹窗，刷新页面或者关闭webview无法达到预期自动弹出效果，只能通过location跳转，不知道是否有坑
 * @param url
 * @param returnUrl 成功后返回页面，默认为当前页面地址
 */
export function goBankCard(url, returnUrl) {
    if (returnUrl) {
        const urlSymbol = url.indexOf('?') > -1 ? '&' : '?'
        url = url.concat(`${urlSymbol}returnUrl=${encodeURIComponent(returnUrl)}`)
    }
    location.href = url
    // if (isApp) {
    //     window.axdBackFunc = () => {
    //         window.axdApp.refresh()
    //     }
    //     window.axdApp.send({
    //         module: 'navigation',
    //         method: 'goURL',
    //         params: {
    //             url
    //         }
    //     })
    // } else {
    //     location.href = url
    // }
}
// 点击链接（app中用手机默认浏览器打开，h5在新窗口中打开）
export const toLink = link => {
    if (isApp) {
        window.axdApp.send({
            module: 'navigation',
            method: 'goURLWithOuterBrowser',
            params: {
                url: link
            }
        })
    } else {
        window.open(link)
    }
}

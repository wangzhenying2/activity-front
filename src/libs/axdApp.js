/* eslint-disable no-eval */
/* eslint-disable no-undef */
/**
 * e.g.：
    axdApp.send({
        module: 'device',
        method: 'getInfo',
        params: {},
        callback: function(data) {
            alert(JSON.stringify(data))
        }
    })
 */
import './jsbridge'
(function() {
    function JSBridgeLogException(e, m) {
        if (typeof console !== 'undefined') {
            console.log('JSBridge:JS: EXCEPTION: ', arguments)
        }
    }

    let core = {
        bridge: function(object) {
            if (typeof object !== 'object' || !object.module || !object.method) {
                console.log('参数格式有误')
                return
            }
            let ua = navigator.userAgent
            let isIOSDevice = /iP(hone|od|ad)/g.test(ua)
            let responseCallbacks = {}
            try {
                const appJS = window.appJS ? window.appJS : window.webkit.messageHandlers.appJS
                if (object.callback) {
                    let cbID = 'cbID' + (+new Date())
                    responseCallbacks[cbID] = object.callback
                    object.callback = cbID
                }

                if (isIOSDevice) {
                    appJS.postMessage(object)
                } else {
                    appJS.requestNative(object.module, object.method, JSON.stringify(object.params), object.callback)
                }
            } catch (e) {
                console.log('JSBridge:JS: EXCEPTION: ', e)
            }
        }
    }

    let axdApp = {
        send: function(object) {
            core.bridge.apply(core, arguments)
            // window.webkit.messageHandlers.appJS.postMessage(object)
        },
        refresh: function() {
            core.bridge({
                module: 'webview',
                method: 'refresh',
                params: {
                    joinLoginInfo: false
                }
            })
        },
        back: function() {
            core.bridge({
                module: 'webview',
                method: 'goBack'
            })
        },
        close: function() {
            core.bridge({
                module: 'webview',
                method: 'close'
            })
        },
        testLog: function(logMsg) {
            core.bridge({
                module: 'tools',
                method: 'log',
                params: {
                    phone: logMsg
                }
            })
        }
    }

    window.axdApp = window.axdApp || axdApp
})()

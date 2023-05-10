/* eslint-disable no-eval */
/* eslint-disable no-undef */
(function(w, doc) {
    if (w.JSBridge) {
        return
    }
    let ua = navigator.userAgent
    let isIOSDevice = /iP(hone|od|ad)/g.test(ua)
    let isAndroidDevice = /Android/g.test(ua)
    let sendMessageQueue = []
    let messageHandlers = {}
    let responseCallbacks = {}
    let apiData = null

    function JSBridgeLogException(e, m) {
        if (typeof console !== 'undefined') {
            console.log('JSBridge:JS: EXCEPTION: ', arguments)
        }
    }

    function getReturnObject(apiName, status, dataJson) {
        let outJson = { status }
        if (apiName) {
            outJson.apiName = apiName
        }

        if (dataJson) {
            outJson.data = dataJson
        }

        return outJson
    }

    function init(bridgeHandler) {
        if (JSBridge.bridgeHandler) {
            JSBridgeLogException(e, 'init')
        }

        JSBridge.bridgeHandler = bridgeHandler
    }

    function registerEvent(eventName, handler) {
        messageHandlers[eventName] = handler
    }

    function deRegisterEvent(eventName, handler) {
        if (messageHandlers[eventName]) {
            delete messageHandlers[eventName]
        }
    }

    function postMessage(msg) {
        let appJS = (window.appJS) ? window.appJS : window.webkit.messageHandlers.appJS
        if (isIOSDevice) {
            appJS.postMessage(msg)
        } else if (isAndroidDevice) {
            appJS.requestNative(msg.module, msg.method, JSON.stringify(msg.params), msg.callback)
        }
    }

    function callNative(object) {
        try {
            if (object.callback) {
                let cbID = 'cbID' + (+new Date())
                responseCallbacks[cbID] = object.callback
                object.callback = cbID
            }

            if (isIOSDevice) {
                postMessage(object)
            } else {
                if (isAndroidDevice) {
                    if (object) {
                        postMessage(object)
                    } else {
                        AndroidAPI.ProcessJSAPIRequest(object.module + '.' + object.method, null)
                    }
                } else {
                    let api = eval((isAndroidDevice) ? ('AndroidAPI.ProcessJSAPIRequest') : ('WebAppAPI.ProcessJSAPIRequest'))

                    if (api) {
                        if (object) {
                            return api(object.module + '.' + object.method, object.params)
                        }
                        return api(object.module + '.' + object.method, null)
                    } else {
                        JSBridgeLogException('Unsupported API:', name)
                    }
                }
            }
        } catch (e) {
            JSBridgeLogException(e, 'Invalid API:' + name)
        }
    }

    function callAPICallback(apiCallback, outJson, status) {
        if (apiCallback) {
            apiCallback(getReturnObject(null, ((status) || ('true')), outJson))
        }
    }

    function callEventCallback(responseCallback, outJson, inJson) {
        if (responseCallback) {
            responseCallback(getReturnObject(((inJson) ? (inJson.eventName) : (null)), 'true', outJson))
        }
    }

    function _fetchJSEventQueue() {
        try {
            let messageQueueString = JSON.stringify(sendMessageQueue)
            sendMessageQueue = []
            return messageQueueString
        } catch (e) {
            JSBridgeLogException(e, '_fetchJSEventQueue')
        }

        return []
    }

    function _getAPIData() {
        return JSON.stringify(apiData)
    }

    function _invokeJSCallback(cbID, removeAfterExecute, data) {
        if (cbID) {
            let cb = responseCallbacks[cbID]
            if (cb) {
                if (removeAfterExecute) {
                    delete (responseCallbacks[cbID])
                }
                cb(data)
            }
        }
    }

    w.JSBridge = {
        init: init.bind(this),
        callNative: callNative.bind(this),
        registerEvent: registerEvent.bind(this),
        deRegisterEvent: deRegisterEvent.bind(this),
        callAPICallback: callAPICallback.bind(this),
        callEventCallback: callEventCallback.bind(this),
        _fetchJSEventQueue: _fetchJSEventQueue.bind(this),
        _getAPIData: _getAPIData.bind(this),
        _invokeJSCallback: _invokeJSCallback.bind(this)
    }
})(window, document)

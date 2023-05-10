import axios from 'axios'
import { Toast } from 'vant'
import { shutaoGateway, shuyaoOrigin } from 'libs/domain'
import { isApp } from 'libs/utils'

/**
 * [loading 逻辑处理]
 */
const reqLoadingLogical = () => {
    Toast.loading({
        duration: 0,
        forbidClick: true
    })
}
const resLoadingLogical = () => {
    Toast.clear()
}

// 服务端接口走网关，前后端域名分开，本地走devServer代理，否则无法处理登录状态
axios.defaults.baseURL = import.meta.env.DEV ? '/api' : shutaoGateway
// 跨域携带cookie
axios.defaults.withCredentials = true

// Add a request interceptor
axios.interceptors.request.use(
    (config) => {
        config = Object.assign(
            {
                showLoading: true,
                showToast: true
            },
            config
        )

       
            // 埋点请求和收银台请求走nginx转发
            config.baseURL = import.meta.env.DEV ? '/api' : ''
        
        config.withCredentials = !(config.withCredentials === false)
        config.showLoading && reqLoadingLogical()
        config.metadata = { startTime: Date.now(), eventId }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add a response interceptor
axios.interceptors.response.use(
    (response) => {
        const { config = {} } = response
        config.showLoading && resLoadingLogical()

        const { success, code, message, data = {}, result = {} } = response.data
        // success :true , 直接返回数据
        if (success || response.config.url.indexOf('/cashier') > -1) {
            return Promise.resolve(success ? data : result)
        }
        // 展示弹层: true
        config.showToast && Toast({
            message: message || result.error.message
        })
        if (code === '10002' && config.url.indexOf('/user/h5/cookie') < 0 && config.url.indexOf('/user/h5/auth/check') < 0 && config.url.indexOf('/user/h5/info') < 0) {
            let loginUrl = '/pages/user/login?backUrl=' + encodeURIComponent(location.href)
            if (isApp) {
                loginUrl = shuyaoOrigin + '/pages/shutao?backUrl=' + encodeURIComponent(location.pathname + location.search)
            }
            setTimeout(() => {
                location.href = loginUrl
            }, 1000)
        }
        return Promise.reject(response.data)
    },
    (error) => {
        error.config.showLoading && resLoadingLogical()
        if (error.response.status !== 200) {
            Toast('系统繁忙，请稍后再试')
        }
        return Promise.reject(error)
    }
)

export const get = (url, data = {}, config = {}) => {
    return axios.get(url, { params: data, ...config })
}

export const post = (url, data = {}, config = {}) => {
    return axios.post(url, data, config)
}


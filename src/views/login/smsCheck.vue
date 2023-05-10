<template>
<div class="checkPage">
    <h2 class="checkTT">输入验证码</h2>
    <p class="sendWord">短信验证码已发送至 {{phoneNo.replace(/^(.{3})(?:\d+)(.{4})$/, "$1****$2")}} </p>
    <div class="part_input">
        <input type="tel" maxlength="6" class="input_hidden" ref="realInput" v-model.trim="smsCode">
        <ul class="input_fake" @click="focusOnInput">
            <li v-for="n in 6" :key="n" :class="smsCodeArr[n-1] ? 'on' : ''">
                {{ smsCodeArr[n-1] }}
            </li>
        </ul>
    </div>
    <div class="errorTip" v-if="errorTip">{{errorTip}}</div>
    <div :class="!isCounting ? 'resend' : 'currentCount'" @click="onResend">{{countDownTxt}}</div>
    <imgcodeDialog :imgCodeShow="imgCodeShow" :phoneNo="route.query.phoneNo" :source="source" @getInfo="getInfo" @handCountDown="countDown"></imgcodeDialog>
</div>
</template>
<script setup>
import { ref } from 'vue'
import { goLogin, sendCodeMsg } from 'api/login'
import imgcodeDialog from './components/imgcode.vue'
import { Toast } from 'vant'
const router = useRouter()
const route = useRoute()
const phoneNo = ref(route.query.phoneNo)
const smsCode = ref('')
const errorTip = ref('')
const imgCodeShow = ref(false)
const source = ref('smsCheck')
const smsCodeArr = computed(() => {
    return smsCode.value.split('')
})

watch(smsCode, curVal => {
    console.log(curVal.length)
    if (curVal.length === 6) {
        console.log('验证码输入6位了，该去校验了')
        onLogin()
    }
})

const getInfo = (data) => {
    imgCodeShow.value = data.imgCodeShow
    applyToken.value = data.applyToken
}
const applyToken = ref(route.query.applyToken)
// 登录事件
const onLogin = () => {
    goLogin({
        smsCode: smsCode.value,
        smsKey: applyToken.value,
        telephone: route.query.phoneNo
    }).then(res => {
        errorTip.value = ' '
        // registerFlag为true为注册用户，需要跳转到auth页面不能跳backurl
        // 如果是订单页面，不判断registerFlag
        if (route.query.backUrl && (route.query.backUrl.indexOf('/pages/order/list') > -1)) {
            goBackUrl()
        } else {
            if (res.registerFlag) {
                router.push({
                    path: '/pages/user/auth',
                    query: {
                        backUrl: route.query.backUrl
                    }
                })
                return false
            }
            goBackUrl()
        }
    }).catch(err => {
        console.log(err)
        smsCode.value = ''
        errorTip.value = '验证码错误，请重新输入'
    })
}
// 登录成功回调函数
const backUrl = route.query.backUrl
const goBackUrl = () => {
    if (backUrl) {
        window.location.href = decodeURIComponent(backUrl)
    }
}

// 60s倒计时
const isCounting = ref(false)
const countDownTxt = ref('重新发送')
let times = ref(60)
const timer = ref(null)
const countDown = () => {
    clearInterval(timer.value)
    timer.value = setInterval(() => {
        isCounting.value = true
        times.value -= 1
        countDownTxt.value = '重新发送 (' + times.value + 's)'
        if (times.value <= 0) {
            clearInterval(timer.value)
            isCounting.value = false
            countDownTxt.value = '重新发送'
            times.value = 60
            return false
        }
    }, 1000)
}
countDown()

// 重新发送验证码
const onResend = () => {
    console.log(isCounting.value, times.value)
    if (!isCounting.value) {
        sendCodeMsg({
            imgCode: '',
            needPic: 'n',
            smstype: 'normal',
            telphone: route.query.phoneNo
        }).then(res => {
            countDown()
            applyToken.value = res
        }).catch(err => {
            if (err.code === '1003' || err.code === '1005' || err.message === '请输入图形验证码') {
                imgCodeShow.value = true
            }
        })
    }
}

</script>
<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
}
.errorTip {
    margin-top: 20px;
    text-align: center;
    font-size: 15px;
    font-weight: 400;
    color: #FF3E00;
}
.resend {
    margin-top: 32px;
    text-align: center;
    font-size: 12px;
    font-weight: 400;
    color: #4286FF;
}
.currentCount {
    margin-top: 32px;
    text-align: center;
    font-size: 12px;
    font-weight: 400;
    color: #ccc;
}
.checkPage {
    background: linear-gradient(360deg, #F8F8F8 0%, #FFEAE8 100%);
}
.checkTT {
    padding: 32px 0 16px 0;
    text-align: center;
    font-size: 22px;
    color: #1A1A1A;
    line-height: 31px;
    font-weight: 500;
}
.sendWord {
    text-align: center;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333;
    line-height: 22px;
}
.part_input {
    padding: 43px 32px 0 32px;
    position: relative;
}

.input_hidden {
    width: 310px;
    position: absolute;
    left: 32px;
    top: 43px;
    height: 48px;
    line-height: 48px;
    opacity: 0;
    z-index: 100;
    font-size: 32px;
    background: transparent;
    border: 0;
    border-radius: 0;
    letter-spacing: 41px;
}

.input_fake {
    z-index: 109;
    display: flex;
    justify-content: space-between;
    li {
        width: 35px;
        height: 48px;
        line-height: 48px;
        border-bottom: 1px solid #ccc;
        text-align: center;
        font-size: 32px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
    }
    li.on {
        border-bottom: 1px solid #666;
    }
}
</style>

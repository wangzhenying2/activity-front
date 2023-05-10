<template>
   <div class="login-part1">
        <img class="loginicon" src="/src/assets/imgs/loginicon.png" alt=""><span class="welcome">欢迎来到淘逛逛</span>
   </div>
   <div class="telbox">
        <input type="tel" maxlength="11" v-model="telephone" placeholder="请输入手机号"/>
        <p class="button-box">
            <van-button type="danger" :disabled="isCan" class="fz16" block @click="onNext">下一步</van-button>
        </p>
        <div class="protocal-container">
            <div class="checkbox-wrap"><van-checkbox v-model="protocalChecked" class="col_999">我已阅读并同意 </van-checkbox></div>
            <a @click="showProtocal('tgg_zhucexy')">&nbsp;用户协议&nbsp;</a>及<a @click="showProtocal('tgg_yinsixy')">&nbsp;隐私协议</a>
        </div>
   </div>
   <imgcodeDialog :imgCodeShow="imgCodeShow" :phoneNo="telephone"></imgcodeDialog>
    <p class="tips">登录成功默认注册</p>
</template>
<script setup>
import { Toast } from 'vant'
import { sendCodeMsg } from 'api/login'
import { shutaoGateway } from 'src/libs/domain'
import imgcodeDialog from './components/imgcode.vue'
import { contractPath } from 'libs/domain'
import { includeCss } from 'src/libs/utils.js'
const router = useRouter()
const imgCodeShow = ref(false)
const telephone = ref('')
const isCan = computed(() => {
    let reg = /^1[3456789]\d{9}$/
    if (reg.test(telephone.value)) {
        return false
    }
    return true
})
const protocalChecked = ref(false)
const showProtocal = code => {
    window.location.href = `${contractPath}/${code}`
}

// 短信验证码发送成功接收token值
const route = useRoute()
const applyToken = ref('')

const onNext = () => {
    if (!protocalChecked.value) {
        Toast('请阅读并勾选协议')
        return false
    }
    sendCodeMsg({
        imgCode: '',
        needPic: 'n',
        smstype: 'normal',
        telphone: telephone.value
    }).then(res => {
        applyToken.value = res
        router.push({
            path: '/pages/user/smsCheck',
            query: {
                phoneNo: telephone.value,
                applyToken: applyToken.value,
                backUrl: route.query.backUrl
            }
        })
    }).catch(err => {
        if (err.code === '1003' || err.code === '1005' || err.message === '请输入图形验证码') {
            imgCodeShow.value = true
        }
    })
}

// 加载反欺诈css文件
let pathname = document.location.pathname
if (pathname.indexOf('/login') !== -1) {
    includeCss(shutaoGateway + '/user/h5/login/themes/view.css')
}
</script>
<style lang="scss" scoped>
.tips {
    width: 100%;
    font-size: 12px;
    text-align: center;
    color: #999;
    position: absolute;
    bottom: 32px;
}
.telbox {
    padding: 16px 24px 0px 24px;
    input {
        width: 327px;
        padding: 21px 0;
        border: 0 none;
        border-bottom: .5px solid #ccc;
        background: transparent;
        font-size: 16px;
        border-radius: 0;
    }
    .button-box {
        padding: 40px 0 0 0;
        margin: 0;
        .fz16 {
            font-size: 16px;
            width: 327px;
            height: 48px;
            line-height: 48px;
        }
    }
    .protocal-container {
        font-size: 12px;
        color: #999;
        padding: 20px 0 0 0;
        :deep(.van-checkbox__label) {
            color: #999;
        }
        .checkbox-wrap {
            display: inline-block;
        }
        a{
            line-height: 20px;
            color: #333;
        }
        :deep(.van-checkbox){
            align-items: flex-start;
        }
        :deep(.van-icon){
            font-size: 12px;
            margin-top: 2px;
        }
    }
}
.login-part1 {
    background: linear-gradient(360deg, #F8F8F8 0%, #FFEAE8 100%);
    padding: 32px 24px 49px 24px;
    .welcome {
        height: 31px;
        font-size: 22px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #1A1A1A;
        line-height: 31px;
        vertical-align: middle;
    }
    .loginicon {
        width: 24px;
        height: auto;
        margin: 0px 8px 0 1px;
        vertical-align: middle;
    }
}
</style>

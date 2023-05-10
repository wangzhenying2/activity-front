<template>
    <van-dialog :show="isShow" title="请输入图形验证码" :showConfirmButton="false" @close="closeImgCode">
        <div class="img_container">
            <span class="size_special"><input class="imgcode-input" maxLength="4" v-model.trim="imgCode" type="text" placeholder="请输入验证码"></span>
            <img :src="imgCodeSrc" alt="" @click="creatImgCode">
        </div>
        <p class="imgcodeErr">{{imgcodeError}}</p>
        <p class="h10">&nbsp;</p>
        <p class="submitBtn" @click="imgcodeConfirm">确定</p>
    </van-dialog>
</template>
<script setup>
import { Toast } from 'vant'
import { sendCodeMsg } from 'api/login'
import { shutaoGateway } from 'src/libs/domain'

const prop = defineProps({
    imgCodeShow: {
        type: Boolean,
        default: false
    },
    phoneNo: {
        type: String,
        default: ''
    },
    source: {
        type: String,
        default: ''
    }
})

const isShow = computed(() => prop.imgCodeShow)

watch(isShow, curVal => {
    if (curVal) {
        creatImgCode()
    }
})

// 弹框关闭清空错误提示语
const closeImgCode = () => {
    imgcodeError.value = ''
}
// 生成图形验证码
const imgCode = ref('')
const imgCodeSrc = ref('')
const creatImgCode = () => {
    imgCodeSrc.value = shutaoGateway + '/user/h5/vcode?time=' + +new Date()
    imgCode.value = ''
}

// 图形验证码弹框确定事件
const router = useRouter()
const route = useRoute()
const applyToken = ref('')
const emit = defineEmits(['getInfo', 'handCountDown'])
const imgcodeError = ref('')

const imgcodeConfirm = () => {
    if (imgCode.value.length !== 4) {
        imgcodeError.value = '请输入4位有效验证码'
        return false
    } else {
        imgcodeError.value = ''
        sendCodeMsg({
            imgCode: imgCode.value,
            needPic: 'y',
            smstype: 'normal',
            telphone: prop.phoneNo
        }).then(res => {
            emit('handCountDown')
            console.log('发送验证码返回的applytoken', res)
            applyToken.value = res
            // 判断来源是smsCheck页面时，需要关闭图形验证码弹框，且不需要跳转
            if (prop.source === 'smsCheck') {
                // 关掉弹框 且把返回的applyToken传给父级
                emit('getInfo', { imgCodeShow: false, applyToken: applyToken.value })
            } else {
                router.push({
                    path: '/pages/user/smsCheck',
                    query: {
                        phoneNo: prop.phoneNo,
                        applyToken: applyToken.value,
                        backUrl: route.query.backUrl
                    }
                })
            }
        }).catch(err => {})
    }
}
</script>
<style lang="scss" scoped>
/* 图形验证码 */
.img_container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 40px 5px 40px;
    .size_special {
        display: inline-block;
        width: 140px;
        height: 35px;
        background: #F7F7F7;
        text-indent: 15px;
        // padding-top: 0px;
        .imgcode-input {
            border: 0;
            height: 35px;
            line-height: 35px;
            font-size: 14px;
            background: transparent;
            color: #333;
        }
    }
    img {
        display: inline-block;
        width: 85px;
        height: 35px;
    }
}
.submitBtn {
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #f99e00;
    font-size: 16px;
    margin: 0;
    padding: 0;
}
.h10 {
    height: 10px;
    margin: 0;
    padding: 0;
    border-bottom: 1px solid #e6e6e6;
}
.imgcodeErr {
    color: red;
    font-size: 12px;
    margin: 0;
    padding: 0 0 0 50px;
}
</style>

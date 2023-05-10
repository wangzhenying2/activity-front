<template>
    <div class="header-fixed">
        <div class="header-bar flex center">
            <div class="back" @click="historyBack"><van-icon name="arrow-left" /></div>
            <div class="flex-1"><img src="/src/assets/imgs/header.png" alt=""></div>
        </div>
        <div class="header-title">
            {{route.meta.title || store.state.title}}
        </div>
    </div>
</template>
<script setup>
import { isApp } from 'libs/utils'
const route = useRoute()
const store = useStore()
const historyBack = () => {
    // 针对外部绑卡返回的页面，需要关闭webview，不然后退到第三方，点击“返回机构”又会回到当前页面，造成死循环
    if (window.document.referrer.indexOf('bankLoading') > -1) {
        window.axdApp.close()
        return
    }
    if (typeof store.state.backFunc === 'function') {
        store.state.backFunc()
        return
    }
    window.axdApp.send({
        module: 'webview',
        method: 'goBack'
    })
}

</script>
<style lang="scss" scoped>
.header-fixed {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999;
}
.header-bar {
    height: 44px;
    text-align: center;
    background: #fff;
    .back {
        font-size: 22px;
        width: 44px;
        height: 44px;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .flex-1 {
        padding-right: 44px;
    }
    img {
        height: 18px;
    }
}
.header-title {
    height: 34px;
    line-height: 34px;
    text-align: center;
    font-size: 16px;
    background: #fff;
}
</style>

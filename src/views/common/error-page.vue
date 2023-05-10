<template>
    <div class="error-page">
        <img src="./imgs/error.png" alt="">
        <div class="title">{{errorMsg || '抱歉，服务器出现故障'}}</div>
        <van-button class="mt20" type="danger" @click="reload">重新加载</van-button>
    </div>
</template>
<script setup>
defineProps({
    errorMsg: String
})
const reload = () => location.reload()
</script>
<style lang="scss" scoped>
.error-page {
    text-align: center;
    img {
        margin: 100px auto 0;
        width: 160px;
    }
    .title {
        color: #999999;
        font-size: 16px;
        padding: 10px 0 0;
    }
}
</style>

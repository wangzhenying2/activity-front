<template>
    <div class="error-page">
        <img src="./imgs/error.png" alt="">
        <div class="title">抱歉，找不到当前页面</div>
        <van-button class="mt20 fix-width"  type="danger" @click="goBack">返回</van-button>
    </div>
</template>
<script setup>
const goBack = () => history.back()
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

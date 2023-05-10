<template>
    <div class="empty-page">
        <img src="./imgs/empty.png" alt="">
        <div class="title">
            <pre>{{mesasge || `您的分期支付计划正在创建中\n请等待…`}}</pre>
        </div>
    </div>
</template>
<script setup>
defineProps({
    mesasge: String
})
const reload = () => location.reload()
</script>
<style lang="scss" scoped>
.empty-page {
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

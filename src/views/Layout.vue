<template>
    <div class="page-wrapper" :class="{'with-header': showHeader}">
        <zjl-header v-if="showHeader"></zjl-header>
        <div class="page-content">
            <router-view v-if="loaded"></router-view>
        </div>
    </div>
    <footnote v-show="(route.path !== '/pages/homePage') && (route.path !== '/pages/product/contract')"></footnote>
</template>

<script setup>
import { Toast } from 'vant'
import { setAuthCookie, setUserCookie } from 'api/auth'
import { isApp } from 'libs/utils'

const route = useRoute()
const loaded = ref(false)
const showHeader = computed(() => isApp && route.path !== '/pages/homePage' && route.path !== '/pages/serviceEntry' && route.path !== '/pages/product/contract')



</script>
<style scoped lang="scss">
    .page-wrapper {
        min-height: calc(100vh - 40px);
        &.with-header {
            :deep(.tabbar-wrapper)  {
                top: 88px!important;
            }
            .page-content {
                padding-top: 88px;
            }
        }
    }
</style>

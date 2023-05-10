import { createApp } from 'vue'
import { router } from './router/index'
import store from './store/index'
import App from './App.vue'
import vantLibs from 'libs/vant'
import vanAmount from './components/amount.vue'
import zjlHeader from './components/header.vue'
import footnote from './components/footnote.vue'
import disclaimer from './components/disclaimer.vue'
import vanFieldTag from './components/field-tag.vue'
import 'vant/lib/index.css'
import './assets/style/index.scss'
const app = createApp(App)

app.use(vantLibs).use(router).use(store)
app.component('van-amount', vanAmount)
app.component('zjl-header', zjlHeader)
app.component('footnote', footnote)
app.component('disclaimer', disclaimer)
app.component('van-field-tag', vanFieldTag)
app.mount('#app')

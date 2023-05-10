import { createStore } from 'vuex'

const store = createStore({
    state () {
        return {
            title: '',
            backFunc: null,
            count: 3
        }
    },
    mutations: {
        setTitle(state, value) {
            state.title = value
        },
        setBackFunc(state, value) {
            state.backFunc = value
        },
        increment (state) {
            state.count++
        }
    }
})

export default store

import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import legacy from '@vitejs/plugin-legacy'

function resolve(dir) {
    return path.join(__dirname, dir)
}
export default defineConfig({
    plugins: [
        vue(),
        legacy(),
        AutoImport({
            imports: [
                'vue',
                'vuex',
                'vue-router'
            ],
            eslintrc: {
                enabled: false, // 工程启动时生成配置文件，默认false, true启用。生成一次就可以，
                filepath: './.eslintrc-auto-import.json',
                globalsPropValue: true
            }
        })
    ],

    resolve: {
        extensions: ['.vue', '.js', '.json'],
        alias: {
            src: resolve('src'),
            api: resolve('src/api'),
            components: resolve('src/components'),
            libs: resolve('src/libs')
        }
    },
    server: {
        host: '0.0.0.0',
        port: 8090,
        strictPort: true,
        // https: true,
        proxy: {
            '/api': {
                logLevel: 'debug',
                target: 'http://localhost:8080', // 
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '')
            }
        }
    },
    build: {
        outDir: '../static-build/activity-static-h5',
        assetsDir: 'assets',
        cssCodeSplit: true, // 启用之后拆分异步chunk的css，视情况开启
        emptyOutDir: true, // root清空打包目录, 非root提醒
        brotliSize: false, // 压缩报告，开启消耗性能
        target: ['ios11', 'es2015'], // 兼容IOS11(iphone6)
        rollupOptions: {
            output: {
                manualChunks: {
                    vendors: ['vue', 'axios', 'vue-router', 'vuex']
                },
                chunkFileNames: ChunkInfo => {
                    let name = ChunkInfo.name
                    if (ChunkInfo.isDynamicEntry) {
                        // 如果是异步加载的入口文件，根据文件路径来命名
                        const arr = Object.keys(ChunkInfo.modules)
                        const path = arr[arr.length - 1]
                        const pathArr = path.split('/')
                        if (pathArr[pathArr.length - 1].includes('.vue')) {
                            name = path
                                .split('/views/')[1]
                                .replace(/\.vue$/, '')
                                .replace(/\/index$/, '')
                                .replace(/\//g, '_')
                        }
                    }
                    return 'assets/' + name + '.[hash].js'
                }
            },
            plugins: []
        }
    }
})

export const shuyaoOrigin =
    import.meta.env.DEV || location.host.includes('dev')
        ? 'https://m-dev.shuyaotest.com'
        : location.host.includes('test')
            ? (location.host.includes('shutao1') ? 'https://m-syao1.shuyaotest.com' : 'https://m-syao3.shuyaotest.com')
            : 'https://m.zhaojiling.com'

const getDomain = prefix => {
    if (import.meta.env.DEV) {
        return `https://${prefix}-shutao1.shuyaotest.com`
    }
    return window.location.protocol + '//' + window.location.host.replace(/^(mall)/, prefix)
}

export const cashierOrigin = getDomain('cashier')
export const shutaoGateway = getDomain('api-gateway')
export const contractPath = getDomain('opengateway-contract') + '/mng/template/view'

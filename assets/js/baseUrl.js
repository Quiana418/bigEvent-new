//每次发起各类请求之前 都会先调用这个函数
//在这个函数里 可以拿到我们给Ajax提供的配置对象
//这个函数是基于jQuery的
//请求拦截器
$.ajaxPrefilter((options) => {
    options.url = `http://www.liulongbin.top:3007` + options.url
})
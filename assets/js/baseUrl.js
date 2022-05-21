//每次发起各类请求之前 都会先调用这个函数
//在这个函数里 可以拿到我们给Ajax提供的配置对象
//这个函数是基于jQuery的
//请求拦截器
$.ajaxPrefilter((options) => {
    //请求拦截 发起请求之前 拼接好地址
    options.url = `http://www.liulongbin.top:3007` + options.url
    //在请求之前给有权限的接口注入token
    if (options.url.includes('/my/')) {
        options.headers = {
            Authorization: localStorage.getItem('token')
        }
    }
    options.complete = (res) => {
        // console.log(res);
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //清空token
            localStorage.removeItem('token')
            //跳转到登录页面
            location.href = '/login.html'
        }
    }
})
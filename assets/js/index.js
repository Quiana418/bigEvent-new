$(function () {
    //放在入口函数里的函数不能挂载到全局
    getUserInfo()
    //实现退出功能  在其他页面不会使用到 所以不用挂载到window上 直接写进入口函数
    //获取layer 弹出提示信息
    const layer = layui.layer
    $('#btnLogout').click(function () {
        //弹出信息
        layer.confirm('确认是否退出', {
            icon: 3,
            title: ''
        }, function (index) {
            // console.log(1);
            //清除token
            localStorage.removeItem('token')
            //跳转到登录页面
            location.href = '/login.html'
        })


    })
})
//提示组件
const layer = layui.layer
//发起请求 获取用户信息
//以下函数在其他页面也要调用 所以要挂载到全局 不能用let 和const
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: '/my/userinfo',
        //写入baseURL里面了
        // headers: {
        //     //取到本地存储里的token
        //     Authorization: localStorage.getItem('token')
        // },
        success: function (res) {
            console.log(res);
            if (res.status != 0) {
                return layer.msg('获取用户信息失败')
            }
            layer.msg('获取用户信息成功')
            //获取成功之后 渲染用户昵称和头像
            renderAvatar(res.data)
        },
        //无论发起什么请求都要执行这个操作 所以放进baseUrl里面
        // 不论成功还是失败，最终都会调用 complete 回调函数
        // complete: (res) => {
        //     console.log(res);
        //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //清空token
        //         localStorage.removeItem('token')
        //         //跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // },
    })
}
// console.log(window.getUserInfo);
//渲染欢迎文本和头像
function renderAvatar(user) {
    //获取名字
    const name = user.nickname || user.username
    //设置欢迎文本
    $('#welcome').html(`欢迎 ${name}`)
    //按需渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        //否则有文本头像 获取第一个字
        const first = name[0].toUpperCase()
        $('.text-avatar').html(first).show();
    }
}
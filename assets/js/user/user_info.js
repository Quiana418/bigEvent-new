$(function () {
    //基本信息表单校验 用form.verify()
    const form = layui.form
    //自定义校验规则
    form.verify({
        nickname: (val) => {
            if (val.length > 6) return "昵称必须在1-6个字符之间"
        }
    })

    //实现提交修改用户信息功能
    //先获取用户信息
    const layer = layui.layer;
    const initUserInfo = () => {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg('获取用户信息失败');
                // layer.msg('获取用户信息成功')
                form.val('formUserInfo', res.data);
            }
        })
    }
    initUserInfo();

    //点击重置按钮 实现重置功能
    $('#btnReset').click(function (e) {
        //阻止默认提交
        e.preventDefault();
        //重新渲染到页面
        initUserInfo();
    })

    //点击提交信息 更新用户信息 并重新获取数据 渲染到用户文本头像
    //监听表单的提交事件
    // $('#layui-form').on('submit', function (e) {
    //     e.preventDefault();
    //     //发起请求 获取数据 更新数据
    //     $.ajax({
    //         type: 'POST',
    //         url: "/my/userinfo",
    //         data: $(this).serialize(),
    //         success: function (res) {
    //             if (res.status !== 0) return layer.msg('更新用户信息失败')
    //             layer.msg('更新用户信息成功')
    //             //调用父页面index.html的获取用户信息并渲染函数 重新渲染到页面
    //              window.parent.getUserInfo();
    //         }
    //     })
    // })

    // 更新用户数据
    $(".layui-form").on("submit", (e) => {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(".layui-form").serialize(),
            success: (res) => {
                if (res.status !== 0) return layer.msg("更新用户信息失败！");
                layer.msg("更新用户信息成功！");
                // 调用父页面渲染函数
                window.parent.getUserInfo();
            },
        });
    });




})
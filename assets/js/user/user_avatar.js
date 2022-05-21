$(function () {
    const layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //2.点击上传 实现选择文件上传功能
    $('#btnChooseImage').click(function () {
        //手动点击上传文件的按钮 同时隐藏上传文件按钮
        $('#file').click()
    })

    //设置图片 渲染到页面 监听文件表单change事件
    // 为文件上传框绑定 change 事件
    // 为文件上传框绑定 change 事件
    $("#file").change((e) => {
        const fileList = e.target.files.length;
        if (fileList === 0) return layer.msg("请选择文件！");

        // 1. 拿到用户选择的文件
        let file = e.target.files[0];
        // 2. 将文件，转化为路径
        var imgURL = URL.createObjectURL(file);
        // 3. 重新初始化裁剪区域
        $image
            .cropper("destroy") // 销毁旧的裁剪区域
            .attr("src", imgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });

    //  为确定按钮绑定点击事件
    $("#btnUpload").click((e) => {
        e.preventDefault();
        // 1、拿到用户裁切之后的头像
        // 直接复制代码即可
        const dataURL = $image.cropper("getCroppedCanvas", {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100,
            })
            .toDataURL("image/png");
        // 2、发送 ajax 请求，发送到服务器
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL,
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("更换头像失败！");
                }
                layer.msg("更换头像成功！");
                //调用父级的方法 渲染到页面
                window.parent.getUserInfo();
            },
        });
    });

})
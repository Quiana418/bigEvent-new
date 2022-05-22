$(function () {
    //做文章类别选择功能，要获取文章类别里面的数据 发起请求 定义模板 渲染页面
    const layer = layui.layer
    const form = layui.form
    const initCase = () => {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章类别数据失败')
                layer.msg('获取文章类别数据成功')
                //成功之后 渲染到页面
                const htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //调用form.render()渲染到页面
                form.render('select')
            }
        })
    }
    initCase();
    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //点击弹出文件上传框
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    //监听文件上传框的change事件 获取用户选择上传的文件
    $('#coverFile').on('change', function (e) {
        //获取到文件的列表伪数组
        const files = e.target.files
        //判断用户是否选择了文件
        if (files.length === 0) return
        //根据文件 创建对应的url地址
        var newImgUrl = URL.createObjectURL(files[0])
        //为裁剪区重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //定义发布文章状态
    let art_state = '已发布'
    //点击存为草稿
    $('#btnSave2').click(() => {
        art_state = '草稿'
    })

    //监听整个表单的提交事件
    $('#form_pub').on('submit', function (e) {
        e.preventDefault()
        // console.log(art_state);
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0]);
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)

        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })

        //发送新增文章请求
        function publishArticle(fd) {
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                // 注意：如果向服务器提交的是 FormData 格式的数据，
                // 必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('发布文章失败！')
                    }
                    layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                    location.href = '/article/art_list.html'
                    //跳转到文章列表页面
                    window.parent.change()
                }
            })
        }

    })

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
        
    })



})
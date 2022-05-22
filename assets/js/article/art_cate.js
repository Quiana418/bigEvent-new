$(function () {
    const layer = layui.layer
    const form = layui.form
    // 获取 表格数据
    const initArtCateList = () => {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: (res) => {
                if (res.status !== 0) return layer.msg('获取失败')
                layer.msg('获取成功')
                // 调用 template
                const htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
            },
        });
    };

    initArtCateList();



    let indexAdd = null;
    $("#btnAddCate").click(() => {
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "添加文章分类",
            content: $("#dialog-add").html(),
        });
    });
    // 通过代理监听 submit 事件
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) return layer.msg("新增分类失败！");
                initArtCateList();
                layer.msg("新增分类成功！");
                layer.close(indexAdd);
            },
        });
    });

    //编辑操作
    // 通过代理方式，为 btn-edit 按钮绑定点击事件
    let indexEdit = null;
    $("tbody").on("click", ".btn-edit", function () {
        // 弹出修改文章分类的弹窗
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "修改文章分类",
            content: $("#dialog-edit").html(),
        });

        const id = $(this).attr("data-id");
        console.log(id);
        // 发起请求获取对应分类的数据
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章分类数据失败')
                layer.msg('获取文章分类数据成功')
                form.val("form-edit", res.data);

            },
        });

    });

    //更新文章分类 发起请求 渲染页面 关闭弹窗 委托代理
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('更新文章分类失败')
                layer.msg('更新文章分类成功')
                layer.close(indexEdit)
                initArtCateList();
            }
        })
    })

    //点击删除按钮 删除文章 获取id 发起请求 委托代理
    $("tbody").on("click", ".btn-delete", function () {
        //获取id
        const id = $(this).attr("data-id");
        // 提示用户是否删除
        layer.confirm("确定删除吗？", {
            icon: 3,
            title: "提示"
        }, function (index) {
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除分类失败！");
                    }
                    layer.msg("删除分类成功！");
                    layer.close(index);
                    initArtCateList();
                },
            });
        });
    });






})
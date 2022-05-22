$(function () {
    const form = layui.form
    const layer = layui.layer
    const laypage = layui.laypage
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    const q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的发布状态
    };

    // 获取文章列表数据
    const initTable = () => {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！");
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);

                //获取文章总条数
                renderPage(res.total)
            },
        });
    };

    initTable();



    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    initCate()

    // 初始化文章分类的方法 渲染文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render('select')
            }
        })
    }

    //实现筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        console.log(total)
    }

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            //选择每页显示的条数
            limits: [2, 3, 5, 10],
            jump: (obj, first) => {
                // console.log(obj.curr);
                // console.log(obj.limit);
                //将最新的页码值 复制到q的查询参数中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit

                //触发时机
                //laypage.render调用时就会触发，第一次调用不能调用initTable() 因为页面一打开已经有数据了 否则会循环调用
                //切换页码时也会触发 切换页码时 必须调用initTable()重新渲染数据
                //console.log(first)  返回true 或者false
                if (!first) {
                    initTable()
                }
            }

        })
    }

    //删除文章 发起请求 委托代理 渲染数据
    $('tbody').on('click', '.btn-delete', function (e) {
        //获取id
        const id = $(this).attr("data-id")
        //根据删除按钮的数量 确定剩余文章条数
        const len = $('.btn-delete').length
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    //判断 如果当前页面数据只剩最后一条 那么将页面数量减1 删除之后跳转到上一个页面
                    //如果已经删除到了第一页 那么就让页面处于第一页
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable()
                }
            })

            layer.close(index)
        })

    })
})
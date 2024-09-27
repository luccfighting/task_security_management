require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc/simplexml/ready!'], function (
        _,
        $,
        mvc,
        TableView,
        SearchManager) {
    var tokensDefault = mvc.Components.get("default");

    // 内嵌的iframe设置边距
    $('#inneriframe').find('div[class="panel-body html"]').css('padding', '0')
    $(document).on('click', '.btn-topsek-addnewuser', function () {
        $('.btn-changeuser').hide();
        $('.btn-addnewuser').show();
        $('.popOutBg').show();
        $('.popOut').show();
        $(".help-alert-all").hide();
        // var eachclassname=$('li[class="active"]').children('a').attr('data-value')
        var eachclassname = 'task-topsek-value'
        $('.' + eachclassname).each(function () {
            // console.log($(this).prop("tagName"));
            const dtype = $(this).prop("tagName")
            if (dtype == "SPAN") {
                //   console.log($(this).attr('value-default'));
                $(this).html($(this).attr('value-default'));
            } else {
                if ($(this).attr('is_default') != "true") {
                    $(this).val("")
                }
            }
        });
    });

    $(document).on('click', '.btn-topsek-changeuser', function () {
        $('.btn-addnewuser').hide();
        $('.btn-changeuser').show();
        $(".help-alert-all").hide();
        $('.popOutBg').show();
        $('.popOut').show();
        console.log($(this).attr('r'))
        $('.btn-changeuser').attr('user_id', $(this).attr('r').split("#tpsplit#")[0].split('\'')[1])
        var changevalue = $(this).attr('r').split("#tpsplit#")[1].split("|")
        let changecount = 0

        // var eachclassname=$('li[class="active"]').children('a').attr('data-value')
        var eachclassname = 'task-topsek-value'
        $('.' + eachclassname).each(function () {
            // console.log($(this).prop("tagName"));
            const dtype = $(this).prop("tagName")
            if (dtype == "SPAN") {
                //   console.log($(this).attr('value-default'));
                $(this).html(changevalue[changecount]);
            } else {
                if ($(this).attr('is_default') != "true") {
                    $(this).val(changevalue[changecount])
                }
            }
            console.log(changevalue[changecount])
            changecount += 1
        });
    });

    //弹出框隐藏
    $(document).on('click', '.btn-cancel', function () {
        $('.addnew').remove();
        $('.popOutBg').hide();
        $('.popOut').hide();
    });

    $(document).on('click', '.close', function () {
        $('.popOutBg').hide();
        $('.popOut').hide();
    });

    $(document).on('click', '.popOutBg', function () {
        $('.popOutBg').hide();
        $('.popOut').hide();
    });

    //下拉选择    
    var up_data = { 'cron': '' };
    $(document).on('click', '.synthetic-select', function () {
        var text = $.trim($(this).text());
        $(this).parent('li').parent('ul').parent('div').prev('a').children('.link-label').html(text);
        tokensDefault.set('form.' + $(this).parent('li').parent('ul').parent('div').prev('a').children('.link-label').attr('value-key-en'), text)
        $('.icon-check').css("display", "none");
        $(this).children('i').css("display", "inline");
        up_data['cron'] = text;
    });

    //控制弹出框下拉内容
    $(document).on('click', '.control-topsek', function () {
        if ($(this).children('.dropdown-toggle').attr('disabled') == "disabled") {
            cosole.log("请认领后再编辑")
        } else {
            $('.dropdown-menu').hide();
            var menuid = '#' + $(this).attr('menu-name');
            var menuselect = menuid.split("-");
            var menuvalue = $(this).children('a').children('.btn-topsek-value').html();
            if ($(menuid).hasClass('open')) {
                $(menuid).removeClass('open');
                $(menuid).hide();
            } else {
                $(menuid).addClass('open');
                $(menuid).show();
                $(menuid).focus();
                var menu = tokensDefault.get(menuselect[1]);
                //console.log(menu);
                var menulist = menu.split("|");
                let str = "";
                for (var i = 0; i < menulist.length; i++) {
                    //console.log(menuvalue);
                    //console.log(menulist[i]);
                    let menuicon = "none"
                    if (menulist[i] == menuvalue) {
                        menuicon = "block";
                    } else {
                        menuicon = "none";
                    }
                    str += `<li><a class="synthetic-select " href="#" data-item-idx="0" data-item-value="hourly"><i class="icon-check" style="display:${menuicon}"/><span class="link-label">`;
                    str += menulist[i];
                    str += '</span></a></li>';
                }
                //console.log("str:",str);
                $(menuid).children('ul').html(str);

            }
        }
    });


    //增加任务系统用户
    $(document).on('click', '.btn-addnewuser', function () {

        let splstr = '| makeresults  |eval '
        var eachclassname = 'task-topsek-value'
        var d = {};
        var json_str = {};
        let is_save = "True"

        $('.help-alert-all').hide();
        $('.' + eachclassname).each(function () {
            const dtype = $(this).prop("tagName")
            if (dtype == "SPAN") {
                if ($(this).attr('value-default') == $.trim($(this).html()) || $.trim($(this).html()) == "") {
                    console.log("未填项：", $.trim($(this).attr('value-key')));
                    $('.help-alert-' + $.trim($(this).attr('value-key-en'))).show();
                    is_save = "False"
                } else {
                    json_str[$(this).attr('value-key-en')] = $.trim($(this).html());
                }
            } else {
                if (($.trim($(this).val()) == "" || $.trim($(this).val()) == null) && $(this).attr('is_necessary') == "true") {
                    console.log("未填项：", $.trim($(this).attr('value-key')));
                    $('.help-alert-' + $.trim($(this).attr('value-key-en'))).show();
                    is_save = "False"
                } else {
                    json_str[$(this).attr('value-key-en')] = $.trim($(this).val());
                }
            }
        });
        var userchecksql = '| tmsdbquery "select" "select * from task_user where account=\'' + json_str["account"] + '\' " "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"|append [|makeresults|eval a=0]'
        if (is_save == "True") {
            const usercheck_search = new SearchManager({
                preview: false
            });
             console.log(userchecksql)

            usercheck_search.set({ earliest_time: "0", latest_time: "now", search: userchecksql }, { tokens: true });
            var myresults = usercheck_search.data("results")
            myresults.on('data', function () {
                console.log("Has data? ", myresults.hasData());
                console.log("Data (rows): ", myresults.data().rows.length);
                if (myresults.data().rows.length <= 1) {
                    for (var key in json_str) {
                        // console.log(key);
                        // console.log(json_str[key]);
                        splstr += key + "=\"" + json_str[key] + "\"|eval "
                    }
                    splstr += ' update_time=strftime(now(),"%F %T")| table account name zone task_role update_time email mobile| tmsdbquery "insert" "INSERT INTO task_user(account,name,zone,task_role,update_time,email,mobile) VALUES " "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"'
                    // alert(splstr)
                    console.log(splstr)
                    this._searchManager = new SearchManager({
                        preview: false
                    });
                    this._searchManager.set({ earliest_time: "0", latest_time: "now", search: splstr }, { tokens: true });

                    // console.log( this._searchManager.data("results"))
                    // abc=this._searchManager.data("results")
                    // console.log(abc[0])
                    this._searchManager.data("results").on("data", function () {
                        alert("执行成功");
                        var a = tokensDefault.get('changecount');
                        a = parseInt(a) + 1;
                        tokensDefault.set('form.changecount', parseInt(a));
                        $('.popOutBg').hide();
                        $('.popOut').hide();
                    });

                } else {
                    // var is_exists="Exists"
                    alert("账号已存在");
                }
            })
        } else {
            alert("您有未填项");
        }


    });


    //修改任务系统用户
    $(document).on('click', '.btn-changeuser', function () {

        var userid = $(this).attr('user_id')
        var eachclassname = 'task-topsek-value'
        var json_str = {};
        var is_save = "True"
        $('.help-alert-all').hide();
        $('.' + eachclassname).each(function () {
            const dtype = $(this).prop("tagName")
            if (dtype == "SPAN") {
                if ($(this).attr('value-default') == $.trim($(this).html()) || $.trim($(this).html()) == "") {
                    console.log("未填项：", $.trim($(this).attr('value-key')));
                    $('.help-alert-' + $.trim($(this).attr('value-key-en'))).show();
                    is_save = "False"
                } else {
                    json_str[$(this).attr('value-key-en')] = $.trim($(this).html());
                }
            } else {
                if (($.trim($(this).val()) == "" || $.trim($(this).val()) == null) && $(this).attr('is_necessary') == "true") {
                    console.log("未填项：", $.trim($(this).attr('value-key')));
                    $('.help-alert-' + $.trim($(this).attr('value-key-en'))).show();
                    is_save = "False"
                } else {
                    json_str[$(this).attr('value-key-en')] = $.trim($(this).val());
                }
            }
        });
        if (is_save == "True") {
            var splstr = '| makeresults  |eval update_time=strftime(now(),"%F %T")|eval sql=\"'
            for (var key in json_str) {
                console.log(key);
                console.log(json_str[key]);
                splstr += key + "=\'" + json_str[key] + "\',"
            }
            splstr += 'update_time=\'"+update_time+"\' WHERE id=\'' + userid + '\'"| table sql| tmsdbquery "update" "UPDATE task_user SET " "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"'
            // alert(splstr)
            console.log(splstr)
            this._searchManager = new SearchManager({
                preview: false
            });
            this._searchManager.set({ earliest_time: "0", latest_time: "now", search: splstr }, { tokens: true });
            this._searchManager.data("results").on("data", function () {
                $('.addnew').remove();
                alert("执行成功");
                var a = tokensDefault.get('changecount');
                a = parseInt(a) + 1;
                tokensDefault.set('form.changecount', parseInt(a));
                $('.popOutBg').hide();
                $('.popOut').hide();
            });
        } else {
            alert("您有未填项");
        }


    });

    var CustomIconRenderer = TableView.BaseCellRenderer.extend({
        canRender: function () {
            return true;
        },
        render: function ($td, cell) {
            // Compute the icon base on the field value
            var icon;
            var color = "#84BBFC";
            if (cell.field === '操作') {
                const r = cell.value;
                if (r == 0) {
                    $td.addClass('icon-inline numeric').html(_.template('<div style="float:left;"></div>', {
                    }));
                } else {
                    $td.addClass('icon-inline numeric').html(_.template('<div style="float:left;"><a class="btn-topsek-changeuser" style="padding-right: 10px;" r="<%-r%>" >编辑</a><a  r="<%-r%>"  class="deleteuser" >删除</a></div>', {
                    }));
                }
            } else {
                $td.addClass('icon-inline numeric').html(_.template('<div style="float:left;"><%-text%></div>', {
                    icon: icon,
                    text: cell.value
                }));
            }
        }
    });

    var tableElement = mvc.Components.getInstance("task_user_table");

    tableElement.getVisualization(function (tableView) {
        tableView.addCellRenderer(new CustomIconRenderer());
    });

    //删除某条用户信息
    $(document).on('click', '.deleteuser', function () {
        let splstr = '| makeresults '
        splstr += '| table name create_user| tmsdbquery "delete" "DELETE FROM task_user WHERE' + $(this).attr('r').split("#tpsplit#")[0] + '" "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"'
        console.log(splstr)
        this._searchManager = new SearchManager({
            preview: false
        });
        this._searchManager.set({ earliest_time: "0", latest_time: "now", search: splstr }, { tokens: true });
        this._searchManager.data("results").on("data", function () {
            alert("执行成功");
            var a = tokensDefault.get('changecount');
            a = parseInt(a) + 1;
            tokensDefault.set('form.changecount', parseInt(a));
        });
       
    });
});
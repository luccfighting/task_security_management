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

    var CustomIconRenderer = TableView.BaseCellRenderer.extend({
        canRender: function (cell) {
            return true;
        },
        render: function ($td, cell) {
            // Compute the icon base on the field value
            var icon;
            var color = "#84BBFC";
            if (cell.field === '操作') {
                var value_arr = cell.value.split("|");
                r = value_arr[0];
                r1 = value_arr[1];
                r2 = value_arr[2];
                r3 = value_arr[3];
                r4 = value_arr[4];
                r5 = value_arr[5];
                r6 = value_arr[6];
                r7 = value_arr[7];
                r8 = value_arr[8];
                r9 = value_arr[9];
                r10 = value_arr[10];
                r11 = value_arr[11];
                r12 = value_arr[12];
                r13 = value_arr[13];
                r14 = value_arr[14];
                r15 = value_arr[15];
                task_target = value_arr[16]
                soar_status = value_arr[17]
                soar_workflow = value_arr[18]
                secondtype = value_arr[19]
                html_str = '<div style="float:left;"><a class="btn-topsek " r="<%-r%>" r1="<%-r1%>" r2="<%-r2%>" r3="<%-r3%>" r4="<%-r4%>" r5="<%-r5%>" r6="<%-r6%>" r7="<%-r7%>" r8="<%-r8%>" r9="<%-r9%>" r10="<%-r10%>" r11="<%-r11%>" r12="<%-r12%>" r13="<%-r13%>" r14="<%-r14%>"  r15="<%-r15%>" task_target="<%-task_target%>" soar_status="<%-soar_status%>" soar_workflow="<%-soar_workflow%>" secondtype="<%-secondtype%>" >编辑</a> '
                if (r14 == "1") {
                    html_str += '<a  r="<%-r%>" class="btn-topsek-unactive" >禁用</a> '
                } else {
                    html_str += '<a  r="<%-r%>" class="btn-topsek-active" >启用</a> '
                }
                if (r15 == "1") {
                    html_str += '<a  r="<%-r%>" class="btn-topsek2 " >删除</a>'
                }
                html_str += '</div>'
                $td.addClass('icon-inline').html(_.template(html_str, {
                }));
            } else if (cell.field === '任务描述' || cell.field === '任务名称') {

                $td.addClass('icon-inline').html(_.template('<div style="overflow: hidden;text-overflow: ellipsis;width: 100%;height: 20px;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient:vertical;" title="<%-text%>"><%-text%></div>', {
                    icon: icon,
                    text: cell.value
                }));
            } else {
                $td.addClass('icon-inline numeric').html(_.template('<div style="float:left;"><%-text%></div>', {
                    icon: icon,
                    text: cell.value
                }));
            }
        }
    });


    var div = document.getElementById('timezhouqi');
    var up_data = { 'cron': '' };
    function ani() {
        $(".popOut").className = "popOut ani";
    };
    function alertani() {
        $(".alertOut").className = "alertOut ani";
    };


    $(document).on('click', '.control-soar-status-inp', function () {
        if ($(this).val() == 0) {
            $('#soar-workflow-div').hide();
            $('.task-topsek-value[value-key-en="soar_workflow"]').html($('.task-topsek-value[value-key-en="soar_workflow"]').attr('value-default'))
        } else {
            $('#soar-workflow-div').show();
        }
    });

    $(document).on('click', '.btn-topsek', function () {
        console.log("Console Log: Hello World");
        console.log($(this).attr('r1'));
        console.log($(this).attr('r2'));
        //$('.inp').val($(this).attr('t'));
        // row含义顺序： id+"|"+name+"|"+description+"|"+cycle+"|"+cron+"|"+level+"|"+zone+"|"+business+"|"+department+"|"+task_role+"|"+task_owner+"|"+create_user
        var task_name = $(this).attr('r1');
        var task_description = $(this).attr('r2');
        var task_cycle = $(this).attr('r3');
        var task_cron = $(this).attr('r4');
        var task_level = $(this).attr('r5');
        var task_zone = $(this).attr('r6');
        var task_business = $(this).attr('r7');
        var task_department = $(this).attr('r8');
        var task_role = $(this).attr('r9');
        var task_owner = $(this).attr('r10');
        var task_type = $(this).attr('r12');
        var task_firsttype = $(this).attr('r13');
        var task_secondtype = $(this).attr('secondtype');
        var task_target = $(this).attr('task_target');
        var soar_status = $(this).attr('soar_status');
        var soar_workflow = $(this).attr('soar_workflow');
        // var create_user = $(this).attr('r11');
        tokensDefault.set('task_name', task_name);
        tokensDefault.set('form.taskfirsttype', task_firsttype);
        //tokensDefault.set('penson_mail',row2);
        //tokensDefault.set('task_description',row3);
        tokensDefault.set('task_cycle', task_cycle);
        tokensDefault.set('form.task_id', $(this).attr('r'));
        $("#control-task-name").css('display', "block");
        $("#control-task-name2").css('display', "none");
        $("#marcossave").css('display', "block");
        $("#taskadd").css('display', "none");
        $('#control-task-name').children('span').text(task_name);
        $('#control-task-type').children('a').children('.link-label').html(task_type);
        $('#control-task-firsttype').children('a').children('.link-label').html(task_firsttype);
        $('#control-task-secondtype').children('a').children('.link-label').html(task_secondtype);
        $('#control-task-target').val(task_target)
        $('#control-task-description').children('textarea').val(task_description);
        $('#control-task-cycle').children('a').children('.link-label').html(task_cycle);
        $('#control-task-level').children('a').children('.link-label').html(task_level);
        $('#control-task-zone-inp').val(task_zone);
        $('#control-task-business-inp').val(task_business);
        $('#control-task-department-inp').val(task_department);
        $('#control-task-role').children('a').children('.link-label').html(task_role);
        $('#control-task-owner-inp').val(task_owner);
        if (soar_status == 0) {
            $('.control-soar-status-inp[value="0"]').click();
            $('#soar-workflow-div').hide();
            $('.task-topsek-value[value-key-en="soar_workflow"]').html($('.task-topsek-value[value-key-en="soar_workflow"]').attr('value-default'))
        } else {
            $('.control-soar-status-inp[value="1"]').click();
            $('#soar-workflow-div').show();
            $('.task-topsek-value[value-key-en="soar_workflow"]').html(soar_workflow)
        }

        if (task_type == "资产漏洞管理成熟度" || task_type == "安全运营成熟度"){
            tokensDefault.set('form.typelabel', task_type);
            $('#firsttype').show();
            $('#secondtype').show();
        } else if (task_type == "定期任务"){
            tokensDefault.set('form.typelabel', task_type);
            $('#firsttype').show();
            $('#secondtype').show();
        } else{
            tokensDefault.set('form.typelabel', task_type);
            $('#firsttype').show();
            $('#secondtype').hide();
        }
        // 判断是否为内置任务，限制编辑选项

        var can_delete = $(this).attr('r14');
        if (can_delete == 0) {
            $('.task-topsek-value[value-key-en="task_type"]').parent('a').attr('disabled', 'disabled');
            $('.dropdown-toggle[aria-label="计划: --请选择任务周期--"]').attr('disabled', 'disabled');
        } else {
            $('.task-topsek-value[value-key-en="task_type"]').parent('a').removeAttr('disabled');
            $('.dropdown-toggle[aria-label="计划: --请选择任务周期--"]').removeAttr('disabled');
        }

        //task_cron = task_cron.split(' ');
        if (task_cycle == "按 Cron 计划运行") {
            console.log("成功");
            $('.custom_time').css("display", "inline");
            $('.custom_time').html(cron_text);
            $('#control-view61944').val(task_cron);
        } else if (task_cycle == "每天运行") {
            console.log("成功");
            $('.custom_time').css("display", "inline");
            $('.custom_time').html(day_text);
            task_cron = task_cron.split(' ');
            console.log(task_cron);
            task_cron = task_cron[1] + ':00';
            $('#link-label-hour').html(task_cron);
        } else if (task_cycle == "每周运行") {
            console.log("成功");
            $('.custom_time').css("display", "inline");
            $('.custom_time').html(week_text);
            task_cron = task_cron.split(' ');
            console.log(task_cron);
            hour = task_cron[1] + ':00';
            $('#link-label-hour').html(hour);
            var task_cron_html = "星期一"
            if (task_cron[4] == 0) {
                task_cron_html = "星期日"
            } else if (task_cron[4] == 1) {
                task_cron_html = "星期一"
            } else if (task_cron[4] == 2) {
                task_cron_html = "星期二"
            } else if (task_cron[4] == 3) {
                task_cron_html = "星期三"
            } else if (task_cron[4] == 4) {
                task_cron_html = "星期四"
            } else if (task_cron[4] == 5) {
                task_cron_html = "星期五"
            } else if (task_cron[4] == 6) {
                task_cron_html = "星期六"
            }
            $('.schedule_weekly').children('a').children('.link-label').html(task_cron_html);
        } else if (task_cycle == "每月运行") {
            console.log("成功");
            $('.custom_time').css("display", "inline");
            $('.custom_time').html(month_text);
            task_cron = task_cron.split(' ');
            console.log(task_cron);
            hour = task_cron[1] + ':00';
            $('#link-label-hour').html(hour);
            $('.schedule_monthly').children('a').children('.link-label').html(task_cron[2]);
        } else if (task_cycle == "每年运行") {
            console.log("成功");
            $('.custom_time').css("display", "inline");
            $('.custom_time').html(year_text);
        } else if (task_cycle == "立即") {
            console.log("成功");
            $('.custom_time').css("display", "none");
        } else {
            console.log("失败");
        }
        console.log("Console Log: Hello World");
        $(".popOut").css('display', "block");
        ani();
        $(".popOutBg").css('display', "block");
        console.log("Console Log: Hello World");
        document.getElementById('timezhouqi').className = "dropdown-menu dropdown-menu-selectable dropdown-menu-default";
    });

    $(document).on('click', '.btn-topsek2', function () {
        console.log("Console Log: Start Delete Data");
        console.log("Console Log: check again");
        var row5 = $(this).attr('r');
        tokensDefault.set('form.task_id', row5);
        $(".deleteOut").css('display', "block");
        $(".deleteOutBg").css('display', "block");
    });

    $(document).on('click', '.btn-topsek3', function () {
        console.log("Console Log: Start Add Data");
        $(".popOut").css('display', "block");
        ani();
        $(".popOutBg").css('display', "block");
        $("#control-task-name").css('display', "none");
        $("#control-task-name2").css('display', "block");
        $("#marcossave").css('display', "none");
        $("#taskadd").css('display', "block");
        $('#control-task-name').children('span').val('');
        $('#control-task-name2').children('input').val('');
        $('#control-task-type').children('a').children('.link-label').html(' --请选择任务属性--');
        $('#control-task-firsttype').children('a').children('.link-label').html(' --请选择任务类型--');
        $('#control-task-secondtype').children('a').children('.link-label').html(' --请选择指标类型--');
        $('#firsttype').hide();
        $('#secondtype').hide();
        $('#control-task-target2').children('input').val('');
        $('#control-task-description').children('textarea').val('');
        $('#control-task-cycle').children('a').children('.link-label').html(' --请选择任务周期--');
        $('#control-task-level').children('a').children('.link-label').html(' --请选择任务等级--');
        $('#control-task-zone-inp').val('');
        $('#control-task-business-inp').val('');
        $('#control-task-department-inp').val('');
        $('#control-task-role').children('a').children('.link-label').html(' --请选择初始角色--');
        $('#control-task-owner-inp').val('');
        
        $('.custom_time').css("display", "none");
        $('.control-soar-status-inp[value="0"]').click();
    });

    // 启停任务
    $(document).on('click', '.btn-topsek-active', function () {
        console.log("Console Log: check again");
        var task_id = $(this).attr('r');
        splstr = '| makeresults |eval update_time=strftime(now(),"%F %T")|eval sql=\"'
        splstr += 'update_time=\'"+update_time+"\',status=\'1\' WHERE id=\'' + task_id + '\'"| table sql| tmsdbquery "update" "UPDATE task_list SET " "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"'
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
            $(".alertOut").css('display', "none");
            $(".alertOutBg").css('display', "none");
            $(".popOut").css('display', "none");
            $(".popOutBg").css('display', "none");
            $(".deleteOut").css('display', "none");
            $(".deleteOutBg").css('display', "none");
        });
    });

    $(document).on('click', '.btn-topsek-unactive', function () {
        console.log("Console Log: check again");
        var task_id = $(this).attr('r');
        splstr = '| makeresults |eval update_time=strftime(now(),"%F %T")|eval sql=\"'
        splstr += 'update_time=\'"+update_time+"\',status=\'0\' WHERE id=\'' + task_id + '\'"| table sql| tmsdbquery "update" "UPDATE task_list SET " "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"'
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
            $(".alertOut").css('display', "none");
            $(".alertOutBg").css('display', "none");
            $(".popOut").css('display', "none");
            $(".popOutBg").css('display', "none");
            $(".deleteOut").css('display', "none");
            $(".deleteOutBg").css('display', "none");
        });
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
                str = "";
                for (var i = 0; i < menulist.length; i++) {
                    //console.log(menuvalue);
                    //console.log(menulist[i]);
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

    $(document).on('click', '.synthetic-select', function () {
        
        console.log(up_data);
        console.log("下拉框");
        console.log($(this).text());
        var text = $.trim($(this).text());
        //  document.getElementById('#control-task-cycle.a').setAttribute("dropdown-toggle", text);
        //$('#control-task-cycle').children('a').children('.link-label').html(text);
        if ($(this).parent('li').parent('ul').parent('div').prev('a').children('.link-label').hasClass('task-topsek-value') && $(this).parent('li').parent('ul').parent('div').prev('a').children('.link-label').attr('value-key-en') == "task_firsttype") {
            $('.task-topsek-value[value-key-en="task_secondtype"]').html($('.task-topsek-value[value-key-en="task_secondtype"]').attr('value-default'))
            tokensDefault.set('form.taskfirsttype', text)
        }
        $(this).parent('li').parent('ul').parent('div').prev('a').children('.link-label').html(text);
        $('.icon-check').css("display", "none");
        $(this).children('i').css("display", "inline");
        up_data['cron'] = text;
        console.log(up_data);
        if (text == "按 Cron 计划运行") {
            console.log("成功");
            $('.custom_time').css("display", "inline");
            $('.custom_time').html(cron_text);

        } else if (text == "每天运行") {
            console.log("成功");
            $('.custom_time').css("display", "inline");
            $('.custom_time').html(day_text);
        } else if (text == "每周运行") {
            console.log("成功");
            $('.custom_time').css("display", "inline");
            $('.custom_time').html(week_text);
        } else if (text == "每月运行") {
            console.log("成功");
            $('.custom_time').css("display", "inline");
            $('.custom_time').html(month_text);
        } else if (text == "每年运行") {
            console.log("成功");
            $('.custom_time').css("display", "inline");
            $('.custom_time').html(year_text);
        } else if (text == "立即") {
            console.log("成功");
            $('.custom_time').css("display", "none");
        } else if (text == "安全运营成熟度" || text == "资产漏洞管理成熟度"){
            tokensDefault.set('form.typelabel', text);
            $('#firsttype').show();
            $('.task-topsek-value[value-key-en="task_firsttype"]').text($('.task-topsek-value[value-key-en="task_firsttype"]').attr('value-default'))
            $('#secondtype').show();
        }else if (text == "安全事件"){
            tokensDefault.set('form.typelabel', text);
            $('.task-topsek-value[value-key-en="task_firsttype"]').text($('.task-topsek-value[value-key-en="task_firsttype"]').attr('value-default'))
            $('#firsttype').show();
            $('#secondtype').hide();
        }else if (text == "定期任务"){
            tokensDefault.set('form.typelabel', text);
            $('.task-topsek-value[value-key-en="task_firsttype"]').text($('.task-topsek-value[value-key-en="task_firsttype"]').attr('value-default'))
            $('#firsttype').show();
            $('#secondtype').show();
        }else {
            console.log("失败");
            
        }
    });

    $(document).on('click', '.schedule_weekly', function () {
        $('.schedule_daily').children('div').removeClass('open');
        $('.schedule_monthly').children('div').removeClass('open');
        $('#control-task-cycle').children('div').removeClass('open');
        if ($(this).children('div').hasClass('open')) {
            $(this).children('div').removeClass('open');
        } else {
            $(this).children('div').addClass('open');
        }
    });

    $(document).on('click', '.schedule_daily', function () {
        $('.schedule_weekly').children('div').removeClass('open');
        $('.schedule_monthly').children('div').removeClass('open');
        $('#control-task-cycle').children('div').removeClass('open');
        if ($(this).children('div').hasClass('open')) {
            $(this).children('div').removeClass('open');
        } else {
            $(this).children('div').addClass('open');
        }
    });
    $(document).on('click', '.schedule_monthly', function () {
        $('.schedule_daily').children('div').removeClass('open');
        $('.schedule_weekly').children('div').removeClass('open');
        $('#control-task-cycle').children('div').removeClass('open');
        if ($(this).children('div').hasClass('open')) {
            $(this).children('div').removeClass('open');
        } else {
            $(this).children('div').addClass('open');
        }
    });

    // 计划任务下拉显示控制
    $(document).on('click', '#control-task-cycle', function () {
        $('.schedule_daily').children('div').removeClass('open');
        $('.schedule_monthly').children('div').removeClass('open');
        $('.schedule_weekly').children('div').removeClass('open');
        //alertani();
        console.log(div.className);
        if ($('.dropdown-toggle[aria-label="计划: --请选择任务周期--"]').attr('disabled') == 'disabled') {
            console.log("do nothing")
        } else {
            if ($('#timezhouqi').hasClass('open')) {
                $('#timezhouqi').removeClass('open');

                $('#timezhouqi').hide();
            } else {
                $('#timezhouqi').addClass('open');
                $('#timezhouqi').show();
            }
        }
        //document.getElementById('timezhouqi').className = "dropdown-menu dropdown-menu-selectable dropdown-menu-default open";
    });

    $(document).on('click', '.close', function () {
        $(".popOut").css('display', "none");
        $(".popOutBg").css('display', "none");
        $(".alertOut").css('display', "none");
        $(".alertOutBg").css('display', "none");
        $(".help-alert-all").hide();
    });


    $(document).on('click', '.modal-btn-cancel', function () {
        $(".alertOut").css('display', "none");
        $(".alertOutBg").css('display', "none");
        $(".popOut").css('display', "none");
        $(".popOutBg").css('display', "none");
        $(".deleteOut").css('display', "none");
        $(".deleteOutBg").css('display', "none");
        $(".help-alert-all").hide();
    });

    $(document).on('click', '.alertOutBg', function () {
        $(".popOut").css('display', "none");
        $(".popOutBg").css('display', "none");
        $(".alertOut").css('display', "none");
        $(".alertOutBg").css('display', "none");
    });
    
    // 获取任务清单弹出框参数
    function get_task_detail() {
        json_str = {}

        json_str["task_role"] = "一线"
        json_str["task_owner"] = ""
        json_str["create_user"] = "task_admin";
        // console.log(create_user);
        json_str["task_target"] = $.trim(document.getElementById('control-task-target').value);
        json_str["description"] = $.trim($('#control-task-description').children('textarea').val());
        json_str["task_type"] = $.trim($('#control-task-type').children('a').children('.link-label').text());
        json_str["task_firsttype"] = $.trim($('#control-task-firsttype').children('a').children('.link-label').text());
        json_str["task_secondtype"] = $.trim($('#control-task-secondtype').children('a').children('.link-label').text());
        console.log(json_str)
        json_str["cycle"] = $.trim($('#control-task-cycle').children('a').children('.link-label').text());
        console.log(json_str)
        json_str["level"] = $.trim($('#control-task-level').children('a').children('.link-label').text());
        console.log(json_str)
        json_str["zone"] = $.trim(document.getElementById('control-task-zone-inp').value);
        json_str["business"] = $.trim(document.getElementById('control-task-business-inp').value);
        json_str["department"] = $.trim(document.getElementById('control-task-department-inp').value);
        json_str["task_role"] = $.trim($('#control-task-role').children('a').children('.link-label').text());
        json_str["task_owner"] = $.trim(document.getElementById('control-task-owner-inp').value);
        var schedule_daily = $.trim($('.schedule_daily').children('a').children('span').text()).split(":");
        var schedule_monthly = $.trim($('.schedule_monthly').children('a').children('span').text());

        var schedule_weekly_value = $.trim($('.schedule_weekly').children('a').children('span').text());
        var schedule_weekly = "1"
        if (schedule_weekly_value == "星期日") {
            schedule_weekly = "0"
        } else if (schedule_weekly_value == "星期一") {
            schedule_weekly = "1"
        } else if (schedule_weekly_value == "星期二") {
            schedule_weekly = "2"
        } else if (schedule_weekly_value == "星期三") {
            schedule_weekly = "3"
        } else if (schedule_weekly_value == "星期四") {
            schedule_weekly = "4"
        } else if (schedule_weekly_value == "星期五") {
            schedule_weekly = "5"
        } else if (schedule_weekly_value == "星期六") {
            schedule_weekly = "6"
        }
        var schedule_cron = $.trim($('#control-view61944').val());
        var cron = '';
        if ($.trim($('#control-task-cycle').children('a').children('.link-label').text()) == "按 Cron 计划运行") {
            console.log($.trim($('#control-view61944').val()));
            cron = schedule_cron;
        } else if ($.trim($('#control-task-cycle').children('a').children('.link-label').text()) == "每天运行") {
            cron = '0 ' + schedule_daily[0] + ' * * *';
            console.log(cron);
        } else if ($.trim($('#control-task-cycle').children('a').children('.link-label').text()) == "每周运行") {
            cron = '0 ' + schedule_daily[0] + ' * * ' + schedule_weekly;
            console.log(cron);
        } else if ($.trim($('#control-task-cycle').children('a').children('.link-label').text()) == "每月运行") {
            cron = '0 ' + schedule_daily[0] + ' ' + schedule_monthly + ' * *';
            console.log(cron);
        }
        json_str["cron"] = cron;

        // 获取soar信息
        json_str["soar_status"] = $('.control-soar-status-inp:checked').val();
        json_str["soar_workflow"] = $.trim($('#control-soar-workflow').children('a').children('.link-label').text());

        return json_str
    }
    //删除某条任务
    $(document).on('click', '#taskdelete', function () {
        console.log("Console Log: 开始调用删除脚本");
        var id = tokensDefault.get('task_id');
        splstr = '| makeresults '
        splstr += '| table name create_user| tmsdbquery "delete" "DELETE FROM task_list WHERE id=\'' + id + '\'" "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"'
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
            $(".alertOut").css('display', "none");
            $(".alertOutBg").css('display', "none");
            $(".popOut").css('display', "none");
            $(".popOutBg").css('display', "none");
            $(".deleteOut").css('display', "none");
            $(".deleteOutBg").css('display', "none");
        });
    });

    // 更新某条任务
    $(document).on('click', '#marcossave', function () {
        console.log("Console Log: 开始调用更新脚本");
        json_str = get_task_detail()
        id = tokensDefault.get('task_id');
        json_str["name"] = $.trim($('#control-task-name').text());

        this._searchManager = new SearchManager({
            preview: false
        });
        var flag = true;
        $(".help-alert-all").hide();
        if (json_str["name"] == "") {
            flag = false;
            $(".help-alert-taskname").show();
        }
        if (json_str["task_type"] == "--请选择任务类型--") {
            flag = false;
            $(".help-alert-type").show();
        }
        if (json_str["cycle"] == "--请选择任务周期--") {
            flag = false;
            $(".help-alert-cycle").show();
        }
        if (json_str["level"] == "--请选择任务等级--") {
            flag = false;
            $(".help-alert-level").show();
        }
        if (json_str["task_role"] == "--请选择初始角色--") {
            flag = false;
            $(".help-alert-role").show();
        }
        if (flag) {
            var str = '| makeresults  |eval update_time=strftime(now(),"%F %T")|eval sql=\"'
            for (var key in json_str) {
                console.log(key);
                console.log(json_str[key]);
                str += key + "=\'" + json_str[key] + "\',"
            }
            str += 'update_time=\'"+update_time+"\' WHERE id=\'' + id + '\'"| table sql| tmsdbquery "update" "UPDATE task_list SET " "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"'
            console.log(str)
            this._searchManager.set({ earliest_time: "0", latest_time: "now", search: str }, { tokens: true });
            console.log(this._searchManager.data("results"));
            this._searchManager.data("results").on("data", function () {
                console.log("配置更新成功");
                $(".popOut").css('display', "none");
                $(".popOutBg").css('display', "none");
                $(".alertOut").css('display', "none");
                $(".alertOutBg").css('display', "none");
                console.log("保存成功");
                console.log(tokensDefault.get('changecount'));
                var a = tokensDefault.get('changecount');
                a = parseInt(a) + 1;
                tokensDefault.set('form.changecount', parseInt(a));
            });
        }
    });

    // 增加某条任务
    $(document).on('click', '#taskadd', function () {
        console.log("Console Log: 开始调用添加脚本");
        json_str = get_task_detail()
        json_str["name"] = $.trim(document.getElementById('control-task-name3').value);
        this._searchManager = new SearchManager({
            preview: false
        });
        var str = '| makeresults  |eval '
        for (var key in json_str) {
            console.log(key);
            console.log(json_str[key]);
            str += key + "=\"" + json_str[key] + "\"|eval "
        }
        str += ' update_time=strftime(now(),"%F %T")| table name task_type task_firsttype task_secondtype description cron cycle level department business zone create_user task_role task_owner update_time task_target soar_status soar_workflow| tmsdbquery "insert" "INSERT INTO task_list(name,task_type,task_firsttype,task_secondtype,description,cron,cycle,level,department,business,zone,create_user,task_role,task_owner,update_time,task_target,soar_status,soar_workflow) VALUES " "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"'
        // var str = '| inserttask --task_type="安全事件类" --add_type="自定义任务" --create_user="'+create_user+'" --task_name="'+task_name+'" --task_description="'+task_description+'" --task_cycle="'+task_cycle+'" --endtime_inp="'+endtime_inp+'" --quyu="'+quyu+'" --yw="'+yw+'" --xt="'+xt+'" --person_mail="'+person_mail+'" --task_cycle_cron="'+cron+'"';
        console.log(str)
        // console.log(task_name);
        var flag = true;
        $(".help-alert-all").hide();
        if (json_str["name"] == "") {
            flag = false;
            $(".help-alert-taskname").show();
        }
        if (json_str["task_type"] == "--请选择任务属性--") {
            flag = false;
            $(".help-alert-type").show();
        }
        if (json_str["task_firsttype"] == "--请选择任务类型--") {
            flag = false;
            $(".help-alert-firsttype").show();
        }
        if (json_str["task_type"] != "安全事件" && json_str["task_secondtype"] == "--请选择指标类型--") {
            flag = false;
            $(".help-alert-secondtype").show();
        }
        if (json_str["cycle"] == "--请选择任务周期--") {
            flag = false;
            $(".help-alert-cycle").show();
        }
        if (json_str["level"] == "--请选择任务等级--") {
            flag = false;
            $(".help-alert-level").show();
        }
        if (json_str["task_role"] == "--请选择初始角色--") {
            flag = false;
            $(".help-alert-role").show();
        }
        if (flag) {
            this._searchManager.set({ earliest_time: "0", latest_time: "now", search: str }, { tokens: true });
            console.log(this._searchManager.data("results"));
            this._searchManager.data("results").on("data", function () {
                console.log("配置更新成功");
                $(".popOut").hide();
                $(".popOutBg").hide();
                $(".alertOut").hide();
                $(".alertOutBg").hide();
                console.log("保存成功");
                if (json_str["cycle"] == "立即") {
                    addtaskinfo()
                }
                console.log(tokensDefault.get('changecount'));
                var a = tokensDefault.get('changecount');
                a = parseInt(a) + 1;
                tokensDefault.set('form.changecount', parseInt(a));
            });
        }
    });

    function addtaskinfo() {
        this._searchManager = new SearchManager({
            preview: false
        });
        str = '| tmsdbquery "select" "select a.* FROM task_list a WHERE NOT EXISTS (SELECT 1 FROM task_info b WHERE b.task_id = a.id) AND a.cycle=\'立即\'" "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"| eval status=if(task_owner!="","已认领","未认领")| table id name task_type level create_user description task_owner task_role status create_time| tmsdbquery "insert" "INSERT INTO task_info(task_id,name,task_type,level,create_user,description,user_name,role,status,update_time) VALUES " "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"'
        this._searchManager.set({ earliest_time: "0", latest_time: "now", search: str }, { tokens: true });
        this._searchManager.data("results").on("data", function () {
            console.log("立即任务执行成功");
        });
    }


    var cron_text = '<div class="control-group shared-controls-controlgroup control-group-default" ><label class="control-label" for="control-view61944"> Cron 表达式 </label><div class="controls controls-join "><div class="control shared-controls-textcontrol control-default" id="control-container-view"><span class="uneditable-input " data-role="uneditable-input" style="display:none">22 16 * * *</span><input type="text" id="control-view61944" name="cron_schedule" aria-label="Cron 表达式" class="  " value="* * * * *" autocomplete="off"/></div></div><div class="help-block ">      如 00 18 *** (每天下午 6 点)。 </div></div>';
    var day_text = '<div class="control-group shared-controls-controlgroup control-group-default" ><label class="control-label" for="control-view61944"></label><div class="controls controls-separate "><div class="control btn-group shared-controls-syntheticselectcontrol control-default schedule_daily" data-cid="view33585" data-view="views/shared/controls/SyntheticSelectControl" data-name="hour" data-render-time="0.004" style=""><a class="dropdown-toggle btn" href="#" aria-label="选择将告警计划在一天中的哪个小时: 0:00" data-dialog-id="dialog-view35272"><i class=" icon-large"></i><span class="link-label" id="link-label-hour"> 0:00</span><span class="caret"></span></a><div class="dropdown-menu dropdown-menu-selectable dropdown-menu-default"><div class="arrow" style="margin-left: -8px;"></div><ul class="dropdown-menu-main"><li><a class="synthetic-select " href="#" data-item-idx="0" data-item-value="0" aria-label="选择将告警计划在一天中的哪个小时 : 0:00 : "><i class="icon-check" style="display: inline;"></i><span class="link-label">0:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="1" data-item-value="1" aria-label="选择将告警计划在一天中的哪个小时 : 1:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">1:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="2" data-item-value="2" aria-label="选择将告警计划在一天中的哪个小时 : 2:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">2:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="3" data-item-value="3" aria-label="选择将告警计划在一天中的哪个小时 : 3:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">3:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="4" data-item-value="4" aria-label="选择将告警计划在一天中的哪个小时 : 4:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">4:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="5" data-item-value="5" aria-label="选择将告警计划在一天中的哪个小时 : 5:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">5:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="6" data-item-value="6" aria-label="选择将告警计划在一天中的哪个小时 : 6:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">6:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="7" data-item-value="7" aria-label="选择将告警计划在一天中的哪个小时 : 7:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">7:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="8" data-item-value="8" aria-label="选择将告警计划在一天中的哪个小时 : 8:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">8:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="9" data-item-value="9" aria-label="选择将告警计划在一天中的哪个小时 : 9:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">9:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="10" data-item-value="10" aria-label="选择将告警计划在一天中的哪个小时 : 10:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">10:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="11" data-item-value="11" aria-label="选择将告警计划在一天中的哪个小时 : 11:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">11:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="12" data-item-value="12" aria-label="选择将告警计划在一天中的哪个小时 : 12:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">12:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="13" data-item-value="13" aria-label="选择将告警计划在一天中的哪个小时 : 13:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">13:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="14" data-item-value="14" aria-label="选择将告警计划在一天中的哪个小时 : 14:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">14:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="15" data-item-value="15" aria-label="选择将告警计划在一天中的哪个小时 : 15:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">15:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="16" data-item-value="16" aria-label="选择将告警计划在一天中的哪个小时 : 16:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">16:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="17" data-item-value="17" aria-label="选择将告警计划在一天中的哪个小时 : 17:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">17:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="18" data-item-value="18" aria-label="选择将告警计划在一天中的哪个小时 : 18:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">18:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="19" data-item-value="19" aria-label="选择将告警计划在一天中的哪个小时 : 19:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">19:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="20" data-item-value="20" aria-label="选择将告警计划在一天中的哪个小时 : 20:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">20:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="21" data-item-value="21" aria-label="选择将告警计划在一天中的哪个小时 : 21:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">21:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="22" data-item-value="22" aria-label="选择将告警计划在一天中的哪个小时 : 22:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">22:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="23" data-item-value="23" aria-label="选择将告警计划在一天中的哪个小时 : 23:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">23:00</span></a></li></ul><div class="dropdown-footer"></div></div></div></div></div>';
    var week_text = ' <div class="control-group shared-controls-controlgroup control-group-default" ><label class="control-label" for="control-view61944"></label><div class="controls controls-separate "><div class="control btn-group shared-controls-syntheticselectcontrol control-default schedule_weekly"  data-name="dayOfWeek" data-render-time="0.004" style="display: inline;"><a class="dropdown-toggle btn" href="#" aria-label="选择将告警计划在星期几: 星期一"><i class=" icon-large"/><span class="link-label"> 星期一</span><span class="caret"/></a><div class="dropdown-menu dropdown-menu-selectable dropdown-menu-default   "><div class="arrow"/><ul class="dropdown-menu-main"><li><a class="synthetic-select " href="#" data-item-idx="0" data-item-value="1" aria-label="选择将告警计划在星期几 : 星期一 : "><i class="icon-check" style="display: inline;"/><span class="link-label">星期一</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="1" data-item-value="2" aria-label="选择将告警计划在星期几 : 星期二 : "><i class="icon-check" style="display:none"/><span class="link-label">星期二</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="2" data-item-value="3" aria-label="选择将告警计划在星期几 : 星期三 : "><i class="icon-check" style="display:none"/><span class="link-label">星期三</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="3" data-item-value="4" aria-label="选择将告警计划在星期几 : 星期四 : "><i class="icon-check" style="display:none"/><span class="link-label">星期四</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="4" data-item-value="5" aria-label="选择将告警计划在星期几 : 星期五 : "><i class="icon-check" style="display:none"/><span class="link-label">星期五</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="5" data-item-value="6" aria-label="选择将告警计划在星期几 : 星期六 : "><i class="icon-check" style="display:none"/><span class="link-label">星期六</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="6" data-item-value="0" aria-label="选择将告警计划在星期几 : 星期日 : "><i class="icon-check" style="display:none"/><span class="link-label">星期日</span></a></li></ul><div class="dropdown-footer"/></div></div><div class="control btn-group shared-controls-syntheticselectcontrol control-default schedule_daily" data-cid="view33585" data-view="views/shared/controls/SyntheticSelectControl" data-name="hour" data-render-time="0.004" style=""><a class="dropdown-toggle btn" href="#" aria-label="选择将告警计划在一天中的哪个小时: 0:00" data-dialog-id="dialog-view35272"><i class=" icon-large"></i><span class="link-label"  id="link-label-hour"> 0:00</span><span class="caret"></span></a><div class="dropdown-menu dropdown-menu-selectable dropdown-menu-default"><div class="arrow" style="margin-left: -8px;"></div><ul class="dropdown-menu-main"><li><a class="synthetic-select " href="#" data-item-idx="0" data-item-value="0" aria-label="选择将告警计划在一天中的哪个小时 : 0:00 : "><i class="icon-check" style="display: inline;"></i><span class="link-label">0:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="1" data-item-value="1" aria-label="选择将告警计划在一天中的哪个小时 : 1:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">1:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="2" data-item-value="2" aria-label="选择将告警计划在一天中的哪个小时 : 2:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">2:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="3" data-item-value="3" aria-label="选择将告警计划在一天中的哪个小时 : 3:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">3:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="4" data-item-value="4" aria-label="选择将告警计划在一天中的哪个小时 : 4:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">4:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="5" data-item-value="5" aria-label="选择将告警计划在一天中的哪个小时 : 5:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">5:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="6" data-item-value="6" aria-label="选择将告警计划在一天中的哪个小时 : 6:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">6:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="7" data-item-value="7" aria-label="选择将告警计划在一天中的哪个小时 : 7:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">7:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="8" data-item-value="8" aria-label="选择将告警计划在一天中的哪个小时 : 8:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">8:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="9" data-item-value="9" aria-label="选择将告警计划在一天中的哪个小时 : 9:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">9:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="10" data-item-value="10" aria-label="选择将告警计划在一天中的哪个小时 : 10:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">10:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="11" data-item-value="11" aria-label="选择将告警计划在一天中的哪个小时 : 11:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">11:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="12" data-item-value="12" aria-label="选择将告警计划在一天中的哪个小时 : 12:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">12:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="13" data-item-value="13" aria-label="选择将告警计划在一天中的哪个小时 : 13:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">13:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="14" data-item-value="14" aria-label="选择将告警计划在一天中的哪个小时 : 14:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">14:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="15" data-item-value="15" aria-label="选择将告警计划在一天中的哪个小时 : 15:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">15:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="16" data-item-value="16" aria-label="选择将告警计划在一天中的哪个小时 : 16:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">16:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="17" data-item-value="17" aria-label="选择将告警计划在一天中的哪个小时 : 17:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">17:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="18" data-item-value="18" aria-label="选择将告警计划在一天中的哪个小时 : 18:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">18:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="19" data-item-value="19" aria-label="选择将告警计划在一天中的哪个小时 : 19:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">19:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="20" data-item-value="20" aria-label="选择将告警计划在一天中的哪个小时 : 20:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">20:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="21" data-item-value="21" aria-label="选择将告警计划在一天中的哪个小时 : 21:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">21:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="22" data-item-value="22" aria-label="选择将告警计划在一天中的哪个小时 : 22:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">22:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="23" data-item-value="23" aria-label="选择将告警计划在一天中的哪个小时 : 23:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">23:00</span></a></li></ul><div class="dropdown-footer"></div></div></div></div></div> ';

    var month_text = '<div class="control-group shared-controls-controlgroup control-group-default" ><label class="control-label" for="control-view61944"></label><div class="controls controls-separate "><span role="label" class="monthly_pre_label input-label" style="">	                    日期为 	                </span><div class="control btn-group shared-controls-syntheticselectcontrol control-default schedule_monthly" data-cid="view38446" data-view="views/shared/controls/SyntheticSelectControl" data-name="dayOfMonth" data-render-time="0.008" style=""><a class="dropdown-toggle btn" href="#" aria-label="选择将告警计划在一个月中的哪一天: 1" data-dialog-id="dialog-view42693"><i class=" icon-large"></i><span class="link-label"> 1</span><span class="caret"></span></a><div class="dropdown-menu dropdown-menu-selectable dropdown-menu-default" style=" bottom: auto;"><div class="arrow" style="margin-left: -8px;"></div><ul class="dropdown-menu-main"><li><a class="synthetic-select " href="#" data-item-idx="0" data-item-value="1" aria-label="选择将告警计划在一个月中的哪一天 : 1 : "><i class="icon-check" style="display: inline;"></i><span class="link-label">1</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="1" data-item-value="2" aria-label="选择将告警计划在一个月中的哪一天 : 2 : "><i class="icon-check" style="display:none"></i><span class="link-label">2</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="2" data-item-value="3" aria-label="选择将告警计划在一个月中的哪一天 : 3 : "><i class="icon-check" style="display:none"></i><span class="link-label">3</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="3" data-item-value="4" aria-label="选择将告警计划在一个月中的哪一天 : 4 : "><i class="icon-check" style="display:none"></i><span class="link-label">4</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="4" data-item-value="5" aria-label="选择将告警计划在一个月中的哪一天 : 5 : "><i class="icon-check" style="display:none"></i><span class="link-label">5</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="5" data-item-value="6" aria-label="选择将告警计划在一个月中的哪一天 : 6 : "><i class="icon-check" style="display:none"></i><span class="link-label">6</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="6" data-item-value="7" aria-label="选择将告警计划在一个月中的哪一天 : 7 : "><i class="icon-check" style="display:none"></i><span class="link-label">7</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="7" data-item-value="8" aria-label="选择将告警计划在一个月中的哪一天 : 8 : "><i class="icon-check" style="display:none"></i><span class="link-label">8</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="8" data-item-value="9" aria-label="选择将告警计划在一个月中的哪一天 : 9 : "><i class="icon-check" style="display:none"></i><span class="link-label">9</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="9" data-item-value="10" aria-label="选择将告警计划在一个月中的哪一天 : 10 : "><i class="icon-check" style="display:none"></i><span class="link-label">10</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="10" data-item-value="11" aria-label="选择将告警计划在一个月中的哪一天 : 11 : "><i class="icon-check" style="display:none"></i><span class="link-label">11</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="11" data-item-value="12" aria-label="选择将告警计划在一个月中的哪一天 : 12 : "><i class="icon-check" style="display:none"></i><span class="link-label">12</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="12" data-item-value="13" aria-label="选择将告警计划在一个月中的哪一天 : 13 : "><i class="icon-check" style="display:none"></i><span class="link-label">13</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="13" data-item-value="14" aria-label="选择将告警计划在一个月中的哪一天 : 14 : "><i class="icon-check" style="display:none"></i><span class="link-label">14</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="14" data-item-value="15" aria-label="选择将告警计划在一个月中的哪一天 : 15 : "><i class="icon-check" style="display:none"></i><span class="link-label">15</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="15" data-item-value="16" aria-label="选择将告警计划在一个月中的哪一天 : 16 : "><i class="icon-check" style="display:none"></i><span class="link-label">16</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="16" data-item-value="17" aria-label="选择将告警计划在一个月中的哪一天 : 17 : "><i class="icon-check" style="display:none"></i><span class="link-label">17</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="17" data-item-value="18" aria-label="选择将告警计划在一个月中的哪一天 : 18 : "><i class="icon-check" style="display:none"></i><span class="link-label">18</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="18" data-item-value="19" aria-label="选择将告警计划在一个月中的哪一天 : 19 : "><i class="icon-check" style="display:none"></i><span class="link-label">19</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="19" data-item-value="20" aria-label="选择将告警计划在一个月中的哪一天 : 20 : "><i class="icon-check" style="display:none"></i><span class="link-label">20</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="20" data-item-value="21" aria-label="选择将告警计划在一个月中的哪一天 : 21 : "><i class="icon-check" style="display:none"></i><span class="link-label">21</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="21" data-item-value="22" aria-label="选择将告警计划在一个月中的哪一天 : 22 : "><i class="icon-check" style="display:none"></i><span class="link-label">22</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="22" data-item-value="23" aria-label="选择将告警计划在一个月中的哪一天 : 23 : "><i class="icon-check" style="display:none"></i><span class="link-label">23</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="23" data-item-value="24" aria-label="选择将告警计划在一个月中的哪一天 : 24 : "><i class="icon-check" style="display:none"></i><span class="link-label">24</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="24" data-item-value="25" aria-label="选择将告警计划在一个月中的哪一天 : 25 : "><i class="icon-check" style="display:none"></i><span class="link-label">25</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="25" data-item-value="26" aria-label="选择将告警计划在一个月中的哪一天 : 26 : "><i class="icon-check" style="display:none"></i><span class="link-label">26</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="26" data-item-value="27" aria-label="选择将告警计划在一个月中的哪一天 : 27 : "><i class="icon-check" style="display:none"></i><span class="link-label">27</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="27" data-item-value="28" aria-label="选择将告警计划在一个月中的哪一天 : 28 : "><i class="icon-check" style="display:none"></i><span class="link-label">28</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="28" data-item-value="29" aria-label="选择将告警计划在一个月中的哪一天 : 29 : "><i class="icon-check" style="display:none"></i><span class="link-label">29</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="29" data-item-value="30" aria-label="选择将告警计划在一个月中的哪一天 : 30 : "><i class="icon-check" style="display:none"></i><span class="link-label">30</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="30" data-item-value="31" aria-label="选择将告警计划在一个月中的哪一天 : 31 : "><i class="icon-check" style="display:none"></i><span class="link-label">31</span></a></li></ul><div class="dropdown-footer"></div></div></div><span role="label" class="daily_pre_label input-label" style="">	                    时间为 	                </span><div class="control btn-group shared-controls-syntheticselectcontrol control-default schedule_daily" data-cid="view33585" data-view="views/shared/controls/SyntheticSelectControl" data-name="hour" data-render-time="0.004" style=""><a class="dropdown-toggle btn" href="#" aria-label="选择将告警计划在一天中的哪个小时: 0:00" data-dialog-id="dialog-view35272"><i class=" icon-large"></i><span class="link-label"  id="link-label-hour"> 0:00</span><span class="caret"></span></a><div class="dropdown-menu dropdown-menu-selectable dropdown-menu-default"><div class="arrow" style="margin-left: -8px;"></div><ul class="dropdown-menu-main"><li><a class="synthetic-select " href="#" data-item-idx="0" data-item-value="0" aria-label="选择将告警计划在一天中的哪个小时 : 0:00 : "><i class="icon-check" style="display: inline;"></i><span class="link-label">0:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="1" data-item-value="1" aria-label="选择将告警计划在一天中的哪个小时 : 1:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">1:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="2" data-item-value="2" aria-label="选择将告警计划在一天中的哪个小时 : 2:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">2:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="3" data-item-value="3" aria-label="选择将告警计划在一天中的哪个小时 : 3:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">3:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="4" data-item-value="4" aria-label="选择将告警计划在一天中的哪个小时 : 4:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">4:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="5" data-item-value="5" aria-label="选择将告警计划在一天中的哪个小时 : 5:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">5:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="6" data-item-value="6" aria-label="选择将告警计划在一天中的哪个小时 : 6:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">6:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="7" data-item-value="7" aria-label="选择将告警计划在一天中的哪个小时 : 7:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">7:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="8" data-item-value="8" aria-label="选择将告警计划在一天中的哪个小时 : 8:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">8:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="9" data-item-value="9" aria-label="选择将告警计划在一天中的哪个小时 : 9:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">9:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="10" data-item-value="10" aria-label="选择将告警计划在一天中的哪个小时 : 10:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">10:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="11" data-item-value="11" aria-label="选择将告警计划在一天中的哪个小时 : 11:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">11:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="12" data-item-value="12" aria-label="选择将告警计划在一天中的哪个小时 : 12:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">12:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="13" data-item-value="13" aria-label="选择将告警计划在一天中的哪个小时 : 13:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">13:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="14" data-item-value="14" aria-label="选择将告警计划在一天中的哪个小时 : 14:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">14:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="15" data-item-value="15" aria-label="选择将告警计划在一天中的哪个小时 : 15:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">15:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="16" data-item-value="16" aria-label="选择将告警计划在一天中的哪个小时 : 16:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">16:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="17" data-item-value="17" aria-label="选择将告警计划在一天中的哪个小时 : 17:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">17:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="18" data-item-value="18" aria-label="选择将告警计划在一天中的哪个小时 : 18:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">18:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="19" data-item-value="19" aria-label="选择将告警计划在一天中的哪个小时 : 19:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">19:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="20" data-item-value="20" aria-label="选择将告警计划在一天中的哪个小时 : 20:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">20:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="21" data-item-value="21" aria-label="选择将告警计划在一天中的哪个小时 : 21:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">21:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="22" data-item-value="22" aria-label="选择将告警计划在一天中的哪个小时 : 22:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">22:00</span></a></li><li><a class="synthetic-select " href="#" data-item-idx="23" data-item-value="23" aria-label="选择将告警计划在一天中的哪个小时 : 23:00 : "><i class="icon-check" style="display:none"></i><span class="link-label">23:00</span></a></li></ul><div class="dropdown-footer"></div></div></div></div></div>';
    var year_text = '';


    //window.location.reload();

    //search2 = new SearchManager({
    //	     preview: false
    //	 });
    //search2.set({earliest_time: "0", latest_time: "now", search: '|refresh'}, {tokens: true});
    //search2.data("results").on("data", function() {
    //console.log("配置更新成功");		
    // });
    //$(document).on('click','#popOutBg',function(){

    //	$("#popOut").css('display',"none");
    //	$("#popOutBg").css('display',"none");

    //  });
    var tableElement = mvc.Components.getInstance("task_table");
    tableElement.getVisualization(function (tableView) {
        // Register custom cell renderer, the table will re-render automatically
        tableView.addCellRenderer(new CustomIconRenderer());
    });




});
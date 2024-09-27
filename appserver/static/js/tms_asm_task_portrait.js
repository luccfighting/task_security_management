require([
    'underscore',
    'jquery',
    'splunkjs/mvc/table_export',
    'splunkjs/mvc',
    "splunkjs/mvc/chartview",
    "splunkjs/mvc/checkboxgroupview",
    "splunkjs/mvc/checkboxview",
    "splunkjs/mvc/dropdownview",
    "splunkjs/mvc/eventsviewerview",
    "splunkjs/mvc/multidropdownview",
    "splunkjs/mvc/radiogroupview",
    "splunkjs/mvc/searchbarview",
    "splunkjs/mvc/searchcontrolsview",
    "splunkjs/mvc/singleview",
    "splunkjs/mvc/tableview",
    "splunkjs/mvc/textinputview",
    "splunkjs/mvc/timelineview",
    "splunkjs/mvc/timerangeview",
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc/simplexml/ready!'], function (
        _,
        $,
        Table_export,
        mvc) {
    var SearchManager = require("splunkjs/mvc/searchmanager");
    var TimelineView = require("splunkjs/mvc/timelineview");
    var ChartView = require("splunkjs/mvc/chartview");
    var CheckboxGroupView = require("splunkjs/mvc/checkboxgroupview");
    var CheckboxView = require("splunkjs/mvc/checkboxview");
    var DropdownView = require("splunkjs/mvc/dropdownview");
    var EventsViewer = require("splunkjs/mvc/eventsviewerview");
    var MultiDropdownView = require("splunkjs/mvc/multidropdownview");
    var RadioGroupView = require("splunkjs/mvc/radiogroupview");
    var SearchbarView = require("splunkjs/mvc/searchbarview");
    var SearchControlsView = require("splunkjs/mvc/searchcontrolsview");
    var SingleView = require("splunkjs/mvc/singleview");
    var TableView = require("splunkjs/mvc/tableview");
    var TextInputView = require("splunkjs/mvc/textinputview");
    var TimeRangeView = require("splunkjs/mvc/timerangeview");
    var sharedModels = require("splunkjs/mvc/sharedmodels");

    // 插入搜索框
    // $('#fieldset_div').html(create_input_view("dev_ip_filter_search","dev_ip_filter","").render().el)
    $.each($('.input_div'), function () {
        $(this).html('<label style="margin: 0px 10px;">' + $(this).attr("label") + '</label>')
        $(this).append(create_TextInputView_view($(this).attr('data-value')).render().el)
    })
    $('.tab_active').click()
    function create_TextInputView_view(token_value) {
        var create_view = new TextInputView({
            id: token_value + "-textinput",
            value: mvc.tokenSafe("$" + token_value + "$"),
            default: "",
        });
        return create_view;
    }

    //获取当前账号
    var username = sharedModels.get("user").entry.get("name")


    // 搜索框变更后，查询和请求刷新
    var tokensDefault = mvc.Components.get("default");
    tokensDefault.on('change', function (nodevalue) {
        // console.log(data_mem[data_mem_type]["api_filter"])
        // console.log(nodevalue)
        if (data_mem_type != "统计概览") {
            let data_json = data_mem[data_mem_type]["api_filter"]
            if (nodevalue["changed"] != {}) {
                data_json = $.extend({}, data_json, nodevalue["changed"]);
            }
            $.each(data_json, function (key, value) {
                if (key.split("form.").length == 2) {
                    data_json[key.replace("form.", "")] = value
                    delete data_json[key]
                }
                if (value == "" || value == "*") {
                    delete data_json[key]
                }
            })
            // console.log(data_json)
            // console.log(data_mem[data_mem_type]["api_filter"])
            // data_mem[data_mem_type]["api_filter"] = data_json
            // JSON.stringify(a)==JSON.stringify(b)
            if (JSON.stringify(data_mem[data_mem_type]["api_filter"]) != JSON.stringify(data_json)) {
                // console.log("与原过滤条件不同，重新请求")
                data_mem[data_mem_type]["api_filter"] = data_json
                load_table(1, $('.select-pagesize').val(), data_json)
            }
        }


    })

    // 请求基础配置
    var asmheaders = {
        "Authorization": "e14bd6ed13e908495ab52be3648fa2b0"
    }
    var tmsheaders = {
        // "Authorization": localStorage.getItem("esc_token")
        "Authorization": "mS7HzoN/XYNIgkLCHV3tsDPHbjBBJ9inOPLZhMXiJyg=",
        "content-type": "application/json"
    }
    var tmspostheaders = {
        // "Authorization": localStorage.getItem("esc_token")
        "Authorization": "mS7HzoN/XYNIgkLCHV3tsDPHbjBBJ9inOPLZhMXiJyg=",
        "content-type": "application/json"
    }
    var headers = {
        "Authorization": "e14bd6ed13e908495ab52be3648fa2b0"
    }
    var postheaders = {
        "Authorization": "e14bd6ed13e908495ab52be3648fa2b0",
        "content-type": "application/json"
    }
    // 获取组织信息
    var api_value = tokensDefault.get('form.task_id')
    var data_mem = {
        "资产信息": {
            "id": api_value
        },
        "任务工单": {
            "url": "/tmsapi/task/info/",
            "api_filter": {
            },
            "tb_field_dict": {
                "bulk_edit": "全选",
                "dev_ip": "IP地址",
                "dev_name": "主机名",
                "dev_mac": "MAC地址",
                // "org_name": "组织名称",
                "bus_name": "所属业务",
                "dev_zone": "部署区域",
                "dev_site": "所在区域",
                "dev_type": "设备类型",
                "dev_class": "设备子类",
                "thirdparty_owner": "负责人",
                "is_online": "资产状态",
                "dev_status": "认领状态",
                "data_source": "数据来源",
                "id": "操作"
            },
            "inp_filter": ["inp_dev_ip"],
            "stats_url": "",
            "stats_data": [],
            "stats_field": ""
        },
        "任务配置": {
            "url": "/tmsapi/tasklist/",
            "api_filter": {
            },
            "tb_field_dict": {
                "bulk_edit": "全选",
                "dev_ip": "IP地址",
                "dev_name": "主机名",
                "dev_mac": "MAC地址",
                // "org_name": "组织名称",
                "bus_name": "所属业务",
                "dev_zone": "部署区域",
                "dev_site": "所在区域",
                "dev_type": "设备类型",
                "dev_class": "设备子类",
                "thirdparty_owner": "负责人",
                "is_online": "资产状态",
                "dev_status": "认领状态",
                "data_source": "数据来源",
                "id": "操作"
            },
            "inp_filter": ["inp_dev_ip"],
            "stats_url": "",
            "stats_data": [],
            "stats_field": ""
        },
        "处置记录": {
            "url": "/tmsapi/audit/task/",
            "api_filter": {
            },
            "tb_field_dict": {
                "create_time": "时间",
                "event_name": "事件名称",
                "event_type": "事件类型",
                "operator": "处置人",
                "description": "处置描述",
                "product": "处置类型",
                "data_source": "数据来源",
                "id": "操作"
            },
            "inp_filter": ["inp_dev_ip"],
            "stats_url": "",
            "stats_data": [],
            "stats_field": ""
        },
        "联系人": {
            "url": "/tmsapi/task/contact/",
        },
        "相关设备": {
            "url": "/tmsapi/task/device/",
        },
        "相关告警": {
            "url": "/tmsapi/task/alert/",
        },
        "事件研判": {
            "url": "/rmsapi/alert/judged/",
        },
        "创建工单": {
            "url": "/rmsapi/alert/create/task",
        },
        "相关文件": {
            "url": "/tmsapi/task/file/",
            "api_filter": {
                "task_id": api_value
            },
            "tb_field_dict": {
                "create_time": "上传时间",
                "filename": "文件名称",
                "file_id": "操作"
            },
            "inp_filter": ["inp_dev_ip"],
        },
    }
    // console.log(data_mem)

    try {
        //点击tab
        $(document).on('click', '.toggle-tab', function () {
            $('.toggle-tab').each(function () {
                $(this).parent('li').removeClass('active')
            })
            $(this).parent('li').addClass('active')
            // 跳转到对应y坐标
            var position = $('#' + $(this).attr('data-elements')).offset();
            var y = position.top - 100
            $('html, body').animate({
                scrollTop: y
            }, 'slow');
            // filter_elements = $(this).attr('filter_element').split(",")
            // $('.input_div').hide()
            // $.each(filter_elements, function (item, value) {
            //     $('.input_div[label="' + value + '"]').show()
            // })
            // data_mem_type = $('.active').children('a').attr('tab_type')
            // load_table(1, 10, data_mem[data_mem_type]["api_filter"])
        })
        // 返回顶部
        $(document).on('click', '#back_to_top', function () {
            $('html, body').animate({
                scrollTop: 0
            }, 'slow');
            $('.toggle-tab').each(function () {
                $(this).parent('li').removeClass('active')
            })
            $('.toggle-tab[data-elements="disposal_row"]').parent('li').addClass('active')
        })
        // 监听滚动事件
        $(window).scroll(function () {

            var scrollTop = $(this).scrollTop(); // 获取当前滚动条的y坐标
            var position = $('#disposal_row').offset();
            var y = position.top - 100
            if (scrollTop < y) {
                $('.toggle-tab').each(function () {
                    $(this).parent('li').removeClass('active')
                })
                $('.toggle-tab[data-elements="disposal_row"]').parent('li').addClass('active')
            }
            // console.log("当前页面滚动位置的y坐标: " + scrollTop);
            // 在这里可以根据scrollTop的值进行其他操作
        });


    } catch (err) {
        console.log(err)
    }

    try {
        $(document).on('click', '.btn-topsek-timing', function () {
            $('.btn-topsek-timing').each(function () {
                $(this).removeClass('active')
            })
            $(this).addClass('active')
            if ($(this).attr('data-type') == "*") {
                $('.lifecycle_timeline_li').removeClass('data_type_hide')
            } else {
                $('.lifecycle_timeline_li').addClass('data_type_hide')
                $('.lifecycle_timeline_li[data-type="' + $(this).attr('data-type') + '"]').removeClass('data_type_hide')
            }
            var visibleLiCount = $('#lifecycle_timeline_str2 li:visible').length;
            $('.timeline_count').html(visibleLiCount)
        })
        // timeline_filter
        $('#timeline_filter').on('input', function () {
            if ($(this).val() == "") {
                $('.lifecycle_timeline_li').removeClass('filter_hide')
            } else {
                $('.lifecycle_timeline_li').removeClass('filter_hide')
                var searchString = $(this).val();
                $.each($('.lifecycle_timeline_li'), function () {
                    var divText = $(this).text();
                    if (divText.includes(searchString)) {
                        // console.log("字符串找到了！");
                        $(this).removeClass('filter_hide')
                    } else {
                        $(this).addClass('filter_hide')
                        // console.log("字符串没找到。");
                    }
                })

            }
            console.log('Input value changed to: ' + $(this).val());
        });
    } catch (err) {
        console.log(err)
    }
    var data_mem_type

    // 控制导出的字段
    var export_field_dict = {
        "合规基线": ["IP地址", "所属业务", "检查项", "发现时间", "检查结果", "修复状态"],
    }
    var tb_field_width = {
        "vuln_cve": "116px",
        "name": "100px",
        "risk_level": "80px",
        "event_level": "80px",
        "id": "80px"
    }

    // 获取当前active tab
    data_mem_type = "统计概览"

    $(document).ready(function () {
        $("#zjld_btn_div").append(`<a class="btn btn-horizon btn-review-list" style="float: right;margin-right: 1%;display:none;">核查历史</a>`)
        $('.ul_change_stats[data-value="统计概览"]').click()
    })
    // 获取基础信息并渲染页面
    $('.layercontent').html('')
    load_api_info()
    function load_api_info() {
        // 根据获取到的用户名判断前端权限
        // 先停用所有功能
        $('.btn-topsek-disposal').attr("disabled", "disabled")
        $('.btn-topsek-addnewjournal').attr("disabled", "disabled")
        $('.task_journal').attr("disabled", "disabled")
        if (api_value != "" && api_value != undefined) {
            // $('.span-api-info[data-value="dev_ip"]').text(api_value)
            // 基础信息渲染
            const event_id = [] //告警id列表
            $.ajax({
                //几个参数需要注意一下
                type: "GET",//方法类型
                url: data_mem["任务工单"]["url"] + api_value,//url
                data: {
                    "id": api_value
                },
                async: false,
                headers: tmsheaders,
                success: function (result) {
                    // console.log(result)
                    try {
                        data_mem["资产信息"] = result["records"][0]
                        // console.log("开始渲染基础信息")
                        // 开始判断权限
                        const reviewer_list = get_reviewer_list()
                        console.log(reviewer_list)
                        if (result["records"][0]["status"] == "未认领") {
                            $('.btn-topsek-disposal[data-value="工单处置"][data-status="已认领"]').removeAttr("disabled")
                        } else if ((result["records"][0]["status"] == "已认领" || result["records"][0]["status"] == "处理中" || result["records"][0]["status"] == "未通过") && (result["records"][0]["user_name"] == username)) {
                            $('.btn-topsek-disposal[data-value="工单处置"][data-status="已完成"]').removeAttr("disabled")
                            $('.btn-topsek-disposal[data-value="工单处置"][data-type="工单流转"]').removeAttr("disabled")
                            $('.btn-topsek-disposal[data-value="工单处置"][data-type="文件上传"]').removeAttr("disabled")
                            $('.btn-topsek-addnewjournal').removeAttr("disabled")
                            $('.task_journal').removeAttr("disabled")
                        } else if ((result["records"][0]["status"] == "已完成" || result["records"][0]["status"] == "审核中") && (result["records"][0]["reviewer"] == null || result["records"][0]["reviewer"] == username) && username in reviewer_list) {
                            $('.btn-topsek-disposal[data-value="工单处置"][data-status="已关闭"]').removeAttr("disabled")
                            $('.btn-topsek-disposal[data-value="工单处置"][data-status="未通过"]').removeAttr("disabled")
                            $('.btn-topsek-disposal[data-value="工单处置"][data-type="文件上传"]').removeAttr("disabled")
                            $('.btn-topsek-addnewjournal').removeAttr("disabled")
                            $('.task_journal').removeAttr("disabled")
                        }


                        if (result["records"][0]["event_id"] != undefined && result["records"][0]["event_id"] != "" && result["records"][0]["event_id"] != null) {
                            event_id.push(result["records"][0]["event_id"])
                        }
                        $.each($('.span-api-info[data-type="task_info"]'), function () {
                            if (data_mem["资产信息"][$(this).attr('data-value')] != undefined && data_mem["资产信息"][$(this).attr('data-value')] != "" && data_mem["资产信息"][$(this).attr('data-value')] != null) {
                                if ($(this).attr('data-value') == "org_name") {
                                    if (data_mem["资产信息"][$(this).attr('data-value')] != "" || data_mem["资产信息"][$(this).attr('data-value')] != undefined) {
                                        $(this).html(data_mem["资产信息"][$(this).attr('data-value')] + `  <a title="点击前往组织画像" class="asset_detail" data_type="${$(this).attr('data-value')}" info="${data_mem["资产信息"][$(this).attr('data-value')]}"><i class="fa fa-external-link"></i></a>`)
                                    }
                                } else if ($(this).attr('data-value') == "bus_name") {
                                    if (data_mem["资产信息"][$(this).attr('data-value')] != "" || data_mem["资产信息"][$(this).attr('data-value')] != undefined) {
                                        $(this).html(data_mem["资产信息"][$(this).attr('data-value')] + `  <a title="点击前往业务画像" class="asset_detail" data_type="${$(this).attr('data-value')}" info="${data_mem["资产信息"][$(this).attr('data-value')]}"><i class="fa fa-external-link"></i></a>`)
                                    }
                                } else {
                                    $(this).text(data_mem["资产信息"][$(this).attr('data-value')])
                                }
                            } else {
                                $(this).text('')
                            }
                        })
                    } catch (error) {
                        console.log(error)
                    }
                },
                error: function (result) {
                    console.log(result);
                }
            });
            // 任务信息渲染

            $.ajax({
                //几个参数需要注意一下
                type: "GET",//方法类型
                url: data_mem["任务配置"]["url"] + data_mem["资产信息"]["task_id"],//url
                data: {
                },
                async: false,
                headers: tmsheaders,
                success: function (result) {
                    // console.log(result)
                    try {
                        data_mem["任务配置"][data_mem["资产信息"]["task_id"]] = result


                        // console.log("开始渲染任务信息")
                        $.each($('.span-api-info[data-type="task_config"]'), function () {
                            if (result[$(this).attr('data-value')] != undefined && result[$(this).attr('data-value')] != "" && result[$(this).attr('data-value')] != null) {
                                if ($(this).attr('data-value') == "org_name") {
                                    if (result[$(this).attr('data-value')] != "" || result[$(this).attr('data-value')] != undefined) {
                                        $(this).html(data_mem["资产信息"][$(this).attr('data-value')] + `  <a title="点击前往组织画像" class="asset_detail" data_type="${$(this).attr('data-value')}" info="${result[$(this).attr('data-value')]}"><i class="fa fa-external-link"></i></a>`)
                                    }
                                } else if ($(this).attr('data-value') == "bus_name") {
                                    if (result[$(this).attr('data-value')] != "" || result[$(this).attr('data-value')] != undefined) {
                                        $(this).html(result[$(this).attr('data-value')] + `  <a title="点击前往业务画像" class="asset_detail" data_type="${$(this).attr('data-value')}" info="${result[$(this).attr('data-value')]}"><i class="fa fa-external-link"></i></a>`)
                                    }
                                } else {
                                    $(this).text(result[$(this).attr('data-value')])
                                }
                            } else {
                                $(this).text('')
                            }
                        })
                    } catch (error) {
                        console.log(error)
                    }
                },
                error: function (result) {
                    console.log(result);
                }
            });
            console.log(event_id)
            const user_list = get_user_list()
            // 联系人渲染
            $.ajax({
                //几个参数需要注意一下
                type: "GET",//方法类型
                url: data_mem["联系人"]["url"],//url
                data: {
                    "task_id": api_value
                },
                async: false,
                headers: tmsheaders,
                success: function (result) {
                    // console.log(result)
                    try {
                        $('.contact_tbody').html('')
                        $('.contact_tbody_v2').html('')
                        // console.log("开始渲染任务信息")
                        if (result["records"].length == 0) {
                            $('.contact_tbody').html(`<tr><td colspan="2"><div>暂无联系人信息<div></td></tr>`)
                            $('.contact_tbody_v2').html(`<tr><td colspan="7"><div>暂无联系人信息<div></td></tr>`)
                        } else {
                            $('.contact_tbody').html('')
                            $('.toggle-tab[tab_type="联系人"]').html('联系人(' + result["records"].length + ")")
                            $.each(result["records"], function (key, item) {
                                data_mem["联系人"][item["user_id"]] = item
                                $('.contact_tbody').append(`<tr><td ><div>${user_list[item["user_id"]]["account"]}<div></td>
                                                                <td ><a class="btn-topsek-contact" data-value="${item["user_id"]}" >详情<a></td></tr>`)
                                $('.contact_tbody_v2').append(`<tr><td ><div>${user_list[item["user_id"]]["account"]}<div></td>
                                                                <td ><div>${user_list[item["user_id"]]["name"]}<div></td>
                                                                <td ><div>${user_list[item["user_id"]]["business"]}<div></td>
                                                                <td ><div>${user_list[item["user_id"]]["department"]}<div></td>
                                                                <td ><div>${user_list[item["user_id"]]["zone"]}<div></td>
                                                                <td ><div>${user_list[item["user_id"]]["email"]}<div></td>
                                                                <td ><div>${user_list[item["user_id"]]["mobile"]}<div></td></tr>`)

                            })
                        }
                    } catch (error) {
                        console.log(error)
                    }
                },
                error: function (result) {
                    console.log(result);
                }
            });
            // 相关设备渲染
            const dev_id = []
            $.ajax({
                //几个参数需要注意一下
                type: "GET",//方法类型
                url: data_mem["相关设备"]["url"],//url
                data: {
                    "task_id": api_value
                },
                async: false,
                headers: tmsheaders,
                success: function (result) {
                    // console.log(result)
                    try {
                        data_mem["相关设备"][api_value] = result["records"]
                        // console.log("开始渲染任务信息")
                        if (result["records"].length == 0) {
                            $('.device_tbody').html(`<tr><td colspan="2"><div>暂无相关设备信息<div></td></tr>`)
                        } else {
                            $('.device_tbody').html('')
                            $('.toggle-tab[tab_type="相关设备"]').html('相关设备(' + result["records"].length + ")")
                            $.each(result["records"], function (key, item) {
                                dev_id.push(item["dev_ip"])
                                $('.device_tbody').append(`<tr><td ><div>${item["dev_ip"]}<div></td><td><a class="btn-topsek-detail" data-type="IP资产" data-value="${item["dev_ip"]}">前往画像<a></td></tr>`)
                            })
                        }
                    } catch (error) {
                        console.log(error)
                    }
                },
                error: function (result) {
                    console.log(result);
                }
            });
            // 相关告警渲染
            $.ajax({
                //几个参数需要注意一下
                type: "GET",//方法类型
                url: data_mem["相关告警"]["url"],//url
                data: {
                    "task_id": api_value
                },
                async: false,
                headers: tmsheaders,
                success: function (result) {
                    // console.log(result)
                    try {
                        data_mem["相关告警"][api_value] = result["records"]
                        // console.log("开始渲染任务信息")
                        if (result["records"].length == 0) {
                            $('.alert_tbody').html(`<tr><td colspan="5"><div>暂无相关告警信息<div></td></tr>`)
                        } else {
                            $('.alert_tbody').html('')
                            $('.toggle-tab[tab_type="相关告警"]').html('相关告警(' + result["records"].length + ")")
                            $.each(result["records"], function (key, item) {

                                $('.alert_tbody').append(`<tr><td ><div>${item["event_id"]}<div></td><td><div>详情<div></td></tr>`)
                            })
                        }
                    } catch (error) {
                        console.log(error)
                    }
                },
                error: function (result) {
                    console.log(result);
                }
            });

            // 相关文件渲染
            $.ajax({
                //几个参数需要注意一下
                type: "GET",//方法类型
                url: data_mem["相关文件"]["url"],//url
                data: {
                    "task_id": api_value
                },
                async: false,
                headers: tmsheaders,
                success: function (result) {
                    // console.log(result)
                    try {
                        data_mem["相关文件"][api_value] = result["records"]
                        if (result["records"].length == 0) {
                            $('.file_tbody').html(`<tr><td colspan="3"><div>暂无相关文件信息<div></td></tr>`)
                        } else {
                            $('.toggle-tab[tab_type="相关文件"]').html('相关文件(' + result["records"].length + ")")
                            $.each(result["records"], function (index, value) {
                                $('.file_tbody').append(`<tr>
                                <td ><div>${value["create_time"]}<div></td>
                                <td ><div>${value["filename"]}<div></td>
                                <td><div style="text-align:left;" ><a class="btn-topsek-download" title="点击下载文件" file_name="${value["filename"]}" file_id="${value["file_id"]}" >下载<i class="fa fa-download"></i></a></div></td>
                                </tr>`)
                            })
                            $('.span-api-info[data-value="file_count"]').html(`<a class="btn-topsek-file" data-type="相关文件" data-value="${api_value}"><i class="fa fa-file-text-o"></i>${result["page"]["total"]}个文件</a>`)
                        }
                    } catch (error) {
                        console.log(error)
                    }
                },
                error: function (result) {
                    console.log(result);
                }
            });

            // 处置记录
            let disposal_history = []
            const dev_info = []
            let alert_info = {}

            // 获取相关告警处置信息
            $.each(event_id, function (key, item) {
                $('.alert_tbody').html('')
                // 通过相关告警获取风险信息 资产风险：product，dev_ip
                $.ajax({
                    //几个参数需要注意一下
                    type: "POST",//方法类型
                    url: "/escapi/es/search",//url
                    data: JSON.stringify({
                        "page": "1",
                        "pageSize": "1000",
                        "index": "*_alerting_total",
                        "kql": "eventb_uuid:" + item
                    }),
                    async: false,
                    headers: tmspostheaders,
                    success: function (result) {
                        $('.toggle-tab[tab_type="相关告警"]').html('相关告警(' + result["records"].length + ")")
                        $.each(result["records"], function (index, value) {
                            dev_info.push({ "asset": value["alert_asset"], "product": value["product"], "task_id": value["task_id"] })
                            value["result"] = JSON.stringify({ "alert_url": "asmv2_asset_security?form.field1.earliest=0&form.field1.latest=now&form.asm_alert_name=" + alert_info["alert_name"] + "&form.asm_alert_level=严重&form.asm_alert_level=高危&form.asm_alert_level=中危&form.asm_alert_assets=" + alert_info["alert_asset"] + "&form.asm_alert_type=*&form.asm_status=*" })
                            const product = value["product"]
                            alert_info = value
                            $('.alert_tbody').append(`<tr>
                                <td ><div>${value["fire_time"]}<div></td>
                                <td ><div>${value["alert_name"]}<div></td>
                                <td ><div>${value["threat_level"]}<div></td>
                                <td ><div>${value["threat_stage"]}<div></td>
                                <td><div eventb_uuid="${value["event_id"]}"><a href="asmv2_asset_security?form.field1.earliest=${Date.parse(value["fire_time"]) / 1000 - 60}&form.field1.latest=${Date.parse(value["fire_time"]) / 1000}&form.asm_alert_name=${alert_info["alert_name"]}&form.asm_alert_level=严重&form.asm_alert_level=高危&form.asm_alert_level=中危&form.asm_alert_assets=${alert_info["alert_asset"]}&form.asm_alert_type=*&form.asm_status=*" target="_blank">详情</a><div></td>
                                </tr>`)
                        })

                    },
                    error: function (result) {
                        console.log(result);
                    }
                });

                // 通过dev_info获取风险处置信息
                // $.each(dev_info, function (key, item) {
                //     $.ajax({
                //         //几个参数需要注意一下
                //         type: "POST",//方法类型
                //         url: "/escapi/es/search",//url
                //         data: JSON.stringify({
                //             "page": "1",
                //             "pageSize": "1000",
                //             "index": "asm_assets*",
                //             "kql": item["asset"] + " AND product:" + item["product"] + " AND task_id:" + item["task_id"]
                //         }),
                //         async: false,
                //         headers: tmspostheaders,
                //         success: function (result) {
                //             risk_info={}
                //             $.each(result["records"], function (index, value) {
                //                 risk_info[value["id"]]=value
                //             })
                //             $.each(risk_info, function (index, value) {
                //                 $.ajax({
                //                     //几个参数需要注意一下
                //                     type: "GET",//方法类型
                //                     url: "/asmapi/asm/audit/asset/",//url
                //                     data: {
                //                         "page": "1",
                //                         "pageSize": "1000",
                //                         "product": value["product"],
                //                         "asset_id": value["id"]
                //                     },
                //                     async: false,
                //                     headers: asmheaders,
                //                     success: function (result) {
                //                         $.each(result["records"], function (index, value) {
                //                             disposal_history.push(value)
                //                         })

                //                     },
                //                     error: function (result) {
                //                         console.log(result);
                //                     }
                //                 });
                //             })

                //         },
                //         error: function (result) {
                //             console.log(result);
                //         }
                //     });
                // })

                // 获取相关告警处置信息
                $.ajax({
                    //几个参数需要注意一下
                    type: "POST",//方法类型
                    url: "/escapi/es/search",//url
                    data: JSON.stringify({
                        "page": "1",
                        "pageSize": "1000",
                        "index": "*_alerting_journal",
                        "kql": "eventb_uuid:" + item
                    }),
                    async: false,
                    headers: tmspostheaders,
                    success: function (result) {
                        $.each(result["records"], function (index, value) {
                            value["create_time"] = value["@timestamp"].split(".")[0]
                            value["operator"] = value["update_user"]
                            value["data_source"] = ["资产告警"]
                            value["event_type"] = value["event_name"]
                            value["product"] = product
                            value["result"] = JSON.stringify({ "alert_url": "asmv2_asset_security?form.field1.earliest=0&form.field1.latest=now&form.asm_alert_name=" + alert_info["alert_name"] + "&form.asm_alert_level=严重&form.asm_alert_level=高危&form.asm_alert_level=中危&form.asm_alert_assets=" + alert_info["alert_asset"] + "&form.asm_alert_type=*&form.asm_status=*" })
                            disposal_history.push(value)
                        })

                    },
                    error: function (result) {
                        console.log(result);
                    }
                });
            })
            if ($('.alert_tbody').html() == "") {
                $('.alert_tbody').html(`<tr><td colspan="5"><div>暂无相关告警信息<div></td></tr>`)
            }

            $.ajax({
                //几个参数需要注意一下
                type: "GET",//方法类型
                url: "/tmsapi/audit/task/",//url
                data: {
                    "page": "1",
                    "pageSize": "1000",
                    "task_id": api_value
                },
                headers: tmsheaders,
                async: false,
                success: function (result) {
                    $.each(result["records"], function (index, value) {
                        disposal_history.push(value)
                    })

                },
                error: function (result) {
                    console.log(result);
                }
            });
            $.each(disposal_history, function (index, value) {
                value["timestamp"] = Date.parse(value["create_time"])
            })
            console.log(disposal_history)
            disposal_history = disposal_history.sort((a, b) => a.timestamp - b.timestamp);
            console.log(disposal_history)
            $('#lifecycle_timeline_str2').html('')
            $.each(disposal_history, function (index, value) {
                var color = "";
                var file_download_html = ""
                if (value['event_name'] == "触发告警" || value['data_source'].indexOf("资产告警") != -1) {
                    value["data_type"] = "资产告警"

                    color = "#dc4e41"
                } else if (value['event_type'] == "文件上传" || value['event_type'] == "获取线索") {
                    color = "#249087"
                    file_download_html = `<div class="content radius_div blue" style="background-color:${color};border: 1px solid ${color}" title="点击下载文件：${value['result']["file_name"]}">
                                    <span class="btn-topsek-download" title="点击下载文件" file_name="${value['result']["file_name"]}" file_id="${value['result']["file_id"]}" style="color:white">${value['result']["file_name"]}(点击下载文件<i class="fa fa-download"></i>)</span>
                                </div>`
                    value["event_name"] = "文件上传"
                    value["data_type"] = "文件上传"
                } else if (value['event_name'] == "工单流转") {
                    color = "#3847e4"
                    value["data_type"] = value['event_name']
                } else {
                    color = "#0366d6"
                    value["data_type"] = "工单处置"
                }
                // 数据来源拼接
                let data_source_html = ``
                $.each(value["data_source"], function (key, value) {
                    data_source_html += `<div class="content radius_div blue" style="background-color:${color};border: 1px solid ${color}"  title="日志来源：${value}">${value}</div>`
                })

                const append_html = `<li class="lifecycle_timeline_li" data-type="${value["data_type"]}">
                            <div class="date">${value['create_time']}</div>
                            <div class="bullet blue " style="background-color:${color}" />
                            <div class="desc">
                                <div class="title" style="border-left: 3px solid ${color};">
                                    <span class="btn-topsek2" style="color:${color}">${value['event_name']}</span>
                                </div>
                                <div class="content radius_div" style="width:100%">${value['description']}</div>
                                ${data_source_html}
                                <div class="timeline_user content radius_div blue" style="background-color:${color};border: 1px solid ${color}" title="操作人：${value['operator']}">
                                    <i class="fa fa-user" aria-hidden="true" /></i>
                                    <span class="">${value['operator']}</span>
                                </div>
                                ${file_download_html}
                            </div>
                        </li>`
                $('#lifecycle_timeline_str2').append(append_html)

                var visibleLiCount = $('#lifecycle_timeline_str2 li:visible').length;
                $('.timeline_count').html(visibleLiCount)
            })
        }
    }

    // 加载清单
    function load_table(page, pagesize, filter_data = {}, div_id = "") {
        $('.span-title[data-value="menu"]').text(data_mem_type)

        $('#laye_info-fieldset').show()
        let is_load = "true"
        // $('#inp_port').hide()
        // $('#inp_service').hide()
        // $('#inp_weak_class').hide()
        // $('#inp_vuln_name').hide()
        // $('#inp_event_level').hide()
        // $('#inp_domain_path').hide()
        // $('#inp_is_sensitive').hide()
        if (data_mem_type == "统计概览") {
            is_load = "false"
        }
        // else if (data_mem_type == "端口清单") {
        //     $('#inp_port').show()
        //     $('#inp_service').show()
        // } else if (data_mem_type == "系统漏洞" || data_mem_type == "应用漏洞" || data_mem_type == "情报漏洞" || data_mem_type == "POC漏洞") {
        //     $('#inp_vuln_name').show()
        // } else if (data_mem_type == "目录清单") {
        //     $('#inp_domain_path').show()
        //     $('#inp_is_sensitive').show()
        // }
        let data_json = {
            "page": page,
            "pageSize": pagesize
            // ,
            // "strategy_type": "data"
        }
        if (filter_data != {}) {
            data_json = $.extend({}, filter_data, data_json);
        }

        // if (tokensDefault.get('filename') != "" || tokensDefault.get('filename') != undefined) {
        //     data_json["word"] = tokensDefault.get('filename')
        // }

        if (is_load == "true") {
            // load_stats_count()
            $('#' + div_id + 'table_div').show()
            $('#' + div_id + 'table_tfoot_div').show()
            $('#' + div_id + 'table_div').html('')
            $('#' + div_id + 'table_tfoot_div').html('')
            let ajax_type = "GET"
            let ajax_headers = tmsheaders
            if (data_mem_type == "威胁情报") {
                ajax_type = "POST"
                data_json = JSON.stringify($.extend({}, {
                    "index": "threat_intelligence*",
                    "kql": "dst_ip:" + api_value
                }, data_json));
                ajax_headers = postheaders
            } else if (["内部威胁", "外部入侵"].indexOf(data_mem_type) > -1) {
                console.log(data_json)
                data_json = JSON.stringify(data_json)
                ajax_type = "POST"
                ajax_headers = postheaders
            } else {
                ajax_type = "GET"
                ajax_headers = tmsheaders
            }
            $.ajax({
                //几个参数需要注意一下
                type: ajax_type,//方法类型
                // url: "/ndrapi/rules/match/tag/strategy/info/",//url
                // url: "/asmapi/asm/assets/database/info/",
                url: data_mem[data_mem_type]["url"],
                data: data_json,
                headers: ajax_headers,
                success: function (result) {
                    // console.log(result);
                    data_mem[data_mem_type]["records"] = []
                    data_mem[data_mem_type]["records"] = result["records"]
                    // console.log(data_mem)
                    const tb_field = data_mem[data_mem_type]["tb_field_dict"]
                    const filetable = create_file_table(data_mem_type, tb_field, data_mem[data_mem_type])
                    // console.log(filetable)
                    // filetable.addCellRenderer(new file_table());
                    document.getElementById(div_id + 'table_div').innerHTML = ''
                    document.getElementById(div_id + 'table_div').appendChild(filetable)
                    // 页脚渲染
                    const page_data = result["page"]
                    let next_class = ""
                    let preview_class = ""
                    const filetfoot = document.createElement('tfoot')
                    if (page * pagesize >= page_data["total"]) {
                        next_class = "disabled"
                    } else {
                        next_class = ""
                    }
                    if (page == "1") {
                        preview_class = "disabled"
                    } else {
                        preview_class = ""
                    }
                    const pagesize_json = {
                        "10": "",
                        "20": "",
                        "50": "",
                        "100": ""
                    }
                    pagesize_json[pagesize] = "selected"
                    filetfoot.innerHTML = `<div class="splunk-view splunk-paginator ndr_tfoot" id="audit_tfoot" style="display: block;">
                <span class="right-pagination-total">
                        共 ${page_data["total"]} 条
                    </span>
                <a class="${preview_class}" data-page="preview"  data-value="${data_mem_type}" total_count="${page_data["total"]}">« 上一页</a>
                <input class="inp inp-page" value="${page}" type="number" min="1" style="width:60px"  data-value="${data_mem_type}" total_count="${page_data["total"]}"/>
                <a class="${next_class}" data-page="next"  data-value="${data_mem_type}" total_count="${page_data["total"]}">下一页 »</a>
                <select class="select-pagesize" style="width:105px"  data-value="${data_mem_type}" total_count="${page_data["total"]}">
                    <option value="10" ${pagesize_json["10"]}>每页10行</option>
                    <option value="20" ${pagesize_json["20"]}>每页20行</option>
                    <option value="50" ${pagesize_json["50"]}>每页50行</option>
                    <option value="100" ${pagesize_json["100"]}>每页100行</option>
                </select>
                </div>`
                    document.getElementById(div_id + 'table_tfoot_div').innerHTML = ''
                    document.getElementById(div_id + 'table_tfoot_div').appendChild(filetfoot)
                },
                error: function (result) {
                    console.log(result);
                }
            });
        } else {
            $('#table_div').hide()
            $('#table_tfoot_div').hide()
        }


    }

    const file_total_list = {}
    function create_file_table(table_type, tb_th, res_data) {
        const filetable = document.createElement('table')
        const filethead = document.createElement('thead')
        const filetbody = document.createElement('tbody')
        const tb_data = res_data["records"]
        // console.log(tb_th)
        const filetr = document.createElement('tr')
        Object.keys(tb_th).forEach(function (key) {
            const fileth = document.createElement('th')
            if (tb_th[key] == "全选") {
                fileth.innerHTML = `<input type="checkbox" class="page_AllAssets" id="page_AllAssets" name="page_AllAssets">`
            } else if (tb_th[key] == "操作") {
                fileth.innerHTML = tb_th[key]
                fileth.classList.add("sticky_td");
            } else {
                fileth.innerHTML = tb_th[key]
            }
            fileth.style.width = tb_field_width[key]
            // fileth.setAttribute('style',"width:"+tb_field_width[key])
            fileth.setAttribute('data-value', tb_th[key])
            filetr.appendChild(fileth)
        })
        filethead.appendChild(filetr)

        tb_data.forEach(function (data_item) {
            const filetr2 = document.createElement('tr')
            Object.keys(tb_th).forEach(function (key) {
                const filetd = document.createElement('td')
                // console.log(table_type)
                try {
                    if (tb_th[key] == "操作") {
                        filetd.classList.add("sticky_td");
                    }
                    if (key == "id" && (table_type == "系统漏洞" || table_type == "情报漏洞" || table_type == "POC漏洞")) {
                        if (data_item["status"] == "fixed") {
                            filetd.innerHTML = `<div style="text-align:left;" ><a class="btn-topsek-detail" data-value="${table_type}" rule_id="${data_item[key]}" >查看</a> <span class="review_vuln_span" style="color:#c3cbd4" dev_ip="${data_item["dev_ip"]}" family_name="${data_item["family_name"]}" plugin_id="${data_item["plugin_id"]}" vuln_name="${data_item["vuln_name"]}">核查</span></div>`
                        } else {
                            filetd.innerHTML = `<div style="text-align:left;" ><a class="btn-topsek-detail" data-value="${table_type}" rule_id="${data_item[key]}" >查看</a> <a class="review_vuln_a" dev_ip="${data_item["dev_ip"]}" family_name="${data_item["family_name"]}" plugin_id="${data_item["plugin_id"]}" vuln_name="${data_item["vuln_name"]}">核查</a></div>`
                        }
                    } else if (key == "id") {

                        filetd.className = 'static-col sticky_td'
                        file_total_list[data_item[key]] = data_item
                        filetd.innerHTML = `<div style="text-align:left;" ><a class="btn-topsek-detail" data-value="${table_type}" rule_id="${data_item[key]}" >查看</a></div>`
                        data_mem[table_type][data_item[key]] = data_item
                    } else if (key == "file_id") {
                        filetd.className = 'static-col sticky_td'
                        filetd.innerHTML = `<div style="text-align:left;" ><a class="btn-topsek-download" title="点击下载文件" file_name="${data_item["filename"]}" file_id="${data_item[key]}" >下载<i class="fa fa-download"></i></a></div>`
                    } else if (key == "eventb_uuid") {
                        filetd.innerHTML = `<div style="text-align:left;" ><a class="btn-topsek-detail" data-value="${table_type}" rule_id="${data_item[key]}" >查看</a> <a class="risk_dispose" rule_id="${data_item[key]}">处置</a></div>`
                    } else if (key == "vuln_name") {
                        filetd.innerHTML = `<div class="source_data_div" data_type="${key}" info="${data_item[key]}"  title='描述：\n` + bian(data_item["description"]) + `\n解决建议:\n${bian(data_item["solution"])}'><a class="asset_detail" data_type="${data_mem_type}" info="${data_item[key]}" vuln_id="${data_item["id"]}">${data_item[key]}</a></div>`
                    } else if (key == "bulk_edit") {
                        filetd.innerHTML = `<input type="checkbox" class="bulk_edit_assets"  name="bulk_edit_assets" value="${data_item["id"]}" dev_ip="${data_item["dev_ip"]}" family_name="${data_item["family_name"]}" plugin_id="${data_item["plugin_id"]}" vuln_name="${data_item["vuln_name"]}">`


                    } else if (["first_time", 'fire_time'].indexOf(key) > -1) {
                        filetd.innerHTML = key != "fire_time" ? timestampToTime(data_item[key]) : timestampToTime(parseInt(data_item[key]) / 1000);
                    } else if (key == "status") {
                        if (data_mem_type == "review") {
                            if (data_item[key] == "核查中") {
                                filetd.innerHTML = `<i class="fa fa-spinner fa-spin"></i>` + data_item[key]
                            } else {
                                filetd.innerHTML = `<i class="fa fa-check"></i>` + data_item[key]
                            }
                        } else {
                            var status = data_mem["status"][data_item[key]]
                            filetd.innerHTML = status == undefined ? data_item[key] : status;
                        }

                    } else if (key == "data_source") {
                        let htmlstr = '';
                        $.each(data_item[key], function (key, value) {
                            htmlstr += '<span style="display: inline-block;float: left; position:relative;background-color:#0073e7" class="radius_div2 blue">' + value + '</span> '
                        })
                        filetd.innerHTML = htmlstr
                    } else {
                        try {
                            if (key in data_item) {
                                if (data_mem[table_type]["fields_dict"] != undefined && key in data_mem[table_type]["fields_dict"]) {
                                    filetd.innerHTML = data_mem[table_type]["fields_dict"][key][data_item[key]]
                                } else {
                                    filetd.innerHTML = data_item[key]
                                }

                            } else {
                                filetd.innerHTML = `<div style="display: inline-block;float: left; position:relative" class="radius_div2 grey">-</div>`
                            }
                        } catch (err) {
                            console.log(err)
                            console.log(key)
                            console.log(data_item)
                        }
                    }
                } catch (err) {
                    console.log(err)
                }

                filetr2.appendChild(filetd)
            })
            filetbody.appendChild(filetr2)
        })
        filetable.appendChild(filethead)
        filetable.appendChild(filetbody)
        filetable.classList.add("table");
        filetable.classList.add("table-striped");
        filetable.classList.add("table-hover");
        // console.log(filetable)
        return filetable
    }


    // 查看详情
    $(document).on('click', '.btn-topsek-detail', function () {
        const rule_id = $(this).attr('rule_id')
        const data_type = $(this).attr('data-type')
        const data_value = $(this).attr('data-value')
        switch (data_type) {
            case data_type = "IP资产":
                window.open('asm_internal_ip_portrait?form.dev_ip=' + data_value)
                break
            case data_type = "内网域名":
                window.open('asm_internet_portrait?form.domain=' + data_mem[data_value][rule_id]["domain"])
                break
            case data_type = "互联网IP":
                window.open('asm_internet_ip_portrait?form.domain=' + data_mem[data_value][rule_id]["dev_ip"])
                break
            case data_type = "互联网域名":
                window.open('asm_internet_domain_portrait?form.domain=' + data_mem[data_value][rule_id]["domain"])
                break
            case data_type = "所属业务":
                window.open('asm_business_portrait?form.bus_name=' + rule_id)
                break
            case data_type = "URL/API":
                window.open('ndr_api_portrait_v2?form.api=' + rule_id)
                break
            case data_type = "POC漏洞":
                window.open('asm_hostvuln_portrait?hideEdit=true&hideTitle=true&hideFilters=true&form.vuln_id=' + rule_id)
                break
            case data_type = "系统漏洞":
                window.open('asm_hostvuln_portrait?hideEdit=true&hideTitle=true&hideFilters=true&form.vuln_id=' + rule_id)
                break
            case "内部威胁": case "外部入侵":
                console.log(data_mem[data_mem_type])
                $.each(data_mem[data_mem_type]['records'], function (idx, value) {
                    console.log(value['eventb_uuid'])
                    if (value['eventb_uuid'] == rule_id) {
                        console.log(value['eventb_uuid'])
                        window.open(`cmsoc_newalert_portrait?hideTitle=true&hideEdit=true&hideFilters=true&form.index_name=${value['_index']}&form.src_ip=${value["src_ip"]}&form.dst_ip=${value['dst_ip']}&form.uuid=${value['eventb_uuid']}&form.alert_name=${value['alert_name']}&form.time.earliest=0&form.time.latest=now`)
                        return false;
                    }
                })
                break
            default:
                break
        }


    })

    // 跳转画像
    $(document).on('click', '.asset_detail', function () {
        const data_value = $(this).attr("data_type")
        switch (data_value) {
            case "org_name":
                window.open('asm_org_portrait?form.org_name=' + $(this).attr('info'))
                break
            case "bus_name":
                window.open('asm_business_portrait?form.bus_name=' + $(this).attr('info'))
                break
            case "dev_ip":
                window.open('asm_intranet_portrait?hideEdit=true&hideTitle=true&hideFilters=true&form.dev_ip=' + $(this).attr('info'))
                break
            case "domain":
                window.open('asm_internet_portrait?hideEdit=true&hideTitle=true&hideFilters=true&form.domain=' + $(this).attr('info'))
                break
            case "系统漏洞":
                window.open('asm_hostvuln_portrait?hideEdit=true&hideTitle=true&hideFilters=true&form.vuln_id=' + $(this).attr('vuln_id'))
                break
            case "情报漏洞":
                window.open('asm_hostvuln_portrait?hideEdit=true&hideTitle=true&hideFilters=true&form.vuln_id=' + $(this).attr('vuln_id'))
                break
            case "POC漏洞":
                window.open('asm_hostvuln_portrait?hideEdit=true&hideTitle=true&hideFilters=true&form.vuln_id=' + $(this).attr('vuln_id'))
                break
            case "应用漏洞":
                window.open('asm_appvuln_portrait?hideEdit=true&hideTitle=true&hideFilters=true&form.vuln_id=' + $(this).attr('vuln_id'))
                break
            case "domain_ip":
                window.open('asm_internet_ip_portrait?hideEdit=true&hideTitle=true&hideFilters=true&form.domain=' + $(this).attr('info'))
                break
            default:
                break
        }

    })

    // 联系人 弹窗
    $(document).on('click', '.btn-topsek-contact', function () {
        const user_id = $(this).attr('data-value')
        showModal({
            title: "联系人信息",
            size: 50,
            body: `<div class="" style="overflow: auto;padding: 2rem; max-height: 36rem;">
                        <table style="width:100%">
                            <tr>
                                <td class="menu_td_label">账号：</td>
                                <td class="menu_td_value">
                                    <span class="span-api-info" data-type="contact" data-value="account"/>
                                </td>
                                <td class="menu_td_label">全名：</td>
                                <td class="menu_td_value">
                                    <span class="span-api-info" data-type="contact" data-value="name"/>
                                </td>
                                <td class="menu_td_label">角色：</td>
                                <td class="menu_td_value">
                                    <span class="span-api-info" data-type="contact" data-value="task_role"/>
                                </td>
                            </tr>
                            <tr>
                                <td class="menu_td_label">业务：</td>
                                <td class="menu_td_value">
                                    <span class="span-api-info" data-type="contact" data-value="business"/>
                                </td>
                                <td class="menu_td_label">部门：</td>
                                <td class="menu_td_value">
                                    <span class="span-api-info" data-type="contact" data-value="department"/>
                                </td>
                                
                                <td class="menu_td_label">区域：</td>
                                <td class="menu_td_value">
                                    <span class="span-api-info" data-type="contact" data-value="zone"/>
                                </td>
                            </tr>
                            <tr>
                                <td class="menu_td_label">邮箱：</td>
                                <td class="menu_td_value">
                                    <span class="span-api-info" data-type="contact" data-value="email"/>
                                </td>
                                <td class="menu_td_label">手机号：</td>
                                <td class="menu_td_value">
                                    <span class="span-api-info" data-type="contact" data-value="mobile"/>
                                </td>
                                
                            </tr>
                        </table>
                    </div>`,
            actions: [{
                onClick: function () { $(".modal").modal('hide'); },
                label: "返回"
            }]

        });
        console.log(data_mem["联系人"])
        const user_list = get_user_list()
        $.each(user_list[user_id], function (key, value) {
            $('.span-api-info[data-type="contact"][data-value="' + key + '"]').html(value)
        })
    })

    // 相关文件 弹窗
    $(document).on('click', '.btn-topsek-file', function () {
        let task_id = $(this).attr('data-value')
        showModal({
            title: "相关文件",
            size: 50,
            body: `<div class="" style="overflow: auto;padding: 1rem; max-height: 30rem;">
                        <div id="file_filter_div" />
                        <div id="file_table_div" />
                        <div id="file_table_tfoot_div" style="float: right;" />
                    </div>`,
            actions: [{
                onClick: function () { $(".modal").modal('hide'); },
                label: "返回"
            }]

        });
        data_mem_type = "相关文件"
        load_table(1, 10, data_mem["相关文件"]["api_filter"], "file_")
    })

    // 导出模块
    $(document).on('click', '.btn-topsek-download', function () {
        const file_name = $(this).attr('file_name')
        const file_id = $(this).attr('file_id')
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            // url: "/ndrapi/rules/match/tag/strategy/info/",//url
            // url: "/asmapi/asm/assets/database/info/",
            url: "/tmsapi/downloadfile/" + file_id,
            data: {},
            headers: tmsheaders,
            success: function (result) {
                // console.log(result);

                const blob = new Blob(['\uFEFF' + result], { type: "application/octet-stream" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", file_name);
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            error: function (result) {
                console.log(result);
            }
        });
    })



    // 渲染导出窗口的列名input
    function custom_multipleDown(default_list, total_list) {
        $('#line_box').empty();
        //显示当前显示的列名
        $.each(default_list, function (index, val) {
            $('#line_box').append(`
              <div class="line_div">
                <div class="line_single">
                  <div class="line_value">${val}</div>
                  <div class="line_delete">x</div>
                </div>
              </div>`)
            $('#select_fields_list ul').empty();
            $.each(total_list, function (index, val) {
                if (default_list.indexOf(val[0]) > -1) {
                    $('#select_fields_list ul').append(`<li data-value="${val[0]}" style="display:none">${val[0]}</li>`)
                } else {
                    $('#select_fields_list ul').append(`<li data-value="${val[0]}">${val[0]}</li>`)
                }
            })
            if (index == default_list.length - 1) {
                var drag_drop = require("splunkjs/mvc/drag_drop")
                let new_drag_drop = new drag_drop()
            }
        })

        $(document).off('click', '.line_delete').on('click', '.line_delete', function (e) {
            e.stopPropagation();
            var curr_val = $(this).prev('.line_value').text();
            $(this).parent().parent().remove();
            $(`#select_fields_list li[data-value="${curr_val}"]`).show();
            $('#select_fields_list').show();
            $('#line_box').css({ "box-shadow": "rgb(255, 255, 255) 0px 0px 2px 1px inset, rgb(0, 164, 253) 0px 0px 0px 2px inset" })
        })

        //点击其它区域隐藏列名选择栏
        $(document).click(function () {
            $('#select_fields_list').hide();
            $('#line_box').css({ "box-shadow": "unset" })
        })
        //点击列出列名选择栏
        $(document).on('click', '#line_box', function (e) {
            e.stopPropagation();
            $('#select_fields_list').show();
            $(this).css({ "box-shadow": "rgb(255, 255, 255) 0px 0px 2px 1px inset, rgb(0, 164, 253) 0px 0px 0px 2px inset" })
        })
        //点击选择列名
        $(document).off('click', '#select_fields_list li').on('click', '#select_fields_list li', function (e) {
            e.stopPropagation();
            var curr_line = $(this).text();
            $(this).hide();
            $('#line_box').append(`
              <div class="line_div">
                <div class="line_single">
                  <div class="line_value">${curr_line}</div>
                  <div class="line_delete">x</div>
                </div>
              </div>`)
        })
    }



    // 展开隐藏效果渲染
    $(document).ready(function () {
        $('.fa-angle-down').hide();
        $('.fa-angle-up').show();
        $('.fa-angle-down').click(function () {
            $('.fa-angle-down[data-value="' + $(this).attr('data-value') + '"]').hide();
            $('.fa-angle-up[data-value="' + $(this).attr('data-value') + '"]').show();
            $('.timeline-small-body').css("height", "calc(37rem - " + $('.business_detail_div[data-value="' + $(this).attr('data-value') + '"]').height() + "px)")
            // $('#tabs').css("height","calc(37rem - "+$('.business_detail_div[data-value="' + $(this).attr('data-value') + '"]').height()+"px)")
            // $('#tabs').css("margin-top", "250px")
            // console.log($(this).attr('data-value'))
            // console.log("calc(37rem - "+$('.business_detail_div[data-value="' + $(this).attr('data-value') + '"]').height()+"px)")
            // console.log($('.timeline-small-body').css("height"))
            $('.business_detail_div[data-value="' + $(this).attr('data-value') + '"]').slideDown(); // 显示下一行
        });
        $('.fa-angle-down').click()
        $('.fa-angle-up').click(function () {
            $('.fa-angle-down[data-value="' + $(this).attr('data-value') + '"]').show();
            $('.fa-angle-up[data-value="' + $(this).attr('data-value') + '"]').hide();
            $('.business_detail_div[data-value="' + $(this).attr('data-value') + '"]').slideUp();
            $('.timeline-small-body').css("height", "calc(37rem - 0px)")
            // $('#tabs').css("height","calc(37rem - 0px)")
            // $('#tabs').css("margin-top", "250px")
            // console.log($('.timeline-small-body').css("height"))
        });
    });

    // 编辑 按钮
    $(document).on('click', '.btn-topsek-edit', function () {

        // rule_id = $(this).attr('rule_id')
        // rule_json = get_rule_json(rule_id)
        const rule_json = data_mem["资产信息"]
        const rule_id = rule_json["id"]
        console.log(rule_json)
        const showmodal_body = ""
        showModal({
            title: "编辑资产",
            size: 80,
            body: showmodal_body,
            actions: [{
                onClick: function () {
                    $('.modal').one('hidden.bs.modal', function () {
                        const patch_data = {}
                        $.each($('.un-topsek-value'), function () {
                            patch_data[$(this).attr('value-key-en')] = $(this).val()
                        })
                        if (patch_data["dev_ipv6"] == "") {
                            delete patch_data["dev_ipv6"]
                        }
                        console.log(patch_data)
                        $.ajax({
                            //几个参数需要注意一下
                            type: "PATCH",//方法类型
                            url: "/asmapi/asm/assets/internal/" + rule_id + "/",//url
                            data: JSON.stringify(patch_data),
                            headers: postheaders,
                            success: function (result) {
                                console.log("保存成功");
                                console.log(result);
                                load_api_info()
                            },
                            error: function (result) {
                                console.log(result);
                            }
                        });
                    }).modal('hide');
                },
                // cssClass: 'btn-primary',
                cssClass: 'btn-horizon',
                label: "保存"
            }, {
                onClick: function () { $(".modal").modal('hide'); },
                label: "取消"
            }]

        });

        // 渲染组织，业务，设备类型，设备子类，部门，信创
        const org_list = get_org_list()
        $('.un-topsek-value[value-key-en="org_name"]').html('')
        $.each(org_list, function (key, item) {
            $('.un-topsek-value[value-key-en="org_name"]').append(`<option label="${item["org_name"]}" value="${item["org_name"]}"></option>`)
        })

        const bus_list = get_bus_list()
        $('.un-topsek-value[value-key-en="bus_name"]').html('')
        $.each(bus_list, function (key, item) {
            $('.un-topsek-value[value-key-en="bus_name"]').append(`<option label="${item["bus_name"]}" value="${item["bus_name"]}"></option>`)
        })

        $('.un-topsek-value[value-key-en="is_xc"]').html('')
        $('.un-topsek-value[value-key-en="is_xc"]').append(`<option label="是" value="是"></option><option label="否" value="否"></option>`)

        const depart_list = get_depart_list()
        $('.un-topsek-value[value-key-en="department"]').html('')
        $.each(depart_list, function (key, item) {
            $('.un-topsek-value[value-key-en="department"]').append(`<option label="${item["department"]}" value="${item["department"]}"></option>`)
        })

        let dev_type_list = get_dev_type_list()
        let dev_type_id = 1
        // 获取设备类型字典id
        Object.keys(dev_type_list).forEach(function (key) {
            // console.log(bus_list["records"])
            if (dev_type_list[key]["key"] == "dev_type" && dev_type_list[key]["parent_id"] == null) {
                dev_type_id = dev_type_list[key]["id"]
            }
        })
        dev_type_list = get_dev_type_list(dev_type_id)
        // 获取设备类型清单与对应id
        const dev_type_id_list = []
        $.each(dev_type_list, function (key, item) {
            // console.log(bus_list["records"])
            $('.un-topsek-value[value-key-en="dev_type"]').append(`<option label="${item["key"]}" value="${item["value"]}"></option>`)
            dev_type_id_list.push(dev_type_list[key]["id"])
        })
        // 获取设备子类清单
        $.each(dev_type_id_list, function (key, type_id) {
            const dev_class_list = get_dev_type_list(type_id)
            $.each(dev_class_list, function (key, item) {
                // console.log(bus_list["records"])
                $('.un-topsek-value[value-key-en="dev_class"]').append(`<option label="${item["key"]}" value="${item["value"]}"></option>`)
            })
        })

        $('.un-topsek-value[value-key-en="dev_ip"]').prop("disabled", true)


        $.each(rule_json, function (key, value) {
            $('.un-topsek-value[value-key-en="' + key + '"]').val(value)
        })
    })

    // 处置状态变化时变化填报内容
    $(document).on('change', '.disposal-topsek-value[data-value="event_type"]', function () {
        $('.disposal-tr ').hide()
        if ($(this).val() == "处置记录") {
            $('.disposal-topsek-tr').show()
        } else if ($(this).val() == "文件上传") {
            $('.upload-topsek-tr').show()
        } else {
            $('.task-topsek-tr').show()
        }

    })

    // 处置弹窗
    $(document).on('click', '.btn-topsek-disposal', function () {
        if ($(this).attr('disabled') == undefined) {
            const product = $(this).attr('data-value')
            const event_type = $(this).attr('data-type')
            let asset_id = $(this).attr('rule_id')
            asset_id = api_value
            const task_json = data_mem["资产信息"]
            console.log(task_json)
            showModal({
                title: "工单处置",
                size: 50,
                body: `<div class="" style="overflow: auto;padding: 2rem; max-height: 36rem;">
                        <table style="width:100%">
                        <tr class="disposal-tr action-topsek-tr"  >
                            <td>处置动作:</td><td><select type="text" class="disposal-topsek-value" data-value="event_type" style="">
                                <option label="处置记录" value="处置记录"></option>
                                <option label="文件上传" value="文件上传"></option>
                                <option label="工单流转" value="工单流转"></option>
                            </select></td>
                        </tr>
                        <tr class="disposal-tr disposal-topsek-tr-fake"  >
                            <td>处置状态:</td><td><select type="text" class="disposal-topsek-value" data-value="status" style="">
                                <option label="已认领" value="已认领"></option>
                                <option label="处理中" value="处理中"></option>
                                <option label="已完成" value="已完成"></option>
                                <option label="已关闭" value="已关闭"></option>
                                <option label="未通过" value="未通过"></option>
                            </select></td>
                        </tr>
                        <tr class="disposal-tr task-topsek-tr" style="display:none">
                            <td>指派给:</td><td><select type="text" class="task-topsek-value" data-value="department" style=""></select><select type="text" class="task-topsek-value" data-value="username" style=""></select></td>
                        </tr>
                        <tr class="disposal-tr upload-topsek-tr" style="display:none">
                            <td>上传文件:</td><td><input id='upload' type='file' style='width: 180px;' class='ce_file_upload_input'/></td>
                        </tr>
                        <tr>
                            <td>处置内容:</td><td><textarea type="text" class="disposal-topsek-value" data-value="description" style="height: 62px;width:100%"></textarea></td>
                        </tr>
                        
                        </table>
                    </div>`,
                actions: [{
                    onClick: function () {

                        if ($('.disposal-topsek-value[data-value="description"]').val() != "" && $('.disposal-topsek-value[data-value="description"]').val() != undefined && $('.disposal-topsek-value[data-value="description"]').val() != null) {
                            if ($('.disposal-topsek-value[data-value="event_type"]').val() == "处置记录") {
                                if (task_json["status"] != $('.disposal-topsek-value[data-value="status"]').val()) {
                                    let old_disposal_status = "待确认"
                                    if (task_json["status"] != null) {
                                        old_disposal_status = task_json["status"]
                                    } else {
                                        old_disposal_status = "待确认"
                                    }
                                    // 处置状态变更
                                    $.ajax({
                                        //几个参数需要注意一下
                                        type: "POST",//方法类型
                                        url: "/tmsapi/audit/task/",//url
                                        data: JSON.stringify({
                                            "data_source": ["人工操作"],
                                            "event_name": "处置状态变更",
                                            "event_type": "状态变更",
                                            "operator": username,
                                            "description": "经人工判定，该任务状态由" + old_disposal_status + "转为" + $('.disposal-topsek-value[data-value="status"]').val(),
                                            "result": { "status": $('.disposal-topsek-value[data-value="status"]').val() },
                                            "product": product,
                                            "task_id": asset_id,
                                            "task_config_id": task_json["task_id"]
                                        }),
                                        async: false,
                                        headers: tmspostheaders,
                                        success: function (result) {
                                            console.log(result)
                                            // $(".modal").modal('hide');
                                        },
                                        error: function (result) {
                                            console.log(result);
                                        }
                                    });
                                    // 更新任务状态
                                    const patch_data={
                                            "status": $('.disposal-topsek-value[data-value="status"]').val()
                                        }
                                    if($('.disposal-topsek-value[data-value="status"]').val()=="已认领"){
                                        patch_data["user_name"]=username
                                    }
                                    $.ajax({
                                        //几个参数需要注意一下
                                        type: "PATCH",//方法类型
                                        url: data_mem["任务工单"]["url"] + asset_id,//url
                                        data: JSON.stringify(patch_data),
                                        async: false,
                                        headers: tmspostheaders,
                                        success: function () {
                                            load_api_info()
                                            // $(".modal").modal('hide');
                                        },
                                        error: function (result) {
                                            console.log(result);
                                        }
                                    });
                                }
                                $.ajax({
                                    //几个参数需要注意一下
                                    type: "POST",//方法类型
                                    url: "/tmsapi/audit/task/",//url
                                    data: JSON.stringify({
                                        "data_source": ["人工操作"],
                                        "event_name": "工单处置",
                                        "event_type": "处置记录",
                                        "operator": username,
                                        "description": $('.disposal-topsek-value[data-value="description"]').val(),
                                        "result": { "dev_owner": username },
                                        "product": product,
                                        "task_id": asset_id,
                                        "task_config_id": task_json["task_id"]
                                    }),
                                    headers: tmspostheaders,
                                    success: function (result) {
                                        console.log(result)
                                        $(".modal").modal('hide');
                                        load_api_info()
                                    },
                                    error: function (result) {
                                        console.log(result);
                                    }
                                });
                            } else if ($('.disposal-topsek-value[data-value="event_type"]').val() == "工单流转") {
                                $.ajax({
                                    //几个参数需要注意一下
                                    type: "POST",//方法类型
                                    url: "/tmsapi/audit/task/",//url
                                    data: JSON.stringify({
                                        "data_source": ["人工操作"],
                                        "event_name": "工单流转",
                                        "event_type": "处置记录",
                                        "operator": $('.task-topsek-value[data-value="username"]').val(),
                                        "description": "经人工判定后，工单由" + username + "流转给" + $('.task-topsek-value[data-value="username"]').val() + ",处置内容：" + $('.disposal-topsek-value[data-value="description"]').val(),
                                        "result": { "dev_owner": $('.task-topsek-value[data-value="username"]').val() },
                                        "product": product,
                                        "task_id": asset_id,
                                        "task_config_id": task_json["task_id"]
                                    }),
                                    headers: tmspostheaders,
                                    success: function (result) {
                                        console.log(result)
                                        $(".modal").modal('hide');
                                    },
                                    error: function (result) {
                                        console.log(result);
                                    }
                                });
                                // 更新任务负责人
                                $.ajax({
                                    //几个参数需要注意一下
                                    type: "PATCH",//方法类型
                                    url: data_mem["任务工单"]["url"] + asset_id,//url
                                    data: JSON.stringify({
                                        "user_name": $('.task-topsek-value[data-value="username"]').val()
                                    }),
                                    async: false,
                                    headers: tmspostheaders,
                                    success: function () {

                                        // $(".modal").modal('hide');
                                    },
                                    error: function (result) {
                                        console.log(result);
                                    }
                                });
                                // 判断联系人中是否存在，不存在则添加到联系人
                                if ($('option[value="' + $('.task-topsek-value[data-value="username"]').val() + '"]').attr('user_id') in data_mem["联系人"]) {
                                    console.log("联系人已存在，不做操作")
                                    load_api_info()
                                } else {
                                    console.log("联系人不存在，开始添加联系人")
                                    $.ajax({
                                        //几个参数需要注意一下
                                        type: "POST",//方法类型
                                        url: data_mem["联系人"]["url"],//url
                                        data: JSON.stringify({
                                            "task_id": asset_id,
                                            "user_id": $('option[value="' + $('.task-topsek-value[data-value="username"]').val() + '"]').attr('user_id')
                                        }),
                                        async: false,
                                        headers: tmspostheaders,
                                        success: function () {
                                            load_api_info()
                                            // $(".modal").modal('hide');
                                        },
                                        error: function (result) {
                                            console.log(result);
                                        }
                                    });
                                }
                            } else if ($('.disposal-topsek-value[data-value="event_type"]').val() == "文件上传") {
                                var file = $('.ce_file_upload_input')[0].files[0];
                                var reader = new FileReader();
                                reader.onloadend = function () {
                                    var upFileB64 = reader.result;
                                    const fullPath = $('.ce_file_upload_input')[0].value;
                                    console.log('Full path:', fullPath);
                                    // showTreePaneSpinner();
                                    var filetype = ".txt,.doc,.docx,.pdf";
                                    var path1 = file.name.split(".");
                                    var path2 = path1[path1.length - 1].toLowerCase()
                                    if (path2) {
                                        console.log('Full path:', fullPath);
                                        const form = new FormData();
                                        form.append("file", file);
                                        $.ajax({
                                            //几个参数需要注意一下
                                            type: "POST",//方法类型
                                            url: "/tmsapi/uploadfile/",//url
                                            data: form,
                                            headers: tmsheaders,
                                            processData: false,
                                            contentType: false,
                                            mimeType: "multipart/form-data",
                                            success: function (result) {
                                                console.log("上传成功");
                                                console.log(result);
                                                result = $.parseJSON(result)
                                                const file_id = result["upload_time"] + "-" + result["filename"]
                                                const filename = result["filename"]
                                                $.ajax({
                                                    //几个参数需要注意一下
                                                    type: "POST",//方法类型
                                                    url: data_mem["相关文件"]["url"],//url
                                                    crossDomain: true,
                                                    data: JSON.stringify({
                                                        "filename": filename,
                                                        "create_time": timestampToTime(result["upload_time"]),
                                                        "file_id": file_id,
                                                        "task_id": asset_id
                                                    }),
                                                    headers: tmspostheaders,
                                                    success: function (result) {
                                                        console.log("绑定成功");
                                                        console.log(result);
                                                        $.ajax({
                                                            //几个参数需要注意一下
                                                            type: "POST",//方法类型
                                                            url: data_mem["处置记录"]["url"],//url
                                                            data: JSON.stringify({
                                                                "data_source": ["人工操作"],
                                                                "event_name": "工单处置",
                                                                "event_type": "文件上传",
                                                                "operator": username,
                                                                "description": $('.disposal-topsek-value[data-value="description"]').val(),
                                                                "result": { "dev_owner": username, "file_id": file_id, "file_name": filename },
                                                                "product": product,
                                                                "task_id": asset_id,
                                                                "task_config_id": task_json["task_id"]
                                                            }),
                                                            headers: tmspostheaders,
                                                            success: function (result) {
                                                                console.log(result)
                                                                $(".modal").modal('hide');
                                                                load_api_info()
                                                            },
                                                            error: function (result) {
                                                                console.log(result);
                                                            }
                                                        });
                                                    },
                                                    error: function (result) {
                                                        console.log(result);
                                                    }
                                                });
                                            },
                                            error: function (result) {
                                                console.log(result);
                                            }
                                        });
                                    }
                                    else {
                                        alert("请上传" + filetype + "格式的文件");
                                    }
                                }
                                reader.readAsDataURL(file);
                            }
                        }
                    },
                    cssClass: 'btn-horizon',
                    label: "保存"
                }, {
                    onClick: function () { $(".modal").modal('hide'); },
                    label: "返回"
                }]

            });
            if ($(this).attr('data-type') == "处置记录") {
                $('.disposal-topsek-value[data-value="status"]').val($(this).attr('data-status'))
            }

            $('.disposal-topsek-value[data-value="event_type"]').val(event_type)
            $('.disposal-topsek-value[data-value="event_type"]').change()
            $('.task-topsek-value[data-value="department"]').html('<option value="" label="请选择部门"></option>')
            const depart_list = get_depart_list()
            $.each(depart_list, function (key, item) {
                // console.log(item)
                $('.task-topsek-value[data-value="department"]').append('<option value="' + item["department"] + '" label="' + item["department"] + '"></option>')
            })

            $('.task-topsek-value[data-value="username"]').html('<option value="" label="请选择人员"></option>')
            const user_list = get_user_list()
            $.each(user_list, function (key, item) {
                // console.log(item)
                if (item["name"] == "" || item["name"] == null) {
                    item["name"] = item["account"]
                }
                $('.task-topsek-value[data-value="username"]').append('<option department="' + item["department"] + '" user_id="' + item["id"] + '" value="' + item["account"] + '" label="' + item["name"] + '"></option>')
            })
        }
    })

    // 工作日志填报
    $(document).on('click', '.btn-topsek-addnewjournal', function () {
        if ($(this).attr('disabled') == undefined) {
            const product = $(this).attr('data-value')
            const event_type = $(this).attr('data-type')
            const asset_id = api_value
            const task_json = data_mem["资产信息"]
            console.log(task_json)


            if ($('.task_journal').val() != "" && $('.task_journal').val() != undefined && $('.task_journal').val() != null) {
                if (task_json["status"] != "处理中" && task_json["status"] != "已完成" && task_json["status"] != "审核中" && task_json["status"] != "已关闭") {
                    let old_disposal_status = ""
                    if (task_json["status"] != null) {
                        old_disposal_status = task_json["status"]
                    } else {
                        old_disposal_status = "待确认"
                    }
                    // 处置状态变更
                    $.ajax({
                        //几个参数需要注意一下
                        type: "POST",//方法类型
                        url: "/tmsapi/audit/task/",//url
                        data: JSON.stringify({
                            "data_source": ["人工操作"],
                            "event_name": "处置状态变更",
                            "event_type": "状态变更",
                            "operator": username,
                            "description": "经人工判定，该任务状态由" + old_disposal_status + "转为 处理中",
                            "result": { "status": "处理中" },
                            "product": product,
                            "task_id": asset_id,
                            "task_config_id": task_json["task_id"]
                        }),
                        async: false,
                        headers: tmspostheaders,
                        success: function (result) {
                            console.log(result)
                            // $(".modal").modal('hide');
                        },
                        error: function (result) {
                            console.log(result);
                        }
                    });
                    // 更新任务状态
                    $.ajax({
                        //几个参数需要注意一下
                        type: "PATCH",//方法类型
                        url: data_mem["任务工单"]["url"] + asset_id,//url
                        data: JSON.stringify({
                            "status": $('.disposal-topsek-value[data-value="status"]').val()
                        }),
                        async: false,
                        headers: tmspostheaders,
                        success: function () {
                            load_api_info()
                            // $(".modal").modal('hide');
                        },
                        error: function (result) {
                            console.log(result);
                        }
                    });
                } else if (task_json["status"] == "已完成" || task_json["status"] == "审核中") {
                    // 更新任务状态和审核人
                    $.ajax({
                        //几个参数需要注意一下
                        type: "PATCH",//方法类型
                        url: data_mem["任务工单"]["url"] + asset_id,//url
                        data: JSON.stringify({
                            "status": "审核中",
                            "reviewer": username

                        }),
                        async: false,
                        headers: tmspostheaders,
                        success: function () {
                            load_api_info()
                            // $(".modal").modal('hide');
                        },
                        error: function (result) {
                            console.log(result);
                        }
                    });
                }
                $.ajax({
                    //几个参数需要注意一下
                    type: "POST",//方法类型
                    url: "/tmsapi/audit/task/",//url
                    data: JSON.stringify({
                        "data_source": ["人工操作"],
                        "event_name": "工单处置",
                        "event_type": "处置记录",
                        "operator": username,
                        "description": $('.task_journal').val(),
                        "result": { "dev_owner": username },
                        "product": product,
                        "task_id": asset_id,
                        "task_config_id": task_json["task_id"]
                    }),
                    headers: tmspostheaders,
                    success: function (result) {
                        console.log(result)
                        $(".modal").modal('hide');
                        confirm("提交工作日志成功")
                        load_api_info()

                    },
                    error: function (result) {
                        console.log(result);
                    }
                });
            }
        }
    })



    // 渲染动态字段
    function render_dynamic_fields() {
        // dynamic_dict = get_dynamic_dict()
        var return_data
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: "/asmapi/asm/dynameic/assets/table/info/?table_name=asm_assets_info",//url
            data: {},
            headers: {
                "Authorization": "e14bd6ed13e908495ab52be3648fa2b0",
                "Content-Type": "application/json"
            },
            async: false,
            success: function (result) {
                console.log(result["records"])
                return_data = result["records"]
            },
            error: function (result) {
                console.log(result);
                confirm("发生异常，原因：渲染动态字段失败，请联系管理员")
            }
        });
        return return_data
    }

    // 获取用户清单
    function get_reviewer_list() {
        var user_list = {}
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: "/tmsapi/reviewer",//url
            data: {},
            async: false,
            headers: tmsheaders,
            success: function (result) {
                console.log(result)
                // user_list = result["records"]
                $.each(result["records"], function (key, item) {
                    user_list[item["account"]] = item
                })
            },
            error: function (result) {
                console.log(result);
            }
        });
        return user_list
    }

    // 获取用户清单
    function get_user_list() {
        var user_list = {}
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: "/tmsapi/user/list/",//url
            data: {},
            async: false,
            headers: tmsheaders,
            success: function (result) {
                console.log(result)
                // user_list = result["records"]
                $.each(result["records"], function (key, item) {
                    user_list[item["id"]] = item
                })
            },
            error: function (result) {
                console.log(result);
            }
        });
        return user_list
    }

    // 获取组织清单
    function get_org_list() {
        var org_list
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: "/asmapi/asm/assets/orgs/",//url
            data: {
                "page": 1,
                "pageSize": 10000
            },
            async: false,
            headers: headers,
            success: function (result) {
                org_list = result["records"]
            },
            error: function (result) {
                console.log(result);
            }
        });
        return org_list
    }
    // 获取业务清单
    function get_bus_list() {
        var bus_list
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: "/asmapi/asm/assets/business/",//url
            data: {
                "page": 1,
                "pageSize": 10000
            },
            async: false,
            headers: headers,
            success: function (result) {
                bus_list = result["records"]
            },
            error: function (result) {
                console.log(result);
            }
        });
        return bus_list
    }

    // 获取部门清单
    function get_depart_list() {
        var depart_list
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: "/asmapi/asm/assets/department/",//url
            data: {
                "page": 1,
                "pageSize": 10000
            },
            async: false,
            headers: headers,
            success: function (result) {
                depart_list = result["records"]
            },
            error: function (result) {
                console.log(result);
            }
        });
        return depart_list
    }

    // 部门变化时，用户列表变化
    $(document).on('change', '.task-topsek-value[data-value="department"]', function () {
        $('.task-topsek-value[data-value="username"]').val('')
        $('.task-topsek-value[data-value="username"] option').hide()
        if ($(this).val() == "") {
            $('.task-topsek-value[data-value="username"] option').show()
        } else {
            $('.task-topsek-value[data-value="username"] option[department="' + $(this).val() + '"]').show()
        }

    })


    // 获取设备类型
    function get_dev_type_list(dictionary_id = null) {
        var dev_type_list
        let dictionary_url = "/tmsapi/data/dictionary"
        if (dictionary_id != null) {
            dictionary_url += "/" + dictionary_id
        }
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: dictionary_url,//url
            data: {
                "page": 1,
                "pageSize": 10000
            },
            async: false,
            headers: headers,
            success: function (result) {

                dev_type_list = result["records"]
            },
            error: function (result) {
                console.log(result);
            }
        });
        return dev_type_list
    }

    // 刷新表格
    function refresh_table(data_value, page, pagesize) {
        // load_table(page, pagesize, data_mem[data_mem_type]["api_filter"])
        switch (data_value) {
            case data_value = "review":
                load_review_table(page, pagesize, data_mem[data_mem_type]["api_filter"])
                break
            default:
                load_table(page, pagesize, data_mem[data_mem_type]["api_filter"])
                break
        }
    }

    // 页脚模块
    // ndr_tfoot
    // 上一页
    $(document).on('click', 'a[data-page="preview"]', function () {
        const data_value = $(this).attr("data-value")
        const now_page = $('.inp-page[data-value="' + data_value + '"]').val()
        const total_count = $(this).attr("total_count")
        const now_pagesize = $('.select-pagesize').val()
        if (now_page <= 1) {
            console.log("无效页码，无法翻页")
        } else (
            refresh_table(data_value, now_page - 1, now_pagesize)
        )

    })

    // 下一页
    $(document).on('click', 'a[data-page="next"]', function () {
        const data_value = $(this).attr("data-value")
        const now_page = $('.inp-page[data-value="' + data_value + '"]').val()
        const total_count = $(this).attr("total_count")
        const now_pagesize = $('.select-pagesize').val()
        if (now_page * now_pagesize >= total_count) {
            console.log("无效页码，无法翻页")
        } else (
            refresh_table(data_value, now_page - 1 + 2, now_pagesize)
        )

    })

    // 跳转页
    $(document).on('change', '.inp-page', function () {
        const data_value = $(this).attr("data-value")
        const now_page = $('.inp-page[data-value="' + data_value + '"]').val()
        const total_count = $(this).attr("total_count")
        const now_pagesize = $('.select-pagesize').val()
        console.log(now_page)
        console.log(now_pagesize)
        console.log(total_count)
        if (now_page * now_pagesize > total_count) {
            confirm("无效页码，无法翻页，即将返回首页")
            refresh_table(data_value, 1, now_pagesize)
        } else (
            refresh_table(data_value, now_page, now_pagesize)
        )

    })

    // 每页行数调整
    $(document).on('change', '.select-pagesize', function () {
        const data_value = $(this).attr("data-value")
        const now_page = $('.inp-page[data-value="' + data_value + '"]').val()
        const total_count = $(this).attr("total_count")
        const now_pagesize = $('.select-pagesize[data-value="' + data_value + '"]').val()
        refresh_table(data_value, 1, now_pagesize)
    })

    // 弹出框统一样式
    var showModal = function self(o) {
        var options = $.extend({
            title: '',
            body: '',
            remote: false,
            backdrop: true,
            size: 50,
            onShow: false,
            onHide: false,
            actions: false
        }, o);
        self.onShow = typeof options.onShow == 'function' ? options.onShow : function () { };
        self.onHide = typeof options.onHide == 'function' ? options.onHide : function () { };
        if (self.$modal === undefined) {
            self.$modal = $('<div class="modal fade"><div class="modal-dialog"><div class="modal-content"></div></div></div>').appendTo('body');
            self.$modal.on('shown.bs.modal', function (e) {
                self.onShow.call(this, e);
            });
            self.$modal.on('hidden.bs.modal', function (e) {
                self.onHide.call(this, e);
            });
        }
        self.$modal.css({ 'width': options.size + "px", 'margin-left': -1 * (options.size / 2) + "px" });
        self.$modal.css({ 'width': options.size + "%", 'margin-left': -1 * (options.size / 2) + "%", 'top': "20%" });
        self.$modal.data('bs.modal', false);
        self.$modal.find('.modal-dialog').removeClass().addClass('modal-dialog ');
        self.$modal.find('.modal-content').html('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">${title}</h4></div><div class="modal-body">${body}</div><div class="modal-footer"></div>'.replace('${title}', options.title).replace('${body}', options.body));

        var footer = self.$modal.find('.modal-footer');
        if (Object.prototype.toString.call(options.actions) == "[object Array]") {
            for (var i = 0, l = options.actions.length; i < l; i++) {
                options.actions[i].onClick = typeof options.actions[i].onClick == 'function' ? options.actions[i].onClick : function () { };
                $('<button type="button" class="btn ' + (options.actions[i].cssClass || '') + '">' + (options.actions[i].label || '{Label Missing!}') + '</button>').appendTo(footer).on('click', options.actions[i].onClick);
            }
        } else {
            $('<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>').appendTo(footer);
        }
        self.$modal.modal(options);
    };

    // unix时间转换
    function timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y + M + D + h + m + s;
    }

    // 处理带html的字符串
    function bian(a) { return new Option(a).innerHTML }


})
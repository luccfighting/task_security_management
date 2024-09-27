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
        mvc,
        TableView,
        SearchManager) {
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
    var sharedModels = require('splunkjs/mvc/sharedmodels')
    // 获取用户名和app信息
    var username = sharedModels.get("user").entry.get("name")
    var app_name = sharedModels.get("app").attributes.app
    // 获取会话信息
    var cookie_list = document.cookie.split(";")
    

    // $('#fieldset_div').html(create_input_view("org_name_filter_search","org_name_filter","").render().el)
    $.each($('.input_div'), function () {
        $(this).html(create_TextInputView_view($(this).attr('data-value')).render().el)
    })
    function create_TextInputView_view(token_value) {
        var create_view = new TextInputView({
            id: token_value + "-textinput",
            value: mvc.tokenSafe("$" + token_value + "$"),
            default: "*",
        });
        return create_view;
    }
    var tokensDefault = mvc.Components.get("default");
    var tokenschange_count = 1
    var tokensOld = tokensDefault["attributes"]
    var tokensNew = tokensOld
    tokensDefault.on('change', function (nodevalue) {
        tokensNew = tokensOld
        if (nodevalue["changed"] != {}) {
            tokensNew = $.extend({}, tokensNew, nodevalue["changed"]);
        }
        $.each(tokensNew, function (key, value) {
            if (key.split("form.").length == 2) {
                tokensNew[key.replace("form.", "")] = value
                delete tokensNew[key]
            }
            if (value == "" || value == "*") {
                delete tokensNew[key]
            }
        })

        if (JSON.stringify(tokensNew) != JSON.stringify(tokensOld)) {
            tokensOld = tokensNew
            data_mem_type = tokensDefault.get('form.data_mem_type')
            load_table(1, $('.select-pagesize').val(), update_filter())
        }

    })

    var session_headers = {
        // "Authorization": localStorage.getItem("esc_token")
        "Authorization": "mS7HzoN/XYNIgkLCHV3tsDPHbjBBJ9inOPLZhMXiJyg=",
        "content-type": "application/json"
    }
    var headers = {
        "Authorization": "mS7HzoN/XYNIgkLCHV3tsDPHbjBBJ9inOPLZhMXiJyg="
    }
    var postheaders = {
        "Authorization": "mS7HzoN/XYNIgkLCHV3tsDPHbjBBJ9inOPLZhMXiJyg=",
        "content-type": "application/json"
    }

    var data_mem = {
    }

    var batch_edit_assets = { //记录批量编辑的资产
        "IP视角": [],
        "网段视角": []
    }

    // 获取动态data_mem
    var curr_page = sharedModels.get("app").attributes.page
    load_data_mem()

    function load_data_mem() {
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            // url: "/ndrapi/rules/match/tag/strategy/info/",//url
            url: "/escapi/esc/page/data/" + curr_page,  //获取当前界面id，并拼接成api
            data: {},
            headers: {},
            async: false,
            success: function (result) {
                data_mem = result
            },
            error: function (result) {
                console.log(result);
            }
        });
    }

    console.log(data_mem)
    //点击切换显示
    try {
        $(document).on('click', '.toggle-tab', function () {
            $('.toggle-tab').each(function () {
                $(this).parent('li').removeClass('active')
                $.each($(this).attr('data-elements').split(","), function (key, value) {
                    $('#' + value).hide()
                })
            })
            $(this).parent('li').addClass('active')
            $.each($(this).attr('data-elements').split(","), function (key, value) {
                $('#' + value).show()
            })
            data_mem_type = $('.active').children('a').attr('tab_type')
            if (data_mem_type == "IP视角") {
                $('.btn-review-list').show()
                $('.btn-review-all').show()
            } else {
                $('.btn-review-list').hide()
                $('.btn-review-all').hide()
            }
            load_statscount()
            load_table(1, 10, update_filter())
        })
        $('.active .toggle-tab').click()
    } catch (err) {
        console.log(err)
    }
    var data_mem_type

    // 需要做高度限制
    var table_tbody_dict = ["IP视角", "服务端口", "软件组件", "域名资产"]

    // 获取特定data数据
    function get_rule_json(rule_id) {
        var return_data = {}
        // console.log(data_mem[data_mem_type])
        $.each(data_mem[data_mem_type]["records"], function (key, item) {
            // console.log(item)
            // console.log(String(item["id"]))
            // console.log(String(rule_id))
            if (String(item["id"]) == String(rule_id)) {
                return_data = item
            }
        })
        // console.log(return_data)
        return return_data
    }
    // 加载清单
    // 获取当前active tab
    // data_mem_type = $('.active').children('a').attr('tab_type')
    data_mem_type = tokensDefault.get('form.data_mem_type')
    $.each($('.toggle-tab'), function () {
        if ($(this).attr('data_type') != "" && $(this).attr('data_type') != undefined) {
            // data_dev_class = $('.active').children('a').attr('data_type')
            console.log($(this).attr('tab_type'))
            // api_filter[$(this).attr('tab_type')]["dev_class"]=data_dev_class
        }
    })

    var orderColumn = ""
    var orderType = ""
    load_table(1, 100, update_filter())
    function load_table(page, pagesize, filter_data = {}) {
        let data_json = {
            "page": page,
            "pageSize": pagesize
            // ,
            // "strategy_type": "data"
        }
        if (orderColumn != "") {
            data_json["orderColumn"] = orderColumn
            data_json["orderType"] = orderType
        }
        if (filter_data != {}) {
            data_json = $.extend({}, filter_data, data_json);
        }
        if (data_mem[data_mem_type]["api_filter"] != {}) {
            data_json = $.extend({}, data_mem[data_mem_type]["api_filter"], data_json);
        }
        if (tokensDefault.get('filename') != "" || tokensDefault.get('filename') != undefined) {
            data_json["word"] = tokensDefault.get('filename')
        }
        data_json["app_name"]=app_name
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            // url: "/ndrapi/rules/match/tag/strategy/info/",//url
            // url: "/asmapi/asm/assets/database/info/",
            url: data_mem[data_mem_type]["url"],
            data: data_json,
            headers: session_headers,
            success: function (result) {
                // console.log(result);
                data_mem[data_mem_type]["records"] = []
                data_mem[data_mem_type]["records"] = result["records"]
                // console.log(data_mem)
                const tb_field = data_mem[data_mem_type]["tb_field"]
                const filetable = create_file_table(data_mem_type, tb_field, data_mem[data_mem_type])
                // filetable.addCellRenderer(new file_table());
                console.log(filetable)
                document.getElementById('table_div').innerHTML = ''
                document.getElementById('table_div').appendChild(filetable)
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
                document.getElementById('table_tfoot_div').innerHTML = ''
                document.getElementById('table_tfoot_div').appendChild(filetfoot)
                tokenschange_count = 1
            },
            error: function (result) {
                console.log(result);
            }
        });
    }

    var file_total_list = {}

    function create_file_table(table_type, tb_th, res_data) {
        const filetable = document.createElement('table')
        const filethead = document.createElement('thead')
        const filetbody = document.createElement('tbody')
        const tb_data = res_data["records"]

        const filetr = document.createElement('tr')
        Object.keys(tb_th).forEach(function (key) {
            const fileth = document.createElement('th')
            // fileth.innerHTML = tb_th[key]
            if (tb_th[key] == "全选") {
                fileth.innerHTML = `<input type="checkbox" class="page_AllAssets" id="page_AllAssets" name="page_AllAssets">`
            } else if (tb_th[key] == "操作") {
                fileth.innerHTML = tb_th[key]
                fileth.classList.add("sticky_td");
            } else if (orderColumn == key) {
                fileth.innerHTML = tb_th[key] + '<i class="fa fa-sort-' + orderType.toLowerCase() + '" data-value="' + key + '" aria-hidden="true" style="margin: 0px 5px;font-size: 12px;cursor: pointer;"/></i>'
            } else {
                fileth.innerHTML = tb_th[key] + '<i class="fa fa-sort" data-value="' + key + '" aria-hidden="true" style="margin: 0px 5px;font-size: 12px;cursor: pointer;"/></i>'
            }
            fileth.style.width = data_mem[table_type]["tb_field_width"][key]
            // fileth.setAttribute('style',"width:"+tb_field_width[key])
            fileth.setAttribute('data-value', tb_th[key])
            filetr.appendChild(fileth)
        })
        filethead.appendChild(filetr)

        tb_data.forEach(function (data_item) {
            const filetr2 = document.createElement('tr')
            Object.keys(tb_th).forEach(function (key) {
                const filetd = document.createElement('td')
                if (data_item[key] == null) {
                    data_item[key] = "-"
                }
                if (key == "id") {
                    filetd.className = 'static-col'
                    filetd.innerHTML = `<div style="text-align:left;" ><a class="btn-topsek-detail" data-value="${table_type}" rule_id="${data_item[key]}" >查看</a></div>`
                    // if (data_item["status"] == 1) {
                    //     filetd.innerHTML = `<div style="text-align:left;" ><a class="btn-topsek-edit" data-value="${table_type}" rule_id="${data_item[key]}" >编辑</a> <a class="btn-topsek-on" style="display:none" data-value="${table_type}" rule_id="${data_item[key]}">启用</a> <a class="btn-topsek-off" data-value="${table_type}" rule_id="${data_item[key]}">禁用</a> <a class="btn-topsek-delete" data-value="${table_type}" rule_id="${data_item[key]}">删除</a></div>`
                    // } else {
                    //     filetd.innerHTML = `<div style="text-align:left;" ><a class="btn-topsek-edit" data-value="${table_type}" rule_id="${data_item[key]}" >编辑</a> <a class="btn-topsek-on" data-value="${table_type}" rule_id="${data_item[key]}">启用</a> <a class="btn-topsek-off"  style="display:none" data-value="${table_type}" rule_id="${data_item[key]}">禁用</a> <a class="btn-topsek-delete" data-value="${table_type}" rule_id="${data_item[key]}">删除</a></div>`
                    // }

                    data_mem[table_type][data_item[key]] = data_item
                    // } else if (key == "bus_name") {
                    //     filetd.innerHTML = `<div style="text-align:left;" ><a class="btn-topsek-detail" data-value="${table_type}" rule_id="${data_item[key]}" >${data_item[key]}</a></div>`
                    filetd.classList.add("sticky_td");
                } else if (key == "bulk_edit") {
                    filetd.innerHTML = `<input type="checkbox" class="bulk_edit_assets"  name="bulk_edit_assets" value="${data_item["id"]}" dev_ip="${data_item["dev_ip"]}" family_name="${data_item["family_name"]}" plugin_id="${data_item["plugin_id"]}" vuln_name="${data_item["vuln_name"]}">`
                    filetd.style.width = data_mem[table_type]["tb_field_width"][key]
                } else if (key == "enable") {
                    if (data_item[key] == 1) {
                        filetd.innerHTML = "启用"
                    } else {
                        filetd.innerHTML = "禁用"
                    }

                } else if (key == "bus_name") {
                    filetd.innerHTML = `<div class="source_data_div" title="${bian(data_item[key])}" style="text-align:left;" ><a class="btn-topsek-detail" data-value="所属业务" rule_id="${data_item[key]}" >${data_item[key]}</a></div>`
                } else if (key == "org_name") {
                    filetd.innerHTML = `<div class="source_data_div" title="${bian(data_item[key])}" style="text-align:left;" ><a class="btn-topsek-detail" data-value="组织名称" rule_id="${data_item[key]}" >${data_item[key]}</a></div>`
                } else if (key == "dev_ip") {
                    filetd.innerHTML = `<div  class="source_data_div" title="${bian(data_item[key])}" style="text-align:left;" ><a class="btn-topsek-detail" data-value="IP地址" rule_id="${data_item[key]}" >${data_item[key]}</a></div>`


                } else if (key == "data_source") {
                    let htmlstr = '';
                    $.each(data_item[key], function (key, value) {
                        htmlstr += '<span style="display: inline-block; position:relative;background-color:#0073e7" class="radius_div2 blue">' + value + '</span> '
                    })
                    filetd.innerHTML = htmlstr
                } else if (key == "create_time" || key == "update_time") {
                    filetd.innerHTML = `<div ><i class="fa fa-clock-o" aria-hidden="true"  style="margin-right: 5px;" /></i>` + data_item[key] + `</div>`
                } else if (key == "role") {
                    if (data_item["user_name"] != "" && data_item["user_name"] != null && data_item["user_name"] != undefined) {
                        filetd.innerHTML = `<div ><i class="fa fa-address-card" aria-hidden="true" style="margin-right: 5px;"/></i>` + data_item["user_name"] + `</div>`
                    } else {
                        filetd.innerHTML = `<div ><i class="fa fa-group" aria-hidden="true"  style="margin-right: 5px;" /></i>` + data_item[key] + `</div>`
                    }
                // } else if (key == "status") {
                //     if (data_item[key] == 1) {
                //         color = "green"
                //     } else {
                //         color = "grey"
                //     }
                //     filetd.innerHTML = `<div class="radius_div2 ${color}" title="${bian(data_mem[table_type]["fields_dict"][key][data_item[key]])}">` + data_mem[table_type]["fields_dict"][key][data_item[key]] + `</div>`
                } else {
                    if (key in data_item) {
                        if (data_mem[table_type]["fields_dict"] != undefined && key in data_mem[table_type]["fields_dict"]) {
                            filetd.innerHTML = `<div class="source_data_div" title="${bian(data_mem[table_type]["fields_dict"][key][data_item[key]])}">` + data_mem[table_type]["fields_dict"][key][data_item[key]] + `</div>`
                        } else {
                            filetd.innerHTML = `<div class="source_data_div" title="${bian(data_item[key])}">` + data_item[key] + `</div>`
                            // filetd.innerHTML = `<div>` + data_item[key] + `</div>`
                        }
                    } else {
                        filetd.innerHTML = `<div style="display: inline-block;float: left; position:relative" class="radius_div2 grey">-</div>`
                    }
                }

                filetr2.appendChild(filetd)
            })
            filetbody.appendChild(filetr2)
        })
        filetable.appendChild(filethead)
        // filetbody.classList.add("table_tbody_div");
        if (table_tbody_dict.indexOf(data_mem_type) == -1) {

            filetbody.style.height = "auto"
        }
        filetable.appendChild(filetbody)
        filetable.classList.add("table");
        filetable.classList.add("table-striped");
        filetable.classList.add("table-hover");
        // console.log(filetable)
        return filetable
    }


    var dev_type_value_dict = {}
    // 编辑 按钮
    $(document).on('click', '.btn-topsek-edit', function () {
        const rule_id = $(this).attr('rule_id')
        const rule_json = data_mem[data_mem_type][rule_id]
        // console.log(rule_json)
        const showmodal_body = get_showmodal_body()
        showModal({
            title: "编辑任务-" + rule_json["name"],
            size: 40,
            body: showmodal_body,
            actions: [{
                onClick: function () {
                    $('.modal').one('hidden.bs.modal', function () {
                        const post_data = {
                            "info": []
                        }
                        $.each($('.outsourcing_config_item'), function () {
                            const data_cid = $(this).attr('data-cid')
                            const data_product = $('.horizon-ruleconfig-value[value-key-en="product"][data-cid="' + data_cid + '"]').val()
                            const item_json = {
                                "product": data_product
                            }
                            $.each($('.config_tbody[data-cid="' + data_cid + '"][data-type="' + data_product + '"] .horizon-ruleconfig-value'), function () {
                                item_json[$(this).attr('value-key-en')] = $(this).val()
                            })
                            post_data["info"].push(item_json)
                        })
                        $.ajax({
                            //几个参数需要注意一下
                            type: "PATCH",//方法类型
                            url: data_mem[data_mem_type]["url"] + rule_id,//url
                            data: JSON.stringify(post_data),
                            headers: postheaders,
                            async: false,
                            success: function (result) {
                                console.log("保存成功");
                                console.log(result);
                            },
                            error: function (result) {
                                console.log(result);
                            }
                        });
                        load_table(1, $('.select-pagesize').val())

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
        // 开始渲染下拉
        // 任务属性渲染
        const task_type_dict = [{ "name": "定期任务" }, { "name": "安全事件" }]
        $('.horizon-ruleconfig-value[value-key-en="task_type"]').html('<option label="请选择" value="">')
        $.each(task_type_dict, function (key, item) {
            $('.horizon-ruleconfig-value[value-key-en="task_type"]').append(`<option label="${item["name"]}" value="${item["name"]}"/>`)
        })
        // SLA等级渲染
        const sla_dict = get_sla_list()
        $('.horizon-ruleconfig-value[value-key-en="level"]').html('<option label="请选择" value="">')
        $.each(sla_dict, function (key, item) {
            // $('.horizon-ruleconfig-value[value-key-en="level"]').append(`<option label="${item["level"]}" value="${item["id"]}"/>`)
            $('.horizon-ruleconfig-value[value-key-en="level"]').append(`<option label="${item["level"]}" value="${item["level"]}"/>`)
        })
        // 任务周期渲染
        const task_cycle_dict = [{ "name": "立即" }, { "name": "每天运行" }, { "name": "每周运行" }, { "name": "每月运行" }, { "name": "按 Cron 计划运行" }]
        $('.horizon-ruleconfig-value[value-key-en="cycle"]').html('<option label="请选择" value="">')
        $.each(task_cycle_dict, function (key, item) {
            $('.horizon-ruleconfig-value[value-key-en="cycle"]').append(`<option label="${item["name"]}" value="${item["name"]}"/>`)
        })
        // 任务组渲染
        const task_role_dict = [{ "name": "一线" }, { "name": "二线" }, { "name": "三线" }]
        $('.horizon-ruleconfig-value[value-key-en="task_role"]').html('<option label="请选择" value="">')
        $.each(task_role_dict, function (key, item) {
            $('.horizon-ruleconfig-value[value-key-en="task_role"]').append(`<option label="${item["name"]}" value="${item["name"]}"/>`)
        })
        // 负责人渲染
        const task_owner_dict = get_user_list()
        $('.horizon-ruleconfig-value[value-key-en="task_owner"]').html('<option label="不指定" value="">')
        $.each(task_owner_dict, function (key, item) {
            $('.horizon-ruleconfig-value[value-key-en="task_owner"]').append(`<option label="${item["name"]}(${item["account"]})" value="${item["account"]}"/>`)
        })

        $.each(rule_json, function (key, item) {
            $('.horizon-ruleconfig-value[value-key-en="' + key + '"]').val(item)
        })
    })

    $(document).on('change', '.horizon-ruleconfig-value[value-key-en="dev_type"]', function () {
        $('.horizon-ruleconfig-value[value-key-en="dev_class"]').val('')
        $('.horizon-ruleconfig-value[value-key-en="dev_class"] option').hide()
        if ($(this).val() == "") {
            $('.horizon-ruleconfig-value[value-key-en="dev_class"] option').show()
        } else {
            $('.horizon-ruleconfig-value[value-key-en="dev_class"] option[parent_id="' + dev_type_value_dict[$(this).val()] + '"]').show()
        }

    })

    //渲染批量编辑的操作列选择
    // function create_MultiDropdownView(search_id, view_id, label_field, value_field, store_div, search_query, curr_lists, model) {
    //     var search_id = search_id + Date.now();
    //     var view_name = view_id;
    //     var view_id = view_id + Date.now();
    //     let view_name_SearchManager = new SearchManager({
    //         id: search_id,
    //         search: search_query,
    //         earliest_time: "0",
    //         latest_time: "now"
    //     });
    //     let view_name = new MultiDropdownView({
    //         id: view_id,
    //         managerid: search_id,
    //         labelField: label_field,
    //         valueField: value_field,
    //         el: store_div
    //     }).render();

    //     view_name.val(model)
    //     fieldsSelect_refresh(curr_lists, model)

    //     //必填项禁用编辑
    //     var must_disabled = setInterval(function () {
    //         if ($('.select_module button').length > 0) {
    //             $.each(curr_lists, function (index, val) {
    //                 val = val.split('#soc#')[1]
    //                 if ($(`.data_params[data_field="${val}"]`).hasClass('must')) {
    //                     console.log(val)
    //                     $(`button[data-test-value="${val}"]`).prop('disabled', true)
    //                 }
    //             })
    //             clearInterval(must_disabled)
    //         }
    //     }, 200)


    //     view_name.off('change').on('change', function () {
    //         var model = view_name.val();
    //         console.log(model)
    //         fieldsSelect_refresh(curr_lists, model)
    //     })
    // }
    //批量编辑选择列的显示与隐藏控制
    function fieldsSelect_refresh(curr_lists, values) {
        $.each(curr_lists, function (index, value) {
            var key = value.split('#soc#')[1]
            if (values.indexOf(key) < 0) {
                $(`.modal.fade.in table td[value-key-en="${key}"]`).hide();
            } else {
                $(`.modal.fade.in table td[value-key-en="${key}"]`).show();
            }

        })
    }

    function get_showmodal_body() {

        switch (data_mem_type) {
            case data_mem_type = "任务配置":
                const showmodal_body_json = [
                    {
                        "name": "name",
                        "zh_name": "名称",
                        "placeholder": "请输入任务名称",
                        "type": "input",
                        "is_important": "true"
                    },
                    {
                        "name": "task_type",
                        "zh_name": "任务属性",
                        "placeholder": "请选择任务属性",
                        "type": "select",
                        "is_important": "true"
                    },
                    {
                        "name": "level",
                        "zh_name": "SLA等级",
                        "placeholder": "请选择任务周期",
                        "type": "select",
                        "is_important": "true"
                    },
                    {
                        "name": "description",
                        "zh_name": "描述",
                        "placeholder": "请输入任务描述",
                        "type": "textarea",
                        "is_important": "false"
                    },
                    {
                        "name": "cycle",
                        "zh_name": "任务周期",
                        "placeholder": "请选择任务周期",
                        "type": "select",
                        "is_important": "true"
                    },
                    {
                        "name": "cron",
                        "zh_name": "计划任务",
                        "placeholder": "请输入计划任务",
                        "type": "input",
                        "is_important": "false"
                    },
                    {
                        "name": "task_role",
                        "zh_name": "任务组",
                        "placeholder": "请选择任务组",
                        "type": "select",
                        "is_important": "true"
                    },
                    {
                        "name": "task_owner",
                        "zh_name": "负责人",
                        "placeholder": "请选择负责人",
                        "type": "select",
                        "is_important": "false"
                    },
                ]
                let return_html = `<div id="edit-internal-table" style="text-align:centor;">
                            <table border="0" style="margin:auto;">
                                <tbody id="unad">`
                let td_num = 0
                $.each(showmodal_body_json, function (key, item) {
                    if (td_num == 0) {
                        return_html += `<tr>`
                    }
                    let is_important_html = ""
                    if (item["is_important"] == "true") {
                        is_important_html = `<span style="color:red;font-size: 25px;">*</span>`
                    } else {
                        is_important_html = ""
                    }
                    return_html += `<td height="30px" width="100px" value-key-en="${item["name"]}">
                                            ${item["zh_name"]}
                                        </td>
                                        <td height="30px" width="400px" value-key-en="${item["name"]}">`
                    if (item["type"] == "input") {
                        return_html += `<input type="text" class="inp horizon-ruleconfig-value " value-key="${item["zh_name"]}" value-key-en="${item["name"]}" is_important="${item["is_important"]}" style="margin: auto;width:calc(100% - 3rem);" value="" placeholder="${item["placeholder"]}">${is_important_html}`
                    } else if (item["type"] == "select") {
                        return_html += `<select type="" class=" horizon-ruleconfig-value " value-key="${item["zh_name"]}" value-key-en="${item["name"]}" is_important="${item["is_important"]}" style="margin: auto;width:calc(100% - 3rem);" value="" placeholder="${item["placeholder"]}">${is_important_html}<div class="extra_div" value-key="${item["zh_name"]}" value-key-en="${item["name"]}"></div>`
                    } else if (item["type"] == "date") {
                        return_html += `<input type="date" class="inp horizon-ruleconfig-value " value-key="${item["zh_name"]}" value-key-en="${item["name"]}" is_important="${item["is_important"]}" style="margin: auto;width:calc(100% - 3rem);" value="" placeholder="${item["placeholder"]}">${is_important_html}`
                    } else if (item["type"] == "textarea") {
                        return_html += `<textarea type="text" class="horizon-ruleconfig-value " value-key="${item["zh_name"]}" value-key-en="${item["name"]}" is_important="${item["is_important"]}" style="margin: auto;width:calc(100% - 3rem);" value="" placeholder="${item["placeholder"]}"/>${is_important_html}`
                    }

                    return_html += `</td>`
                    if (td_num == 0) {
                        td_num = 0
                        return_html += `</tr>`
                    } else {
                        td_num += 1
                    }
                })
                if (td_num != 3) {
                    return_html += `</tr>`
                }
                return_html += `</tbody></table>
                            </div>`
                return return_html
                break

            default:
                break
        }
    }

    // 获取sla list
    function get_sla_list() {
        var sla_list
        const sla_url = "/tmsapi/task/sla/"
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: sla_url,//url
            data: {
                "page": 1,
                "pageSize": 10000
            },
            async: false,
            headers: headers,
            success: function (result) {
                sla_list = result["records"]
            },
            error: function (result) {
                console.log(result);
            }
        });
        return sla_list
    }

    // 获取user list
    function get_user_list() {
        var user_list
        const user_url = "/escapi/user/list"
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: user_url,//url
            data: {
            },
            async: false,
            headers: headers,
            success: function (result) {
                user_list = result["records"]
            },
            error: function (result) {
                console.log(result);
            }
        });
        return user_list
    }

    // 字符串 脱敏
    function hideString(str) {
        const hidenPart = str.slice(1, -2);
        return str.replace(hidenPart, "******")
    }

    // 更新过滤
    function update_filter() {
        // console.log("开始过滤数据")
        // console.log("问题出在这里")
        var filter_str = ''
        var filter_json = {}


        // 获取页面input值生成过滤条件
        // tokensNew = tokensDefault["attributes"]
        console.log(tokensNew)
        $.each(tokensNew, function (key, item) {

            if (item != "" && item != undefined && item != "*") {
                console.log(key)
                console.log(item)
                filter_json[key.replace('form.', '')] = item
                // if (item.split("*").length > 1) {
                //     // filter_json[key.replace('form.', '') + "_regex"] = item
                //     filter_json[key.replace('form.', '')] = item
                // } else {
                //     filter_json[key.replace('form.', '')] = item
                // }
            }
        })
        console.log(filter_json)
        // 抓取左侧菜单生成的过滤条件
        var draggable_list = []
        $('.btn-draggable').each(function () {
            draggable_list.push($(this).attr('data-type'))
        })

        $.each(draggable_list, function (key, item) {
            var item_list = []
            $('.btn-draggable[data-type="' + item + '"]').each(function () {
                item_list.push($(this).attr('data-search'))
            })
            if (item_list.length == 1) {
                filter_json[item] = item_list[0]
            } else if (item_list.length > 1) {
                filter_json[item + "_in"] = item_list.join(",")
            }
        })
        return filter_json
    }

    // 添加筛选
    $(document).on('click', '.depends', function () {
        const datavalue = $(this).attr('data-value')
        let datacid = $(this).attr('data-cid')
        const datasearch = $(this).attr('data-search')
        if ($(this).attr('filter-tag') != 1) {
            if (datavalue == "ld_type") {
                $('.zjld_filter_label').append(`<div class="btn-combo">
            <div class="btn btn-draggable" data-type="ld_type" data-search="${datasearch}" >资产类型="${datasearch}"</div>
            <div class="btn btn-icon-x" data-search="${datasearch}"><i class="icon-x" data-search="${datasearch}"></i></div>
        </div>`)
            } else if (datavalue == "dev_type") {
                $('.zjld_filter_label').append(`<div class="btn-combo">
            <div class="btn btn-draggable" data-type="dev_type" data-search="${datasearch}">资产大类="${datasearch}"</div>
            <div class="btn btn-icon-x" data-search="${datasearch}"><i class="icon-x" data-search="${datasearch}"></i></div>
        </div>`)
            } else if (datavalue == "dev_zone") {
                $('.zjld_filter_label').append(`<div class="btn-combo">
            <div class="btn btn-draggable" data-type="dev_zone" data-search="${datasearch}">所在区域="${datasearch}"</div>
            <div class="btn btn-icon-x" data-search="${datasearch}"><i class="icon-x" data-search="${datasearch}"></i></div>
        </div>`)
            } else if (datavalue == "event_level") {
                $('.zjld_filter_label').append(`<div class="btn-combo">
            <div class="btn btn-draggable" data-type="event_level" data-search="${datasearch}">级别="${datasearch}"</div>
            <div class="btn btn-icon-x" data-search="${datasearch}"><i class="icon-x" data-search="${datasearch}"></i></div>
        </div>`)
            } else if (datavalue == "vuln_type") {
                $('.zjld_filter_label').append(`<div class="btn-combo">
            <div class="btn btn-draggable" data-type="vuln_type" data-search="${datasearch}">漏洞类型="${datasearch}"</div>
            <div class="btn btn-icon-x" data-search="${datasearch}"><i class="icon-x" data-search="${datasearch}"></i></div>
        </div>`)
            } else if (datavalue == "vuln_status") {
                $('.zjld_filter_label').append(`<div class="btn-combo">
            <div class="btn btn-draggable" data-type="vuln_status" data-search="${datasearch}">修复状态="${datasearch}"</div>
            <div class="btn btn-icon-x" data-search="${datasearch}"><i class="icon-x" data-search="${datasearch}"></i></div>
        </div>`)
            } else {
                $('.zjld_filter_label').append(`<div class="btn-combo">
            <div class="btn btn-draggable" data-type="${datavalue}" data-search="${datasearch}">${datasearch}</div>
            <div class="btn btn-icon-x" data-search="${datasearch}"><i class="icon-x" data-search="${datasearch}"></i></div>
        </div>`)
            }
            $('.depends[data-search="' + $(this).attr('data-search') + '"]').attr('filter-tag', 1)
        }
        load_table(1, $('.select-pagesize').val(), update_filter())
    })

    // 删除过滤item
    $(document).on('click', '.btn-icon-x', function () {
        // console.log($('.depends[data-search="' + $(this).attr('data-search') + '"]').attr('filter-tag'))
        $('.depends[data-search="' + $(this).attr('data-search') + '"]').attr('filter-tag', 0)
        // console.log($('.depends[data-search="' + $(this).attr('data-search') + '"]').attr('filter-tag'))
        $(this).parent('div').remove()
        load_table(1, $('.select-pagesize').val(), update_filter())
    })

    // 刷新表格
    function refresh_table(data_value, page, pagesize) {
        batch_edit_assets = { //记录批量编辑的资产
            "IP视角": [],
            "网段视角": []
        }
        switch (data_value) {
            case "任务配置":
                console.log(data_value)
                load_table(page, pagesize, update_filter())
                break
            default:
                load_table(page, pagesize, update_filter())
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
        // if(now_page=="1"){
        //     confirm("已是首页，无法再翻页")
        // }else if(now_page=="2")(
        //     $(this).attr('disabled','disabled')
        // )
        refresh_table(data_value, now_page - 1, now_pagesize)
    })

    // 下一页
    $(document).on('click', 'a[data-page="next"]', function () {
        const data_value = $(this).attr("data-value")
        const now_page = $('.inp-page[data-value="' + data_value + '"]').val()
        const total_count = $(this).attr("total_count")
        const now_pagesize = $('.select-pagesize').val()
        // if(now_page*now_pagesize>=total_count){
        //     confirm("已是尾页，无法再翻页")
        // }else if(now_page=="2")(
        //     $(this).attr('disabled','disabled')
        // )
        if ($(this).hasClass('disabled') == false) {
            refresh_table(data_value, now_page - 1 + 2, now_pagesize)
        }

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
        const now_pagesize = $('.select-pagesize').val()
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
        self.$modal.find('.modal-content').html('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">${title}</h4></div><div class="modal-body modal-body-scrolling">${body}</div><div class="modal-footer"></div>'.replace('${title}', options.title).replace('${body}', options.body));

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

    // 排序功能实现
    $(document).on('click', '.fa-sort', function () {
        const orderColumn = $(this).attr('data-value')
        const orderType = "asc"
        // $(this).className('fa fa-sort-asc')
        const now_page = $('.inp-page[data-value="' + data_mem_type + '"]').val()
        const total_count = $('.select-pagesize[data-value="' + data_mem_type + '"]').val()
        const now_pagesize = $('.select-pagesize').val()
        refresh_table(data_mem_type, now_page, now_pagesize)
    })
    $(document).on('click', '.fa-sort-asc', function () {
        const orderColumn = $(this).attr('data-value')
        const orderType = "desc"
        // $(this).className('fa fa-sort-desc')
        const now_page = $('.inp-page[data-value="' + data_mem_type + '"]').val()
        const total_count = $('.select-pagesize[data-value="' + data_mem_type + '"]').val()
        const now_pagesize = $('.select-pagesize').val()
        refresh_table(data_mem_type, now_page, now_pagesize)
    })
    $(document).on('click', '.fa-sort-desc', function () {
        const orderColumn = $(this).attr('data-value')
        const orderType = "asc"
        // $(this).className('fa fa-sort-asc')
        const now_page = $('.inp-page[data-value="' + data_mem_type + '"]').val()
        const total_count = $('.select-pagesize[data-value="' + data_mem_type + '"]').val()
        const now_pagesize = $('.select-pagesize').val()
        refresh_table(data_mem_type, now_page, now_pagesize)
    })

    // 20240319 IP视角
    // 复选框全选
    $(document).on('click', '#page_AllAssets', function () {
        if ($(this).is(':checked')) {
            $.each($('.bulk_edit_assets'), function () {
                $(this).prop('checked', "true")
            })
        } else {
            $.each($('.bulk_edit_assets'), function () {
                $(this).removeAttr('checked')
            })
        }
    })

    // 查看详情
    $(document).on('click', '.btn-topsek-detail', function () {
        const rule_id = $(this).attr('rule_id')
        const data_value = $(this).attr('data-value')
        // console.log(data_mem["internet_info"])
        switch (data_value) {
            case "我的任务":
                window.open('tms_asm_task_portrait?form.task_id=' + rule_id)
                break
            case "组织名称":
                window.open('asm_org_portrait?form.org_name=' + rule_id)
                break
            case "所属业务":
                window.open('asm_business_portrait?form.bus_name=' + rule_id)
                break
            case "IP视角":
                window.open('asm_internal_ip_portrait?hideEdit=true&hideTitle=true&hideFilters=true&form.dev_ip=' + data_mem["IP视角"][rule_id]["dev_ip"])
                break
            case "IP地址":
                window.open('asm_internal_ip_portrait?hideEdit=true&hideTitle=true&hideFilters=true&form.dev_ip=' + rule_id)
                break
            case "软件组件":
                window.open('asm_appvuln_portrait?hideEdit=true&hideTitle=true&hideFilters=true&form.vuln_id=' + rule_id)
                break
            case "域名资产":
                window.open('asm_internet_domain_portrait?hideEdit=true&hideTitle=true&hideFilters=true&form.domain=' + data_mem["internet_info"][rule_id]["domain"])
                break
            default:
                break
        }
    })

    // 跳转画像
    $(document).on('click', '.asset_detail', function () {
        data_value = $(this).attr("data_type")
        switch (data_value) {
            case "bus_name":
                window.open('asm_busec_portrait?form.bus_name=' + $(this).attr('info'))
                break
            case "dev_ip":
                window.open('asm_intranet_portrait?hideEdit=true&hideTitle=true&hideFilters=true&form.dev_ip=' + $(this).attr('info'))
                break
            case "域名资产":
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
            case "风险分析":
                window.open('asm_risk_overview_v2?form.zjld_dev_ip=' + $(this).attr('info') + '&form.tab_value=' + $(this).attr('tab_value'))
                break
            default:
                break
        }

    })

    // 20240319 左侧菜单开发
    $(document).on('click', '.showh5table', function () {
        $('.H5Table[data-value="' + $(this).attr('data-value') + '"]').show()
        $('.hideh5table[data-value="' + $(this).attr('data-value') + '"]').show()
        $('.showh5table[data-value="' + $(this).attr('data-value') + '"]').hide()
    })
    $(document).on('click', '.hideh5table', function () {
        $('.H5Table[data-value="' + $(this).attr('data-value') + '"]').hide()
        $('.hideh5table[data-value="' + $(this).attr('data-value') + '"]').hide()
        $('.showh5table[data-value="' + $(this).attr('data-value') + '"]').show()
    })
    $('.hideh5table').click()
    $('.hideh5table').hide()
    $("#zjld_btn_div").after(`<a class="create_button btn btn-horizon bulk_edit" style="float: right;margin-right: 1%;">批量编辑 <i class="fa fa-chevron-up" style="font-size: 8px;"></i></a> <a class="btn btn-horizon btn-export-list" style="float: right;margin-right: 1%;">导出</a> <a class="btn btn-horizon custom_showField" style="float: right;margin-right: 1%;">自定义列</a>`)

    // 批量编辑按钮
    $(document).on('click', ".bulk_edit", function () {
        var bulk_edit_window = `<div id="bulkEdit_save">
                          <ul>
                            <li class="bulkEdit_update">编辑</li>
                            <li class="bulkEdit_export">导出</li>
                          </ul>
                          <i class="fa fa-caret-down bulkEdit_updown"></i>
                        </div>`;

        if ($(this).prev("#bulkEdit_save").length == 0) {
            $(this).before(bulk_edit_window)
        } else {
            $(this).prev("#bulkEdit_save").remove();
        }

    })

    // 复选框全选
    $(document).on('click', '#page_AllAssets', function () {
        if ($(this).is(':checked')) {
            $.each($('.bulk_edit_assets:visible'), function () {
                $(this).prop('checked', "true")
                batch_edit_assets[data_mem_type].push($(this).val())
            })
        } else {
            $('.bulk_edit_assets:visible').removeAttr('checked')
            batch_edit_assets[data_mem_type] = []
        }
    })

    //复选框单选
    $(document).on('click', '.bulk_edit_assets', function () {
        if ($(this).is(':checked')) {
            batch_edit_assets[data_mem_type].push($(this).val())
        } else {
            batch_edit_assets[data_mem_type] = _.without(batch_edit_assets[data_mem_type], $(this).val());
        }
    })

    // 批量导出
    $(document).on('click', '.bulkEdit_export', function () {
        if (batch_edit_assets[data_mem_type].length == 0) {
            alert(`请选择需要进行编辑的资产！`)
            return false; //结束函数后面的执行
        } else {
            var addItem_panel =
                '      <div class="modal-body modal-body-scrolling">' +
                '        <div style="width: 90%;margin-left: 5%;" id="export_lists"> ' +
                '          <div class="export-item shared-controls-controlgroup export_fields"><label for="comment" class="control-label">选择列名:</label> <div id="line_box" style="margin-top:-10px"><div class="initialize_value">加载中...</div></div> <div id="select_fields_list" style="margin-left: 5.8%;"><ul style="list-style-type: none;"></ul></div> </div> ' +
                '          <div class="export-item shared-controls-controlgroup export_format"><label for="comment" class="control-label">文件格式:</label> <select name="fileType" id="fileType" disabled="disabled" style="border-radius: 3px;width: 602px;min-height: 40px;margin-left: 14%;margin-bottom: 10px;display: flex;"><option label="CSV" value="CSV" selected="selected"></option></select> </div>' +
                '          <div class="export-item shared-controls-controlgroup export_fileName"><label for="comment" class="control-label"><i class="fa fa-asterisk" style="font-size: 1px;color: #dc4e41;"></i>文件名称:</label> <input type="text" class="fileName item_patams"  style="border-radius: 3px;width: 602px;min-height: 40px;margin-left: 14%;margin-bottom: 10px;display: flex;"/> </div>' +
                '          <div class="export-item shared-controls-controlgroup export_count"><label for="comment" class="control-label" style="width:100%;text-align: left;">当前选中结果数: ' + batch_edit_assets[data_mem_type].length + ' 条</label>  </div>' +
                '          </div>  ' +
                '        </div>' +
                '      </div>' +
                '      <div class="modal-footer">' +
                '        <button type="button" class="btn cancel modal-btn-cancel pull-left" data-dismiss="modal">取消</button>' +
                '        <button type="button" class="btn btn-primary btn-horizon" id="exportItem-modal-save-bulkEdit">导出</button>' +
                '      </div>';

            showModal({
                title: "导出结果",
                size: 50,
                body: addItem_panel,
                actions: []
            });
            let default_list = []
            const total_list = []
            console.log(data_mem_type)
            // default_list = export_field_dict[data_mem_type]
            default_list = data_mem[data_mem_type]['export_field']
            $.each(default_list, function (key, value) {
                total_list.push([value])
            })
            console.log(default_list)
            console.log(total_list)
            custom_multipleDown(default_list, total_list)
        }


    })

    // 批量导出填报完成后导出结果
    $(document).on('click', '#exportItem-modal-save-bulkEdit', function () {
        $(this).attr("disabled", "true").html(`导出 <i class="fa fa-spinner fa-spin"></i>`)
        const export_fields_json = {}
        $.each(data_mem[data_mem_type]['fields_config'], function (idx, value) {
            export_fields_json[value['zh_name']] = value['name']
        })

        const total = $('.select-pagesize[data-value="IP视角"]').attr('total_count')
        const fileName = $('.fileName').val()
        let export_fileName = ""
        if (fileName == "") {
            export_fileName = "asm_assets_" + Math.floor(Math.random() * 1000000) + ".csv"
        } else {
            export_fileName = fileName + ".csv"
        }
        let export_count = batch_edit_assets[data_mem_type].length
        if (export_count == "" || export_count == undefined) {
            export_count = 1000
        } else if (export_count == 0) {
            export_count = total
        }
        const result = {
            "records": []
        }
        $.each(batch_edit_assets[data_mem_type], function (key, value) {
            result["records"].push(data_mem[data_mem_type][value])
        })

        // console.log(result);
        var new_fields = []
        $('#line_box .line_value').each(function () {
            new_fields.push($(this).text())
        })
        var msg = new_fields.join(",") + "\n"
        console.log(new_fields)
        console.log(result["records"])
        $.each(result["records"], function (key, value) {
            $.each(new_fields, function (field_key, field_val) {
                let val = value[export_fields_json[field_val]] == null ? "" : value[export_fields_json[field_val]].toString().replace(/"/g, '""');//.replace(/,/g,'，')
                if (field_val == "修复状态") {
                    val = data_mem["status"][val]
                }
                if (field_key == 0) {
                    msg += '"' + val + '"'
                } else {
                    msg += ',"' + val + '"'
                }
            })
            msg += "\n"
        })
        // console.log("-----------")
        // console.log(msg)
        const blob = new Blob(['\uFEFF' + msg], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", export_fileName);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        $('.close').click();

    })

    //自定义显示列
    $(document).on('click', '.custom_showField', function () {
        let body_html = ''
        $.each(data_mem[data_mem_type]['fields_config'], function (key, val) {
            if (val['is_default'] == 1) {
                var checked = 'checked'
            } else {
                var checked = ''
            }
            var disabled = val['is_important'] == 1 ? 'disabled' : '';

            body_html += `<div class="field_select"> <input type="checkbox" en_field="${val['name']}" ${checked} ${disabled}/> ${val['zh_name']} </div>`
        })
        body_html = '<div class="export-item shared-controls-controlgroup display_field">' + body_html + '</div>'

        showModal({
            title: '列表自定义列',
            size: 30,
            body: body_html,
            actions: [{
                onClick: function () {
                    $('.btn.submit').attr("disabled", "true").html(`保存 <i class="fa fa-spinner fa-spin"></i>`)
                    var field_list = {
                        "show": [],
                        "hide": []
                    }
                    $('.field_select input').each(function () {
                        if ($(this).is(":checked")) {
                            field_list['show'].push($(this).attr('en_field'))
                        } else {
                            field_list['hide'].push($(this).attr('en_field'))
                        }
                    })
                    if (field_list['show'].length > 0) {
                        var data_list = {
                            "data_type": data_mem_type,
                            "filter_key": "name",
                            "filter_value": field_list['show'],
                            "update_dict": {
                                "is_default": 1
                            }
                        }
                        custom_field_fun(data_list)
                    }
                    if (field_list['hide'].length > 0) {
                        var data_list = {
                            "data_type": data_mem_type,
                            "filter_key": "name",
                            "filter_value": field_list['hide'],
                            "update_dict": {
                                "is_default": 0
                            }
                        }
                        custom_field_fun(data_list)
                    }

                },
                cssClass: 'btn-horizon submit',
                label: "保存"
            }, {
                onClick: function () { $(".modal").modal('hide'); },
                label: "取消"
            }]

        });

    })

    //修改自定义列
    function custom_field_fun(data_list) {
        $.ajax({
            type: "PATCH",//方法类型
            url: '/escapi/esc/page/data/fields/' + curr_page,
            data: JSON.stringify(data_list),
            headers: postheaders,
            success: function () {
                setTimeout(function () { //延迟执行，留出API反应时间
                    load_data_mem()
                    load_table(1, $('.select-pagesize').val(), update_filter())
                    $('.close').click()
                }, 500)

            },
            error: function (result) {
                alert('状态码:' + result['status'] + ', 报错信息:' + result['statusText']);
            }
        });
    }

    // 20240319 导出模块
    // 导出数据
    $(document).on('click', '.btn-export-list', function () {
        var addItem_panel =
            '      <div class="modal-body modal-body-scrolling">' +
            '        <div style="width: 90%;margin-left: 5%;" id="export_lists"> ' +
            '          <div class="export-item shared-controls-controlgroup export_fields"><label for="comment" class="control-label">选择列名:</label> <div id="line_box" style="margin-top:-10px"><div class="initialize_value">加载中...</div></div> <div id="select_fields_list" style="margin-left: 5.8%;"><ul style="list-style-type: none;"></ul></div> </div> ' +
            '          <div class="export-item shared-controls-controlgroup export_format"><label for="comment" class="control-label">文件格式:</label> <select name="fileType" id="fileType" disabled="disabled" style="border-radius: 3px;width: 602px;min-height: 40px;margin-left: 14%;margin-bottom: 10px;display: flex;"><option label="CSV" value="CSV" selected="selected"></option></select> </div>' +
            '          <div class="export-item shared-controls-controlgroup export_fileName"><label for="comment" class="control-label"><i class="fa fa-asterisk" style="font-size: 1px;color: #dc4e41;"></i>文件名称:</label> <input type="text" class="fileName item_patams"  style="border-radius: 3px;width: 602px;min-height: 40px;margin-left: 14%;margin-bottom: 10px;display: flex;"/> </div>' +
            '          <div class="export-item shared-controls-controlgroup export_count"><label for="comment" class="control-label">结果数:</label> <input type="text" class="count item_patams" placeholder="留空以导出1000条结果"  style="border-radius: 3px;width: 602px;min-height: 40px;margin-left: 14%;margin-bottom: 10px;display: flex;"/> </div>' +
            '          </div>  ' +
            '        </div>' +
            '      </div>' +
            '      <div class="modal-footer">' +
            '        <button type="button" class="btn cancel modal-btn-cancel pull-left" data-dismiss="modal">取消</button>' +
            '        <button type="button" class="btn btn-primary btn-horizon" id="exportItem-modal-save">导出</button>' +
            '      </div>';

        showModal({
            title: "导出结果",
            size: 50,
            body: addItem_panel,
            actions: []
        });
        // const default_list = []
        const total_list = []
        console.log(data_mem_type)
        // default_list = export_field_dict[data_mem_type]
        const default_list = data_mem[data_mem_type]['export_field']
        $.each(default_list, function (key, value) {
            total_list.push([value])
        })
        console.log(default_list)
        console.log(total_list)
        custom_multipleDown(default_list, total_list)

    })


    // 根据填报导出数据
    $(document).on('click', '#exportItem-modal-save', function () {
        $(this).attr("disabled", "true").html(`导出 <i class="fa fa-spinner fa-spin"></i>`)
        const export_fields_json = {}
        $.each(data_mem[data_mem_type]['fields_config'], function (idx, value) {
            export_fields_json[value['zh_name']] = value['name']
        })

        const total = $('.select-pagesize[data-value="IP视角"]').attr('total_count')
        const fileName = $('.fileName').val()
        let export_fileName=""
        if (fileName == "") {
            export_fileName = "asm_assets_" + Math.floor(Math.random() * 1000000) + ".csv"
        } else {
            export_fileName = fileName + ".csv"
        }
        let export_count = $('.count.item_patams').val()
        if (export_count == "" || export_count == undefined) {
            export_count = 1000
        } else if (export_count == 0) {
            export_count = total
        }
        let data_json = {
            "page": 1,
            "pageSize": export_count,
            // "format": "csv"
            // ,
            // "strategy_type": "data"
        }
        const filter_data = update_filter()
        if (filter_data != {}) {
            data_json = $.extend({}, filter_data, data_json);
        }
        if (data_mem[data_mem_type]["api_filter"] != {}) {
            data_json = $.extend({}, data_mem[data_mem_type]["api_filter"], data_json);
        }
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: data_mem[data_mem_type]["url"],
            data: data_json,
            headers: session_headers,
            success: function (result) {
                // console.log(result);
                var new_fields = []
                $('#line_box .line_value').each(function () {
                    new_fields.push($(this).text())
                })
                var msg = new_fields.join(",") + "\n"
                console.log(new_fields)
                console.log(result["records"])
                $.each(result["records"], function (key, value) {
                    $.each(new_fields, function (field_key, field_val) {
                        let val = value[export_fields_json[field_val]] == null ? "" : value[export_fields_json[field_val]].toString().replace(/"/g, '""');//.replace(/,/g,'，')
                        if (field_val == "修复状态") {
                            val = data_mem["status"][val]
                        }
                        if (field_key == 0) {
                            msg += '"' + val + '"'
                        } else {
                            msg += ',"' + val + '"'
                        }
                    })
                    msg += "\n"
                })
                // console.log("-----------")
                // console.log(msg)
                const blob = new Blob(['\uFEFF' + msg], { type: "application/octet-stream" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", export_fileName);
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                $('.close').click();
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
                let run_drag_drop = new drag_drop()
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

    // 计算IP视角统计信息
    // 第一行总数统计
    load_first_row_statscount()
    function load_first_row_statscount() {
        var data_result=""
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: "/tmsapi/task/info/stats/",//url
            data: {
                "app_name":app_name
            },
            async:false,
            headers: session_headers,
            success: function (result) {
                $.each(result["records"],function(key,item){
                    $('.event_count[data-value="task_info"][data_type="'+item["status"]+'"]').html(item["count"])
                })
            },
            error: function (result) {
                console.log(result);
            }
        });

    }

})
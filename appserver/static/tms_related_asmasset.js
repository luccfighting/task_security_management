require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'], function (
        _,
        $,
        mvc) {
    var tokensDefault = mvc.Components.get("default");
    var task_id = tokensDefault.get('taskid')
    var task_json = {}
    var options_json = {
        "bus_name": [],
        "org_name": [],
        "department": [],
        "dev_zone": [],
        "dev_type": [],
        "dev_class": []

    }
    var headers = {
        "Authorization": "e14bd6ed13e908495ab52be3648fa2b0",
        "content-type": "application/json"
    }

    // 获取组织信息
    function get_org_list() {
        var return_data
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: "/asmapi/asm/assets/orgs/",//url
            data: {
            },
            headers: headers,
            async: false,
            success: function (result) {
                // return return_data["records"]
                return_data = result
            },
            error: function (result) {
                console.log(result);
                // return result
                return_data = result
            }
        });
        return return_data
    }

    // 获取业务清单
    function get_bus_list() {
        var return_data
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: "/asmapi/asm/assets/business/",//url
            data: {
            },
            headers: headers,
            async: false,
            success: function (result) {
                // return return_data["records"]
                return_data = result
            },
            error: function (result) {
                console.log(result);
                // return result
                return_data = result
            }
        });
        return return_data
    }

    // 获取部门清单
    function get_dept_list() {
        var return_data
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: "/asmapi/asm/assets/department/",//url
            data: {
            },
            headers: headers,
            async: false,
            success: function (result) {
                // return return_data["records"]
                return_data = result
            },
            error: function (result) {
                console.log(result);
                // return result
                return_data = result
            }
        });
        return return_data
    }

    // 获取设备类型清单
    function get_devtype_list() {
        var return_data
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: "/tmsapi/data/dictionary",//url
            data: {
            },
            headers: headers,
            async: false,
            success: function (result) {
                // return return_data["records"]
                return_data = result
            },
            error: function (result) {
                console.log(result);
                // return result
                return_data = result
            }
        });
        return return_data
    }

    // 获取下拉菜单

    function get_all_options() {
        const bus_list = get_bus_list()
        const department_list = get_dept_list()
        const dev_type_list = get_devtype_list()

        // 数据处理
        options_json = {
            "bus_name": ["---请选择---"],
            "org_name": ["上海总公司"],
            "department": ["---请选择---"],
            "dev_zone": ["---请选择---", "内网", "外网"],
            "dev_type": ["---请选择---"],
            "dev_class": ["---请选择---"]

        }
        Object.keys(bus_list["records"]).forEach(function (key) {
            // console.log(bus_list["records"])
            options_json["bus_name"].push(bus_list["records"][key]["bus_name"])
        })
        Object.keys(department_list["records"]).forEach(function (key) {
            // console.log(bus_list["records"])
            options_json["department"].push(department_list["records"][key]["department"])
        })
        let dev_type_id=""
        // 获取设备类型字典id
        Object.keys(dev_type_list["records"]).forEach(function (key) {
            // console.log(bus_list["records"])
            if (dev_type_list["records"][key]["key"] == "dev_type" && dev_type_list["records"][key]["parent_id"] == null) {
                dev_type_id = dev_type_list["records"][key]["id"]
            }
        })
        // 获取设备类型清单与对应id
        const dev_type_id_list = []
        Object.keys(dev_type_list["records"]).forEach(function (key) {
            // console.log(bus_list["records"])
            if (dev_type_list["records"][key]["parent_id"] == dev_type_id) {
                options_json["dev_type"].push(dev_type_list["records"][key]["key"])
                dev_type_id_list.push(dev_type_list["records"][key]["id"])
            }
        })
        // 获取设备子类清单
        Object.keys(dev_type_list["records"]).forEach(function (key) {
            // console.log(dev_type_id_list)
            if (dev_type_id_list.indexOf(dev_type_list["records"][key]["parent_id"])!="-1") {
                console.log(dev_type_list["records"][key])
                options_json["dev_class"].push(dev_type_list["records"][key]["key"])
            }
        })

        var get_document = document.getElementsByClassName("un-topsek-value");
        Object.keys(get_document).forEach(function (key) {
            // console.log(get_document[key])

            if (get_document[key].getAttribute("value-key-en") in options_json) {
                var item_key = get_document[key].getAttribute("value-key-en")
                get_document[key].innerHTML = ''
                Object.keys(options_json[item_key]).forEach(function (item) {
                    var optionElement = document.createElement('option')
                    optionElement.value = options_json[item_key][item]
                    optionElement["label"] = options_json[item_key][item]
                    get_document[key].appendChild(optionElement)
                })

            }
        })
    }
    // 渲染动态字段
    render_dynamic_fields()
    function render_dynamic_fields() {
        // dynamic_dict = get_dynamic_dict()
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: "/asmapi/asm/dynameic/assets/table/info/?table_name=asm_assets_info",//url
            data: {},
            headers: {
                "Authorization": "e14bd6ed13e908495ab52be3648fa2b0",
                "Content-Type": "application/json"
            },
            success: function (result) {
                console.log(result["records"])
                if (result["records"].length > 0) {
                    let dynameic_table_html = `<tbody id="dynameic_table"><tr><td>动态字段</td></tr>`
                    let tr_td_num = 1
                    Object.keys(result["records"]).forEach(function (key) {
                        if (tr_td_num == 1) {
                            dynameic_table_html += `<tr>`
                        }
                        dynameic_table_html += `<td>${result["records"][key]["field_alias"]}</td><td><input type="text" class="inp un-topsek-value" value-key="${result["records"][key]["field_alias"]}" value-key-en="${result["records"][key]["field_name"]}" is_important="false" style="margin: auto;width:150px;" value="" placeholder="请输入${result["records"][key]["field_alias"]}" disabled="disabled"></td>`
                        if (tr_td_num == 3 || key == result["records"].length - 1) {
                            dynameic_table_html += `</tr>`
                            tr_td_num = 0
                        }
                        tr_td_num += 1
                    })
                    dynameic_table_html += `</tbody>`
                    $('#asm_asset_div table').append(dynameic_table_html)
                } else {
                    $('#dynameic_table').remove()
                }
                get_all_options()
                get_asset_info()


            },
            error: function (result) {
                console.log(result);
                confirm("发生异常，原因：渲染动态字段失败，请联系管理员")
            }
        });
    }

    // 动态字段映射
    function get_dynamic_dict() {
        var return_data = {}
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: "/tmsapi/data/dictionary/2",//url
            data: {},
            headers: {},
            async: false,
            success: function (result) {
                console.log(result["records"])
                Object.keys(result["records"]).forEach(function (key) {
                    return_data[result["records"][key]["value"]] = result["records"][key]["key"]
                })
            },
            error: function (result) {
                console.log(result);
                confirm("发生异常，原因：渲染动态字段失败，请联系管理员")
            }
        });
        console.log(return_data)
        return return_data
    }

    // 获取资产数据
    get_asset_info()
    function get_asset_info() {
        $.ajax({
            //几个参数需要注意一下
            type: "GET",//方法类型
            url: "/tmsapi/taskinfo/" + task_id,//url
            data: {
            },
            headers: {
            },
            success: function (result) {
                const asm_info = result["asm_info"]
                // console.log(asm_info)
                task_json = asm_info
                Rendering_data(asm_info)
            },
            error: function (result) {
                console.log(result);
            }
        });
    }

    // 渲染数据
    function Rendering_data(task_data) {
        Object.keys(task_data).forEach(function (key) {
            var value = task_data[key]
            $('.un-topsek-value[value-key-en="' + key + '"]').val(value)
        })
    }

    // 点击编辑
    $(document).on('click', '.btn-topsek-edit', function () {
        // 按钮显示隐藏刷新
        $('.btn-topsek-edit').hide()
        $('.modal-btn-cancel').show()
        $('.btn-topsek-save').show()

        // 开启编辑模式
        $('.un-topsek-value').removeAttr('disabled')
    })
    // 点击取消
    $(document).on('click', '.modal-btn-cancel', function () {
        // 按钮显示隐藏刷新
        $('.btn-topsek-edit').show()
        $('.modal-btn-cancel').hide()
        $('.btn-topsek-save').hide()

        // 关闭编辑模式
        $('.un-topsek-value').attr('disabled', 'disabled')
        console.log(task_json)
        // 还原数据
        Rendering_data(task_json)
    })
    // 点击保存
    $(document).on('click', '.btn-topsek-save', function () {
        // 按钮显示隐藏刷新
        $('.btn-topsek-edit').show()
        $('.modal-btn-cancel').hide()
        $('.btn-topsek-save').hide()

        // 关闭编辑模式
        $('.un-topsek-value').attr('disabled', 'disabled')

        // 更新数据 并渲染数据
        var get_document = document.getElementsByClassName("un-topsek-value");
        const task_json_new = {}
        Object.keys(get_document).forEach(function (key) {
            task_json_new[get_document[key].getAttribute("value-key-en")] = get_document[key].value
        })
        console.log(task_json_new)
        let return_data
        $.ajax({
            //几个参数需要注意一下
            type: "PATCH",//方法类型
            url: "/tmsapi/taskinfo/" + task_id,//url
            data: JSON.stringify({
                "name": "更新任务信息",
                "info": {
                    "asm_info": task_json_new
                }
            }),
            headers: headers,
            async: false,
            success: function (result) {
                // return return_data["records"]
                return_data = result
                console.log(result)
                alert("保存成功")
            },
            error: function (result) {
                console.log(result);
                // return result
                return_data = result
                alert("保存失败")
            }
        });
        // this._searchManager = new SearchManager({
        //     preview: false
        // });

        // splstr = '| makeresults |eval update_time=strftime(now(),"%F %T")|eval sql=\"'
        // splstr += 'update_time=\'"+update_time+"\',asm_info=\'' +  JSON.stringify(task_json_new) + '\' WHERE id=\'' +  task_id + '\'"| table sql| tmsdbquery "update" "UPDATE task_info SET " "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"'
        // console.log(splstr)
        // this._searchManager.set({ earliest_time: "0", latest_time: "now", search: splstr }, { tokens: true });
        // var mycheckResults = this._searchManager.data("results", { count: 0, output_mode: 'json' });
        // mycheckResults.on("data", function () {
        //     console.log(mycheckResults.data().results)
        // });
    })

});
require.config({
    baseUrl: '/static/app/task_management_system/js/min/',
    paths: {
        jquery_ui: "jquery-ui",
        jquery_ui_min: "jquery-ui.min",
        flowchart: "jquery.flowchart"
    }
});
require([
    'underscore',
    'jquery',
    'jquery_ui',
    'jquery_ui_min',
    "flowchart",
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'], function (
        _,
        $) {
    /* global $ */
    $(document).ready(function () {

        // // 渲染icon
        // $.each($('.icon_div'),function(){
        //     $(this).css('background','url(../icons/'+$(this).data('images')+') 0 0 no-repeat')
        // })


        var $flowchart = $('#flowchartworkspace');
        var $container = $flowchart.parent();
        var fadeOutTime = 5000

        // Apply the plugin on a standard, empty div...
        $flowchart.flowchart({
            data: defaultFlowchartData,
            defaultSelectedLinkColor: '#000055',
            grid: 10,
            multipleLinksOnInput: true,
            multipleLinksOnOutput: true
        });


        function getOperatorData($element) {
            var nbInputs = parseInt($element.data('nb-inputs'), 10);
            var nbOutputs = parseInt($element.data('nb-outputs'), 10);
            var nbTitle = $element.data('title')
            var nbUUID = generateUUID()
            var data = {
                properties: {
                    uuid: nbUUID,
                    title: nbTitle,
                    inputs: {},
                    outputs: {}
                }
            };



            if (nbTitle == "起点") {
                data.properties.outputs['output_start'] = {
                    label: '输出',
                    action: {

                    }
                };
            } else if (nbTitle == "终点") {
                data.properties.inputs['input_end'] = {
                    label: '输入'
                };
            } else if (nbTitle == "IF判断") {
                data.properties.inputs['input_if'] = {
                    label: '输入'
                };
                data.properties.outputs['output_true'] = {
                    label: '是'
                };
                data.properties.outputs['output_false'] = {
                    label: '否'
                };
            } else if (nbTitle == "人工处置") {
                data.properties.inputs['input_audit'] = {
                    label: '输入'
                };
                data.properties.outputs['output_audit'] = {
                    label: '输出'
                };
            } else if (nbTitle == "人工审核") {
                data.properties.inputs['input_review'] = {
                    label: '输入'
                };
                data.properties.outputs['output_review'] = {
                    label: '输出'
                };
            } else {
                var i = 0;
                for (i = 0; i < nbInputs; i++) {
                    data.properties.inputs['input_' + i] = {
                        label: 'Input ' + (i + 1)
                    };
                }
                for (i = 0; i < nbOutputs; i++) {
                    data.properties.outputs['output_' + i] = {
                        label: 'Output ' + (i + 1)
                    };
                }
            }

            return data;
        }

        // 创建UUID
        function generateUUID() {
            var d = new Date().getTime();
            var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16;
                if (d > 0) {
                    r = (d + r) % 16 | 0;
                    d = Math.floor(d / 16);
                } else {
                    r = (d2 + r) % 16 | 0;
                    d2 = Math.floor(d2 / 16);
                }
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        }



        //-----------------------------------------
        //--- operator and link properties
        //--- start
        var $operatorProperties = $('#operator_properties');
        $operatorProperties.hide();
        var $linkProperties = $('#link_properties');
        $linkProperties.hide();
        var $operatorTitle = $('#operator_title');
        var $linkColor = $('#link_color');

        var $operatorMenu = $('#operator_title');

        var mouseOverData = {}

        $flowchart.flowchart({
            onOperatorSelect: function (operatorId) {
                $operatorProperties.show();
                $operatorTitle.val($flowchart.flowchart('getOperatorTitle', operatorId));
                return true;
            },
            onOperatorUnselect: function () {
                $operatorProperties.hide();
                return true;
            },
            onLinkSelect: function (linkId) {
                $linkProperties.show();
                $linkColor.val($flowchart.flowchart('getLinkMainColor', linkId));
                return true;
            },
            onLinkUnselect: function () {
                $linkProperties.hide();
                return true;
            },
            onOperatorMouseOver: function (operatorId) { //鼠标移入
                const data = $flowchart.flowchart('getData');
                // mouseOverData = $flowchart.flowchart('getOperatorData', operatorId);
                mouseOverData = data["operators"][operatorId]
                mouseOverData.operatorId = operatorId
                // console.log(mouseOverData)
                $('.flowchart-operator-icon[data-uuid="' + data["operators"][operatorId]["properties"]["uuid"] + '"]').show();

                return true;
            },
            onOperatorMouseOut: function (operatorId) { //鼠标移入
                const data = $flowchart.flowchart('getData');
                $('.flowchart-operator-icon[data-uuid="' + data["operators"][operatorId]["properties"]["uuid"] + '"]').hide();
                return true;
            }
            // <i class="fa fa-trash" aria-hidden="true" /></i>
        });

        // 监听右键事件
        $(document).on('contextmenu', '.flowchart-operator', function () {
            event.preventDefault()
            // let uuid = $(this).child('.flowchart-operator-icon').data('uuid')
            console.log(mouseOverData)
            if (["起点", "终点"].indexOf(mouseOverData["properties"]["title"]) != -1) {
                showLeftNote({
                    'body': mouseOverData["properties"]["title"] + " 节点不可编辑"
                })
            } else {
                const showmodal_body = get_showmodal_body(mouseOverData["properties"]["title"])
                showLeftModal({
                    title: "节点配置",
                    size: 40,
                    body: showmodal_body,
                    actions: [{
                        onClick: function () {
                            $('.modal').one('hidden.bs.modal', function () {
                                const operator_action = {}
                                $.each($('.horizon-ruleconfig-value'), function () {
                                    console.log($(this).val())
                                    operator_action[$(this).attr('value-key-en')] = $(this).val()
                                })
                                mouseOverData["action"] = operator_action
                                $flowchart.flowchart('setOperatorData', mouseOverData.operatorId, mouseOverData);
                                // $.ajax({
                                //     //几个参数需要注意一下
                                //     type: "DELETE",//方法类型
                                //     url: data_mem[data_mem_type]["url"] + rule_id,//url
                                //     data: {},
                                //     headers: postheaders,
                                //     async: false,
                                //     success: function (result) {
                                //         console.log("保存成功");
                                //         console.log(result);
                                //     },
                                //     error: function (result) {
                                //         console.log(result);
                                //     }
                                // });
                                // load_table(1, $('.select-pagesize').val(), update_filter())

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
            }
            // 渲染下拉内容
            switch (mouseOverData["properties"]["title"]) {
                case mouseOverData["properties"]["title"] = "人工处置":
                    // 任务组渲染
                    const task_role_dict = [{ "name": "一线" }, { "name": "二线" }, { "name": "三线" }]
                    $('.horizon-ruleconfig-value[value-key-en="role"]').html('<option label="请选择" value="">')
                    $.each(task_role_dict, function (key, item) {
                        $('.horizon-ruleconfig-value[value-key-en="role"]').append(`<option label="${item["name"]}" value="${item["name"]}"/>`)
                    })
                    // 负责人渲染
                    const task_user_dict = get_user_list()
                    $('.horizon-ruleconfig-value[value-key-en="user_name"]').html('<option label="请选择" value="">')
                    $.each(task_user_dict, function (key, item) {
                        // $('.horizon-ruleconfig-value[value-key-en="level"]').append(`<option label="${item["level"]}" value="${item["id"]}"/>`)
                        $('.horizon-ruleconfig-value[value-key-en="user_name"]').append(`<option label="${item["name"]}" value="${item["account"]}"/>`)
                    })
                    break
                case mouseOverData["properties"]["title"] = "人工审核":
                    // 审核人渲染
                    const task_reviewer_dict = get_reviewer_list()
                    $('.horizon-ruleconfig-value[value-key-en="reviewer"]').html('<option label="请选择" value="">')
                    $.each(task_reviewer_dict, function (key, item) {
                        $('.horizon-ruleconfig-value[value-key-en="reviewer"]').append(`<option label="${item["name"]}" value="${item["account"]}"/>`)
                    })

                    break
                default:
                    break
            }

        })
        // 获取用户清单
        function get_reviewer_list() {
            var user_list = {}
            $.ajax({
                //几个参数需要注意一下
                type: "GET",//方法类型
                url: "/tmsapi/reviewer",//url
                data: {},
                async: false,
                headers: headers,
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
                headers: headers,
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

        $operatorTitle.keyup(function () {
            var selectedOperatorId = $flowchart.flowchart('getSelectedOperatorId');
            if (selectedOperatorId != null) {
                $flowchart.flowchart('setOperatorTitle', selectedOperatorId, $operatorTitle.val());
            }
        });

        $linkColor.change(function () {
            var selectedLinkId = $flowchart.flowchart('getSelectedLinkId');
            if (selectedLinkId != null) {
                $flowchart.flowchart('setLinkMainColor', selectedLinkId, $linkColor.val());
            }
        });
        //--- end
        //--- operator and link properties
        //-----------------------------------------

        //-----------------------------------------
        //--- delete operator / link button
        //--- start
        $flowchart.parent().siblings('.delete_selected_button').click(function () {
            $flowchart.flowchart('deleteSelected');
        });

        $(document).on('click', '.fa-trash', function () {
            console.log($(this).data('uuid'))
            $flowchart.flowchart('deleteSelected');
        });
        //--- end
        //--- delete operator / link button
        //-----------------------------------------


        // 复制uuid
        $(document).on('click', '.fa-file', function () {
            const uuid = $(this).data('uuid')
            var $temp = $("<textarea>");
            $("body").append($temp);
            $temp.val(uuid).select();
            document.execCommand("copy");
            $temp.remove();
            showLeftNote({
                'body': "复制ID成功"
            })

        });


        //-----------------------------------------
        //--- create operator button
        //--- start
        var operatorI = 0;
        $flowchart.parent().siblings('.create_operator').click(function () {
            var operatorId = 'created_operator_' + operatorI;
            var operatorData = {
                top: ($flowchart.height() / 2) - 30,
                left: ($flowchart.width() / 2) - 100 + (operatorI * 10),
                properties: {
                    title: 'Operator ' + (operatorI + 3),
                    inputs: {
                        input_1: {
                            label: 'Input 1',
                        }
                    },
                    outputs: {
                        output_1: {
                            label: 'Output 1',
                        }
                    }
                }
            };

            operatorI++;

            $flowchart.flowchart('createOperator', operatorId, operatorData);

        });
        //--- end
        //--- create operator button
        //-----------------------------------------

        //-----------------------------------------
        //--- draggable operators
        //--- start
        //var operatorId = 0;
        var $draggableOperators = $('.draggable_operator');
        $draggableOperators.draggable({
            cursor: "move",
            opacity: 0.7,

            // helper: 'clone',
            appendTo: 'body',
            zIndex: 1000,

            helper: function (e) {
                var $this = $(this);
                var data = getOperatorData($this);
                console.log(e)
                return $flowchart.flowchart('getOperatorElement', data);

            },
            stop: function (e, ui) {

                console.log(e)
                var $this = $(this);
                var elOffset = ui.offset;
                var containerOffset = $container.offset();
                if (elOffset.left > containerOffset.left &&
                    elOffset.top > containerOffset.top &&
                    elOffset.left < containerOffset.left + $container.width() &&
                    elOffset.top < containerOffset.top + $container.height()) {

                    var flowchartOffset = $flowchart.offset();

                    var relativeLeft = elOffset.left - flowchartOffset.left;
                    var relativeTop = elOffset.top - flowchartOffset.top;

                    var positionRatio = $flowchart.flowchart('getPositionRatio');
                    relativeLeft /= positionRatio;
                    relativeTop /= positionRatio;

                    var data = getOperatorData($this);
                    data.left = relativeLeft;
                    data.top = relativeTop;
                    let is_create = 1;
                    const operators_data = $flowchart.flowchart('getData');
                    console.log(operators_data)
                    console.log($(this).data('title'))
                    const operators_title = $(this).data('title')
                    if (["起点", "终点"].indexOf(operators_title) != -1) {
                        $.each(operators_data["operators"], function (key, item) {
                            if (["起点", "终点"].indexOf(item["properties"]["title"]) != -1 && operators_title == item["properties"]["title"]) { // 已经存在节点，所以提示不允许添加
                                is_create = 0
                                showLeftNote({
                                    'body': "只能存在一个" + item["properties"]["title"]
                                })
                            }
                        })
                    }
                    if (is_create == 1) {
                        $flowchart.flowchart('addOperator', data);
                    }


                }
            }
        });
        //--- end
        //--- draggable operators
        //-----------------------------------------


        //-----------------------------------------
        //--- save and load
        //--- start
        function Flow2Text() {
            var data = $flowchart.flowchart('getData');
            $('#flowchart_data').val(JSON.stringify(data, null, 2));
        }
        $('#get_data').click(Flow2Text);

        function Text2Flow() {
            var data = JSON.parse($('#flowchart_data').val());
            $flowchart.flowchart('setData', data);
        }
        $('#set_data').click(Text2Flow);

        /*global localStorage*/
        // function SaveToLocalStorage() {
        //     if (typeof localStorage !== 'object') {
        //         alert('local storage not available');
        //         return;
        //     }
        //     Flow2Text();
        //     localStorage.setItem("stgLocalFlowChart", $('#flowchart_data').val());
        // }
        // $('#save_local').click(SaveToLocalStorage);

        // function LoadFromLocalStorage() {
        //     if (typeof localStorage !== 'object') {
        //         alert('local storage not available');
        //         return;
        //     }
        //     var s = localStorage.getItem("stgLocalFlowChart");
        //     if (s != null) {
        //         $('#flowchart_data').val(s);
        //         Text2Flow();
        //     }
        //     else {
        //         alert('local storage empty');
        //     }
        // }
        // $('#load_local').click(LoadFromLocalStorage);
        //--- end
        //--- save and load
        //-----------------------------------------
        var flow_url = "/tmsapi/task/flow/"
        var headers = {
            "Authorization": "mS7HzoN/XYNIgkLCHV3tsDPHbjBBJ9inOPLZhMXiJyg=",
            "content-type": "application/json"
        }
        $(document).on('click', '.btn-topsek-saveflow', function () {
            showModal({
                title: "保存流程",
                size: 40,
                body: `<div id="edit-internal-table" style="text-align:centor;">
                            <table border="0" style="margin:auto;">
                                <tbody id="unad">
                                    <tr>
                                        <td height="30px" width="140px" value-key-en="role">
                                            名称
                                        </td>
                                        <td height="30px" width="400px" value-key-en="role">
                                            <input type="text" class="inp horizon-ruleconfig-value " value-key="名称" value-key-en="name" is_important="true" style="margin: auto;width:calc(100% - 3rem);" value="" placeholder="请输入流程名称"></input></div>
                                        </td></tr></tbody></table>
                            </div>`,
                actions: [{
                    onClick: function () {
                        $('.modal').one('hidden.bs.modal', function () {
                            // 获取当前流程信息
                            const flowchart_info = $flowchart.flowchart('getData')
                            const name = $('.horizon-ruleconfig-value[value-key-en="name"]').val()

                            $.ajax({
                                //几个参数需要注意一下
                                type: "POST",//方法类型
                                url: flow_url,//url
                                data: JSON.stringify({
                                    "name": name,
                                    "flowchart_info": flowchart_info
                                }),
                                headers: headers,
                                async: false,
                                success: function (result) {
                                    console.log("保存成功");
                                    console.log(result);
                                    showLeftNote({
                                        'body': "流程保存成功"
                                    })
                                },
                                error: function (result) {
                                    console.log(result);
                                }
                            });
                            // load_table(1, $('.select-pagesize').val(), update_filter())

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
        })

        // 渲染showbody
        function get_showmodal_body(data_mem_type) {
            let showmodal_body_json = []
            switch (data_mem_type) {
                case data_mem_type = "人工处置":
                    showmodal_body_json = [
                        {
                            "name": "role",
                            "zh_name": "任务组",
                            "placeholder": "请选择",
                            "type": "select",
                            "is_important": "true",
                            "config": {
                            }
                        },
                        {
                            "name": "user_name",
                            "zh_name": "任务负责人",
                            "placeholder": "请选择",
                            "type": "select",
                            "is_important": "true",
                            "config": {
                            }
                        },
                        {
                            "name": "sendemail",
                            "zh_name": "邮件通知",
                            "placeholder": "请选择",
                            "type": "radio",
                            "is_important": "true",
                            "config": {
                                "是": "1",
                                "否": "0"
                            }
                        }
                    ]
                    break
                case data_mem_type = "人工审核":
                    showmodal_body_json = [
                        {
                            "name": "reviewer",
                            "zh_name": "审核人",
                            "placeholder": "请选择审核人",
                            "type": "select",
                            "is_important": "true"
                        }
                    ]
                    break
                default:
                    break
            }

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
                return_html += `<td height="30px" width="140px" value-key-en="${item["name"]}">
                                            ${item["zh_name"]}
                                        </td>
                                        <td height="30px" width="400px" value-key-en="${item["name"]}">`
                if (item["type"] == "input") {
                    return_html += `<input type="text" class="inp horizon-ruleconfig-value " value-key="${item["zh_name"]}" value-key-en="${item["name"]}" is_important="${item["is_important"]}" style="margin: auto;width:calc(100% - 3rem);" value="" placeholder="${item["placeholder"]}">${is_important_html}`
                } else if (item["type"] == "select") {
                    return_html += `<select type="" class=" horizon-ruleconfig-value " value-key="${item["zh_name"]}" value-key-en="${item["name"]}" is_important="${item["is_important"]}" style="margin: auto;width:calc(100% - 3rem);" value="" placeholder="${item["placeholder"]}"/>${is_important_html}<div class="extra_div" value-key="${item["zh_name"]}" value-key-en="${item["name"]}"></div>`
                } else if (item["type"] == "date") {
                    return_html += `<input type="date" class="inp horizon-ruleconfig-value " value-key="${item["zh_name"]}" value-key-en="${item["name"]}" is_important="${item["is_important"]}" style="margin: auto;width:calc(100% - 3rem);" value="" placeholder="${item["placeholder"]}">${is_important_html}`
                } else if (item["type"] == "textarea") {
                    return_html += `<textarea type="text" class="horizon-ruleconfig-value " value-key="${item["zh_name"]}" value-key-en="${item["name"]}" is_important="${item["is_important"]}" style="margin: auto;width:calc(100% - 3rem);" value="" placeholder="${item["placeholder"]}"/>${is_important_html}`
                } else if (item["type"] == "radio") {
                    $.each(item["config"], function (key, value) {
                        return_html += `<input type="radio" class="inp horizon-ruleconfig-value " value-key="${item["zh_name"]}" value-key-en="${item["name"]}" is_important="${item["is_important"]}" style="margin: auto;" name="${item["name"]}" value="${value}">${key} `
                    })

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
        }

        // 加载若存在flow_id则渲染
        const flow_id = getParameterByName('flow_id')
        if (flow_id != undefined && flow_id != "") {
            $.ajax({
                //几个参数需要注意一下
                type: "GET",//方法类型
                url: flow_url + flow_id,//url
                data: {},
                headers: headers,
                async: false,
                success: function (result) {
                    if (result["message"] == "success") {
                        flowchart_info = result["records"][0]["flowchart_info"]
                        if (flowchart_info != null && flowchart_info != undefined) {
                            $flowchart.flowchart('setData', flowchart_info);
                        }
                    }

                },
                error: function (result) {
                    console.log(result);
                }
            });
        }
        function getParameterByName(name, url = window.location.href) {
            name = name.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }

        // 测试流程关系梳理
        $(document).on('click', '.btn-topsek-test', function () {
            // 获取当前流程信息
            const flowchart_info = $flowchart.flowchart('getData')
            // 获取起点信息
            console.log(flowchart_info)
            let start_operators_id
            let end_operators_id
            $.each(flowchart_info["operators"], function (operators_id, item) {
                if (item["properties"]["title"] == "起点") {
                    start_operators_id = operators_id
                } else if (item["properties"]["title"] == "终点") {
                    end_operators_id = operators_id
                }
            })
            const operator_dict = flowchart_info["operators"]
            const links_dict = flowchart_info.links
            console.log(links_dict)
            const operatorId = 2
            for (var linkId in links_dict) {
                if (links_dict.hasOwnProperty(linkId)) {
                    var linkData = links_dict[linkId];
                    if (linkData.fromOperator === operatorId) {
                        console.log(linkData)
                    }
                }
            }
            $.each(operator_dict, function (key, item) {
                item["node_type"] = item["properties"]["title"]
                item["node_uuid"] = item["properties"]["uuid"]
                item["child"] = []
            })
            let operators_id_list = [start_operators_id]
            let operators_id_list_new = []
            while (operators_id_list.length != 0) {
                operators_id_list_new = []
                operators_id_list_new = refresh_operators_id_list(operators_id_list, operators_id_list_new)
                // console.log($flowchart.flowchart('getLinksTo',operators_id))
                operators_id_list = operators_id_list_new
                // console.log(operators_id_list)
                console.log(operators_id_list_new)
                // console.log(operator_dict)
            }

            console.log(start_operators_id, end_operators_id)
            console.log(operators_id_list)
            console.log(operators_id_list_new)

            console.log(flowchart_info)
            let check_result = true
            $.each(operator_dict, function (key, item) {
                if (item["node_type"] != "终点" && item["child"].length == 0) {
                    check_result = false
                    alert("节点" + item["node_type"] + key + " 为无效节点，将不执行该分支流程(uuid:" + item["node_uuid"] + ")")
                }
            })
            if (check_result) {
                $.each(operator_dict, function (key, item) {
                    item.operatorId = key
                    $flowchart.flowchart('setOperatorData', key, item);
                })
            }

        })
    });

    var refresh_operators_id_list = function (operators_id_list, operators_id_list_new) {
        $.each(operators_id_list, function (key, operators_id) {
            const link_from_list = []
            console.log(links_dict)
            for (var linkId in links_dict) {
                if (links_dict.hasOwnProperty(linkId)) {
                    var linkData = links_dict[linkId];
                    if (linkData.fromOperator == operators_id) {
                        link_from_list.push(linkData);
                    }
                }
            }
            console.log("连接信息")
            console.log(operators_id)
            console.log(link_from_list)
            $.each(link_from_list, function (key, item) {
                if (operator_dict[operators_id]["child"].indexOf(item["toOperator"]) == -1) {
                    operator_dict[operators_id]["child"].push(item["toOperator"])
                    operators_id_list_new.push(item["toOperator"])
                }

            })
        })
        return operators_id_list_new
    }

    var defaultFlowchartData = {
        operators: {
            operator1: {
                top: 20,
                left: 20,
                properties: {
                    title: 'Operator 1',
                    inputs: {},
                    outputs: {
                        output_1: {
                            label: 'Output 1',
                        }
                    }
                }
            },
            operator2: {
                top: 80,
                left: 300,
                properties: {
                    title: 'Operator 2',
                    inputs: {
                        input_1: {
                            label: 'Input 1',
                        },
                        input_2: {
                            label: 'Input 2',
                        },
                    },
                    outputs: {}
                }
            },
        },
        links: {
            link_1: {
                fromOperator: 'operator1',
                fromConnector: 'output_1',
                toOperator: 'operator2',
                toConnector: 'input_2',
            },
        }
    };
    // if (false) console.log('remove lint unused warning', defaultFlowchartData);

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

    // 左侧配置 弹出框统一样式
    var showLeftModal = function self(o) {
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
        self.$modal.css({ 'width': options.size + "%", 'margin-left': "50%", 'top': "0%", "height": "100vh" });
        self.$modal.css({ 'width': options.size + "%", 'margin-left': (50 - options.size) + "%", 'top': "0%", "height": "100vh" });
        self.$modal.data('bs.modal', false);
        self.$modal.find('.modal-dialog').removeClass().addClass('modal-dialog ');
        self.$modal.find('.modal-content').html('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">${title}</h4></div><div class="modal-body modal-body-scrolling" style="height: 100vh;max-height: calc(100vh - 175px);">${body}</div><div class="modal-footer"></div>'.replace('${title}', options.title).replace('${body}', options.body));

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
        // self.$modal.fadeIn(1000);

    };

    // 左侧提示框
    var showLeftNote = function self(o) {
        const fadeOutTime = 4000
        var options = $.extend({
            body: '',
            remote: false,
            backdrop: false,
            size: 50,
            onShow: false,
            onHide: false
        }, o);
        self.onShow = typeof options.onShow == 'function' ? options.onShow : function () { };
        self.onHide = typeof options.onHide == 'function' ? options.onHide : function () { };
        if (self.$modal === undefined) {
            self.$modal = $('<div class="modal note"><div class="modal-dialog"><div class="modal-content"></div></div></div>').appendTo('body');
            self.$modal.on('shown.bs.modal', function (e) {
                self.onShow.call(this, e);
            });
            self.$modal.on('hidden.bs.modal', function (e) {
                self.onHide.call(this, e);
            });
        }
        self.$modal.css({ 'width': "auto", 'right': "2rem", 'top': "2rem", "height": "auto", "left": "auto" });
        self.$modal.data('bs.modal', false);
        self.$modal.find('.modal-dialog').removeClass().addClass('modal-dialog ');
        self.$modal.find('.modal-content').html('<div class="modal-body modal-body-scrolling">${body}</div>'.replace('${body}', options.body));
        self.$modal.modal(options);
        $('.modal.note').show();
        $('.modal.note').fadeOut(fadeOutTime);
    };



})
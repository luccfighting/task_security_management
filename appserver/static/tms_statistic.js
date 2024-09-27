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

    var soar_BaseRowExpansionRenderer = TableView.BaseRowExpansionRenderer.extend({
        canRender: function () {
            return true;
        },
        render: function ($container, rowData) {
            var uuidCell = _(rowData.cells).find(function (cell) {
                return cell.field === 'ID';
            });
            //console.log(uuidCell.value);                
            var taskid = uuidCell.value;
            var readorganizationjob = new SearchManager({
                preview: false
            });
            var runstr = `| readsoarworkflow "report_detail" ${taskid}
                        | search app_name!="WebHook" app_name!="任务ID"
                        | eval status=case(status=="0","正常",status=="1","警告",status=="2","错误")
                        | eval _raw=result
                        | spath message
                        | eval result=if(isnull(message),result,message)
                        | fields - _raw message
                        | rename id as ID app_name as 流程名称 result as 执行日志 status as 执行结果 create_time as 执行时间|eval tag=1
                        | append 
                            [| makeresults 
                            | eval ID=""
                            | eval tag=0] 
                        | eventstats count as count2 
                        | search count2=1 OR tag=1
                        | fields - count2 _time tag`
            // console.log(str)
            readorganizationjob.set({ earliest_time: "0", latest_time: "now", search: runstr }, { tokens: true });
            var mycheckResults = readorganizationjob.data("results", { count: 0, output_mode: 'json' });
            mycheckResults.on("data", function () {
                let str = ""
                str += '<html><div style="width:100%;float:left;"><h4>详细信息</h4><table border="1" style="border-color: #dedede;width:95%"  >';
                str += '<tbody id="tb" style="border-color: #dedede;" >';
                str += '<tr>';
                str += '<td  width="10%" style="color:#1E90FF;border-width: 1px;border-color: #dedede;padding: 8px;border-style: solid;background-color: #F2F4F5 !important;">ID</td> ';
                str += '<td  width="20%" style="color:#1E90FF;border-width: 1px;border-color: #dedede;padding: 8px;border-style: solid;background-color: #F2F4F5 !important;">流程名称</td> ';
                str += '<td  width="30%" style="color:#1E90FF;border-width: 1px;border-color: #dedede;padding: 8px;border-style: solid;background-color: #F2F4F5 !important;">执行日志</td> ';
                str += '<td  width="20%" style="color:#1E90FF;border-width: 1px;border-color: #dedede;padding: 8px;border-style: solid;background-color: #F2F4F5 !important;">执行结果</td> ';
                str += '<td  width="20%" style="color:#1E90FF;border-width: 1px;border-color: #dedede;padding: 8px;border-style: solid;background-color: #F2F4F5 !important;">执行时间</td> ';
                str += '</tr>';
                for (var i = 0; i < mycheckResults.data().results.length; i++) {

                    str += '<tr>';
                    str += '<td  width="10%" style="word-break: break-all;border-color: #dedede;border-top: thin #dedede;border-style: solid;">' + mycheckResults.data().results[i]["ID"] + '</td> ';
                    str += '<td  width="20%" style="word-break: break-all;border-color: #dedede;border-top: thin #dedede;border-style: solid;">' + mycheckResults.data().results[i]["流程名称"] + '</td> ';
                    str += '<td  width="30%" style="word-break: break-all;border-color: #dedede;border-top: thin #dedede;border-style: solid;">' + mycheckResults.data().results[i]["执行日志"] + '</td> ';
                    str += '<td  width="20%" style="word-break: break-all;border-color: #dedede;border-top: thin #dedede;border-style: solid;">' + mycheckResults.data().results[i]["执行结果"] + '</td> ';
                    str += '<td  width="20%" style="word-break: break-all;border-color: #dedede;border-top: thin #dedede;border-style: solid;">' + mycheckResults.data().results[i]["执行时间"] + '</td> ';
                    str += '</tr>';
                }
                str += '</tbody></table></div></html>';
                $container.append(str);
            })

        }
    });

    var tableElement = mvc.Components.getInstance("soar_table");

    tableElement.getVisualization(function (tableView) {
        tableView.addRowExpansionRenderer(new soar_BaseRowExpansionRenderer());
    });

    var task_BaseRowExpansionRenderer = TableView.BaseRowExpansionRenderer.extend({
        canRender: function () {
            return true;
        },
        render: function ($container, rowData) {
            var uuidCell = _(rowData.cells).find(function (cell) {
                return cell.field === 'ID';
            });
            var str = "<html>"
            //console.log(uuidCell.value);                
            var taskid = uuidCell.value;

            var readtaskjournal = new SearchManager({
                preview: false
            });
            var taskstr = `| tmsapi "获取任务日志" ${taskid}
| table create_time audit_log 
| rename create_time as 审计时间 audit_log as 审计日志 
| eval tag=1 
| eventstats count
| append 
    [| makeresults 
    | eval 审计时间="",审计日志=""
    | eval tag=0] 
| eventstats count as count2 
| search count2=1 OR tag=1 
| fields - count2 _time tag count`
            readtaskjournal.set({ earliest_time: "0", latest_time: "now", search: taskstr }, { tokens: true });
            var mytaskResults = readtaskjournal.data("results", { count: 0, output_mode: 'json' });
            mytaskResults.on("data", function () {

                str += '<div style="width:50%;float:left;"><h4>任务流转</h4><table border="1" style="border-color: #dedede;width:95%"  >';
                str += '<tbody id="tb" style="border-color: #dedede;" >';
                str += '<tr>';
                str += '<td  width="10%" style="color:#1E90FF;border-width: 1px;border-color: #dedede;padding: 8px;border-style: solid;background-color: #F2F4F5 !important;">审计时间</td> ';
                str += '<td  width="20%" style="color:#1E90FF;border-width: 1px;border-color: #dedede;padding: 8px;border-style: solid;background-color: #F2F4F5 !important;">审计日志</td> ';
                
                str += '</tr>';
                console.log(mytaskResults.data().results.length)
                if (mytaskResults.data().results.length == 1 && mytaskResults.data().results[0]["审计时间"] == "") {
                    str += '<tr><td colspan="2" style="text-align: center;">暂未审计记录</td></tr>'
                } else {
                    for (var i = 0; i < mytaskResults.data().results.length; i++) {
                        str += '<tr>';
                        str += '<td  width="10%" style="word-break: break-all;border-color: #dedede;border-top: thin #dedede;border-style: solid;">' + mytaskResults.data().results[i]["审计时间"] + '</td> ';
                        str += '<td  width="20%" style="word-break: break-all;border-color: #dedede;border-top: thin #dedede;border-style: solid;">' + mytaskResults.data().results[i]["审计日志"] + '</td> ';
                        
                        str += '</tr>';
                    }
                }

                str += '</tbody></table></div>';


                var readorganizationjob = new SearchManager({
                    preview: false
                });
                var runstr = `| readsoarworkflow "scan_result" ${taskid}
                        | search app_name!="WebHook" app_name!="任务ID"|rename STATUS as status
                        | eval status=case(status=="0","正常",status=="1","警告",status=="2","错误")
                        | eval _raw=result
                        | spath message
                        | eval result=if(isnull(message),result,message)
                        | fields - _raw message
                        | rename id as ID app_name as 流程名称 result as 执行日志 status as 执行结果 create_time as 执行时间|eval tag=1
                        | append 
                            [| makeresults 
                            | eval ID=""
                            | eval tag=0] 
                        | eventstats count as count2 
                        | search count2=1 OR tag=1
                        | fields - count2 _time tag`
                // console.log(str)
                readorganizationjob.set({ earliest_time: "0", latest_time: "now", search: runstr }, { tokens: true });
                var mycheckResults = readorganizationjob.data("results", { count: 0, output_mode: 'json' });
                mycheckResults.on("data", function () {
                    str += '<div style="width:50%;float:left;"><h4>SOAR</h4><table border="1" style="border-color: #dedede;width:95%"  >';
                    str += '<tbody id="tb" style="border-color: #dedede;" >';
                    str += '<tr>';
                    str += '<td  width="10%" style="color:#1E90FF;border-width: 1px;border-color: #dedede;padding: 8px;border-style: solid;background-color: #F2F4F5 !important;">ID</td> ';
                    str += '<td  width="20%" style="color:#1E90FF;border-width: 1px;border-color: #dedede;padding: 8px;border-style: solid;background-color: #F2F4F5 !important;">流程名称</td> ';
                    str += '<td  width="30%" style="color:#1E90FF;border-width: 1px;border-color: #dedede;padding: 8px;border-style: solid;background-color: #F2F4F5 !important;">执行日志</td> ';
                    str += '<td  width="20%" style="color:#1E90FF;border-width: 1px;border-color: #dedede;padding: 8px;border-style: solid;background-color: #F2F4F5 !important;">执行结果</td> ';
                    str += '<td  width="20%" style="color:#1E90FF;border-width: 1px;border-color: #dedede;padding: 8px;border-style: solid;background-color: #F2F4F5 !important;">执行时间</td> ';
                    str += '</tr>';
                    console.log(mycheckResults.data().results.length)
                    if (mycheckResults.data().results.length == 1 && mycheckResults.data().results[0]["ID"] == "") {
                        console.log("soar日志拉取失败")
                        str += '<tr><td colspan="5" style="text-align: center;">未关联到SOAR信息</td></tr>'
                    } else {
                        for (var i = 0; i < mycheckResults.data().results.length; i++) {

                            str += '<tr>';
                            str += '<td  width="10%" style="word-break: break-all;border-color: #dedede;border-top: thin #dedede;border-style: solid;">' + mycheckResults.data().results[i]["ID"] + '</td> ';
                            str += '<td  width="20%" style="word-break: break-all;border-color: #dedede;border-top: thin #dedede;border-style: solid;">' + mycheckResults.data().results[i]["流程名称"] + '</td> ';
                            str += '<td  width="30%" style="word-break: break-all;border-color: #dedede;border-top: thin #dedede;border-style: solid;">' + mycheckResults.data().results[i]["执行日志"] + '</td> ';
                            str += '<td  width="20%" style="word-break: break-all;border-color: #dedede;border-top: thin #dedede;border-style: solid;">' + mycheckResults.data().results[i]["执行结果"] + '</td> ';
                            str += '<td  width="20%" style="word-break: break-all;border-color: #dedede;border-top: thin #dedede;border-style: solid;">' + mycheckResults.data().results[i]["执行时间"] + '</td> ';
                            str += '</tr>';
                        }
                    }

                    str += '</tbody></table></div></html>';
                    $container.append(str);

                })
            })
        }
    });

    var tableElement = mvc.Components.getInstance("task_table");

    tableElement.getVisualization(function (tableView) {
        tableView.addRowExpansionRenderer(new task_BaseRowExpansionRenderer());
    });
});
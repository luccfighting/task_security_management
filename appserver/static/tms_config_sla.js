require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc/simplexml/ready!'], function(
    _,
     $,
    mvc,
    TableView,
    SearchManager) {

        const addnewhtml='<tr class="shared-resultstable-resultstablerow even addnew">'+
        '<td class="string">'+
        '<input type="text" class="add-sla-value" value-key="任务等级" value-key-en="level" style="margin: auto;" value="" placeholder="请输入任务等级（唯一）"></td>'+
        '<td data-cell-index="1" class="string">'+
        '<input type="text" class="add-sla-value" value-key="响应时间" value-key-en="response" style="margin: auto;" value="" placeholder="请输入响应时间（单位：分钟）"></td>'+
        '<td data-cell-index="2" class="string">'+
        '<input type="text" class="add-sla-value" value-key="响应超时通知时间" value-key-en="response_send" style="margin: auto;" value="" placeholder="请输入响应超时通知时间（单位：分钟）"></td>'+
        '<td data-cell-index="3" class="string">'+
        '<input type="text" class="add-sla-value" value-key="处理时间" value-key-en="resolution" style="margin: auto;" value="" placeholder="请输入处理时间（单位：分钟）"></td>'+
        '<td data-cell-index="4" class="string">'+
        '<input type="text" class="add-sla-value" value-key="处理超时通知时间" value-key-en="resolution_send" style="margin: auto;" value="" placeholder="请输入处理超时通知时间（单位：分钟）"></td>'+
        '<td data-cell-index="2" class="null"><div style="float:left;"><a class="btn-addnewsla"  style="padding-right: 10px;font-family: Splunk Platform Mono,Inconsolata,Consolas,Droid Sans Mono,Monaco,Courier New,Courier,monospace;">保存</a><a class="btn-canceladd" style="padding-right: 10px;font-family: Splunk Platform Mono,Inconsolata,Consolas,Droid Sans Mono,Monaco,Courier New,Courier,monospace;">取消</a></div></td></tr>'
        let addnewbody=false

        $(document).on('click','.btn-topsek-addnewsla',function(){
            if(addnewbody==false){
                $('#task_sla_table').find('thead').append(addnewhtml)
                $('.addnew').show();
                addnewbody=true
            }
           
        });

        $(document).on('click','.btn-canceladd',function(){
            $('.addnew').remove();
            addnewbody=false
        });

        $(document).on('click','th',function(){
            $('.addnew').remove();
            addnewbody=false
        });

        $(document).on('click','.btn-addnewsla',function(){
            
            let is_add="true"
            let null_str=''
            let splstr='| makeresults '
            $('.add-sla-value').each(function(){
                console.log($(this).attr('value-key-en'),$.trim($(this).val()))
                if($.trim($(this).val())==''){
                    is_add="false"
                    null_str+=$(this).attr('value-key')+","
                }else{
                    splstr=splstr+' |eval '+$(this).attr('value-key-en')+'="'+$.trim($(this).val())+'"'
                }
            })
            splstr+='| table level response response_send resolution resolution_send| tmsdbquery "insert" "INSERT INTO task_sla(level,response,response_send,resolution,resolution_send) VALUES " "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"'
            
            if(is_add=="true"){
                const checkspl='|tmsdbquery "select" "select count(*) from task_sla where level=\''+$('.add-sla-value[value-key-en="level"]').val()+'\'"  "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"'
                console.log(checkspl)
                const checksearchmanager =  new SearchManager({
                            preview: false
                        });
                checksearchmanager.set({earliest_time: "0", latest_time: "now", search: checkspl}, {tokens: true});
                var mycheckResults = checksearchmanager.data("results");
                mycheckResults.on("data", function() {
                    console.log("Has data? ", mycheckResults.hasData());
                    // console.log("Type: ", myChoice);
                    console.log("Data (rows): ", mycheckResults.data().rows);
                    console.log("Data (rows count): ", mycheckResults.data().rows.length);
                    const datajson=mycheckResults.data().rows[0]['0']
                    console.log("is level already exists:",datajson)
                    console.log("Backbone collection: (rows) ", mycheckResults.collection().raw.rows);
                    if(datajson=="1"){
                        alert("同名任务等级已存在,请调整后重新保存")
                    }else{
                        console.log("开始插入数据：",splstr)
                        const insertsearchmanager=new SearchManager({
                            preview: false
                        });
                        insertsearchmanager.set({earliest_time: "0", latest_time: "now", search: splstr}, {tokens: true});
                        var myinsertResults = insertsearchmanager.data("results");
                        myinsertResults.on("data", function() {
                            // alert(myinsertResults.data().rows[0]['0'])
                            alert("保存成功")
                            $('.addnew').remove();
                            addnewbody=false
                            $('.refresh').click()
                        });
                    }
                });
            }else{
                alert(null_str+"发现以上字段未填,均为必填项")
            }
        });

        $(document).on('click','.btn-topsek-deletesla',function(){
            console.log("Console Log: 开始调用删除脚本");
            var id = $(this).attr('sid');
            let splstr='| makeresults '
            splstr+='| table name create_user| tmsdbquery "delete" "DELETE FROM task_sla WHERE id=\''+id+'\'" "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"'
            console.log(splstr)
            this._searchManager = new SearchManager({
           			     preview: false
           			 });
            this._searchManager.set({earliest_time: "0", latest_time: "now", search: splstr}, {tokens: true});
            this._searchManager.data("results").on("data", function() {
		            alert("执行成功");		
                    $('.refresh').click()
                    $(".alertOut").css('display',"none");
                    $(".alertOutBg").css('display',"none");
                    $(".popOut").css('display',"none");
                    $(".popOutBg").css('display',"none");
                    $(".deleteOut").css('display',"none");
                    $(".deleteOutBg").css('display',"none");
		    });          
        })

        var CustomIconRenderer = TableView.BaseCellRenderer.extend({
            canRender: function() {
                return true;
            },
            render: function($td, cell) {
                // Compute the icon base on the field value
                var icon;
                var color = "#84BBFC";
                if(cell.field === '操作') {
                    var value_arr  = cell.value.split('#slasplit#');
                    let r=value_arr[0]
                    const can_delete=value_arr[1]
                    let html_str='<div style="float:left;"><a class="btn-topsek-changesla" style="padding-right: 10px;" sid="<%-r%>" >编辑</a><a class="btn-topsek-changesavesla" style="padding-right: 10px;display:none;" sid="<%-r%>" >保存</a><a class="btn-topsek-unchangesla" style="padding-right: 10px;display:none;" sid="<%-r%>" >取消</a>'
                    if(can_delete == 1) {
                       html_str+='<a  sid="<%-r%>"  class="btn-topsek-deletesla" >删除</a>'
                    }
                    html_str+='</div>'
                    $td.addClass('icon-inline numeric').html(_.template(html_str, {
                        }));
                }else if(cell.field === '任务等级' && (cell.value == "P1" || cell.value == "P2" || cell.value == "P3" || cell.value == "P4" || cell.value == "P5")) {
                    $td.addClass('icon-inline numeric').html(_.template('<%-text%>', {
                        icon: icon,
                        text: cell.value
                    }));
                }else{
                    $td.addClass('icon-inline numeric').html(_.template('<span class="spanToInput" tfield="<%-text_field%>"><%-text%></span>', {
                        text_field: cell.field,
                        text: cell.value
                    }));
                }
            }
        });

        var tableElement = mvc.Components.getInstance("task_sla_table");

        tableElement.getVisualization(function(tableView){
            tableView.addCellRenderer(new CustomIconRenderer());
        });

        $(document).on('click','.btn-topsek-changesla',function(){
            $('.btn-topsek-changesla[sid='+$(this).attr('sid')+']').hide()
            $('.btn-topsek-deletesla[sid='+$(this).attr('sid')+']').hide()
            $('.btn-topsek-unchangesla[sid='+$(this).attr('sid')+']').show()
            $('.btn-topsek-changesavesla[sid='+$(this).attr('sid')+']').show()
            $(this).attr('sla-sid',$(this).parent('div').parent('td').parent('tr').attr('data-cid'));
            // $('td').attr('sla-tid','sla-'+$('td').parent('tr').attr('data-cid'));
            // $('td').children('span').attr('sla-sid','sla-'+$('td').parent('tr').attr('data-cid'));
            var slatid=$(this).parent('div').parent('td').parent('tr').attr('data-cid');
            var eachclassname='.spanToInput'
            var orignalnodename = "spanToInput"
            $('tr[data-cid="'+slatid+'"] td').each(function(){
                $(this).children('span').attr("sla-sid",slatid);
            });
            var eachclassname='.spanToInput'
            $(eachclassname+'[sla-sid="'+slatid+'"]').each(function(){
                var cId=$(this).attr("sla-sid");//获取当前点击span的id
                var $input=$("<input>",{
                    val:$(this).text(),
                    type:"text"
                });
                $input.addClass(cId);
                $input.attr("sla-sid",cId);
                $input.attr("default-value",$(this).text());
                $input.attr("orignalnodename",orignalnodename);
                $(this).replaceWith($input);
             });  
            
        })

        $(document).on('click','.btn-topsek-changesavesla',function(){
            $('.btn-topsek-changesla[sid='+$(this).attr('sid')+']').show()
            $('.btn-topsek-deletesla[sid='+$(this).attr('sid')+']').show()
            $('.btn-topsek-unchangesla[sid='+$(this).attr('sid')+']').hide()
            $('.btn-topsek-changesavesla[sid='+$(this).attr('sid')+']').hide()
            var eachclassname='.spanToInput'
            var slatid=$(this).parent('div').parent('td').parent('tr').attr('data-cid');
            var task_id = $(this).attr('sid')
            var eachclassname='.spanToInput'
            $('.'+slatid).each(function(){
                var cId=$(this).attr("sla-sid");//获取当前点击input的id
                var orignalnodename = $(this).attr("orignalnodename");
                console.log($(this).attr("orignalnodename"))
            //console.log($("#"+cId).prop('nodeName').toLowerCase());
                var thisTag=$(this).prop('nodeName').toLowerCase();
                console.log(thisTag)
                var a,b=null;
                if(thisTag=="input"){
                    a=$(this).val();
                    b=switchToInput;
                }
                else if(thisTag=="select"){
                    a=$(this).find("option:selected").text();//获取selected的option文本值
                    b=switchToSelect;
                }
                else if(thisTag=="textarea"){
                    a=$(this).val();
                    b=switchToTextarea;
                }
                var $span=$("<span>",{
                            text: a
                        });
                $span.addClass(orignalnodename);
                $span.attr("sla-sid",cId);
                $(this).replaceWith($span);
            });  
            console.log(slatid)
            const i={}
            i['1']="response"
            i['2']="response_send"
            i['3']="resolution"
            i['4']="resolution_send"
            const json_str={}
            $('span[sla-sid="'+slatid+'"').each(function(){
                console.log($(this).text())
                var indexid = $(this).parent('td').attr('data-cell-index')
                json_str[i[indexid]]=$(this).text()
            });
            this._searchManager = new SearchManager({
                        preview: false
                    });
            const splstr=`|makeresults|eval sql="response='${json_str["response"]}',response_send='${json_str["response_send"]}',resolution='${json_str["resolution"]}',resolution_send='${json_str["resolution_send"]}' WHERE id='${task_id}'"|table sql| tmsdbquery "update" "UPDATE task_sla SET " "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"`
            console.log('sla信息已获取：',splstr)
            this._searchManager.set({earliest_time: "0", latest_time: "now", search: splstr}, {tokens: true});
            this._searchManager.data("results").on("data", function() {
                    console.log("执行成功");	
                    // $('.hide_task_detail').click()
                    // $('.refresh').click()	
            }); 
        })

        $(document).on('click','.btn-topsek-unchangesla',function(){
            $('.btn-topsek-changesla[sid='+$(this).attr('sid')+']').show()
            $('.btn-topsek-deletesla[sid='+$(this).attr('sid')+']').show()
            $('.btn-topsek-unchangesla[sid='+$(this).attr('sid')+']').hide()
            $('.btn-topsek-changesavesla[sid='+$(this).attr('sid')+']').hide()
            var eachclassname='.spanToInput'
            var slatid=$(this).parent('div').parent('td').parent('tr').attr('data-cid');

            var eachclassname='.spanToInput'
            $('.'+slatid).each(function(){
                var cId=$(this).attr("sla-sid");//获取当前点击input的id
                var orignalnodename = $(this).attr("orignalnodename");
                console.log($(this).attr("orignalnodename"))
            //console.log($("#"+cId).prop('nodeName').toLowerCase());
                var thisTag=$(this).prop('nodeName').toLowerCase();
                console.log(thisTag)
                var a,b=null;
                if(thisTag=="input"){
                    a=$(this).attr('default-value');
                    b=switchToInput;
                }
                else if(thisTag=="select"){
                    a=$(this).find("option:selected").text();//获取selected的option文本值
                    b=switchToSelect;
                }
                else if(thisTag=="textarea"){
                    a=$(this).val();
                    b=switchToTextarea;
                }
                var $span=$("<span>",{
                            text: a
                        });
                $span.addClass(orignalnodename);

                $span.attr("sla-sid",cId);
                $(this).replaceWith($span);
            });  
            
        })

        // input select textarea转span
        var switchToSpan=function () {
            // console.log($(this).attr("sla-sid"));
            var cId=$(this).attr("sla-sid");//获取当前点击input的id
            var orignalnode = $(this).attr("orignalnodename");
           //console.log($("#"+cId).prop('nodeName').toLowerCase());
            var thisTag=$(this).prop('nodeName') //.toLowerCase();
            var a,b=null;
            if(thisTag=="input"){
                a=$(this).val();
                b=switchToInput;
            }
            else if(thisTag=="select"){
                a=$(this).find("option:selected").text();//获取selected的option文本值
                b=switchToSelect;
            }
            else if(thisTag=="textarea"){
                a=$(this).val();
                b=switchToTextarea;
            }
            var $span=$("<span>",{
                        text: a
                    });
            $span.addClass(orignalnode);
            $span.attr("sla-sid",cId);
            $(this).replaceWith($span);
                // $span.on("click",b);
        };
        // span转input
        var switchToInput=function () {
            console.log('this:',$(this));
            var cId=$(this).attr("sla-sid");//获取当前点击span的id
            var orignalnodename = "spanToInput"
            var $input=$("<input>",{
                val:$(this).text(),
                type:"text"
            });
            $input.addClass(cId);
            $input.prop("name",orignalnodename);
            $input.attr("sla-sid",cId);
            $(this).replaceWith($input);
            console.log($input)
            // $input.on("blur",switchToSpan);//失去焦点时，执行switchToSpan函数
            // $input.select();
        };
// span转select
        var switchToSelect=function () {

            var cId = $(this).attr("sla-sid");//获取当前点击input的id
            var $select = $("<select></select>");
            var arr=[["国有企业","集体企业","私营企业","三资企业"],["人数<20","20≤人数<300","300≤人数<1000","1000≤人数<5000","人数≥5000"]];
            var j=null;
            if(cId=="companyType"){
                //var arr1=new Array("国有企业","集体企业","私营企业","三资企业");
                //console.log(arr1);
                $select.addClass("midBtn1");
                j=0;
            }
            else if(cId=="companySize"){
                j=1;
                $select.addClass("midBtn1");
            }
            for(var i=0;i<arr[j].length;i++){
                $select.append("<option value='"+arr[j][i]+"'>" +arr[j][i]+"</option>");
            }
            $select.addClass(cId);
            $select.attr("sla-sid", cId);
            $(this).replaceWith($select);
            $select.on("blur",switchToSpan);
}
// span转textarea
var switchToTextarea=function () {
            var cId = $(this).attr("sla-sid");
            var $textarea=$("<textarea cols='50' rows='6'></textarea>");
            $textarea.val($(this).text());
            $textarea.addClass(cId);
            $textarea.attr("sla-sid",cId);
            $(this).replaceWith($textarea);
            $textarea.on("blur",switchToSpan);
            $textarea.select();

        }
// // 给span添加点击事件
//         $(".spanToInput").on("click",switchToInput);
//         $(".spanToSelect").on("click",switchToSelect);
//         $(".spanToTextarea").on("click",switchToTextarea);

        
        
});
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
        var tokensDefault = mvc.Components.get("default");
        
                
        tokensDefault.on("change:useraction",function(nodevalue,options){
            tablestatus=$.trim(tokensDefault.get('table_status'));
            console.log("tablestatus:",tablestatus)
            if(tablestatus=="未认领" || tablestatus=="已完成" || tablestatus=="审核中" || tablestatus=="已关闭"){
                $('.task-detail-value').parent('a').attr('disabled','disabled');
                // $('.task-detail-value[value-key-en="role"]').parent('a').attr('disabled','disabled');
            }else{
                console.log(tablestatus)
                // $('.task-detail-value[value-key-en="level"]').parent('a').removeAttr('disabled','disabled');
                $('.task-detail-value').parent('a').removeAttr('disabled','disabled');
            }
        });


        // 内嵌的iframe设置边距
        $('#tms_mytask_row2').find('div[class="panel-body html"]').css('padding','0')
        $(document).on('click','.toggle-tab',function(){
            $('.toggle-tab').each(function(){
                // console.log("遍历",$(this).attr("data-elements"));
                hidedivlist = $(this).attr("data-elements")
                hidediv = hidedivlist.split(",")
                for(i=0 ;i<hidediv.length;i++){
                    // console.log(hidediv[i]);
                    $("#"+hidediv[i]).hide();
                }
                });	
            tokensDefault.set('form.iframe_url',$(this).attr('iframe_str'))
            refreshiframe()
            showdivlist = $(this).attr("data-elements")
            // console.log(showdivlist);
            showdiv = showdivlist.split(",")
            // console.log(showdiv);
            for(i=0 ;i<showdiv.length;i++){
                    console.log(showdiv[i]);
                    $("#"+showdiv[i]).show();
            }
        });

        // //更新筛选框
        // tokensDefault.on("change:form.level",function(nodevalue,options){
        //     refreshiframe()
        // });


        function refreshiframe(){
            var tms_mytask_iframe = document.getElementById("tms_mytask_iframe");
            // console.log(tms_mytask_iframe)
            console.log($('#tms_mytask_iframe').prop('contentWindow').document.body.clientHeight);
            if(tms_mytask_iframe.attachEvent){
                tms_mytask_iframe.attachEvent("onload",function(){
                    $('#tms_mytask_iframe').css("height",$('#tms_mytask_iframe').prop('contentWindow').document.body.clientHeight+100);
                });
            }else{
                tms_mytask_iframe.onload =function(){
                    $('#tms_mytask_iframe').css("height",$('#tms_mytask_iframe').prop('contentWindow').document.body.clientHeight+100);
                }
            }
        }
        window.setInterval(function(){
            // console.log($('#tms_mytask_iframe').prop('contentWindow').document.body.clientHeight);
            if($('#tms_mytask_iframe').height()<=1050){
            $('#tms_mytask_iframe').css("height",$('#tms_mytask_iframe').prop('contentWindow').document.body.clientHeight+100);   }
            else{
                $('#tms_mytask_iframe').css("height",$('#tms_mytask_iframe').prop('contentWindow').document.body.clientHeight);
            }        
        }, 200);

        var CustomIconRenderer = TableView.BaseCellRenderer.extend({
            canRender: function(cell) {
                return true;
            },
            render: function($td, cell) {
                // Compute the icon base on the field value
                var icon;
                var color = "#84BBFC";
                if(cell.field === '操作') {
                    r  = cell.value;
                    if(r == 0) {
                        $td.addClass('icon-inline numeric').html(_.template('<div style="float:left;"></div>', {
                        }));
                    }else{
                        $td.addClass('icon-inline numeric').html(_.template('<div style="float:left;"><a  r="<%-r%>"  class="show_task_detail" style="padding-right: 10px;" >详情</a><a style="display:none" r="<%-r%>"  class="deletetask" >删除</a></div>', {
                        }));
                    }
                } else if(cell.field === 'SLA进度'){
                    r  = cell.value;
                    if(r>=0){
                        if(r<=33){
                            c = '#53A051';
                        }
                        else if(r<=66){
                            c = '#F1813F';
                        }else{
                            c = '#DC4E41';
                        }
                        $td.addClass('icon-inline numeric').html(_.template('<div style="float:left;"><div class="container"><div class="skills loading" style="background-color:<%-c%>;width:<%-r%>%;"><%-r%>%</div> </div></div>', {
                            }));
                    }else{
                        $td.addClass('icon-inline numeric').html(_.template('<div style="float:left;"></div>', {
                        }));
                    }
                }else if(cell.field === '任务描述'|| cell.field==='任务名称'){
                    
                    $td.addClass('icon-inline').html(_.template('<div style="overflow: hidden;text-overflow: ellipsis;width: 100%;height: 20px;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient:vertical;" title="<%-text%>"><%-text%></div>', {
                        icon: icon,
                        text: cell.value
                    }));
                }else{
                    $td.addClass('icon-inline numeric').html(_.template('<div style="float:left;"><%-text%></div>', {
                        icon: icon,
                        text: cell.value
                    }));
                }
            }
        });

        var tableElement = mvc.Components.getInstance("task_table");

        tableElement.getVisualization(function(tableView){
            tableView.addCellRenderer(new CustomIconRenderer());
        });

        //删除某条任务
        $(document).on('click','.deletetask',function(){
            splstr='| makeresults '
            splstr+='| table name create_user| tmsdbquery "insert" "DELETE FROM task_info WHERE '+$(this).attr('r')+'" "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"'
            console.log(splstr)
            this._searchManager = new SearchManager({
           			     preview: false
           			 });
            this._searchManager.set({earliest_time: "0", latest_time: "now", search: splstr}, {tokens: true});
            this._searchManager.data("results").on("data", function() {
		            alert("执行成功");		
		    });
            var a=tokensDefault.get('changecount');
		    a=parseInt(a)+1;
		    tokensDefault.set('form.changecount', parseInt(a));
        });

        // 显示任务明细
        $(document).on('click','.show_task_detail',function(){
            tokensDefault.set('form.task_search',$(this).attr('r'))
            window.open("tms_asm_task_portrait?form.task_id=" + $(this).attr('r').replace(" id='","").replace("'",""))
            // $('.refresh').click()
            // $('#tms_mytask_row1').show();
            // $('#tms_mytask_row2').show();
            // $('#task_row1').hide();
            // $('#task_row2').hide();
            // $('.toggle-tab[iframe_str="tms_related_journal"]').click();
            // tablestatus=$.trim(tokensDefault.get('table_status'));
            // console.log(tablestatus)
            // if(tablestatus=="未认领"){
            //     console.log($('.task-detail-value[value-key-en="level"]').parent('a').html())
            //     $('.task-detail-value[value-key-en="level"]').parent('a').attr('disabled','disabled');
            //     $('.task-detail-value[value-key-en="role"]').parent('a').attr('disabled','disabled');
                
            // }else{
            //     console.log(tablestatus)
            //     $('.task-detail-value[value-key-en="level"]').parent('a').removeAttr('disabled','disabled');
            //     $('.task-detail-value[value-key-en="role"]').parent('a').removeAttr('disabled','disabled');
             
            // }
        });

        // 返回
        $(document).on('click','.hide_task_detail',function(){
            $('#tms_mytask_row1').hide();
            $('#tms_mytask_row2').hide();
            $('.toggle-tab[data-elements="默认"]').click();
            $('#task_row1').show();
            $('#task_row2').show();
        });

        //弹出框隐藏
        $(document).on('click','.btn-cancel',function(){
            $('.addnew').remove();
            addnewbody=false
            $('.popOutBg').hide();
            $('.popOut').hide();
        });

        $(document).on('click','.close',function(){
            $('.popOutBg').hide();
            $('.popOut').hide();
        });

        $(document).on('click','.popOutBg',function(){
            $('.popOutBg').hide();
            $('.popOut').hide();
        });

        //下拉选择    
        var up_data = {'cron':''};
        $(document).on('click','.synthetic-select',function(){
            //  console.log(up_data);
            // console.log("下拉框");
            //  console.log($(this).text());
            var text = $.trim($(this).text());
            //  document.getElementById('#control-task-cycle.a').setAttribute("dropdown-toggle", text);
            //$('#control-task-cycle').children('a').children('.link-label').html(text);
            if($(this).parent('li').parent('ul').parent('div').prev('a').children('.link-label').attr('value-key-en')=="status" && text=="未认领"){
                $('.task-detail-value[value-key-en="level"]').parent('a').attr("disabled","disabled");
                 $('.task-detail-value[value-key-en="level"]').parent('a').prop("title","请认领后再操作");
            }
            $(this).parent('li').parent('ul').parent('div').prev('a').children('.link-label').html(text);
            tokensDefault.set('form.'+$(this).parent('li').parent('ul').parent('div').prev('a').children('.link-label').attr('value-key-en'),text)
            $('.icon-check').css("display","none");
            $(this).children('i').css("display","inline");
            up_data['cron'] = text;
            //console.log(up_data);
        });
        
        //控制弹出框下拉内容
        $(document).on('click','.control-topsek',function(){ 
            //$('.schedule_daily').children('div').removeClass('open');
            //$('.schedule_monthly').children('div').removeClass('open');
            //$('.schedule_weekly').children('div').removeClass('open'); 
            if($(this).children('.dropdown-toggle').attr('disabled')=="disabled"){
                cosonle.log("请认领后再编辑")
            }else{
                $('.dropdown-menu').hide();
                var menuid = '#'+$(this).attr('menu-name');
                var menuselect = menuid.split("-");
                var menuvalue = $(this).children('a').children('.btn-topsek-value').html();
                //alertani();           
                //console.log("menuid:",menuid);
                //console.log("menuselect:",menuselect);
                //console.log("class:",div.className);
                if($(menuid).hasClass('open')){
                    $(menuid).removeClass('open');
                    $(menuid).hide();
                }else{
                    $(menuid).addClass('open');
                    $(menuid).show();
                    $(menuid).focus();
                    var menu = tokensDefault.get(menuselect[1]);
                    //console.log(menu);
                    var menulist = menu.split("|");
                    str="";               
                    for(var i=0;i<menulist.length;i++){
                        //console.log(menuvalue);
                        //console.log(menulist[i]);
                        if(menulist[i] == menuvalue){
                            menuicon="block";
                        }else{
                            menuicon="none";
                        }
                        str+=`<li><a class="synthetic-select " href="#" data-item-idx="0" data-item-value="hourly"><i class="icon-check" style="display:${menuicon}"/><span class="link-label">`;
                        str+=menulist[i];
                        str+='</span></a></li>';
                    }
                    //console.log("str:",str);
                    $(menuid).children('ul').html(str);
                    
                }
            }
		});
        
        //更新任务信息
        $(document).on('click','.update_task_info',function(){
            console.log('开始更新任务信息，请稍后')
            var eachclassname='task-detail-value'
            var task_role = $.trim($('.task-detail-value[value-key-en="role"]').html())
            var task_level = $.trim($('.task-detail-value[value-key-en="level"]').html())
            var task_owner = $.trim($('.task-detail-value[value-key-en="user_name"]').html())
            var task_status = $.trim($('.task-detail-value[value-key-en="status"]').html())
            var task_id = $(this).attr('taskid')
            console.log("人员信息",task_owner)
            console.log("人员信息",tokensDefault.get('account'))
            if(task_status == "未认领"){
                var task_owner = tokensDefault.get('account')
                var task_status = "已认领"
            }
            this._searchManager = new SearchManager({
                            preview: false
                        });
            this._searchManager2 = new SearchManager({
                            preview: false
                        });
            splstr=`|makeresults|eval sql="level='${task_level}',user_name='${task_owner}',role='${task_role}',status='${task_status}' WHERE id='${task_id}'"|table sql| tmsdbquery "update" "UPDATE task_info SET " "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"`
            console.log('任务信息已获取：',splstr)
            this._searchManager.set({earliest_time: "0", latest_time: "now", search: splstr}, {tokens: true});
            var splstr_audit=`|makeresults|eval task_id="${task_id}"|eval audit_log="用户:$env:user$,动作:更新了任务信息,任务等级:${task_level},角色:${task_role},负责人:${task_owner},状态:${task_status}"|table task_id audit_log| tmsdbquery "insert" "INSERT INTO task_log(task_id,audit_log) VALUES" "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"|append [|xdralertingapi "工单日志" "${task_id}" "用户:$env:user$,动作:更新了任务信息,任务等级:${task_level},角色:${task_role},负责人:${task_owner},状态:${task_status}" "${task_owner}" "${task_status}"]`
            console.log(splstr_audit)
            // 时间 名称 描述 用户 结果 
            this._searchManager2.set({earliest_time: "0", latest_time: "now", search: splstr_audit}, {tokens: true});
            this._searchManager2.data("results").on("data", function() {
                console.log("执行成功",splstr);	                       
            }); 
            this._searchManager.data("results").on("data", function() {
                    alert("执行成功");	
                    $('.hide_task_detail').click()
                    $('.refresh').click()	
            }); 
        });
        //增加任务
        $(document).on('click','.btn-addnewtask',function(){
            splstr='| makeresults '
            var eachclassname='task-topsek-value'
            var d = {};
            var json_str = {};
            is_save="True"
            $('.'+eachclassname).each(function(){
                //console.log($(this).prop("tagName"));
                dtype = $(this).prop("tagName")
                if(dtype == "SPAN"){
                    if($(this).attr('value-default')==$.trim($(this).html()) || $.trim($(this).html())==""){                      
                        console.log("未填项：",$.trim($(this).attr('value-key')));
                        is_save="False"
                    }else{
                    json_str[$(this).attr('value-key-en')] = $.trim($(this).html());
                    }
                }else{
                    if(($.trim($(this).val())=="" || $.trim($(this).val()) == null) && $(this).attr('is_default')!="true"){
                        console.log("未填项：",$.trim($(this).attr('value-key')));
                        is_save="False"
                    }else{
                    json_str[$(this).attr('value-key-en')] = $.trim($(this).val());
                    }
                }
             });
            splstr=splstr+' |eval '
            if(is_save=="True"){
                for (var key in json_str) {
                    console.log(key);
                    console.log(json_str[key]);
                    splstr += key + "=\"" + json_str[key] + "\"|eval "
                }
                splstr+=' update_time=strftime(now(),"%F %T")|eval status=if(isnotnull(user_name) AND user_name!="","已认领",status)| table name level create_user description user_name role status update_time| tmsdbquery "insert" "INSERT INTO task_info(name,level,create_user,description,user_name,role,status,update_time) VALUES " "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"'
                // alert(splstr)
                console.log(splstr)
                this._searchManager = new SearchManager({
                            preview: false
                        });
                this._searchManager.set({earliest_time: "0", latest_time: "now", search: splstr}, {tokens: true});
                this._searchManager.data("results").on("data", function() {
                        $('.addnew').remove();
                        addnewbody=false
                        alert("执行成功");	
                        var a=tokensDefault.get('changecount');
                        a=parseInt(a)+1;
                        tokensDefault.set('form.changecount', parseInt(a));
                        $('.popOutBg').hide();
                        $('.popOut').hide();
                }); 
            }else{
                alert("您有未填项");
            }

            
        });

        $(document).on('click','.task_span',function(){
            console.log($(this).attr('task_value'))
            tokensDefault.set('form.task_status_type',$(this).attr('task_value'));
            $('.task_span_choose').each(function(){
                $(this).hide();
            })
            $(this).children('.task_span_choose').show()
            if($(this).attr('task_value')=="*"){
                tokensDefault.set('form.task_status',"!=\"处理完成\"");
            }else{
                tokensDefault.set('form.task_status',"=\"*\"");
            }
        });

});
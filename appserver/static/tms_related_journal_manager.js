require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc/simplexml/ready!'], function(
    _,
     $,
    mvc,
    SearchManager) {
        var tokensDefault = mvc.Components.get("default");
        // 判断该任务当前处理人，防止越权操作
        tokensDefault.on("change:isowner",function(){
            const isowner=tokensDefault.get('isowner')
            if(isowner=="false"){
                $('.task_journal').attr('disabled','disabled')
            }
        });
        tokensDefault.on("change:task_status",function(){
            const task_status=tokensDefault.get('task_status')
            if(task_status=="未通过" || task_status=="处理中"  || task_status=="已认领"  || task_status=="未认领" ){
                $('.task_journal').attr('disabled','disabled')
            }else if(task_status=="已关闭"){
                $('.task_journal').attr('disabled','disabled');
                $('#add_journal_row').hide()
            }
        });

        function can_edit(alertinfo){
            const isowner=tokensDefault.get('isowner')
            const task_status=tokensDefault.get('task_status')
            if(task_status=="已关闭"){
                alert('提示信息：任务已关闭')
            }else if(isowner=="false"){
                alert('异常警告：您无权编辑该任务')
            }else if(task_status=="已完成"){
                alert('提示信息：任务已完成,请等待管理员审核,审核期间无法编辑')
            }else if(alertinfo){
                alert(alertinfo)
            }
        }
        
        $(document).on('click','.btn-topsek-addnewjournal',function(){
            var addtext = $('.task_journal').val();
            if(addtext==""){
                can_edit("请输入工作日志")
            }else{
                var task_id = $(this).attr('task_id')
                var user_id = $(this).attr('user_id')
                this._searchManager = new SearchManager({
                                preview: false
                            });
                var splstr=`|makeresults|eval task_id="${task_id}" |eval user_id="${user_id}" |eval journal="${addtext}"|eval update_time=strftime(now(),"%F %T")| table task_id journal user_id| tmsdbquery "insert" "INSERT INTO task_journal(task_id,journal,user_id) VALUES " "127.0.0.1" "3306" "hjsecurity" "esc@t0pSek" "isoc_task"`
                
                console.log(splstr)
                this._searchManager.set({earliest_time: "0", latest_time: "now", search: splstr}, {tokens: true});
                this._searchManager.data("results").on("data", function() {
                        alert("执行成功");
                        $('.refresh').click()	
                }); 
            }
        });        
    });
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
        $(document).on('click','.btn-topsek-plugging',function(){
            $('.plugging-topsek-value[value-key-en="acl_name"]').removeAttr('disabled')
            $('.plugging-topsek-value[value-key-en="acl_name"]').val('')
            $('.plugging-topsek-value[value-key-en="acl_level"]').val('')
            $('.plugging-topsek-value[value-key-en="dev_type"]').val('')
            $('.plugging-topsek-value[value-key-en="dev_name"]').val('')
            $('.plugging-topsek-value[value-key-en="dev_ip"]').val('')
            $('.plugging-topsek-value[value-key-en="user_name"]').val('')
            $('.plugging-topsek-value[value-key-en="password"]').val('')
            $('.plugging-topsek-value[value-key-en="acl_ipcount"]').val('')
            $('.plugging-topsek-value[value-key-en="acl_first"]').val('')
            $('.plugging-topsek-value[value-key-en="acl_second"]').val('')
            $('.plugging-topsek-value[value-key-en="acl_third"]').val('')
            $('.plugging-topsek-value[value-key-en="acl_reload"]').val('')
            $('.plugging-topsek-value[value-key-en="is_auto"]').val('')
            $('.plugging-topsek-value[value-key-en="auto_index"]').val('')
            $('.plugging-topsek-value[value-key-en="auto_field"]').val('')
            $('.popOutBg').show()
            $('.popPlugging').show()
            $('.addplugging').show()
            $('.changeplugging').hide()
        });

        
		$(document).on('click','.popPluggingclose',function(){
		    $(".alertOut").css('display',"none");
			$(".alertOutBg").css('display',"none");
            $(".popOut").css('display',"none");
			$(".popOutBg").css('display',"none");
            $(".deleteOut").css('display',"none");
			$(".deleteOutBg").css('display',"none");
		});
        $(document).on('click','.popPluggingIPclose',function(){
		    $(".alertOut").css('display',"none");
			$(".alertOutBg").css('display',"none");
            $(".popOut").css('display',"none");
			$(".popOutBg").css('display',"none");
            $(".deleteOut").css('display',"none");
			$(".deleteOutBg").css('display',"none");
		});

        $(document).on('click','.modal-btn-cancel',function(){
		    $(".alertOut").css('display',"none");
			$(".alertOutBg").css('display',"none");
            $(".popOut").css('display',"none");
			$(".popOutBg").css('display',"none");
            $(".deleteOut").css('display',"none");
			$(".deleteOutBg").css('display',"none");
		});

        $(document).on('click','.modalfadeclose',function(){
			$(".createpluggingip").hide();
		});

        $(document).on('click','.btn-topsek-editplugging',function(){
            $('.addplugging').hide()
            $('.changeplugging').show()
            $('.popOutBg').show()
            $('.popPlugging').show()
            var acl_name=$(this).attr('acl_name')
            getlist= new SearchManager({
           			     preview: false
           			 });
            var str = `|plugginglist |search title="${acl_name}" |table title acl_level dev_type dev_name dev_ip user_name password acl_ipcount acl_first acl_second acl_third acl_reload is_auto auto_index auto_field`
			console.log(str)
            getlist.set({earliest_time: "0", latest_time: "now", search: str}, {tokens: true});
            var mycheckResults = getlist.data("results",{count: 0, output_mode: 'json'});
            mycheckResults.on("data", function() {
                console.log("Has data? ", mycheckResults.hasData());
                // console.log("Type: ", myChoice);
                console.log("Data (rows): ", mycheckResults.data());
                console.log("Data (rows): ", mycheckResults.data().results);
                console.log("Data (rows count): ", mycheckResults.data().results.length);
                console.log("Backbone collection: (rows) ", mycheckResults.collection().raw.rows);
                console.log("开始插入数据：",str)
                $('.plugging-topsek-value[value-key-en="acl_name"]').val(mycheckResults.data().results[0]['title'])
                $('.plugging-topsek-value[value-key-en="acl_name"]').attr('disabled','disabled')
                $('.plugging-topsek-value[value-key-en="acl_level"]').val(mycheckResults.data().results[0]['acl_level'])
                $('.plugging-topsek-value[value-key-en="dev_type"]').val(mycheckResults.data().results[0]['dev_type'])
                $('.plugging-topsek-value[value-key-en="dev_name"]').val(mycheckResults.data().results[0]['dev_name'])
                $('.plugging-topsek-value[value-key-en="dev_ip"]').val(mycheckResults.data().results[0]['dev_ip'])
                $('.plugging-topsek-value[value-key-en="user_name"]').val(mycheckResults.data().results[0]['user_name'])
                $('.plugging-topsek-value[value-key-en="password"]').val(mycheckResults.data().results[0]['password'])
                $('.plugging-topsek-value[value-key-en="acl_ipcount"]').val(mycheckResults.data().results[0]['acl_ipcount'])
                $('.plugging-topsek-value[value-key-en="acl_first"]').val(mycheckResults.data().results[0]['acl_first'])
                $('.plugging-topsek-value[value-key-en="acl_second"]').val(mycheckResults.data().results[0]['acl_second'])
                $('.plugging-topsek-value[value-key-en="acl_third"]').val(mycheckResults.data().results[0]['acl_third'])
                $('.plugging-topsek-value[value-key-en="acl_reload"]').val(mycheckResults.data().results[0]['acl_reload'])
                $('.plugging-topsek-value[value-key-en="is_auto"]').val(mycheckResults.data().results[0]['is_auto'])
                $('.plugging-topsek-value[value-key-en="auto_index"]').val(mycheckResults.data().results[0]['auto_index'])
                $('.plugging-topsek-value[value-key-en="auto_field"]').val(mycheckResults.data().results[0]['auto_field'])        
            });
        });

        // 加载封堵ip清单
        $(document).on('click','.btn-topsek-configplugging',function(){
            $('.popOutBg').show()
            $('.popPluggingIP').show()
            $('#iplisttable tbody').html('')
            $('.btn-addpluggingip').attr('acl_name',$(this).attr('acl_name'))
            acl_name=$(this).attr('acl_name')
            pluggingiplist= new SearchManager({
           			     preview: false
           			 });
            var str = `|pluggingiplist ciscofirewall ${$(this).attr('acl_name')}`
			console.log(str)
            pluggingiplist.set({earliest_time: "0", latest_time: "now", search: str}, {tokens: true});
            var mycheckResults = pluggingiplist.data("results",{count: 0, output_mode: 'json'});
            mycheckResults.on("data", function() {
                console.log("Has data? ", mycheckResults.hasData());
                // console.log("Type: ", myChoice);
                console.log("Data (rows): ", mycheckResults.data());
                console.log("Data (rows): ", mycheckResults.data().results);
                console.log("Data (rows count): ", mycheckResults.data().results.length);
                console.log("Backbone collection: (rows) ", mycheckResults.collection().raw.rows);
                // console.log(mycheckResults.data().results[0]['ip'])     
                // alert(mycheckResults.data().results[0]['ip'])
                $('#iplisttable tbody').html('')
                var addiptr=`<tr>
					    <th>IP地址</th>
					    <th>解封时间</th>
					    <th>操作</th>
					  </tr>`
                $('#iplisttable tbody:last').append(addiptr)
                for(var i=0;i<mycheckResults.data().results.length;i++){
                    var addiptr=`<tr class="tr-${acl_name}" denyip="${mycheckResults.data().results[i]['ip']}">
                                    <td height="30px" width="100px">${mycheckResults.data().results[i]['ip']}</td>
                                    <td height="30px" width="250px">未审计</td>
                                    <td height="30px">
                                    <a class="undenyip" denyip="${mycheckResults.data().results[i]['ip']}" acl_name="${acl_name}">解封</a>
                                    </td>
                                </tr>`
                    $('#iplisttable tbody:last').append(addiptr)
                }


                // $(".popOut").hide()
			    // $(".popOutBg").hide()
                // $('.refresh').click()
            });

        });


        // 手动封堵IP
        $(document).on('click','.btn-addpluggingip',function(){
            pluggingipvalue=$('.inp-pluggingip').val()
            pluggingip= new SearchManager({
           			     preview: false
           			 });
            acl_name=$(this).attr('acl_name')
            var str = `|pluggingipadd ciscofirewall ${acl_name} ${pluggingipvalue}`
			console.log(str)
            pluggingip.set({earliest_time: "0", latest_time: "now", search: str}, {tokens: true});
            var mycheckResults = pluggingip.data("results",{count: 0, output_mode: 'json'});
            mycheckResults.on("data", function() {
                console.log("Has data? ", mycheckResults.hasData());
                // console.log("Type: ", myChoice);
                console.log("Data (rows): ", mycheckResults.data());
                console.log("Data (rows): ", mycheckResults.data().results);
                console.log("Data (rows count): ", mycheckResults.data().results.length);
                console.log("Backbone collection: (rows) ", mycheckResults.collection().raw.rows);
                // console.log(mycheckResults.data().results[0]['ip'])     
                alert(mycheckResults.data().results[0]['message'])

                if(mycheckResults.data().results[0]['message']==pluggingipvalue+" 该地址封堵成功"){
                    var addiptr=`<tr class="tr-${acl_name}" denyip="${pluggingipvalue}">
                                        <td height="30px" width="100px">${pluggingipvalue}</td>
                                        <td height="30px" width="250px">未审计</td>
                                        <td height="30px">
                                        <a class="undenyip" denyip="${pluggingipvalue}" acl_name="${acl_name}">解封</a>
                                        </td>
                                    </tr>`
                    $('#iplisttable tbody:last').append(addiptr)
                }
                $(".modalfadeclose").click();
                $('.inp-pluggingip').val('')
                // $(".popOut").hide()
			    // $(".popOutBg").hide()
                // $('.refresh').click()
            });
        });
        
        // 手动解封ip
        $(document).on('click','.undenyip',function(){
            pluggingipvalue=$(this).attr('denyip')
            pluggingip= new SearchManager({
           			     preview: false
           			 });
            acl_name=$(this).attr('acl_name')
            var str = `|pluggingipundeny ciscofirewall ${acl_name} ${pluggingipvalue}`
			console.log(str)
            pluggingip.set({earliest_time: "0", latest_time: "now", search: str}, {tokens: true});
            var mycheckResults = pluggingip.data("results",{count: 0, output_mode: 'json'});
            mycheckResults.on("data", function() {
                console.log("Has data? ", mycheckResults.hasData());
                // console.log("Type: ", myChoice);
                console.log("Data (rows): ", mycheckResults.data());
                console.log("Data (rows): ", mycheckResults.data().results);
                console.log("Data (rows count): ", mycheckResults.data().results.length);
                console.log("Backbone collection: (rows) ", mycheckResults.collection().raw.rows);
                // console.log(mycheckResults.data().results[0]['ip'])     
                alert(mycheckResults.data().results[0]['message'])
                if(mycheckResults.data().results[0]['message']==pluggingipvalue+" 该地址解封成功"){
                    console.log("#tr-"+acl_name+pluggingipvalue)
                    $(".tr-"+acl_name+"[denyip=\""+pluggingipvalue+"\"]").hide()
                }
                $(".modalfadeclose").click();
                $('.inp-pluggingip').val('')
                // $(".popOut").hide()
			    // $(".popOutBg").hide()
                // $('.refresh').click()
            });
        });

        $(document).on('click','.addpluggingip',function(){
            $('.popOutBg').show()
            $('.createpluggingip').show()
        });
        
        $(document).on('click','.addplugging',function(){
            addplugging= new SearchManager({
           			     preview: false
           			 });
            var str = `|pluggingadd ${$('.plugging-topsek-value[value-key-en="acl_name"]').val()} ${$('.plugging-topsek-value[value-key-en="acl_level"]').val()} ${$('.plugging-topsek-value[value-key-en="dev_type"]').val()} ${$('.plugging-topsek-value[value-key-en="dev_name"]').val()} ${$('.plugging-topsek-value[value-key-en="dev_ip"]').val()} ${$('.plugging-topsek-value[value-key-en="user_name"]').val()} ${$('.plugging-topsek-value[value-key-en="password"]').val()} ${$('.plugging-topsek-value[value-key-en="acl_ipcount"]').val()} ${$('.plugging-topsek-value[value-key-en="acl_first"]').val()} ${$('.plugging-topsek-value[value-key-en="acl_second"]').val()} ${$('.plugging-topsek-value[value-key-en="acl_third"]').val()} ${$('.plugging-topsek-value[value-key-en="acl_reload"]').val()} ${$('.plugging-topsek-value[value-key-en="is_auto"]:checked').attr('defaultvalue')} ${$('.plugging-topsek-value[value-key-en="auto_index"]').val()} ${$('.plugging-topsek-value[value-key-en="auto_field"]').val()}`
			console.log(str)
            addplugging.set({earliest_time: "0", latest_time: "now", search: str}, {tokens: true});
            var mycheckResults = addplugging.data("results",{count: 0, output_mode: 'json'});
            mycheckResults.on("data", function() {
                console.log("Has data? ", mycheckResults.hasData());
                // console.log("Type: ", myChoice);
                console.log("Data (rows): ", mycheckResults.data());
                console.log("Data (rows): ", mycheckResults.data().results);
                console.log("Data (rows count): ", mycheckResults.data().results.length);
                console.log("Backbone collection: (rows) ", mycheckResults.collection().raw.rows);
                console.log(mycheckResults.data().results[0]['_raw'])     
                alert(mycheckResults.data().results[0]['_raw'])
                $(".popOut").hide()
			    $(".popOutBg").hide()
                $('.refresh').click()
            });
        });

        $(document).on('click','.changeplugging',function(){
            addplugging= new SearchManager({
           			     preview: false
           			 });
            var str = `|pluggingupdate ${$('.plugging-topsek-value[value-key-en="acl_name"]').val()} ${$('.plugging-topsek-value[value-key-en="acl_level"]').val()} ${$('.plugging-topsek-value[value-key-en="dev_type"]').val()} ${$('.plugging-topsek-value[value-key-en="dev_name"]').val()} ${$('.plugging-topsek-value[value-key-en="dev_ip"]').val()} ${$('.plugging-topsek-value[value-key-en="user_name"]').val()} ${$('.plugging-topsek-value[value-key-en="password"]').val()} ${$('.plugging-topsek-value[value-key-en="acl_ipcount"]').val()} ${$('.plugging-topsek-value[value-key-en="acl_first"]').val()} ${$('.plugging-topsek-value[value-key-en="acl_second"]').val()} ${$('.plugging-topsek-value[value-key-en="acl_third"]').val()} ${$('.plugging-topsek-value[value-key-en="acl_reload"]').val()} ${$('.plugging-topsek-value[value-key-en="is_auto"]:checked').attr('defaultvalue')} ${$('.plugging-topsek-value[value-key-en="auto_index"]').val()} ${$('.plugging-topsek-value[value-key-en="auto_field"]').val()}`
			console.log(str)
            addplugging.set({earliest_time: "0", latest_time: "now", search: str}, {tokens: true});
            var mycheckResults = addplugging.data("results",{count: 0, output_mode: 'json'});
            mycheckResults.on("data", function() {
                console.log("Has data? ", mycheckResults.hasData());
                // console.log("Type: ", myChoice);
                console.log("Data (rows): ", mycheckResults.data());
                console.log("Data (rows): ", mycheckResults.data().results);
                console.log("Data (rows count): ", mycheckResults.data().results.length);
                console.log("Backbone collection: (rows) ", mycheckResults.collection().raw.rows);
                console.log(mycheckResults.data().results[0]['_raw'])     
                alert(mycheckResults.data().results[0]['_raw'])
                $(".popOut").hide()
			    $(".popOutBg").hide()
                $('.refresh').click()
            });
        });
        
        //删除按钮
        $(document).on('click', '.btn-topsek-delete', function () {
            console.log("Console Log: Start Delete Data");
            console.log("Console Log: check again");
            var acl_name = $(this).attr('acl_name');
            $(".deleteOut").css('display', "block");
            $(".deleteOutBg").css('display', "block");
            $(".deletesave").attr('acl_name', $(this).attr('acl_name'));
            console.log($(this).attr('acl_name'))
            console.log($(".deletesave").attr('acl_name'))
        });

        //删除按钮
        $(document).on('click', '.deletesave', function () {
            console.log("Console Log: 开始调用删除脚本");

            deletejob= new SearchManager({
                            preview: false
                        });
            acl_name = $(this).attr('acl_name')
            var str = `| deletepluggingconfig ${acl_name}`
            console.log(str)
            deletejob.set({earliest_time: "0", latest_time: "now", search: str}, {tokens: true});
            var mycheckResults = deletejob.data("results",{count: 0, output_mode: 'json'});
            mycheckResults.on("data", function() {
                console.log("Has data? ", mycheckResults.hasData());
                // console.log("Type: ", myChoice);
                console.log("Data (rows): ", mycheckResults.data());
                console.log("Data (rows): ", mycheckResults.data().results);
                console.log("Data (rows count): ", mycheckResults.data().results.length);
                console.log("Backbone collection: (rows) ", mycheckResults.collection().raw.rows);
                console.log(mycheckResults.data().results[0]['_raw'])     
                alert(mycheckResults.data().results[0]['_raw'])
                $(".deleteOut").hide()
                $(".deleteOutBg").hide()
                $('.refresh').click()
            });
        });


        var CustomIconRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            return true;
        },
        render: function($td, cell) {
            // Compute the icon base on the field value
            var icon;
            var color = "#84BBFC";
            if(cell.field === '操作') {
                acl_name=cell.value
                html_str='<div style="float:left;"><a class="btn-topsek-editplugging" acl_name="<%-acl_name%>" >配置</a> <a class="btn-topsek-configplugging" acl_name="<%-acl_name%>" >封堵</a>'
                // if(r14=="1"){
                //     html_str+='<a  r="<%-r%>" class="btn-topsek-unactive" >禁用</a> '
                // }else{
                //     html_str+='<a  r="<%-r%>" class="btn-topsek-active" >启用</a> '
                // }
                // if(r15=="1"){
                    html_str+=' <a  acl_name="<%-acl_name%>" class="btn-topsek-delete" >删除</a>'
                // }
                html_str+='</div>'
	            $td.addClass('icon-inline').html(_.template(html_str, {
	            }));
            }else{
                $td.addClass('icon-inline numeric').html(_.template('<div style="float:left;"><%-text%></div>', {
					icon: icon,
					text: cell.value
				}));
            }
        }
        });

        var tableElement = mvc.Components.getInstance("plugging_table");
        tableElement.getVisualization(function(tableView){
            // Register custom cell renderer, the table will re-render automatically
            tableView.addCellRenderer(new CustomIconRenderer());
        });

});

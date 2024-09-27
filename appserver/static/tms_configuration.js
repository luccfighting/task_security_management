require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'], function(
    _,
     $,
    mvc,) {
        var tokensDefault = mvc.Components.get("default");

        // 内嵌的iframe设置边距
        $('#tms_configuration_row').find('div[class="panel-body html"]').css('padding','0')
        $(document).on('click','.toggle-tab',function(){
            $('.toggle-tab').each(function(){
                // console.log("遍历",$(this).attr("data-elements"));
                const hidedivlist = $(this).attr("data-elements")
                const hidediv = hidedivlist.split(",")
                for(let i=0 ;i<hidediv.length;i++){
                    // console.log(hidediv[i]);
                    $("#"+hidediv[i]).hide();
                }
            });	
            tokensDefault.set('form.iframe_url',$(this).attr('iframe_str'))
            refreshiframe()
            const showdivlist = $(this).attr("data-elements")
            // console.log(showdivlist);
            const showdiv = showdivlist.split(",")
            // console.log(showdiv);
            for(let i=0 ;i<showdiv.length;i++){
                console.log(showdiv[i]);
                $("#"+showdiv[i]).show();
            }
        });

        // //更新筛选框
        // tokensDefault.on("change:form.level",function(nodevalue,options){
        //     refreshiframe()
        // });

        function refreshiframe(){
            var task_configuration_iframe = document.getElementById("tms_configuration_iframe");
            // console.log(task_configuration_iframe)
            console.log($('#tms_configuration_iframe').prop('contentWindow').document.body.clientHeight);
            if(task_configuration_iframe.attachEvent){
                task_configuration_iframe.attachEvent("onload",function(){
                    $('#tms_configuration_iframe').css("height",$('#tms_configuration_iframe').prop('contentWindow').document.body.clientHeight+100);
                });
            }else{
                task_configuration_iframe.onload =function(){
                    $('#tms_configuration_iframe').css("height",$('#tms_configuration_iframe').prop('contentWindow').document.body.clientHeight+100);
                }
            }
        }
        window.setInterval(function(){
            // console.log($('#tms_configuration_iframe').prop('contentWindow').document.body.clientHeight);
            if($('#tms_configuration_iframe').prop('contentWindow').document.body.clientHeight<=1050){
            $('#tms_configuration_iframe').css("height",1050);   }
            else{
                $('#tms_configuration_iframe').css("height",$('#tms_configuration_iframe').prop('contentWindow').document.body.clientHeight);
            }        
        }, 200);
});
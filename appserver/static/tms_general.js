require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'], function(
    _,
     $,
    mvc) {
       var page_title = $(".dashboard-header-title").text()
       var title_description = $(".dashboard-header-description").text()
       $("#page_navigation_div").parent(".panel-body").css({"position":"absolute","padding":"0px","background":"#f2f4f5","margin-top":"-28px","margin-left":"8rem"})
       //针对不同长度的标题，设置不同的左偏移
       if(page_title.length>=10){
           $("#page_navigation_div").parent(".panel-body").css({"margin-left":"18rem"})
       }else if(page_title.length>=8){
           $("#page_navigation_div").parent(".panel-body").css({"margin-left":"15rem"})
       }else if(page_title.length>=5){
           $("#page_navigation_div").parent(".panel-body").css({"margin-left":"12rem"})
       }
           navigation_up_shift()

           $(document).on('click', '.toggle-tab', function () {
              navigation_up_shift()
           })
       //界面导航渲染
        var page_navigation = mvc.Components.get("page_navigation");
        var page_navigation_results = page_navigation.data("results", {count: 0, output_mode: 'json_rows'});
            page_navigation_results.on("data", function() {
              const label = _.map(page_navigation_results.data().rows, function(e){ return e[0]; }).toString();
              const label2 = _.map(page_navigation_results.data().rows, function(e){ return e[1]; }).toString();
              const label3 = _.map(page_navigation_results.data().rows, function(e){ return e[2]; }).toString();
              const label4 = _.map(page_navigation_results.data().rows, function(e){ return e[3]; }).toString();
              if(label2.length<1){
                 $("#page_navigation_div").html('<span>'+label+' >> '+page_title+'</span>')
              }else if(label3.length<1){
                 $("#page_navigation_div").html('<span>'+label+' >> '+label2+' >> '+page_title+'</span>')
              }else if(label4.length<1){
                 $("#page_navigation_div").html('<span>'+label+' >> '+label2+' >> '+label3+' >> '+page_title+'</span>')
              }else if(label4.length>=1){
                 $("#page_navigation_div").html('<span>'+label+' >> '+label2+' >> '+label3+' >> '+label4+' >> '+page_title+'</span>')
              }
            })

   function navigation_up_shift(){
      //针对不同情况，设置不同的上偏移
         if($("#fieldset1").is(':visible')){
            var fieldset_height=Number($("#fieldset1").innerHeight())+40
                fieldset_height="-"+fieldset_height+"px"
                //console.log(fieldset_height)
           $("#page_navigation_div").parent(".panel-body").css({"margin-top":fieldset_height})
        }else if(title_description.length>0){
           $("#page_navigation_div").parent(".panel-body").css({"margin-top":"-3.6rem"})
        }else{
           $("#page_navigation_div").parent(".panel-body").css({"margin-top":"-28px"})
        }
   }
        
});
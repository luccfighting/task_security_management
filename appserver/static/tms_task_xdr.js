require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc/simplexml/ready!'], function (
        _,
        $,
        mvc) {
    var tokensDefault = mvc.Components.get("default");

    // 内嵌的iframe设置边距
    $('#tms_configuration_row').find('div[class="panel-body html"]').css('padding', '0')

    window.setInterval(function () {
        // console.log($('#asm_iframe_document').prop('contentWindow').document.body.clientHeight);
        if ($('#tms_configuration_iframe').prop('contentWindow').document.body.clientHeight <= 1050) {
            $('#tms_configuration_iframe').css("height", "1050px");
        }
        else {
            $('#tms_configuration_iframe').css("height", $('#tms_configuration_iframe').prop('contentWindow').document.body.clientHeight + 100);
        }
    }, 1000);

    // 尝试初始化
    try{
        $(document).on('click', '.toggle-tab', function () {
            $('.toggle-tab').each(function () {
                $(this).parent().removeClass('active')
            })
            $(this).parent().addClass('active')
            console.log($(this).attr('iframe_str')+'?hideChrome=true&amp;hideEdit=true&amp;hideTitle=true&amp;hideFilters=true')
            $('#tms_configuration_iframe').attr('src',$(this).attr('iframe_str')+'?hideChrome=true&hideEdit=true&hideTitle=true&hideFilters=true')
        })

        $('.active').click()
    }catch(err){
        console.log(err)
    }

    

});
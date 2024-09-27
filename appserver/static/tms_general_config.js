require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'], function (
        _,
        $,
        mvc) {

    var tokensDefault = mvc.Components.get("default");
    var maintenance = {"status":"0","time_range":"0","email_to":"","email_cc":"","email_bcc":"","email_subject":"","email_message":"","dingtalk_token":"","dingtalk_secret":"","dingtalk_message":"","feishu_token":"","feishu_secret":"","feishu_message":"","threat_stage":"","threat_category":"","syslog_config":"","weixin_key":"","weixin_message":"","appendix":"","alioth_webhook":"","capp_webhook":""}
    get_process_status()
    function get_process_status() {
        try {
            $.ajax({
                //几个参数需要注意一下
                type: "GET",//方法类型
                url: "/tmsapi/task_general_config",//url
                data: {
                },
                headers: {},
                success: function (result) {
                    console.log(result);
                    const asm_status=result["asm"]
                    $('input[name="ssl_or_tls"][value="'+asm_status+'"]').click()
                    maintenance=result["maintenance"]
                    $('input[name="maintenance"][value="'+maintenance["status"]+'"]').click()
                    // {"status":"0","time_range":"0","email_to":"","email_cc":"","email_bcc":"","email_subject":"","email_message":"","dingtalk_token":"","dingtalk_secret":"","dingtalk_message":"","feishu_token":"","feishu_secret":"","feishu_message":"","threat_stage":"","threat_category":"","syslog_config":"","weixin_key":"","weixin_message":"","appendix":"","alioth_webhook":"","capp_webhook":""}
                },
                error: function (result) {
                    console.log(result);
                }
            });
        } catch (error) {
            console.error(error.message);
        }
    }

    $('input[name="maintenance"]').click(function(){
        console.log(maintenance)
        if($(this).val()=="1"){
            $('.maintenance_div').show()
            Object.keys(maintenance).forEach(function(key){
                $('.horizon-maintenance-value[value-key-en="'+key+'"]').val(maintenance[key])
            })
        }else{
            $('.maintenance_div').hide()
        }
    })


    // 保存配置
    $(document).on('click', '.btn-horizon', function () {
        const asm_status=$('input[name="ssl_or_tls"]:checked').val()
        maintenance["status"]=$('input[name="maintenance"]:checked').val()
        $('.horizon-maintenance-value').each(function(){
            maintenance[$(this).attr('value-key-en')]=$(this).val()
        })
        
        $.ajax({
            //几个参数需要注意一下
            type: "PATCH",//方法类型
            url: "/tmsapi/task_general_config",//url
            data: JSON.stringify({
                "name": asm_status,
                "info": {
                    "asm": parseInt(asm_status),
                    "maintenance":maintenance
                }
            }),
            headers: {
                "content-type": "application/json"
            },
            success: function (result) {
                console.log(result);
                $('.close').click()
                confirm("保存成功")
            },
            error: function (result) {
                console.log(result);
                $('.close').click()
                confirm("保存失败")
            }
        });
    })

    
    // 添加动作
    // 设置弹出框
    var showModal = function self(o) {
        var options = $.extend({
            title: '',
            body: '',
            remote: false,
            backdrop: true,
            size: 500,
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
        self.$modal.data('bs.modal', false);
        self.$modal.find('.modal-dialog').removeClass().addClass('modal-dialog ');
        self.$modal.find('.modal-content').html('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">${title}</h4></div><div class="modal-body">${body}</div><div class="modal-footer"></div>'.replace('${title}', options.title).replace('${body}', options.body));

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

})
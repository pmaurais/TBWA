/**
 * Created by admin on 2018-6-6.
 */

$( document ).ready( function () {

    //common方法定义
    $.common = {
        //参数定义
        parameter: {
            //是否为IE7 使用方式：$.common.parameter.is_IE7  是IE7浏览器时返回true，否则返回false
            is_IE7: false,
            //是否为IE8 使用方式：$.common.parameter.is_IE8  是IE8浏览器时返回true，否则返回false
            is_IE8: false,
            //是否为IE9 使用方式：$.common.parameter.is_IE9  是IE9浏览器时返回true，否则返回false
            is_IE9: false,
            //是否为手机端浏览器 使用方式：$.common.parameter.is_mobile  是手机浏览器时返回true，否则返回false
            is_mobile: false
        },

        //程序入口
        init: function () {
            var that = this;
            var para = that.parameter;

            that._execute();
        },

        //执行
        _execute: function () {
            var that = this;
            var para = that.parameter;

            para.is_IE7 = that.is_IEx( 7 );
            para.is_IE8 = that.is_IEx( 8 );
            para.is_IE9 = that.is_IEx( 9 );
            para.is_mobile = that.is_mobile_browser();

            //that._add_head_message();
        },

        //象head中添加相关配置信息
        _add_head_message: function(){
            $( "head" ).append( "<link rel='shortcut icon' href='../../../../image/common/ico/favicon.ico'/>" );
            $( "head" ).append( "<link rel='icon' href='../../../../image/common/ico/favicon.ico'/>" );
            $( "head" ).append( "<meta name='renderer' content='webkit'>" );
        },

        jump_to_link: function( elm ){
            var href = elm.attr( 'href'), target = elm.attr( 'target' );

            if( href ){
                if( target == '_blank' ){
                    window.open( href );
                }
                else{
                    window.location.href = href;
                }
            }
        },

        /**
         * 文字过长裁剪省略
         * @param target 目标 jQuery元素对象 输出目标
         * @param max_length 整数 需要保留的长度
         * example： $.common.length_trim( $( "#J_content" ), 10 );
         */
        length_trim: function( target, max_length ){
            if( target && target.length == 1 ){
                var target_value = target.get_trim_value();

                if( target_value && target_value.length > 0 ){
                    var current_length = target_value.length;

                    if( current_length > max_length ){
                        target.attr( "title", target_value );
                        target_value = target_value.substr( 0, max_length - 1 ) + "...";
                        target.set_trim_value( target_value );
                    }
                }
            }
        },

        /**
         * 遮挡手机号
         * @param origin 源 jQuery元素对象 源数据目标
         * @param target 目标 jQuery元素对象 输出目标
         * example： $.common.mask_mobile( $( "#J_mobile_hidden" ), $( "#J_mobile" ) );
         */
        mask_mobile: function( origin, target ){
            if( origin && origin.length > 0 && target && target.length > 0 ){
                var mobile = origin.get_trim_value();
                if( mobile.length == 11 ){
                    var front = mobile.substring( 0, 3 );
                    var last = mobile.substring( 7 );
                    target.set_trim_value( front + "****" + last );
                }
            }
        },

        /**
         * 页面主要内容自动垂直居中
         * @param container 外框架
         * @param target 内部显示元素
         * @param not_first 不需要作为参数传入，此参数仅供事件绑定时的回调判断
         * example： $.common.auto_vertical_align( "#J_exceed_money_page", ".exceed-money-page" );
         */
        auto_vertical_align: function( container, target, not_first ){
            var that = this, header = $( '#j_header' ), footer = $( '#j_footer' );
            container = $( container );
            target = $( target );

            var window_height = that.get_browser_height();
            var header_height =  0;
            if( header.length == 1 ){
                header_height = header.outerHeight();
            }
            var footer_height = 0;
            if( footer.length == 1 ){
                footer_height = footer.outerHeight();
            }

            var target_height = target.outerHeight();

            var container_height = container.outerHeight();

            var differ_height = 0;
            if( target_height < container_height ) {
                differ_height = container_height - target_height;
            }

            //container.css( { "height": container_height + "px" } );
            target.css( { "margin-top" : ( differ_height ) / 2 + "px" } );

            if( not_first != true ){
                $( window ).bind( "resize", function(){
                    that.auto_vertical_align( container, target, true );
                } );
            }
        },

        /**
         * 日期格式化
         * @param date 20150815 或 “20150815”（ 8位日期格式的数字或字符串 ）
         * @return string 格式化后的日期，如参数不符合要求则返回“--------”
         * example： $.common.format_date( "20150815" );
         */
        format_date: function( date ){
            date += "";

            if( isNaN( date ) == false && date.length == 8 ){
                return date.slice( 0, 4 ) + "-" + date.slice( 4, 6 ) + "-" + date.slice( 6, 8 );
            }
            else{
                return "--------";
            }
        },

        /**
         * 时间格式化
         * @param time "1230000" 或 “0230000”（ 7位时间格式的字符串 ）
         * @return string 格式化后的日期，如参数不符合要求则返回“000:00:00”
         * example： $.common.format_time( "1230000" );
         */
        format_time: function( time ){
            time += "";

            if( isNaN( time ) == false && time.length == 7 ){
                return time.slice( 0, 3 ) + ":" + time.slice( 3, 5 ) + ":" + time.slice( 5, 7 );
            }
            else{
                return "000:00:00";
            }
        },

        /**
         * 时间倒计时, 倒数至0
         * @param that 源JS的this对象
         * @param target 目标 倒计时开始对象
         * @param time 可选参数 倒计时时间，默认为60秒
         * @param tip_target 可选参数，倒计时显示的对象，如不传则使用target对象
         * example： $.common.count_down( $( "#J_count_down_time" ) );
         */
        count_down: function( that, target, time, tip_target ){
            var para = that.parameter;

            if( isNaN( time ) ){
                time = 60;
            }
            else{
                time = Number( time );
            }
            para.get_code_state = false;

            if( target && target.length > 0 ){
                if( !tip_target && target ){
                    tip_target = target;
                }
            }
            else{
                para.get_code_state = true;
            }

            target.attr( "disabled", true );
            target.addClass( "disabled" );

            tip_target.set_trim_value( ( time ) + "秒后重新获取" );

            var inv = window.setInterval( function(){
                tip_target.html( ( --time ) + "秒后重新获取" );
                if( time <= 0 ){
                    window.clearInterval( inv );
                    target.removeAttr( "disabled", true );
                    target.addClass( "disable" );

                    tip_target.set_trim_value( "重新获取验证码" );
                    para.get_code_state = true;
                }
            }, 1000 );
        },

        /**
         * 时间倒计时, 直到倒数到000:00:00
         * @param target 目标 jQuery元素对象 源数据目标与输出目标相同
         * @param callback 可选参数，倒数完成后执行的回调函数
         * example： $.common.time_count_down( $( "#J_count_down_time" ) );
         */
        time_count_down: function( target, callback ){
            var that = this;
            that.time_count_down_to_another( target, target, callback );
        },

        /**
         * 时间倒计时, 倒数到000:00:00
         * @param origin 源 jQuery元素对象 源数据目标
         * @param target 目标 jQuery元素对象 输出目标
         * @param callback 可选参数，倒数完成后执行的回调函数
         * example： $.common.time_count_down_to_another( $( "#J_count_down_time_hidden" ), $( "#J_count_down_time" ) );
         */
        time_count_down_to_another: function( origin, target, callback ){
            var that = this;
            var target_value = origin.get_trim_value();

            if( origin && origin.length == 1 ){

                if( target_value){
                    if( target_value.length == 7 ){
                        target_value = that.format_time( target_value );
                    }

                    if( target_value.length == 9 ){
                        var split_time = target_value.split( ":" );
                        var hour = split_time[ 0 ];
                        var minute = split_time[ 1 ];
                        var second = split_time[ 2 ];

                        if( hour && hour.length == 3 && isNaN( hour ) == false &&
                            minute && minute.length == 2 && isNaN( minute ) == false &&
                            second && second.length == 2 && isNaN( second ) == false ){
                            hour = Number( hour );
                            minute = Number( minute );
                            second = Number( second );

                            if( hour == 0 && minute == 0 && second == 0 ){
                                return;
                            }

                            var new_time = hour * 60 * 60 * 1000 + minute * 60 * 1000 + second * 1000;

                            function time_count_down_fun(){
                                new_time = new_time - 1000;

                                var date = new Date( new_time );
                                minute = date.getMinutes();
                                second = date.getSeconds();
                                if( minute == 59 && second == 59 && hour > 0 ){
                                    hour--;
                                }

                                var hours = hour + "", minutes = minute + "", seconds = second + "";

                                if( hour < 10 ){
                                    hours = "00" + hours;
                                }
                                else if( hour < 100 ){
                                    hours = "0" + hours;
                                }

                                if( minute < 10 ){
                                    minutes = "0" + minutes;
                                }

                                if( second < 10 ){
                                    seconds = "0" + seconds;
                                }

                                var str_time = hours + ":" + minutes + ":" + seconds;
                                if( target.hasClass( "no-hour" ) ){
                                    str_time = minutes + "分" + seconds + "秒";
                                }

                                target.set_trim_value( str_time );

                                if( new_time <= 0 ){
                                    window.clearInterval( count_down_time_inv );
                                    if( typeof callback === "function" ){
                                        callback();
                                    }
                                }
                            }

                            time_count_down_fun();
                            var count_down_time_inv = window.setInterval( time_count_down_fun, 1000 );
                        }
                    }
                }
            }
        },


        /**
         * 时间倒计时，12天12:12:12  倒数到 0天00:00:00
         * @param origin 源 jQuery元素对象 源数据目标
         * @param target 目标 jQuery元素对象 输出目标
         * @param callback 可选参数，倒数完成后执行的回调函数
         * example： $.common.time_count_down_day_to_another( $( "#J_count_down_time_hidden" ), $( "#J_count_down_time" ) );
         */
        time_count_down_day_to_another: function( origin, target, callback ){
            var that = this;
            var target_value = origin.get_trim_value();

            if( origin && origin.length == 1 ){

                if( target_value ){
                    if( target_value.length == 7 ){
                        target_value = that.format_time( target_value );
                    }

                    if( target_value.length == 9 ){
                        var split_time = target_value.split( ":" );
                        var day ="";
                        var hour = split_time[ 0 ];
                        var minute = split_time[ 1 ];
                        var second = split_time[ 2 ];

                        if( hour && hour.length == 3 && isNaN( hour ) == false &&
                            minute && minute.length == 2 && isNaN( minute ) == false &&
                            second && second.length == 2 && isNaN( second ) == false ){
                            day = parseInt( Number( hour ) /24 );
                            hour = Number( hour ) -(day * 24 );
                            minute = Number( minute );
                            second = Number( second );

                            if( day == 0 && hour == 0 && minute == 0 && second == 0 ){
                                return;
                            }

                            var new_time = day * 24 * 60 * 60 * 1000+ hour * 60 * 60 * 1000 + minute * 60 * 1000 + second * 1000;

                            function time_count_down_fun(){
                                new_time = new_time - 1000;

                                var date = new Date( new_time );
                                minute = date.getMinutes();
                                second = date.getSeconds();

                                if( minute == 59 && second == 59 && hour > 0 ){
                                    hour--;
                                }
                                if( minute == 0 && second == 0 && hour == 0 && day > 0 ){
                                    day--;
                                    hour = 24;
                                }

                                var hours = hour + "", minutes = minute + "", seconds = second + "";

                                if( hour < 10 ){
                                    hours = "0" + hours;
                                }

                                if( minute < 10 ){
                                    minutes = "0" + minutes;
                                }

                                if( second < 10 ){
                                    seconds = "0" + seconds;
                                }
                                var str_time = day + "天" + hours + ":" + minutes + ":" + seconds;
                                if( target.hasClass( "no-hour" ) ){
                                    str_time = minutes + "分" + seconds + "秒";
                                }

                                target.set_trim_value( str_time );

                                if( new_time <= 0 ){
                                    window.clearInterval( count_down_time_inv );
                                    if( typeof callback === "function" ){
                                        callback();
                                    }
                                }
                            }

                            time_count_down_fun();
                            var count_down_time_inv = window.setInterval( time_count_down_fun, 1000 );
                        }
                    }
                }
            }
        },

        /**
         * 将数值四舍五入( 保留2位小数 )后格式化成金额形式
         * @param num 数值( Number或者String )
         * @param drop_decimals 是否舍弃小数位( boolean型 true 为不返回小数位，否则返回四舍五入后的2位小数 )
         * @return string 金额格式的字符串,如'1,234,567.45'
         * example： $.common.format_currency( "123456.45" ) 返回“1,234,567.45” 或者 $.common.format_currency( "123456.45", true ) 返回 “1,234,567”;
         */
        format_currency: function( num, drop_decimals ) {
            num = num.toString().replace( /\$|\,/g,'');

            if( isNaN( num ) ){
                num = "0";
            }

            var sign = num == ( num = Math.abs( num ) );
            num = Math.floor( num * 100 + 0.50000000001 );
            var cents = num % 100;
            num = Math.floor( num / 100 ).toString();

            if( cents < 10 ){
                cents = "0" + cents;
            }

            if( drop_decimals ){
                cents = "";
            }
            else{
                cents = "." + cents;
            }

            for ( var i = 0; i < Math.floor( ( num.length - ( 1 + i ) ) / 3 ); i++ ){
                num = num.substring( 0, num.length - ( 4 * i + 3 ) ) + ',' + num.substring( num.length - ( 4 * i + 3 ) );
            }

            return ( ( ( sign ) ? '' : '-' ) + num + cents );
        },

        /**
         * 将数值四舍五入( 保留2位小数 )后格式化成特殊金额形式,并增加小数位的特殊样式
         * @param num 数值( Number或者String )
         * @return string 特殊金额格式的字符串,如'1,234,567<span class='cents'>.45</span>'
         * example： $.common.format_currency( "123456.45" );
         */
        format_special_currency: function( num ) {
            num = num.toString().replace( /\$|\,/g,'');

            if( isNaN( num ) ){
                num = "0";
            }

            var sign = num == ( num = Math.abs( num ) );
            num = Math.floor( num * 100 + 0.50000000001 );
            var cents = num % 100;
            num = Math.floor( num / 100 ).toString();

            if( cents < 10 ){
                cents = "0" + cents;
            }

            for ( var i = 0; i < Math.floor( ( num.length - ( 1 + i ) ) / 3 ); i++ ){
                num = num.substring( 0, num.length - ( 4 * i + 3 ) ) + ',' + num.substring( num.length - ( 4 * i + 3 ) );
            }

            return ( ( ( sign ) ? '' : '-' ) + num + "<span class='cents'>." + cents + "</span>" );
        },

        /**
         * 像素数值字符串转数字
         * @param pixel_number 带有px单位的数值字符串
         * @return number 去掉“px”部分并转为数字
         * example： $.common.parse_number( "123px" );
         */
        parse_number: function( pixel_number ){
            if( pixel_number && typeof pixel_number === "string" && pixel_number.indexOf( "px" ) != -1 ){
                return parseFloat( pixel_number.substring( 0, pixel_number.indexOf( "px" ) ) );
            }
            else if( pixel_number && typeof pixel_number === "number" ){
                return pixel_number;
            }
            else{
                return 0;
            }
        },

        /**
         * 获取浏览器可视区域高度
         * @return number 高度值
         * example： $.common.get_browser_height();
         */
        get_browser_height: function(){
            var winHeight;

            if ( document.documentElement.clientHeight ){
                winHeight = document.documentElement.clientHeight;
            }
            else if ( ( document.body ) && ( document.body.clientHeight ) ){
                winHeight = document.body.clientHeight;
            }
            else{
                winHeight = 0
            }

            return winHeight;
        },

        /**
         * 获取浏览器可视区域宽度
         * @return number 高度值
         * example： $.common.get_browser_width();
         */
        get_browser_width: function(){
            var winWidth;

            if ( document.documentElement.clientWidth ){
                winWidth = document.documentElement.clientWidth ;
            }
            else if ( ( document.body ) && ( document.body.clientWidth ) ){
                winWidth = document.body.clientWidth;
            }
            else{
                winWidth = 0
            }

            return winWidth;
        },

        /**
         * 判定异步加载对象判定是否有效
         * @param target 用以判定是否加载完成的目标对象
         * @param callback 加载后执行的回调
         * @param delay_time 延迟加载时间 默认10毫秒
         * @param retry 加载失败重试次数 默认10次
         * return boolean 返回加载结果；
         */
        delay_load: function( target, callback, delay_time, retry ){
            var load = function( target, callback, delay_time, retry ){
                var that = this;
                that.opt = {
                    target: target,
                    callback: callback,
                    delay_time: ( delay_time && isNaN( delay_time ) && delay_time > 0 ) ? delay_time : 10,
                    retry: ( delay_time && isNaN( delay_time ) && retry > 0 ) ? retry : 10,
                    count: 0
                };

                that._delay_load = function(){
                    var opt = that.opt;

                    setTimeout( function(){
                        if( opt.target() ){
                            opt.callback();
                            return true;
                        }
                        else{
                            if( opt.count < opt.retry ){
                                opt.count++;
                                that._delay_load();
                            }
                            else{
                                return false;
                            }
                        }
                    }, opt.delay_time );
                }
            };

            var load_obj = new load( target, callback, delay_time, retry );
            return load_obj._delay_load();
        },

        /**
         * 获取用户所用浏览器是否为手机端浏览器
         * @return boolean
         */
        is_mobile_browser: function(){
            var mobileAgent = new Array( "iphone", "ipod", "ipad", "android", "mobile", "blackberry", "webos", "incognito", "webmate", "bada", "nokia", "lg", "ucweb", "skyfire" );

            var browser = navigator.userAgent.toLowerCase();
            var is_mobile = false;

            for ( var i = 0; i < mobileAgent.length; i++ ){
                if ( browser.indexOf( mobileAgent[ i ] ) != -1 ){
                    is_mobile = true;
                    break;
                }
            }

            return is_mobile;
        },

        /**
         * 获取用户所用浏览器是否为手机端浏览器
         * @param version 要判断IE的版本号
         * @return boolean
         */
        is_IEx: function( version ){
            return $.browser.msie && $.browser.version == version + ".0";
        },

        //判断是否为一个方法
        isFunc: function( func ){
            return typeof func === 'function';
        },

        //执行回调
        callback: function( callback, args ){
            this.isFunc( callback ) ? callback( args ) : null;
        },

        //判断对象是否为空（并包含空对象、空字符串、空数组的判断）
        isNull: function( obj ){
            if( ( obj && obj != '' && obj != "" ) || obj == 0 ){
                if( typeof obj == 'string' ){
                    return obj.trim() == '';
                }
                else{
                    if( obj instanceof Object ){
                        if( typeof obj.length != 'undefined' ){
                            return obj.length == 0;
                        }
                        else{
                            return $.isEmptyObject( obj );
                        }
                    }
                    else{
                        if( obj instanceof Array ){
                            return obj.length == 0;
                        }
                        else{
                            return false;
                        }
                    }
                }
            }
            else{
                return true;
            }

        },

        //判断对象是否非空（并包含空对象、空字符串、空数组的判断）
        notNull: function( obj ){
            return !( this.isNull( obj ) == true );
        },

        //判断后台传值为true的几种方式，并返回boolean型结果
        isTrue: function( obj ){
            return this.notNull( obj ) && ( obj == 1 || obj == true || obj == 'true' || obj == 'TRUE' || obj == 'True' );
        },

        //判断后台传值为false的几种方式，并返回boolean型结果
        isFalse: function( obj ){
            return !( this.isTrue( obj ) == true );
        },

        /**
         *
         */
        initJQueryUI: function(){
            $( 'input[ type="checkbox" ]' ).checkboxradio();
        }
    };

    $.common.init();

    /**
     * 获取当前对象的值或内容并返回trim后的结果
     * @return string
     * example： $( "#J_user_name" ).get_trim_value();
     */
    $.fn.get_trim_value = function(){
        var target = this;
        var origin_target = target[ 0 ];
        var target_value = "";

        if( this && this.length == 1 ){
            if( origin_target.tagName == "INPUT" || origin_target.tagName == "SELECT" ){
                target_value = target.val().trim();
            }
            else{
                target_value = target.html().trim();
            }
        }

        return target_value;
    };

    /**
     * 设置当前对象的值或内容并返回trim后的结果
     * @param content 可选参数 要输入的内容 如未传递此参数，则获取当前对象的值或内容
     * example： $( "#J_user_name" ).set_trim_value();
     */
    $.fn.set_trim_value = function( content ){
        var target = this;
        if( this && this.length == 1 ){
            var origin_target = target[ 0 ];
            var target_value = target.get_trim_value();
            if( content || content == 0 || content == false ){
                target_value = content + "";
            }

            if( origin_target.tagName == "INPUT" || origin_target.tagName == "SELECT" ){
                target.val( target_value );
            }
            else{
                target.html( target_value );
            }
        }
    };

    /**
     * 设置当前对象内容倒计时后跳转，该对象中必须包含自定义属性 count-down-jump-url="xxx"
     * 可另行设置自定义属性target，用来改变跳转方式 允许_blank, _self
     * example： $( "#J_count_down_number" ).count_down_jump();
     */
    $.fn.count_down_jump = function(){
        var target = this;
        if( this && this.length == 1 ){
            var target_url = target.attr( "count-down-jump-url" );
            var target_type = target.attr( "target" );
            var target_value = Number( target.get_trim_value() );
            if( target_url && isNaN( target_value ) == false ){
                var count_down_inv = window.setInterval( function(){
                    target_value--;

                    if( target_value <= 0 ){
                        target.set_trim_value( 0 );
                        window.clearInterval( count_down_inv );
                        if( target_url.length > 0 ){
                            if( target_type == "_blank" ){
                                window.open( target_url );
                            }
                            else{
                                window.location.href = target_url;
                            }
                        }
                    }
                    else{
                        target.set_trim_value( target_value );
                    }
                }, 1000 );
            }
        }
    };
});
/**
 * Created by admin on 2018-6-6.
 */

$( document ).ready( function () {
    var index = {
        //参数定义
        parameter: {
            currentOpenPanel: '',
            showFlag: true,
            query_form: $( '#j_hidden_query_form' )
        },

        //程序入口
        init: function () {
            var self = this, para = self.parameter;

            self._execute();
            self._bind();
            $.common.initJQueryUI();
        },

        //执行
        _execute: function () {
            var self = this, para = self.parameter;

            self._addFormValidate();
            self._initDatePicker();
            self._getFormParams();
            self._initElementsVal();
            self._initRangeSlider();
            self._initShowStars();
            self._createPage();
        },

        _initDatePicker: function(){
            $( '.show-for-date' ).datepicker( {
                dateFormat: "dd.mm.yy"
            } );
        },

        _addFormValidate: function(){
            $( '#j_flights_form' ).validate();
            $( '#j_hotels_form' ).validate();
            $( '#j_login_form' ).validate();
        },

        showFloatPanel: function( type, elm ){
            var self = this, para = self.parameter, allElm = $( '.has-float-panel' ), allPanel = $( '.has-float-panel .float-panel'), targetPanel = elm.find( '.float-panel' );

            if( $.common.notNull( elm.closest( '.float-panel' ) ) || $.common.notNull( elm.closest( '#ui-datepicker-div') ) ){
                para.showFlag = false;

                window.setTimeout( function(){
                    para.showFlag = true;
                }, 0 );

                return false;
            }

            if( para.showFlag ){
                allElm.removeClass( 'open' );
                allPanel.hide();

                if( type ){
                    para.showFlag = false;
                    if( type != para.currentOpenPanel ){
                        para.currentOpenPanel = type;
                        elm.addClass( 'open' );
                        targetPanel.show();
                    }

                    window.setTimeout( function(){
                        para.showFlag = true;
                    }, 0 );
                }
                else{
                    para.currentOpenPanel = '';
                }
            }
        },

        _getFormParams: function(){
            var self = this, para = self.parameter;

            if( $.common.notNull( para.query_form ) ){
                para.price_elm = para.query_form.find( '#j_hidden_price' );
                para.price = $.common.notNull( para.price_elm ) ? JSON.parse( para.price_elm.val() ) : [];
                para.refine_elm = para.query_form.find( '#j_hidden_refine' );
                para.refine = $.common.notNull( para.refine_elm ) ? JSON.parse( para.refine_elm.val() ) : [];
                para.fare_elm = para.query_form.find( '#j_hidden_fare' );
                para.fare = $.common.notNull( para.fare_elm ) ? JSON.parse( para.fare_elm.val() ) : [];
                para.airlines_elm = para.query_form.find( '#j_hidden_airlines' );
                para.airlines = $.common.notNull( para.airlines_elm ) ? JSON.parse( para.airlines_elm.val() ) : [];

                para.airline_sort_elm = para.query_form.find( '#j_hidden_airline_sort' );
                para.airline_sort = $.common.notNull( para.airline_sort_elm ) ? para.airline_sort_elm.val() : '';
                para.class_sort_elm = para.query_form.find( '#j_hidden_class_sort' );
                para.class_sort = $.common.notNull( para.class_sort_elm ) ? para.class_sort_elm.val() : '';
                para.price_sort_elm = para.query_form.find( '#j_hidden_price_sort' );
                para.price_sort = $.common.notNull( para.price_sort_elm ) ? para.price_sort_elm.val() : '';
                para.recommended_sort_elm = para.query_form.find( '#j_hidden_recommended_sort' );
                para.recommended_sort = $.common.notNull( para.recommended_sort_elm ) ? para.recommended_sort_elm.val() : '';

                para.total_sum_elm = para.query_form.find( '#j_hidden_total_sum' );
                para.total_sum = $.common.notNull( para.total_sum_elm ) ? Number( para.total_sum_elm.val() ) : 0;
                para.page_size_elm = para.query_form.find( '#j_hidden_page_size' );
                para.page_size = $.common.notNull( para.page_size_elm ) ? Number( para.page_size_elm.val() ) : 4;
                para.current_page_elm = para.query_form.find( '#j_hidden_current_page' );
                para.current_page = $.common.notNull( para.current_page_elm ) ? Number( para.current_page_elm.val() ) : 1;
            }
        },

        _initElementsVal: function(){
            var self = this, para = self.parameter;

            var itemList = $( '#j_price_range_container .show-range-container span' );
            $( itemList[ 0 ] ).html(  para.price[ 0 ] );
            $( itemList[ 1 ] ).html(  '$' + para.price[ 1 ] );
            $( itemList[ 3 ] ).html(  '$' + para.price[ 2 ] );
            $( itemList[ 2 ] ).html(  para.price[ 3 ] );

            $.each( para.refine, function( refineIndex, refine ){
                var id = '#j_refine_results_' + refine, obj = $( id );
                $.common.notNull( obj ) && obj.attr( 'checked', 'checked' );
            } );
            $.each( para.fare, function( fareIndex, fare ){
                var id = '#j_fare_type_' + fare, obj = $( id );
                $.common.notNull( obj ) && obj.attr( 'checked', 'checked' );
            } );
            $.each( para.airlines, function( airlinesIndex, airlines ){
                var id = '#j_airlines_' + airlines, obj = $( id );
                $.common.notNull( obj ) && obj.attr( 'checked', 'checked' );
            } );

            $( "#j_airline_sort option[ value = '"+ para.airline_sort +"']" ).attr( "selected", "selected" );
            $( "#j_class_sort option[ value = '"+ para.class_sort +"']" ).attr( "selected", "selected" );
            $( "#j_price_sort option[ value = '"+ para.price_sort +"']" ).attr( "selected", "selected" );
            $( "#j_recommended_sort option[ value = '"+ para.recommended_sort +"']" ).attr( "selected", "selected" );
        },

        _initRangeSlider: function(){
            var self = this, para = self.parameter;

            $( '#j_price_range_slider' ).slider(
                {
                    range: true,
                    min: Number( para.price[ 0 ] ),
                    max:  Number( para.price[ 3 ] ),
                    values: [  Number( para.price[ 1 ] ),  Number( para.price[ 2 ] ) ],
                    slide: function ( event, ui ) {
                        self._setPriceChoice( ui.values[ 0 ], ui.values[ 1 ] );
                    }
                }
            );
        },

        _initShowStars: function(){
            var self = this, para = self.parameter;

            $.each( $( '.info-stars .show-stars-container' ), function( index, item ){
                var elm = $( item ), level = Number( elm.attr( 'user-star-level' ) );

                elm.html( '' );

                if( isNaN( level ) == false ){
                    for( var i = 1; i <= 5; i++ ){
                        var star = $( '<img src="../common/images/icon_star.png" />'),
                            fullStar = $( '<img src="../common/images/icon_full_star.png" />' );

                        i <= level ? elm.append( fullStar ) : elm.append( star );
                    }
                }
            } );
        },

        _createPage: function(){
            var self = this, para = self.parameter, sum = para.total_sum, size = para.page_size, cur = para.current_page,
                total = Math.ceil( sum / size ), container = $( '.page-container' ), prev = container.find( '#j_previous' ),
                next = container.find( '#j_next' ), pageNumber = container.find( '.page-number' );

            cur > 1 ? prev.show() : prev.hide();
            cur < total ? next.show() : next.hide();

            pageNumber.html( '' );

            for( var i = 1; i <= total; i++ ){
                var number = $( '<a>' + i + '</a>' );
                i == cur && number.addClass( 'current' );
                number.bind( 'click', function( e ){
                    var elm = $( e.currentTarget );
                    self.changePage( elm.html() );
                } );
                pageNumber.append( number );
            }
        },

        changePage: function( target ){
            var self = this, para = self.parameter;
            if( target != para.current_page ){
                para.current_page = target;
                para.current_page_elm.val( target );
                self._createPage();
                self._formSubmit();
            }
        },

        _setPriceChoice: function( low, high ){
            var self = this, para = self.parameter, price = [], itemList = $( '#j_price_range_container .show-range-container span' );
            price.push(  Number( para.price[ 0 ] ) );
            price.push(  Number( low ) );
            price.push(  Number( high ) );
            price.push(  Number( para.price[ 3 ] ) );

            $( itemList[ 1 ] ).html(  '$' + low );
            $( itemList[ 3 ] ).html(  '$' + high );

            self.price = price;
            para.price_elm.val( JSON.stringify( price ) );
        },

        _setRefineResules: function(){
            var self = this, para = self.parameter, refines = [];

            $.each( $( '#j_refine_results_container input[ type="checkbox" ]' ), function( refineIndex, refine ){
                var obj = $( refine );

                if( obj.attr( 'checked' ) ){
                    refines.push( obj.val() );
                }
            } );

            self.refine = refines;
            para.refine_elm.val( JSON.stringify( refines ) );
            self._formSubmit();
        },

        _setFareType: function(){
            var self = this, para = self.parameter, fares = [];

            $.each( $( '#j_fare_type_container input[ type="checkbox" ]' ), function( fareIndex, fare ){
                var obj = $( fare );

                if( obj.attr( 'checked' ) ){
                    fares.push( obj.val() );
                }
            } );

            self.fare = fares;
            para.fare_elm.val( JSON.stringify( fares ) );
            self._formSubmit();
        },

        _setAirlines: function(){
            var self = this, para = self.parameter, airlines = [];

            $.each( $( '#j_airlines_container input[ type="checkbox" ]' ), function( airlineIndex, airline ){
                var obj = $( airline );

                if( obj.attr( 'checked' ) ){
                    airlines.push( obj.val() );
                }
            } );

            self.airlines = airlines;
            para.airlines_elm.val( JSON.stringify( airlines ) );
            self._formSubmit();
        },

        _formSubmit: function(){
            var self = this, para = self.parameter;

            window.setTimeout( function(){
                para.query_form.submit();
            }, 0 );
        },

        //事件绑定
        _bind: function () {
            var self = this, para = self.parameter;

            $( '.to-jump-link' ).bind( 'click', function( e ){
                var elm = $( e.currentTarget );
                $.common.jump_to_link( elm );
            } );

            $( '*' ).bind( 'click', function( e ){
                var elm = $( e.currentTarget);
                self.showFloatPanel( elm.attr( 'user-data-type' ), elm );
            } );

            $( 'span.ui-slider-handle.ui-corner-all.ui-state-default' ).bind( 'mousedown', function(){
                $( document ).bind( 'mouseup', function(){
                    $( document ).unbind( 'mouseup' );
                    self._formSubmit();
                } );
            } );

            $( '#j_refine_results_container input[ type="checkbox" ]' ).bind( 'change', function(){
                self._setRefineResules();
            } );

            $( '#j_fare_type_container input[ type="checkbox" ]' ).bind( 'change', function(){
                self._setFareType();
            } );

            $( '#j_airlines_container input[ type="checkbox" ]' ).bind( 'change', function(){
                self._setAirlines();
            } );

            $( '#j_airline_sort' ).bind( 'change', function( e ){
                var elm = $( e.currentTarget);
                para.airline_sort_elm.val( elm.val() );
                self._formSubmit();
            } );
            $( '#j_class_sort' ).bind( 'change', function( e ){
                var elm = $( e.currentTarget);
                para.class_sort_elm.val( elm.val() );
                self._formSubmit();
            } );
            $( '#j_price_sort' ).bind( 'change', function( e ){
                var elm = $( e.currentTarget);
                para.price_sort_elm.val( elm.val() );
                self._formSubmit();
            } );
            $( '#j_recommended_sort' ).bind( 'change', function( e ){
                var elm = $( e.currentTarget);
                para.recommended_sort_elm.val( elm.val() );
                self._formSubmit();
            } );

            $( '#j_previous' ).bind( 'click', function(){
                self.changePage( para.current_page - 1 );
            } );

            $( '#j_next' ).bind( 'click', function(){
                self.changePage( para.current_page + 1 );
            } );
        }
    };

    index.init();
});
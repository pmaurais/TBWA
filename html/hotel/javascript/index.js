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

        _addFormValidate: function(){
            $( '#j_flights_form' ).validate();
            $( '#j_hotels_form' ).validate();
            $( '#j_login_form' ).validate();
        },

        _initDatePicker: function(){
            $( '.show-for-date' ).datepicker( {
                dateFormat: "dd.mm.yy"
            } );
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
                para.stars_elm = para.query_form.find( '#j_hidden_stars' );
                para.stars = $.common.notNull( para.stars_elm ) ? JSON.parse( para.stars_elm.val() ) : [];
                para.price_elm = para.query_form.find( '#j_hidden_price' );
                para.price = $.common.notNull( para.price_elm ) ? JSON.parse( para.price_elm.val() ) : [];
                para.property_elm = para.query_form.find( '#j_hidden_property' );
                para.property = $.common.notNull( para.property_elm ) ? JSON.parse( para.property_elm.val() ) : [];

                para.distance_sort_elm = para.query_form.find( '#j_hidden_distance_sort' );
                para.distance_sort = $.common.notNull( para.distance_sort_elm ) ? para.distance_sort_elm.val() : '';
                para.price_sort_elm = para.query_form.find( '#j_hidden_price_sort' );
                para.price_sort = $.common.notNull( para.price_sort_elm ) ? para.price_sort_elm.val() : '';
                para.rating_sort_elm = para.query_form.find( '#j_hidden_rating_sort' );
                para.rating_sort = $.common.notNull( para.rating_sort_elm ) ? para.rating_sort_elm.val() : '';
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

            $.each( para.stars, function( starIndex, star ){
                var id = '#j_star_raiting_' + star, obj = $( id );
                $.common.notNull( obj ) && obj.attr( 'checked', 'checked' );
            } );

            var itemList = $( '#j_price_range_container .show-range-container span' );
            $( itemList[ 0 ] ).html(  para.price[ 0 ] );
            $( itemList[ 1 ] ).html(  '$' + para.price[ 1 ] );
            $( itemList[ 3 ] ).html(  '$' + para.price[ 2 ] );
            $( itemList[ 2 ] ).html(  para.price[ 3 ] );

            $.each( para.property, function( propertyIndex, property ){
                var id = '#j_property_type_' + property, obj = $( id );
                $.common.notNull( obj ) && obj.attr( 'checked', 'checked' );
            } );

            $( "#j_distance_sort option[ value = '"+ para.distance_sort +"']" ).attr( "selected", "selected" );
            $( "#j_price_sort option[ value = '"+ para.price_sort +"']" ).attr( "selected", "selected" );
            $( "#j_rating_sort option[ value = '"+ para.rating_sort +"']" ).attr( "selected", "selected" );
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

        _setStarsChoice: function(){
            var self = this, para = self.parameter, stars = [];

            $.each( $( '#j_star_raiting_container input[ type="checkbox" ]'), function( starIndex, star ){
                var obj = $( star );

                if( obj.attr( 'checked' ) ){
                    stars.push( Number( obj.val() ) );
                }
            } );

            self.stars = stars;
            para.stars_elm.val( JSON.stringify( stars ) );
            self._formSubmit();
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

        _setPropertyType: function(){
            var self = this, para = self.parameter, propertys = [];

            $.each( $( '#j_property_type_container input[ type="checkbox" ]'), function( propertyIndex, property ){
                var obj = $( property );

                if( obj.attr( 'checked' ) ){
                    propertys.push( obj.val() );
                }
            } );

            self.property = propertys;
            para.property_elm.val( JSON.stringify( propertys ) );
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

            $( '#j_star_raiting_container input[ type="checkbox" ]' ).bind( 'change', function(){
                self._setStarsChoice();
            } );

            $( 'span.ui-slider-handle.ui-corner-all.ui-state-default' ).bind( 'mousedown', function(){
                $( document ).bind( 'mouseup', function(){
                    $( document ).unbind( 'mouseup' );
                    self._formSubmit();
                } );
            } );

            $( '#j_property_type_container input[ type="checkbox" ]' ).bind( 'change', function(){
                self._setPropertyType();
            } );

            $( '#j_distance_sort' ).bind( 'change', function( e ){
                var elm = $( e.currentTarget);
                para.distance_sort_elm.val( elm.val() );
                self._formSubmit();
            } );
            $( '#j_price_sort' ).bind( 'change', function( e ){
                var elm = $( e.currentTarget);
                para.price_sort_elm.val( elm.val() );
                self._formSubmit();
            } );
            $( '#j_rating_sort' ).bind( 'change', function( e ){
                var elm = $( e.currentTarget);
                para.rating_sort_elm.val( elm.val() );
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
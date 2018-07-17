/**
 * Created by admin on 2018-6-6.
 */

$( document ).ready( function () {
    var index = {
        //参数定义
        parameter: {
            currentOpenPanel: '',
            showFlag: true,
            query_form: $( '#j_hidden_query_form' ),
            itemHieght: 320
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

            self._showChoosePanel( para.panel );
            self._initPanelSize();
            self._changePage();
            self._initItineraryData();
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
                para.panel_elm = para.query_form.find( '#j_hidden_panel' );
                para.panel = $.common.notNull( para.panel_elm ) ? para.panel_elm.val() : '';

                para.page_size_elm = para.query_form.find( '#j_hidden_page_size' );
                para.page_size = $.common.notNull( para.page_size_elm ) ? para.page_size_elm.val() : 4;

                para.itinerary_data_elm = para.query_form.find( '#j_hidden_itinerary_data' );
                para.itinerary_data = $.common.notNull( para.itinerary_data_elm ) ? JSON.parse( para.itinerary_data_elm.val() ) : [];
            }
        },

        _showChoosePanel: function( target ){
            var self = this, para = self.parameter, container = $( '.tabs-panel-container' ), navTabs = container.find( '.tabs-nav li' ),
                panels = container.find( '.panel-container li.panel' ), targetTab = container.find( '.tabs-nav li.tab-' + target ),
                targetPanels = container.find( '.panel-container li.panel.for-' + target );

            para.navTabs = navTabs;

            navTabs.removeClass( 'current' );
            panels.removeClass( 'current' );
            targetTab.addClass( 'current' );
            targetPanels.addClass( 'current' );

            para.panel = target;
            para.panel_elm.val( target );

            self._changePage();
        },

        _initPanelSize: function(){
            var self = this, para = self.parameter, panels = $( 'li.panel' );

            $.each( panels, function( panelIndex, panelElm ){
                var panel = $( panelElm );
                var curPanelItems = panel.find( 'ul li' ), sum = curPanelItems.length, total = Math.ceil( sum / para.page_size),
                    lastPageItemCount = sum % para.page_size, name = '';

                if( panelIndex == 0 ){
                    name = 'hotels';
                }
                else if( panelIndex == 1 ){
                    name = 'flights';
                }
                else if( panelIndex == 2 ){
                    name = 'cruises';
                }

                para[ name + '_cur_page' ] = 0;
                para[ name + '_sum' ] = sum;
                para[ name + '_total' ] = total;
                para[ name + '_items' ] = curPanelItems;
                para[ name + '_last_item_count' ] = lastPageItemCount;
            } );
        },

        _setPanelHeight: function( panel, name ){
            var self = this, para = self.parameter, cur = para[ name + '_cur_page' ], total = para[ name + '_total' ],
                lastCount = para[ name + '_last_item_count' ], height = 0;

            if( ( cur + 1 ) == total ){
                height = para.itemHieght * lastCount + 'px'
            }
            else{
                height = para.itemHieght * para.page_size + 'px';
            }

            panel.css( 'height', height );
        },

        _changePage: function( type ){
            var self = this, para = self.parameter, panelName = para.panel, curPage = para[ panelName + '_cur_page'],
                targetPage = curPage, targetPanel = $( '.panel.for-' + panelName),
                prev = $( '.page-container .prev' ), next = $( '.page-container .next' ),
                sum = para[ panelName + '_sum' ], total = para[ panelName + '_total' ];

            prev.hide();
            next.hide();


            if( type == 'prev' ){
                targetPage--;
            }
            else if( type == 'next' ){
                targetPage++;
            }


            if( $.common.notNull( targetPanel ) ){
                var scrollTop = targetPage * para.itemHieght * para.page_size;

                if( ( targetPage + 1 ) > 1 ){
                    prev.show();
                }
                if( ( targetPage + 1 ) < total ){
                    next.show();
                }

                para[ panelName + '_cur_page'] = targetPage;
                self._setPanelHeight( targetPanel, panelName );
                targetPanel.scrollTop( scrollTop );
            }
        },

        _initItineraryData: function(){
            var self = this, para = self.parameter, data = para.itinerary_data;

            //console.log( data );
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

            para.navTabs.bind( 'click', function( e ){
                var elm = $( e.currentTarget );
                self._showChoosePanel( elm.html().toLowerCase() );
            } );

            $( '.page-container .prev' ).bind( 'click', function( e ){
                self._changePage( 'prev' );
            } );
            $( '.page-container .next' ).bind( 'click', function( e ){
                self._changePage( 'next' );
            } );
        }
    };

    index.init();
});
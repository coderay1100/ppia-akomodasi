/*!
 SelectNav.js (v. 0.1)
 Converts your <ul>/<ol> navigation into a dropdown list for small screens
 https://github.com/lukaszfiszer/selectnav.js
*/
window.selectnav=function(){return function(p,q){var a,h=function(b){var c;b||(b=window.event);b.target?c=b.target:b.srcElement&&(c=b.srcElement);3===c.nodeType&&(c=c.parentNode);c.value&&(window.location.href=c.value)},k=function(b){b=b.nodeName.toLowerCase();return"ul"===b||"ol"===b},l=function(b){for(var c=1;document.getElementById("selectnav"+c);c++);return b?"selectnav"+c:"selectnav"+(c-1)},n=function(b){g++;var c=b.children.length,a="",d="",f=g-1;if(c){if(f){for(;f--;)d+=r;d+=" "}for(f=0;f<
c;f++){var e=b.children[f].children[0];if("undefined"!==typeof e){var h=e.innerText||e.textContent,i="";j&&(i=-1!==e.className.search(j)||-1!==e.parentElement.className.search(j)?m:"");s&&!i&&(i=e.href===document.URL?m:"");a+='<option value="'+e.href+'" '+i+">"+d+h+"</option>";t&&(e=b.children[f].children[1])&&k(e)&&(a+=n(e))}}1===g&&o&&(a='<option value="">'+o+"</option>"+a);1===g&&(a='<select class="selectnav" id="'+l(!0)+'">'+a+"</select>");g--;return a}};if((a=document.getElementById(p))&&k(a)){document.documentElement.className+=
" js";var d=q||{},j=d.activeclass||"active",s="boolean"===typeof d.autoselect?d.autoselect:!0,t="boolean"===typeof d.nested?d.nested:!0,r=d.indent||"\u2192",o=d.label||"- Navigation -",g=0,m=" selected ";a.insertAdjacentHTML("afterend",n(a));a=document.getElementById(l());a.addEventListener&&a.addEventListener("change",h);a.attachEvent&&a.attachEvent("onchange",h)}}}();


/**
 * SMK Progress Bar jQuery Plugin
 * ----------------------------------------------------
 * Author: Smartik
 * Author URL: http://smartik.ws/
 * Copyright: (c) Smartik. All rights reserved
 */
;(function ( $ ) {

	$.fn.smk_ProgressBar = function( options ) {

		// Defaults
		var settings = $.extend({
			// These are the defaults.
			width: 50,
			animSpeed: 2000,
			animation: true,
			showValue: false,
			modifier: ''
		}, options );

		// Cache current instance
		// To avoid scope issues, use 'plugin' instead of 'this'
		// to reference this class from internal events and functions.
		var plugin = this;

		//"Constructor"
		var init = function() {
			plugin.createEl();
			plugin.widthZero();
			plugin.widthMax();
			plugin.onWidthChange();
		}
		var child = undefined;

		// Create element
		plugin.createEl = function() {
			// Add class to parrent
			plugin.addClass('smk_progress_bar');
			if( true == settings.showValue ){
				plugin.addClass('with_value');
			}

			// Append progress indicator
			plugin.append('<div class="smk_pb_child"></div>');
			child = plugin.children('.smk_pb_child');

			// Add color if is set
			if( plugin.data('bgcolor').length == 4 || plugin.data('bgcolor').length == 7 ){
				child.css('background-color', plugin.data('bgcolor'));
			}

		}

		// Set the width to 0
		plugin.widthZero = function() {
			child.css({
				width: 0
			});
		}

		// Set the width to max value
		plugin.widthMax = function() {

			var data_val = parseInt( plugin.data('val') ),
				speed = parseInt( settings.animSpeed ),
				anim = settings.animation,
				w = parseInt( settings.width ) + '%';

			// Set the width
			if( data_val >= 0 && data_val <= 100 ){
				w = data_val + '%';
			}
			else if( data_val > 100 ){
				w = 100 + '%';
			}
			else if( data_val < 0 ){
				w = 0 + '%';
			}
			else{
				w = parseInt( settings.width ) + '%';
			}

			// If animation is enabled
			if( true == anim ){
				child.animate({
					width: w,
				}, speed, function() {
						if( true == settings.showValue ){
							child.append('<div class="value">' + w + '</div>');
							setTimeout(function(){
								plugin.find('.value').addClass('pb_val_anim');
							}, 200);
						}
				
					});
			}
			else{
				child.css({
					width: w,
				});
				if( true == settings.showValue ){
					child.append('<div class="value">' + w + '</div>');
					setTimeout(function(){
						plugin.find('.value').addClass('pb_val_anim');
					}, 200);
				}
			}
			
			
		}

		// Update width using a selector.
		plugin.onWidthChange = function() {

			$(settings.modifier).on('click', function(){

				var data_val = parseInt( plugin.data('val') ),
					speed = parseInt( settings.animSpeed ),
					mod_val = parseInt( $(this).data('val') );


				plugin.find('.value').removeClass('pb_val_anim');

				child.animate({
					width: mod_val + '%',
				}, speed, function() {
						if( true == settings.showValue ){
							plugin.find('.value').text(mod_val + '%');
							setTimeout(function(){
								plugin.find('.value').addClass('pb_val_anim');
							}, 200);
						}
				
					});

			});

		}

		//"Constructor" init
		init();

	};

}( jQuery ));


/**
 * SMK Tabs jQuery Plugin
 * ----------------------------------------------------
 * Author: Smartik
 * Author URL: http://smartik.ws/
 * Copyright: (c) Smartik. All rights reserved
 */
;(function ( $ ) {

	$.fn.smk_Tabs = function( options ) {

		// Defaults
		var settings = $.extend({
			// These are the defaults.
			animation: true,
		}, options );

		// Cache current instance
		// To avoid scope issues, use 'plugin' instead of 'this'
		// to reference this class from internal events and functions.
		var plugin = this;
		var list_nav = plugin.find('.tab_nav li');

		//"Constructor"
		var init = function() {
			plugin.tabsClass();
			plugin.whenReady();
			plugin.activeOnClick();
		}

		// Add .smk_tabs class
		plugin.tabsClass = function() {
			plugin.addClass('smk_tabs');
		}

		// Create element when the page is ready
		plugin.whenReady = function() {
						
			var tab_nav = plugin.find('.tab_nav li'),
				content = plugin.find('.tab_content .tab_in'),
				active_d = plugin.find('.tab_nav li.active'),
				idx;

			idx = 0;
			tab_nav.each(function(){
				$(this).attr('data-id', idx);
				idx++;
			});

			idx = 0;
			content.each(function(){
				$(this).attr('data-id', idx);
				idx++;
			});

			if( active_d.length > 0 ){
				idx = active_d.data('id');
			}
			else{
				idx = 0;
				plugin.find('.tab_nav li').eq(idx).addClass('active');
			}

			// Tab content
			content.eq(idx).addClass('active');

		}

		// Active on click
		plugin.activeOnClick = function() {
						
			list_nav.on('click', function() {

				var idx = $(this).index();
				var li = $(this);
				var content = plugin.children('.tab_content');

				content.animate('height');

				// List
				plugin.find('.tab_nav li').removeClass('active');
				li.addClass('active');

				if( true == settings.animation ){
					// Height
					var c_height = content.find('.tab_in').eq(idx).height();
					var c_padd = parseInt( content.find('.tab_in').eq(idx).css('padding-top') ) + parseInt( content.find('.tab_in').eq(idx).css('padding-bottom') );

					// Animate content
					content.find('.tab_in').removeClass('tab_fade_in').addClass('tab_fade_out');

					content.animate({
						'height': c_height + c_padd,
					}, 300, function() {
							
							content.css('height', '');

							// Tab content
							content.find('.tab_in').removeClass('active');
							content.find('.tab_in').eq(idx).removeClass('tab_fade_out').addClass('tab_fade_in active');
					
						});
				}
				else{
					//Remove animation classes
					content.find('.tab_in').removeClass('tab_fade_in').removeClass('tab_fade_out');

					//Remove height style
					content.css('height', '');

					// Tab content
					content.find('.tab_in').removeClass('active');
					content.find('.tab_in').eq(idx).addClass('active');

				}

				
			});

		}

		//"Constructor" init
		init();

	};

}( jQuery ));


/**
 * SMK Accordion jQuery Plugin
 * ----------------------------------------------------
 * Author: Smartik
 * Author URL: http://smartik.ws/
 * Copyright: (c) Smartik. All rights reserved
 */
;(function ( $ ) {

	$.fn.smk_Accordion = function( options ) {

		// Defaults
		var settings = $.extend({
			// These are the defaults.
			animation: true,
			showIcon: true,
			closeAble: false,
			slideSpeed: 200
		}, options );

		// Cache current instance
		// To avoid scope issues, use 'plugin' instead of 'this'
		// to reference this class from internal events and functions.
		var plugin = this;

		//"Constructor"
		var init = function() {
			plugin.createStructure();
			plugin.clickHead();
		}

		// Add .smk_accordion class
		plugin.createStructure = function() {

			//Add Class
			plugin.addClass('smk_accordion');
			if( true === settings.showIcon ){
				plugin.addClass('acc_with_icon');
			}

			//Append icon
			if( true === settings.showIcon ){
				plugin.find('.acc_head').prepend('<div class="acc_icon_expand"></div>');
			}

			plugin.find('.accordion_in .acc_content').not('.acc_active .acc_content').hide();

		}

		// Action when the user click accordion head
		plugin.clickHead = function() {

			plugin.on('click', '.acc_head', function(){
				
				var s_parent = $(this).parent();
				
				if( s_parent.hasClass('acc_active') == false ){
					plugin.find('.acc_content').slideUp(settings.slideSpeed);
					plugin.find('.accordion_in').removeClass('acc_active');
				}

				if( s_parent.hasClass('acc_active') ){
					if( false !== settings.closeAble){
						s_parent.children('.acc_content').slideUp(settings.slideSpeed);
						s_parent.removeClass('acc_active');
					}
				}
				else{
					$(this).next('.acc_content').slideDown(settings.slideSpeed);
					s_parent.addClass('acc_active');
				}

					
				
				
			});

		}

		//"Constructor" init
		init();

	};

}( jQuery ));


/**
 * SMK Toggle jQuery Plugin
 * ----------------------------------------------------
 * Author: Smartik
 * Author URL: http://smartik.ws/
 * Copyright: (c) Smartik. All rights reserved
 */
;(function ( $ ) {

	$.fn.smk_Toggle = function( options ) {

		// Defaults
		var settings = $.extend({
			// These are the defaults.
			animation: true,
			showIcon: true,
			defaultState: 'close',
			slideSpeed: 200
		}, options );

		// Cache current instance
		// To avoid scope issues, use 'plugin' instead of 'this'
		// to reference this class from internal events and functions.
		var plugin = this;

		//"Constructor"
		var init = function() {
			plugin.createStructure();
			plugin.clickHead();
		}

		// Add .smk_toggle class
		plugin.createStructure = function() {
					
			//Add Class
			plugin.addClass('smk_toggle');
			if( true === settings.showIcon ){
				plugin.addClass('smk_toggle_with_icon');
			}

			//Append icon
			if( true === settings.showIcon ){
				plugin.find('.smk_toggle_head').prepend('<div class="smk_toggle_expand"></div>');
			}

			//Determine default state(open or close)
			var data_state = plugin.data('state');
			
			if( data_state == 'close' || data_state == 'open' ){
				( 'open' == data_state ) ? plugin.openIt(0) : plugin.closeIt(0);
			}
			else{
				( 'open' == settings.defaultState ) ? plugin.openIt(0) : plugin.closeIt(0);
			}

		}

		// Action when the user click toggle head
		plugin.clickHead = function() {

			plugin.on('click', '.smk_toggle_head', function(){
				
				var s_parent = $(this).parents('.smk_toggle');
				if( s_parent.hasClass('smk_toggle_active') === true ) {
					plugin.closeIt(settings.slideSpeed);
				} 
				else{ 
					plugin.openIt(settings.slideSpeed);
				}

			});

		}

		// Open
		plugin.openIt = function(speed) {

			plugin.addClass('smk_toggle_active');
			plugin.find('.smk_toggle_body').slideDown(speed);

		}

		// Close
		plugin.closeIt = function(speed) {

			plugin.removeClass('smk_toggle_active');
			plugin.find('.smk_toggle_body').slideUp(speed);

		}

		//"Constructor" init
		init();

	};

}( jQuery ));
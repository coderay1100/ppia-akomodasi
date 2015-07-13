/**
 * SMK Slider jQuery Plugin
 * ----------------------------------------------------
 * Author: Smartik
 * Author URL: http://smartik.ws/
 * Copyright: (c) Smartik. All rights reserved
 */
;(function ( $ ) {

	$.fn.smkSlider = function( options ) {

		/* Defaults
		---------------------------------------------------------*/
		var settings = $.extend({

			firstSlide: 1,
			autoplay: false,
			interval: 7000,
			fadeSpeed: 300,
			progressBar: true,
			showBullets: true,
			responsiveScale: true,
			width: 960,
			height: 400,
			customNavigation: false

		}, options );


		/*Variables
		---------------------------------------------------------*/
			// To avoid scope issues, use 'plugin' instead of 'this'
			// to reference this class from internal events and functions.
		var plugin = this,
			//Get browser details
			browser = navigator.userAgent,

			//Get slider details
			slides_block = plugin.children('.smk_cs_slides'),
			slide_child = slides_block.children('.smk_cs_slide')
			plugin.total_slides = slide_child.length,
			plugin.startslide = undefined,
			plugin.stopTheSlider = undefined,
			plugin.theProgressBar = undefined,
			plugin.captionDelay = undefined,
			plugin.sliderIsPlaying = undefined
			plugin.allCaptions = plugin.find('.smk_caption');


		/* "Constructor"
		---------------------------------------------------------*/
		var init = function() {
			plugin.createEl();
			plugin.navigation();
			plugin.windowResize();
		}


		/* Create element 
		---------------------------------------------------------*/
		plugin.createEl = function() {

			// Set required css properties to main container
			slides_block.css({
				'position': 'relative',
				'overflow': 'hidden'
			});

			//If is set Responsive scale
			if( true === settings.responsiveScale ){
				slides_block.attr({
					'data-width': settings.width,
					'data-height': settings.height,
				});
			}

			// Index slides
			for (var i = 0; i < plugin.total_slides; i++) {

				slide_child.eq(i)
				.attr('data-slide', i)
				.hide()
				.css({
					'position': 'absolute',
					'left': 0,
					'width': '100%',
					'display': 'none'
				});

			}
			
			//if starting slide is defined.
			if(settings.firstSlide && settings.firstSlide <= plugin.total_slides ){
				//human numbers starting with 1 not 0. This will let the user to set the right slide starting from 1
				plugin.startslide = settings.firstSlide-1; 
			}
			else{
				plugin.startslide = 0;
			}

			plugin.showSlide(plugin.startslide); 
			// slide_child.eq(plugin.startslide)
			// .addClass('smk_cs_active')
			// .fadeIn(settings.fadeSpeed/2)
			// .css({
			// 	'display': 'block'
			// });


			// Set the height of slider equal to the first slide height 
			$(document).ready(function(){
				$(window).load(function () {

					if( true === settings.autoplay ){
						plugin.sliderIsPlaying = true;
					}
					else{
						plugin.sliderIsPlaying = false;
					}

					//Play/Stop buttons construct
					if (true === plugin.sliderIsPlaying) {
						plugin.find('.smk_cs_stop').show();
						plugin.find('.smk_cs_play').hide();
					}
					else{
						plugin.find('.smk_cs_stop').hide();
						plugin.find('.smk_cs_play').show();
					}

					plugin.captionAnim('remove', plugin.startslide);
					plugin.playSlider();
					plugin.setHeight(plugin.startslide);
					plugin.createProgressBar();
					plugin.startProgressBar();
					plugin.slideBullets();
					plugin.sliderCustomNav();
					plugin.bulletsContainerWidth();
					plugin.captionAnim('add', plugin.startslide);

				});
			});


		}//createEl


		/* Create Progress bar
		---------------------------------------------------------*/
		plugin.createProgressBar = function(){

			if( true === plugin.sliderIsPlaying ){
				if( true == settings.progressBar ){
					plugin.prepend('<div class="smk_cs_progress_bar"></div>');
					plugin.find('.smk_cs_progress_bar').append('<div class="progress"></div>');
					plugin.theProgressBar = plugin.find('.smk_cs_progress_bar .progress');
				}
			}

		}


		/* Window Resize
		---------------------------------------------------------*/
		plugin.windowResize = function(){

			//Get previous width(current)
			var prev_w = $(window).width();

			$(window).resize(function(){
				
				var this_w = $(window).width();

				if( prev_w !== this_w){
					
					plugin.stopSlider();

					var slide_number = slides_block.children('.smk_cs_slide.smk_cs_active').data('slide');
					var slide_height = plugin.getHeight(slide_number);

					slides_block.stop().animate({
						'height': slide_height
					});

					plugin.playSlider();
					plugin.startProgressBar();
				}
				
				//reset previous width(after resize complete)
				prev_w = $(window).width();
			});

		}


		/* Navigation
		---------------------------------------------------------*/
		plugin.navigation = function() {

			//Next slide button
			plugin.children('.smk_cs_next').on('click', function(){
				plugin.nextSlide();
			});

			//Previous slide button
			plugin.children('.smk_cs_prev').on('click', function(){
				plugin.prevSlide();
			});

			//Bullet
			plugin.on('click', '.smk_cs_bullets span', function(){

				var slide_number = $(this).data('slide'),
					bull_parent = $(this).parent();

				bull_parent.find('span').removeClass('active');
				$(this).addClass('active');

				plugin.goToSlide(slide_number);
				
			});

			//customNav
			var cstm_nav = $(settings.customNavigation).children();
			cstm_nav.on('click', function(){

				var slide_number = $(this).data('slide'),
					item_parent = $(this).parent();

				item_parent.children().removeClass('active');
				$(this).addClass('active');

				plugin.goToSlide(slide_number);
				
			});

			//Stop slider[button]
			plugin.find('.smk_cs_stop').on('click', function(){
				$(this).hide();
				plugin.find('.smk_cs_play').show();

				plugin.stopSlider();
				plugin.sliderIsPlaying = false;
			});

			//Play slider[button]
			plugin.find('.smk_cs_play').on('click', function(){
				if( false === plugin.sliderIsPlaying ){

					$(this).hide();
					plugin.find('.smk_cs_stop').show();

					plugin.sliderIsPlaying = true;

					if( true === plugin.sliderIsPlaying ){
						if( true == settings.progressBar ){
							if( plugin.find('.smk_cs_progress_bar').length == 0 ){
								plugin.createProgressBar();
							}
						}
					}

					plugin.stopSlider();
					plugin.startProgressBar();
					plugin.playSlider();
				}
				else{
					return false;
				}
			});


		}//navigation


		/* Next Slide
		---------------------------------------------------------*/
		plugin.nextSlide = function(){

			var this_index = slides_block.children('.smk_cs_slide.smk_cs_active').data('slide'),
				next_slide = this_index+1,
				slide_number;

			slide_number = ( next_slide >= plugin.total_slides ) ? 0 : next_slide;
			
			plugin.goToSlide(slide_number);

		}


		/* Prev Slide
		---------------------------------------------------------*/
		plugin.prevSlide = function(){
	
			var this_index = slides_block.children('.smk_cs_slide.smk_cs_active').data('slide'),
				prev_slide = this_index-1,
				slide_number;

			slide_number = ( prev_slide < 0 ) ? plugin.total_slides-1 : prev_slide;
			
			plugin.goToSlide(slide_number);

		}


		/* Create bullets
		---------------------------------------------------------*/
		plugin.slideBullets = function() {
			
			if( true == settings.showBullets ){

				plugin.append('<div class="smk_cs_bullets"></div>');

				var active_bull;

				for (var i = 0; i < plugin.total_slides; i++) {

					//Set active bullet
					active_bull = ( i == plugin.startslide ) ? 'class="active"' : '';
					
					plugin.children('.smk_cs_bullets').append('<span '+ active_bull +' data-slide="'+ i +'"></span>');

				}

			}

		}


		/* Activate bullet
		---------------------------------------------------------*/
		plugin.activateBullet = function(bull_number){
			var bulls_exist = plugin.find('.smk_cs_bullets span').length;

			if(bulls_exist > 0){
				plugin.find('.smk_cs_bullets span').removeClass('active').eq(bull_number).addClass('active');
			}

		}


		/* Set the width for bullets container
		---------------------------------------------------------*/
		plugin.bulletsContainerWidth = function() {

			var nr_of_bulls = parseInt( plugin.find('.smk_cs_bullets span').length );
			var bull_width = parseInt( plugin.find('.smk_cs_bullets span').outerWidth(true) );
			plugin.find('.smk_cs_bullets').css({
				'width': nr_of_bulls*bull_width
			});

		}


		/* Go to slide X 
		---------------------------------------------------------*/
		plugin.goToSlide = function(slide_number){
			
			plugin.stopProgressBar();
			plugin.stopSlider();
			plugin.captionAnim('remove', slide_number);
			plugin.removeCurrentSlide();
			
			var slide_height = plugin.getHeight(slide_number);
			slides_block.stop().animate({
				'height': slide_height
			}, settings.fadeSpeed);

			plugin.showSlide(slide_number);
			plugin.captionAnim('add', slide_number);
			plugin.playSlider();
			plugin.startProgressBar();

		}//goToSlide
		

		/* Remove current active slide
		---------------------------------------------------------*/
		plugin.removeCurrentSlide = function(){
			
			slides_block.children('.smk_cs_slide.smk_cs_active').fadeOut(settings.fadeSpeed).removeClass('smk_cs_active');

		}


		/* Show slide X
		---------------------------------------------------------*/
		plugin.showSlide = function(slide_number){
			
			//Apply styles to next slide
			slide_child.eq(slide_number).fadeIn(settings.fadeSpeed).addClass('smk_cs_active');

			plugin.activateBullet(slide_number);
			plugin.customNavActive(slide_number);

		}


		/* Play slider
		---------------------------------------------------------*/
		plugin.playSlider = function() {

			if( true === plugin.sliderIsPlaying ){

				plugin.startProgressBar();
				plugin.stopTheSlider = setInterval(function(){
					plugin.nextSlide();
				}, settings.interval);

			}

		}


		/* Stop Slider
		---------------------------------------------------------*/
		plugin.stopSlider = function() {

			plugin.stopProgressBar();
			clearInterval(plugin.stopTheSlider);

		}


		/* Start Progress Bar
		---------------------------------------------------------*/
		plugin.startProgressBar = function() {
			if( true == settings.progressBar ){
				if( true === plugin.sliderIsPlaying ){
					if( plugin.find('.smk_cs_progress_bar').length > 0 ){
						plugin.theProgressBar.stop().animate({
							'width': '100%'
						},{
							duration: settings.interval
						});
					}
				}
			}
		}


		/* Stop Progress Bar
		---------------------------------------------------------*/
		plugin.stopProgressBar = function(clear) {
			if( true == settings.progressBar ){
				if( true === plugin.sliderIsPlaying ){
					plugin.theProgressBar.stop().css({
						'width': '0'
					});
				}
			}

		}


		/* Pause Progress Bar
		---------------------------------------------------------*/
		plugin.pauseProgressBar = function() {

			var this_progress_bar = plugin.find('.smk_cs_progress_bar');

			if( this_progress_bar.length > 0 ){
				var the_progress = this_progress_bar.children('.progress');
				var pb_width = the_progress.width();
				plugin.stopProgressBar();
				the_progress.css('width', pb_width);
			}

		}


		/* Slider Captions
		---------------------------------------------------------*/
		plugin.captionAnim = function(anim_type, slide_number) {
			slide_child.eq(slide_number).find('.smk_caption').each(function(){
				var caption = $(this),
					x = caption.data('x'),
					y = caption.data('y'),
					anim = caption.data('anim'),
					time = parseInt( caption.data('time') );
				caption.css({
					'top': y,
					'left': x,
					'opacity': 0
				});

				time = ( time > 0 ) ? (time+settings.fadeSpeed/2): settings.fadeSpeed;

				if( 'add' == anim_type ){
					setTimeout(function(){
						plugin.captionDelay = caption.addClass(anim).css('opacity', '');
					}, time);
					
				}
				else{
					clearTimeout(plugin.captionDelay);
					caption.removeClass(anim);
				}
				
			});

		}


		/* Create custom navigation
		---------------------------------------------------------*/
		plugin.sliderCustomNav = function() {
			
			if( false !== settings.customNavigation && '' !== settings.customNavigation ){
				
				var custom_nav_exist = $(settings.customNavigation).length;

				if( custom_nav_exist > 0 ){
					for (var i = 0; i < plugin.total_slides; i++) {

						var this_child = $(settings.customNavigation).children().eq(i);

						this_child.attr("data-slide", i);

						if( i == plugin.startslide ){
							this_child.addClass('active');
						}

					}
				}
				

			}

		}


		/* Activate custom navigation item
		---------------------------------------------------------*/
		plugin.customNavActive = function(slide_number){
			var custom_nav_exist = $(settings.customNavigation).length;

			if(custom_nav_exist > 0){
				$(settings.customNavigation).children().removeClass('active').eq(slide_number).addClass('active');
			}

		}


		/* Set Height
		---------------------------------------------------------*/
		plugin.setHeight = function(slide_number){
			slides_block.css('height', parseInt( slide_child.eq(slide_number).outerHeight(true) ));
		}


		/* Get Height
		---------------------------------------------------------*/
		plugin.getHeight = function(slide_number){
			return parseInt( slide_child.eq(slide_number).outerHeight(true) );
		}


		/* Return the Internet Explorer version
		---------------------------------------------------------*/
		plugin.browserIEversion = function(){
			
			if( browser.indexOf("MSIE") !=-1 ){
				var IEversion = browser.substring(browser.indexOf("MSIE")+5);
				IEversion = IEversion.split(";");
				return IEversion[0];
			}
			else{
				return null;
			}
			
		}


		/* Boolean if is Internet Explorer
		---------------------------------------------------------*/
		plugin.is_browserIE = function(){
			
			if( browser.indexOf("MSIE") !=-1 ){
				return true;
			}
			else{
				return false
			}
			
		}


		/* "Constructor" init
		---------------------------------------------------------*/
		init();
		

	};

}( jQuery ));
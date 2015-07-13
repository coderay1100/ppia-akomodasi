jQuery.noConflict();
jQuery(document).ready(function($){

	//sidebar full height
	function smk_sidebar_full_height(_sel, _par){
		var parH = $(_sel).parents(_par).height();
		$(_sel).css('min-height', parH + 'px');
	}
	smk_sidebar_full_height('.mod_sidebar', '.container_row');
	

	//Menu
	this.navLi = $('#main_menu li').children('ul').end();
	//Add arrow for each menu item that has a children
	$.each(this.navLi, function() {
		if ( $(this).children('li ul')[0] ) {
			$(this).children('a').append(' <span class="menu_plus">+</span> ');
		}
	});
	//keep marked parrent element
	this.navLi
		.mouseenter(function() {
			$(this).children('a:first').addClass("hov");
		})
		.mouseleave(function() {
			$(this).children('a:first').removeClass("hov");
		} );

	selectnav('main_menu');

	$( ".progress_bar_minimal" ).each(function() {
		$(this).smk_ProgressBar({
			animSpeed: 2000, //integer, in miliseconds
			width: 75, //integer, in percents
			animation: true // boolean
		});
	});

	$( ".progress_bar_large" ).each(function() {
		$(this).smk_ProgressBar({
			animSpeed: 2000, //integer, in miliseconds
			width: 75, //integer, in percents
			animation: true, //boolean
			showValue: true // boolean
		});
	});

	$( ".tabs_example, .smk_theme_jquery_tabs" ).each(function() {
		$(this).smk_Tabs({
			animation: true, //boolean
		});
	});


	$( ".accordion_example, .smk_theme_jquery_accordion" ).each(function() {
		$(this).smk_Accordion({
			showIcon: true, //boolean
			animation: true, //boolean
			closeAble: false, //boolean
			slideSpeed: 300 //integer, miliseconds
		});
	});

	//Widget accordion
	$( ".widget_accordion_block" ).each(function() {
		$(this).smk_Accordion({
			showIcon: false, //boolean
			animation: true, //boolean
			closeAble: false, //boolean
			slideSpeed: 200 //integer, miliseconds
		});
	});

	//
	$( ".faq_toggle_item, .smk_theme_jquery_toggle" ).each(function() {
		$(this).smk_Toggle();
	});
	
	$( "#homepage_slider1" ).smkSlider({
		firstSlide: 1,
		autoplay: true,
		interval: 12000,
		progressBar: true,
		showBullets: true,
		responsiveScale: true,
		width: 985,
		height: 660,
	});
	$( "#homepage_slider2" ).smkSlider({
		firstSlide: 1,
		autoplay: true,
		interval: 7000,
		fadeSpeed: 500,
		progressBar: true,
		showBullets: false
	});
	
	$( "#homepage_featured_slider" ).smkSlider({
		firstSlide: 2,
		autoplay: false,
		progressBar: false,
		showBullets: false,
		customNavigation: '.fs_custom_nav'
	});
	$( "#footer_slider" ).smkSlider({
		firstSlide: 1,
		autoplay: false,
		interval: 12000,
		progressBar: false,
		showBullets: false
	});
	$(".testimonials_slider").each(function(){
		$( this ).smkSlider({
			firstSlide: 1,
			autoplay: true,
			interval: 12000,
			progressBar: false,
			showBullets: true
		});
	});

	// $('.m_popup').magnificPopup({
	// 	mainClass: 'mfp-with-zoom', // this class is for CSS animation below

	// 	zoom: {
	// 		enabled: true, // By default it's false, so don't forget to enable it

	// 		duration: 300, // duration of the effect, in milliseconds
	// 		easing: 'ease-in-out', // CSS transition easing function 

	// 	}
	// });

	$('.portfolio_grid').magnificPopup({
		delegate: '.m_popup',
		type: 'image',
		tLoading: 'Loading image #%curr%...',
		mainClass: 'mfp-img-mobile',
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0,1] // Will preload 0 - before current, and 1 after the current image
		},
		image: {
			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
			titleSrc: function(item) {
				return item.el.attr('title');
			}
		}
	});

	function smk_theme_google_map_overlay(_selector){
		//Cache the overlay
		var container = $(_selector + ' .google_map_overlay');
		//Hide on click
		container.on('click', function(){
			$(this).fadeOut('fast');
		});
		//Show when we leave the area
		$(document).mouseup(function (e){
			if (!container.is(e.target) // if the target of the click isn't the container...
			&& container.has(e.target).length === 0){ // ... nor a descendant of the container
				container.fadeIn('fast');
			}
		});
	}
	smk_theme_google_map_overlay('.google_map');

	function smk_theme_comments_in_reply_to(){
		$('.in_reply_to a').on('click', function(event){
			event.preventDefault();
			var url = $(this).attr('href'); //cache the url. This is the comment id(parent)

			//Add higlight class
			$(url).addClass('highlight_comment'); 
			
			//Change url hash
			if(history.pushState) {
				$("html, body").animate({ 
					scrollTop: parseInt( $(url).offset().top ) - 50
				}, 300);
				history.pushState(null, null, url);//modern browsers
			}
			else {
				window.location.hash = url;//old browsers
			}
			
			//Finally remove the hilight class
			setTimeout(function(){
				$(url).removeClass('highlight_comment');
			}, 800);
		});
	}
	smk_theme_comments_in_reply_to();

});
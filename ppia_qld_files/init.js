/* 
* @Author: Smartik
* @Date:   2014-05-31 14:06:01
* @Last Modified by:   Smartik
* @Last Modified time: 2014-06-06 18:08:13
*/

jQuery(document).ready(function($){
  
    /*
    -------------------------------------------------------------------------------
    Init Isotope
    -------------------------------------------------------------------------------
    */
	$('.portfolio_grid').imagesLoaded(function(){
		var _container = $('.portfolio_grid');
		// init
		_container.isotope({
			// options
			itemSelector: '.portfolio_item',
			layoutMode: 'fitRows',
		});
		// filter items when filter link is clicked
		$('.portfolio_filter a').click(function(){	
			var selector = $(this).attr('data-filter');
			_container.isotope({ filter: selector });
			$('.portfolio_filter a').removeClass('active_cat');
			$(this).addClass('active_cat');
			return false;
		});
	});

});
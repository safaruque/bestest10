jQuery(document).ready(function($) {

	"use strict";

	// Navigation
	function setSubNavPos() {
		updateSubMenuTopPos();


    	$('#primary-nav-list ul ul').each(function(){
			if( $('body').hasClass('rtl-on') ) {
				$(this).css('left', (-1)*($(this).width()));
			} else {
				$(this).css('left', $(this).parents('ul').width()-2);
			}
		});
	};
	setSubNavPos();
	setInterval(setSubNavPos, 1000);
	function updateSubMenuTopPos() {
		if( !$('#primary-nav-list').length ) return;
		var menu_offset = $('#primary-nav-list > li > a').offset();
		var menu_item_bot = menu_offset.top + $('#primary-nav-list > li > a').height();
		var header_offset = $('.main-header').offset();
		var header_bot = header_offset.top + $('.main-header').outerHeight();
		// console.log(header_bot-menu_item_bot);
		var new_padding = header_bot-menu_item_bot;
		new_padding = Math.floor(new_padding);
		$('#primary-nav-list > li > a, #woocommerce-menu > li > a').css('padding-bottom', new_padding+'px');
	}

	// Sticky
	$('#header #main-header.sticky').sticky({topSpacing:0});
	$('#main-header-sticky-wrapper').css('background-color', $('#header #main-header').css('background-color'));
	$(window).scroll(function(){
		if( !$('#header #main-header').hasClass('sticky') ) return; 
		if( $('#header #main-header').hasClass('no-resize') ) return; 
		var pos = $('#main-header-sticky-wrapper').offset();
		var distance = $(window).scrollTop() - pos.top;

		var new_padding = 35 - distance;
		if(new_padding < 20) new_padding = 20;
		if(new_padding > 35) new_padding = 35;
		new_padding = Math.round(new_padding);
		$('.main-header').css('padding', new_padding+'px 0');

		var new_logo_height = $('#site-title img').data('orig-height') - distance + 35;
		if(new_logo_height < 35) new_logo_height = 35;
		if(new_logo_height > $('#site-title img').data('orig-height')) new_logo_height = $('#site-title img').data('orig-height');
		new_logo_height = Math.round(new_logo_height);
		$('#site-title img').css('height', new_logo_height+'px');

		var new_primary_nav_margin = $('#primary-nav').data('orig-margin') - ($('#site-title img').data('orig-height') - new_logo_height);
		if(new_primary_nav_margin < 0) new_primary_nav_margin = 0;
		if(new_primary_nav_margin > $('#primary-nav').data('orig-margin')) new_primary_nav_margin = $('#primary-nav').data('orig-margin');
		$('#primary-nav').css('margin-top', new_primary_nav_margin+'px');

		$('#main-header-sticky-wrapper').height($('.main-header').outerHeight());
		updateSubMenuTopPos();
	});

	// Search
	$('#search-link').click(function(e){
		e.preventDefault();
		$('#nt-search-bar').slideToggle(250);
	});

	// Side Panel
	var nt_side_panel_active = false;
	$('#primary-nav #tablet-menu-toggle').click(function(e){
		e.preventDefault();
		if( !nt_side_panel_active ) {
			$('#layout').transition({translate:[-300,0]},300, 'ease');
			nt_side_panel_active = true;
		} else {
			$('#layout').transition({translate:[0,0]},300, 'ease');
			nt_side_panel_active = false;
		}
	});
	$('#nt-side-panel li.menu-item-has-children').click(function(e){
		if( !$( e.target ).is( "a" ) ) {
			e.preventDefault();
			e.stopPropagation();
			if( !$(this).children('ul').is(':visible') ) {
				$(this).children('ul').slideDown(250);
			} else {
				$(this).children('ul').slideUp(250);
			}
			
		}
	});

	// Slider
	$('.nt-slider').each(function(){
		var defaults = {
			items: 3,
			itemsDesktop: false,
			itemsDesktopSmall: false,
			itemsTablet: false,
			itemsMobile: [767,1],
			stopOnHover: true,
			transitionStyle: 'fade',
			afterInit: function(elem){
				$(elem).show();
			}
		}

		if( $(this).data('main-slider') ) {
			defaults['afterMove'] = function(elem){
				var current = this.currentItem;
				var bgs = $(elem).parents('.hero-wrap').find('.bg');
				var slides = $(elem).parents('.hero-wrap').find('.owl-item');
				var wrap = $(elem).parents('.hero-wrap');
				$(wrap).removeClass('element-light element-dark').addClass($(slides[current]).find('.nt-slider-item').data('element-style'));
				$(elem).parents('.hero-wrap').find('.bg.active').removeClass('active');
				$(bgs[current]).addClass('active');
			}
		}

		var options = $.extend({}, defaults, $(this).data());
		$(this).owlCarousel(options);
	});


	// Add link class
	$('.nt-img-box a[href]').filter(function() {
	  return /(jpg|gif|png)$/.test($(this).attr('href'))
	}).addClass('nt-image-link');
	$('.nt-img-box a[href]').filter(function() {
	  return /(youtube.com\/watch)/.test($(this).attr('href'))
	}).addClass('nt-youtube-link').attr('target', '_self');
	$('.nt-img-box a[href]').filter(function() {
	  return /(vimeo.com\/)/.test($(this).attr('href'))
	}).addClass('nt-vimeo-link').attr('target', '_self');
	// Link with ahref="#"
	$('a[href="#"]').click(function(e){
		e.preventDefault();
	});

	// TinyNav
	$('#primary-nav-list').tinyNav({
		active: 'current-menu-item, current_page_parent',
		target: '#tiny-nav .select-wrap'
	});
	$('footer#footer nav').each(function(){
		var st_target = '#'+$(this).attr('id')+' .select-wrap';
		console.log(st_target);
		$('ul', $(this)).tinyNav({
			active: 'current-menu-item, current_page_parent',
			target: st_target
		});
	});

	// Fancybox
	$('a.nt-image-link, .gallery-item a').fancybox({
		'padding': 0,
		'cyclic': true,
		'showCloseButton': false,
		'titlePosition': 'over'
	});
	$("a.nt-youtube-link").click(function(e) {
		e.preventDefault();
		$.fancybox({
			'padding'       : 0,
			'showCloseButton': false,
			'title'         : this.title,
			'href'          : this.href.replace(new RegExp("watch\\?v=", "i"), 'v/') + '?showinfo=0',
			'type'          : 'swf',
			'swf'           : {
				'wmode' : 'transparent',
			    'allowfullscreen' : 'true'
			}
		});
	});
	$("a.nt-vimeo-link").click(function(e) {
		e.preventDefault();
		$.fancybox({
			'padding'       : 0,
			'showCloseButton': false,
			'title'         : this.title,
			'href'          : this.href.replace(new RegExp("([0-9])","i"),'moogaloop.swf?clip_id=$1'),
			'type'          : 'swf',
			'swf'           : {
				'wmode' : 'transparent',
			    'allowfullscreen' : 'true'
			}
		});
	});


	// Fitvids
	$('.container').fitVids();

	// Flickr
	$('.widget_flickr a').attr('target','_blank');

	// Lettering
	$('aside .widget-title, #pre-footer .widget-title, .title-wrap span').lettering('words');
	$('.text-branding').lettering();

	// Map
	$('.map-wrap').each(function() {
		var pane = $(this).siblings('.marker-pane');
		var markers = $(this).children();
		var defaults = {
			el: this,
			lat: 0,
			lng: 0,
			zoomControl : true,
			panControl : false,
			streetViewControl : false,
			mapTypeControl: false,
			overviewMapControl: false,
			scrollwheel: false,
			zoom: 6
		};
		var options = $.extend({}, defaults, $(this).data());
		var map = new GMaps(options);

		for (var i = 0; i < markers.length; i++) {
		  var marker_data = $(markers[i]).data();
		  map.addMarker({
		  	lat: marker_data.lat,
		  	lng: marker_data.lng,
		  	title: marker_data.title,
		  	content: marker_data.content,
		  	click: function(e) {
		  		// if(this.title == null) return;
		  		pane.empty();
		  		// if(this.title) pane.append('<p><strong>'+this.title+'</strong></p>');
				if(this.content) pane.append(this.content);
				if(this.title || this.content) {
					pane.css('opacity', 0).css('margin-top', 10);
					pane.animate({opacity: 1, marginTop: '20px'}, 250);
				}
			}
		  });
		}
	});
    
	// Animate Number
	$('.animate-number').html('0');
	var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');
	$('.animate-number').one('inview', function() {
		var start = $(this).data('to')-100;
		if(start<0) start = 0;
		$(this).prop('number', start).animateNumber({
			number: $(this).data('to'),
    		numberStep: comma_separator_number_step,
    		easing: 'easeOutQuad'
		}, 2000);
		$(this).parents('.nt-stat').find('.line').css({ perspective: '0', rotateY: '-90deg'}).transition({ rotateY: '0deg' }, 2000, 'ease');
		// $(this).css({ rotateY: '90deg', transformOrigin: '0 0' }).transition({ perspective: '0', rotateY: '0deg', delay: 250 }, 1000, 'ease');
	});

	// Form
	$('.validate-form').each(function(){
		if( $(this).is('form') ) {
			var curForm = $(this);
		} else {
			var curForm = $('form', $(this));
		}
		$(curForm).validate({
			errorPlacement: function(error, element) {
				$('.form-response', curForm).html(error).fadeIn();
			}
		});
	});
	$('.ajax-form').ajaxForm({
		dataType: 'json',
		beforeSubmit: function(arr, $form, options){
			$('.form-response', $form).html('sending data …').fadeIn();
		},
		success: function(data, statusText, xhr, $form){
			$('.form-response', $form).html(data.response_text);
			$form[0].reset();
		}
	});

	// Tweet
	$(".tweet").each(function(){
		var defaults = {
			modpath: '/assets/twitter/',
			extra_params: {action: 'nt_do_tweet'},
			username: 'twitter',
	        count: 1,
	        loading_text: "",
	        template: "{text}"
        };
        var options = $.extend({}, defaults, $(this).data());
		$(this).tweet(options);
	});
	
	// Animate
	$('.nt-img-box').mouseenter(function(){
		$('.icon-feature', $(this)).transition({
			scale: 1.1
		}, 250);
		$('.plus-sign', $(this)).css({ rotate: '0deg' }).transition({
			rotate: '-360deg'
		}, 500, 'ease');
	}).mouseleave(function(){
		$('.icon-feature', $(this)).transition({
			scale: 1
		}, 250);
	});
	$('.top-bar-item').mouseenter(function(){
		$('.quick-card', $(this)).css({
			translate: [0,10],
			opacity: 0,
			visibility: 'visible'
		}).transition({
			translate: [0,0],
			opacity: 1
		}, 200, 'ease');
	}).mouseleave(function(){
		$('.quick-card', $(this)).transition({
			translate: [0,10],
			opacity: 0
		}, 200, 'ease', function(){ $(this).css('visibility', 'hidden'); });
	});

	$('.title-wrap .runner-line, .title-wrap .runner-line-grey, .title-block .runner-line, .title-block .runner-line-grey').css({ transformOrigin: '0 0', perspective: '0', rotateY: '90deg' }).show();

	function parallax_slider() {
		var window_offset_top = $(window).scrollTop();
		var distance = 80;
		var slide_height = $('.hero-wrap').position().top+$('.hero-wrap').outerHeight(true);
		var new_distance = window_offset_top / slide_height * distance * 1.5;
		if( new_distance >= distance ) new_distance = distance;
		if( new_distance <= 0 ) new_distance = 0;
		
		$('.hero-wrap .bg').css('background-position', 'center -'+new_distance+'px');
	}
	$(window).scroll(function(){
		parallax_slider();
	});

	 // Filter
    $('.filter-wrap').each(function(){
    	var filter_wrap = $(this);
    	var defaults = {
			itemSelector : '.filter-item',
			masonry: { columnWidth: '.filter-item' }
        };
        var options = $.extend({}, defaults, $(this).data());
        $(this).isotope(options);

        var container = $(this);
        $(this).imagesLoaded( function() {
		  	$(container).isotope(options);
		  	var filter_button_wrap = $(container).parents('.stack').find('.filter-button-list');
	        $('a.filter-button', filter_button_wrap).click(function(){
			  var selector = $(this).attr('data-filter');
			  $(this).parents('.slide-control').find('.handle span').html( $(this).html() );
			  $(this).parents('ul').find('.active').removeClass('active');
			  $(this).addClass('active');
			  filter_wrap.isotope({ filter: selector });
			  return false;
			});
		});
    });

	// Animate
	// Inview Animate
	$('.nt-enter-effect-enabled, .running-number, .title-wrap .runner-line, .title-wrap .runner-line-grey, .title-block .runner-line, .title-block .runner-line-grey, .stack-testimonial .star-wrap i').one('inview', function() {
		
		if( $(this).hasClass('running-number') && !$(this).hasClass('running-number-active') ) {
				var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');
				$(this).animateNumber({
					number: $(this).data('to'),
		    		numberStep: comma_separator_number_step,
		    		easing: 'easeOutQuad'
				}, 1500);
				$(this).parents('.running-number-box').transition({
					perspective: '100px',
  					rotateX: '360deg',
  					delay: 1500
				}, 300, 'ease');
				return false;
			}
		
		if( $(this).hasClass('runner-line-grey') ) {
			if( $(this).css('text-align') == 'center' ) {
				$(this).css({ transformOrigin: 'center 0' });
			} else if( $(this).css('text-align') == 'right' ) {
				$(this).css({ transformOrigin: 'right 0' });
			} else {
				$(this).css({ transformOrigin: '0 0' });
			}
			$(this).transition({
				perspective: '0',
	  			rotateY: '0deg',
	  			delay: 250
			}, 1000);
			return false;
		}

		if( $(this).hasClass('runner-line') ) {
			if( $(this).css('text-align') == 'center' ) {
				$(this).css({ transformOrigin: 'center 0' });
			} else if( $(this).css('text-align') == 'right' ) {
				$(this).css({ transformOrigin: 'right 0' });
			} else {
				$(this).css({ transformOrigin: '0 0' });
			}
			$(this).transition({
				perspective: '0',
	  			rotateY: '0deg',
	  			delay: 750
			}, 500);
			return false;
		}

		if( $(this).hasClass('nt-icon-star-1') ) {
			$(this).css({ opacity: 0 }).transition({
				opacity: 1, delay: 250
			}, 500);
			return false;
		}

	});

	
});
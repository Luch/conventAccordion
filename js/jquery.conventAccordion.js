/*
*	conventAccordion 1.0.0 - jQuery plugin
*	written by Luch Klooster
*
*	Copyright (c) 2013 Luch Klooster
*	Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses.
*	Built for jQuery library http://jquery.com
*
*	0.1.0 2013-01-26 Luch Klooster
*	Total redesign of easyAccordion. Now based on ordered list. Renamed to conventAccordion.
*	Can be used for vertical and horizontal accordions.
*	1.0.0 2013-02-25 Luch Klooster
*	First full production version.
*	Supports now spineless accordions to be used as gallery slidedeck and rotating banner.
*	Extended navigation functions (external method navigation).
*   1.1.0 2013-06-15 Luch Klooster
*   Added callback functions.
*   1.2.0 2013-09-15 Luch Klooster
*   Second way to create conventAccordion using HTML5 data attributes without additional JavaScript code.
*	Added option remember. true(default): last active slide is displayed on page refresh
*                          false: startSlide is displayed on page refresh
*   startSlide: 0, will now start accordion with all slides closed.
*/
(function ($) {

	var ConventAccordion = function (accordion, options) {
        this.$elem = $(accordion);
        var metadata = (this.$elem.data("options")) ? this.$elem.data("options") : {};
        var attrdata = (this.$elem.data()) ? this.$elem.data() : {};
		var elem = this;
		var defaults = {
			pauseOnHover: false,				// pause on hover
			actOnHover: false,					// activate slide on hover

			autoPlay: false,					// automatically cycle through slides
			slideInterval: 3000,				// time between slide cycles
			continuous: true,					// autoPlay one cycle or continuous

			startSlide: 1,						// displays slide (n) on page load, 0 all slides closed on page load
			remember: true,						// display last active slide on page refresh
			slideSpeed: 600,					// slide animation speed
			easing: 'swing',					// custom easing function

			autoScaleImages: false,				// if a single image is placed within the slide, this will be automatically scaled to fit
			minContainerWidth : 300,			// minimum width the accordion will resize to
			maxContainerWidth : 960,			// maximum width the accordion will resize to
			dynamicHeight: false,				// if true height of slide will adjust to content height

			linkable : false,					// link slides via hash

			onActivate : null,					// callback on slide activate
			onSlideOpen : null,					// callback on slide open
			onSlideClose : null,				// callback on slide close
			onLoad: null,						// callback on accordion load

			prevText: '&laquo;',
			nextText: '&raquo;',
			playText: 'Play',
			stopText: 'Stop',
			prevTitle: 'Previous',
			nextTitle: 'Next',
			playTitle: 'Play',
			stopTitle: 'Stop',
			
			listStyleSymbol: '&rsaquo;'			// symbol used for list-style-type inherit (disc)
		},

			// merge defaults with options in new settings object 
			settings = $.extend({}, defaults, options, metadata, attrdata),

			// globals
			listItems = accordion.children('li'),
			spines = listItems.children(':first-child'),
			slides = listItems.children(':first-child').next(),
			navParent = null,
			navItems = null,
			activeID = 0,
			startSlide = (settings.startSlide - 1),
			accordionID = accordion.attr('id'),
			orientation = '',
			listStyleType = 'none',
			accordionWidth = 0,
			accordionHeight = 0,
			slideTotal = accordion.find('>li').size(),
			slideHeight = 0,
			slideWidth = 0,
			timerInstance = null,
			responsive = false,
			scale = false,
			nested = false,
			nav = false,					// html for navigation

			// public methods
			methods = {

				// start elem animation
				play : function (index) {
					var next = core.nextSlide(index && index);

					if (core.playing) return;

					// start autoplay
					core.playing = setInterval(function() {
						spines.eq(next()).trigger('auto.conventAccordion');
						if (settings.continuous == false) {
							if (activeID == startSlide) {
								methods.stop();
								return;
							}
						}
					}, settings.slideInterval);
					$('.CAplay').addClass('disabled');
					$('.CAstop').removeClass('disabled');

				},

				// stop elem animation
				stop : function() {
					clearInterval(core.playing);
					core.playing = 0;
					$('.CAstop').addClass('disabled');
					$('.CAplay').removeClass('disabled');
				},

				// trigger next slide
				next : function() {
					if (settings.continuous) {
						methods.stop();
						spines.eq(activeID === slideTotal - 1 ? 0 : activeID + 1).trigger('nav.conventAccordion');
					} else {
						if (activeID < slideTotal) {
							methods.stop();
							spines.eq(activeID + 1).trigger('nav.conventAccordion');
						}
					}
				},

				// trigger previous slide
				prev : function() {
					if (settings.continuous) {
						methods.stop();
						spines.eq(activeID - 1).trigger('nav.conventAccordion');
					} else {
						if (activeID > 0) {
							methods.stop();
							spines.eq(activeID - 1).trigger('nav.conventAccordion');
						}
					}
				},

				// trigger slide n
				activate : function(n) {
					methods.stop();
					spines.eq(n - 1).trigger('nav.conventAccordion');
				},

				// create html for navigation
				navigation : function(param) {
				if (!nav) {
						var buttons = new Array();
						if (!param) {
							buttons.push('slides');
						} else {
							buttons = param.split(',');
						}
						navParent = $('<ul class="CAnavigation" style="list-style-type: none;">');
						for (var i in buttons) {
							switch (buttons[i].trim()) {
							case 'slides':
								spines.each(function(index) {
									var $this = $(this);
									var navLi = $('<li class="CAnavSpine CAnav_' + (index + 1) + '" onclick="$(' + accordionID + ').conventAccordion(\'activate\', ' + (index + 1) + ')"></li>');
									if (index === startSlide) {navLi.addClass('active')};
									if (index === (startSlide + 1)) {navLi.addClass('next')};
									navLi.append('<span class="CAnavTitle">' + $this.find('.CAspineTitle').text() + '</span>');
									navLi.append('<span class="CAnavNumber">' + $this.find('.CAspineNumber').text() + '</span>');
									navParent.append(navLi);
								});
								break;
							case 'prev':
								var navLi = $('<li class="CAprev" onclick="$(' + accordionID + ').conventAccordion(\'prev\')"></li>');
									navLi.append('<span class="CAnavTitle">'+ settings.prevTitle + '</span>');
									navLi.append('<span class="CAnavNumber">' + settings.prevText + '</span>');
								navParent.append(navLi);
								break;
							case 'next':
								var navLi = $('<li class="CAnext" onclick="$(' + accordionID + ').conventAccordion(\'next\')"></li>');
									navLi.append('<span class="CAnavTitle">'+ settings.nextTitle + '</span>');
									navLi.append('<span class="CAnavNumber">'+ settings.nextText + '</span>');
								navParent.append(navLi);
								break;
							case 'play':
								var navLi = $('<li class="CAplay" onclick="$(' + accordionID + ').conventAccordion(\'play\')"></li>');
									navLi.append('<span class="CAnavTitle">' + settings.playTitle + '</span>');
									navLi.append('<span class="CAnavNumber">' + settings.playText + '</span>');
								navParent.append(navLi);
								break;
							case 'stop':
								var navLi = $('<li class="CAstop" onclick="$(' + accordionID + ').conventAccordion(\'stop\')"></li>');
									navLi.append('<span class="CAnavTitle">' + settings.stopTitle + '</span>');
									navLi.append('<span class="CAnavNumber">'+ settings.stopText + '</span>');
								navParent.append(navLi);
								break;
							}
						}
						accordion.parent().append(navParent);
						nav = true;
						if (core.playing) {
								$('.CAplay').addClass('disabled');
						} else {
								$('.CAstop').addClass('disabled');
						}
					}
				},

				// destroy plugin instance
				destroy : function() {                    
					// stop autoplay
					methods.stop();

					// remove hashchange event bound to window
					$(window).off('.conventAccordion');

					// remove generated styles, classes, data, events
					accordion
						.attr('style', '')
						.removeClass('conventAccordion horizontal vertical rounded basic dark light stitch spineless wind')
						.removeData('conventAccordion')
						.off('.conventAccordion')
						.find('li > :first-child')
						.off('.conventAccordion');
					accordion.find('>li').each(function(index) {
						var CAspine = $(this).find('>div:first');
						var CAslide = $(this).find('>div:last');
						CAspine
							.attr('style', '')
							.removeClass('CAspine active next CAspine_' + (index + 1))
							.find('.CAspineNumber')
							.remove()
							.end()
							.html(CAspine.text());
						CAslide
							.attr('style', '')
							.removeClass('CAslide')
							.find('.CAslideContent')
							.contents()
							.unwrap();
					});
					accordion.parent().find('.CAnavigation').remove();
					nav = false;
				},

				// poke around the internals (NOT CHAINABLE)
				debug : function() {
					return {
						accordion : accordion,
						defaults : defaults,
						settings : settings,
						methods : methods,
						core : core
					};
				},

				// current active slide
				current : function() {
//					return {current : activeID};
					return (activeID);

				},

				// number of slides
				totalslides : function() {
					return (slideTotal);
				}

			},

			// core utility and animation methods
			core = {

				// set style properties
				setStyles : function() {

					// get listStyleType from css
					listStyleType = accordion.css('list-style-type');
					// set listStyleType to 'none', display will be handled by this plug-in
					accordion.css('list-style-type', 'none');

					// check if accordion is responsive ( <ol ... style="width: auto; ... > )
					responsive = (accordion[0].style.width == 'auto');

					// check if accordion width/height has te be scaled ( <ol ... style="height: auto; ... > )
					scale = (accordion[0].style.height == 'auto');

					// check if accordion is a nested accordion ( parent ol with class conventAccordion )
					nested = accordion.parents('ol').hasClass('conventAccordion');

					accordion.addClass('conventAccordion');

					if (nested) {
						// add class to ease styling by css
						accordion.addClass('nested');
						// clear margin of slidecontent
						accordion.parent().css({
								marginLeft:'0',
								marginRight:'0',
								marginTop:'0',
								marginBottom:'0'
						});
					}

					if (accordion.hasClass('vertical')) {
						orientation = 'vertical'
					} else {
						orientation = 'horizontal';
						accordion.addClass('horizontal');
					}
					if (settings.remember) {
						if (store.get(accordionID) == null)  {
							store.set(accordionID, startSlide);
						} else {
							startSlide = parseInt(store.get(accordionID));
						};
					}
					activeID = startSlide;

					accordion.find('>li').each(function(index) {
						var CAspine = $(this).find('>div:first');
						var CAslide = $(this).find('>div:last');
						var CAspineNumber = CAspine.find('>div:first').html();
						if (!$.isEmptyObject(CAspineNumber)) {
							CAspine.find('>div:first').remove();
						}
						// add unique id to each tab, add active corner
						CAspine.wrapInner('<span class="CAspineTitle" />').addClass('CAspine').addClass('CAspine_' + (index + 1));
						if (startSlide > -1) {
							if (index === startSlide) {CAspine.addClass('active')};
							if (index === (startSlide + 1)) {CAspine.addClass('next')};
						}
						if ($.isEmptyObject(CAspineNumber)) {
							switch (listStyleType) {
								case 'decimal':
									$('<span class="CAspineNumber">' + (index + 1) + '</span>').appendTo(CAspine);
									break;
								case 'decimal-leading-zero':
									$('<span class="CAspineNumber">' + (index + 1).pad() + '</span>').appendTo(CAspine);
									break;
								case 'lower-roman':
									$('<span class="CAspineNumber">' + core.romanize(index + 1).toLowerCase() + '</span>').appendTo(CAspine);
									break;
								case 'upper-roman':
									$('<span class="CAspineNumber">' + core.romanize(index + 1) + '</span>').appendTo(CAspine);
									break;
								case 'lower-alpha':
									$('<span class="CAspineNumber">' + String.fromCharCode(index+97) + '</span>').appendTo(CAspine);
									break;
								case 'upper-alpha':
									$('<span class="CAspineNumber">' + String.fromCharCode(index+65) + '</span>').appendTo(CAspine);
									break;
								case 'upper-latin':
									$('<span class="CAspineNumber">' + String.fromCharCode(index+65) + '</span>').appendTo(CAspine);
									break;
								case 'none':
									break;
								default:
								//case 'disc': // inherit
									$('<span class="CAspineNumber">' + settings.listStyleSymbol + '</span>').appendTo(CAspine);
									break;
							}
						} else {
							$('<span class="CAspineNumber">' + CAspineNumber + '</span>').appendTo(CAspine);
						}

						CAslide.wrapInner('<div class="CAslideContent">').addClass('CAslide');
					});
				},

				// set the variables
				setVariables : function() {
					var spineWidth = 0;
					var	spineHeight = 0;

					if (scale) {
						// set new accordion height
						accordion.height(accordion.width() / 3 | 0);
					}
					accordionWidth = accordion.find('>li').width();
					accordionHeight = accordion.height();
					accordion.find('.CAspine').each(function() {
						spineWidth = spineWidth + $(this).outerWidth(true);
						spineHeight = spineHeight + $(this).outerHeight(true);
					});

					slideWidth = accordion.width() - spineWidth;
					slideHeight = accordion.height() - spineHeight;
					accordion.find('>li').each(function() {
						var CAspine = $(this).find('>div:first');
						var CAslide = $(this).find('>div:last');
						if (orientation === 'horizontal') {
							var CAspineOuter = (CAspine.outerHeight(true) - CAspine.height());
							var CAslideOuter = (CAslide.outerHeight(true) - CAslide.height());
							CAspine.height(accordionHeight - CAspineOuter).find('.CAspineTitle').width(accordionHeight - CAspineOuter);
							if (settings.dynamicHeight) {
								accordion.height('100%');
								CAslide.height('100%');
							} else {
								CAslide.height(accordionHeight - CAslideOuter);
							}
							accordion.find('.CAslideContent').width(slideWidth);
						}  
						if (orientation === 'vertical') {
							var CAspineOuter = (CAspine.outerWidth(true) - CAspine.width());
							var CAslideOuter = (CAslide.outerWidth(true) - CAslide.width());
							CAspine.width(accordionWidth - CAspineOuter).find('.CAspineTitle').width(accordionWidth - CAspineOuter);
							CAslide.width(accordionWidth - CAslideOuter);
							accordion.find('.CAslideContent').height(slideHeight);
						}
					});
				},

				// responsive styles
				responsive : function() {
					var parentWidth = accordion.parent().width(); 
					if (responsive && !nested) {
						// set new accordion width
						if (parentWidth > settings.minContainerWidth) {
							accordion.width(parentWidth < settings.maxContainerWidth ? parentWidth : settings.maxContainerWidth);
						} else if (parentWidth < settings.maxContainerWidth) {
							accordion.width(parentWidth > settings.minContainerWidth ? parentWidth : settings.minContainerWidth);
						}
						core.setVariables();
						spines.eq(activeID).trigger('click.conventAccordion');
					}
				},

				// scale images contained within a slide to fit the slide height and width
				autoScaleImages : function() {
					//loop thru slides to look for images
					slides.children('div.CAslideContent').each(function() {
						var $this = $(this), 
							$imgs = $this.find('img');
						if ($imgs.length) {
							// clear margin of slidecontent
							$this.css({
								marginLeft:'0',
								marginRight:'0',
								marginTop:'0',
								marginBottom:'0'
							});
							// set width and height of image to 100%
							$imgs.each(function(index, item) {
								$(item).width('100%'); 
								$(item).height('100%');                                
							});
						}
					});
				},

				// bind click and mouseover events
				bindEvents : function() {
					var resizeTimer = 0;

					if (settings.actOnHover) {
						accordion.find('.CAspine').not('active').bind('click.conventAccordion mouseover.conventAccordion auto.conventAccordion nav.conventAccordion', core.animateSlide);
					} else {
						accordion.find('.CAspine').not('active').bind('click.conventAccordion auto.conventAccordion nav.conventAccordion', core.animateSlide);
					}
					// pause on hover (can't use custom events with $.hover())      
					if (settings.pauseOnHover && settings.autoPlay) {
						accordion
							.bind('mouseover.conventAccordion', function() {
								core.playing && methods.stop();
							})
							.bind('mouseout.conventAccordion', function() {
								!core.playing && methods.play(activeID);
							});
					}

					// resize and orientationchange
					$(window).bind('resize.conventAccordion orientationchange.conventAccordion', function() {
					// approximates 'onresizeend'
						clearTimeout(resizeTimer);
						resizeTimer = setTimeout(function() {core.responsive()}, 100);
					})
				},

				linkable : function() {
					var cacheSlideNames = (function() {
						var slideNames = [];

						listItems.each(function() {
							if ($(this).attr('data-slide-name')) slideNames.push(($(this).attr('data-slide-name')).toLowerCase());
						});
						// memoize
						return cacheSlideNames = slideNames;                        
					})();

					var triggerHash = function(e) {
						var index;
						
						if (e.type === 'load' && !window.location.hash) return;
						if (e.type === 'hashchange' && core.playing) return;

						index = $.inArray((window.location.hash.slice(1)).toLowerCase(), cacheSlideNames);
						if (index > -1 && index < cacheSlideNames.length) spines.eq(index).trigger('click.conventAccordion');
					};

					$(window).bind('hashchange.conventAccordion load.conventAccordion', triggerHash);
				},

				// next slide index
				nextSlide : function(index) {
					var next = index + 1 || activeID + 1;

					// closure
					return function() {
						return next++ % slideTotal;
					};
				},  

				// holds interval counter
				playing : 0,

				// functions

				animateSlide : function(e) {
					var $this = $(this);
					// difficult action to find right element because of wrong results with nested accordions (jQuery bug??)
					//	 accordion.parent().find('#'+ accordionID + '>li:eq(' + activeID + ')> div.CAslide')
					// instead of 
					//   accordion.find('.CAslide:eq(' + (activeID) + ')')
					var $that = accordion.parent().find('#'+ accordionID + '>li:eq(' + activeID + ')> div.CAslide');
					// trigger callback if there is one
					if (typeof settings.onSlideClose == "function") settings.onSlideClose(methods, $that);
					if (orientation === 'vertical') {
						$that.stop(true).animate({height: 0},settings.slideSpeed,settings.easing);
					} else {
						$that.stop(true).animate({width: 0},settings.slideSpeed,settings.easing);
					}
					accordion.parent().find('#'+ accordionID + '>li:eq(' + activeID + ')> div.CAspine').removeClass('active');
					accordion.parent().find('#'+ accordionID + '>li:eq(' + (activeID + 1) + ')> div.CAspine').removeClass('next');
					$this.addClass('active');
					activeID = spines.index($this);
					// set location.hash
					if (settings.linkable && !core.playing) window.location.hash = $this.parent().attr('data-slide-name');
					$this = accordion.parent().find('#'+ accordionID + '>li:eq(' + activeID + ')> div.CAslide');
					// adjust height of slide if height less than accordion height
					//if (settings.dynamicHeight & ($this.height() < accordionHeight)){
					//	$this.height(accordionHeight);
					//}
					// trigger callback if there is one and action came from outside
					if (typeof settings.onActivate == "function" & e.type != 'auto') settings.onActivate(methods, $this);
					accordion.parent().find('#'+ accordionID + '>li:eq(' + (activeID + 1) + ')> div.CAspine').addClass('next');
					if (orientation === 'vertical') {
						$this.stop(true).animate({height: slideHeight},settings.slideSpeed,settings.easing);
					} else { 
						$this.stop(true).animate({width: slideWidth},settings.slideSpeed,settings.easing);
					}

					// adjust navigation
					if (nav) {
						navParent.find('li.active').removeClass('active');
						navParent.find('li.next').removeClass('next');
						navParent.find('.CAnav_' + (activeID + 1)).addClass('active');
						navParent.find('.CAnav_' + (activeID + 2)).addClass('next');
					}

					// set arrow classes
					if (!settings.continuous) {
						if((activeID + 1) === slideTotal){
							// disable the next button
							$('.CAnext').addClass('disabled');
							$('.CAprev').removeClass('disabled');
						}else if((activeID) === 0){
							// disable the previous button
							$('.CAnext').removeClass('disabled');
							$('.CAprev').addClass('disabled');
						}else{
							// enable both next/previous buttons
							$('.CAnext, .CAprev').removeClass('disabled');
						}
					}

					// save activeID for pagerefresh
					if (settings.remember) {
						store.set(accordionID, activeID);
					}
						
					// trigger callback if there is one
					if (typeof settings.onSlideOpen == "function") settings.onSlideOpen(methods, $this);
				},

				ieClass : function(version) {
					// add class lteIE8 to HTML tag for 'conditional' CSS
					if (version < 9) {
						$('html').addClass('lteIE8'); 
					}
					if (!(version == 6.0)) {
						accordion.find('.CAspine').hover(function() {
							$(this).addClass('hover');
						}, function() {
							$(this).removeClass('hover');
						});
					}
				},

				// convert arabic number to roman
				romanize : function (N){
					var s,b,a,o,t;
					t=N/1e3|0;N%=1e3;
					for(s=b='',a=5;N;b++,a^=7)
						for(o=N%a,N=N/a^0;o--;)
							s='IVXLCDM'.charAt(o>2?b+N-(N&=~1)+(o=1):b)+s;
					return Array(t+1).join('M')+s;
				},

				// Let's do it!
				init : function() {
					var ua = navigator.userAgent,
						index = ua.indexOf('MSIE');

					// test for ie
					if (index !== -1) {                        
						ua = ua.slice(index + 5, index + 6);
						core.ieClass(+ua);
					}
					// extending the Number object with pad 
					Number.prototype.pad = function(size){
						if(typeof(size) !== "number"){size = 2;}
						var s = String(this);
						while (s.length < size) s = "0" + s;
						return s;
					}

					// extending the String object with trim
					if(!String.prototype.trim) {
						String.prototype.trim = function () {
						return this.replace(/^\s+|\s+$/g,'');
						};
					}

					core.setStyles();
					// init styles and events
					if (responsive) {
						core.responsive();
					} else {
						core.setVariables();
					}
					if (settings.autoScaleImages) core.autoScaleImages();
					if (settings.navigation) core.createNav();
					core.bindEvents();

					function trackerObject() {this.value = null};
					timerInstance = new trackerObject();
					timerInstance.paused = false;

					if (startSlide > -1) {
						accordion.find('.CAspine:eq(' + (startSlide) + ')').trigger('click.conventAccordion');
					}

					// check slide speed is not faster than interval speed
					if (settings.slideInterval < settings.slideSpeed) settings.slideInterval = settings.slideSpeed;

					// init hash links
					if (settings.linkable && 'onhashchange' in window) core.linkable();

					// trigger callback if there is one
					if (typeof settings.onLoad == "function") settings.onLoad(elem);

					// init autoplay
					settings.autoPlay && methods.play();

				}
			};

			// store utility methods to support localStore with Cookies as fallback
			store = {
				localStoreSupport : function() {
					try {
						return (navigator.userAgent.indexOf('MSIE')==-1) && 'localStorage' in window && window['localStorage'] !== null;
					} catch (e) {
						return false;
					}
				},
				set : function(name,value,days) {
					if (days) {
						var date = new Date();
						date.setTime(date.getTime()+(days*24*60*60*1000));
						var expires = "; expires="+date.toGMTString();
					}
					else {
						var expires = "";
					}
					if( this.localStoreSupport() ) {
						localStorage.setItem(name, value);
					}
					else {
						document.cookie = name+"="+value+expires+"; path=/";
					}
				},
				get : function(name) {
					if( this.localStoreSupport() ) {
						return localStorage.getItem(name);
					}
					else {
						var nameEQ = name + "=";
						var ca = document.cookie.split(';');
						for(var i=0;i < ca.length;i++) {
							var c = ca[i];
							while (c.charAt(0)==' ') c = c.substring(1,c.length);
							if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
						}
						return null;
					}
				},
				del : function(name) {
					if( this.localStoreSupport() ) {
						localStorage.removeItem(name);
					}
					else {
						this.set(name,"",-1);
					}
				}
			}

		// init plugin
		core.init();

		// expose methods
		return methods;

	};
	$.fn.conventAccordion = function(method, param) {
		var elem = this,
			instance = elem.data('conventAccordion');
		// if creating a new instance
		if (typeof method === 'object' || !method) {
			return elem.each(function() {
				var conventAccordion;

				// if plugin already instantiated, return
				if (instance) return;

				// otherwise create a new instance
				conventAccordion = new ConventAccordion(elem, method);
				elem.data('conventAccordion', conventAccordion);
			});

		// otherwise, call method on current instance
		} else if (typeof method === 'string' && instance[method]) {
			// debug, current and totalslides methods aren't chainable b/c we need the object to be returned
			if (method === 'debug' || method === 'current' || method === 'totalslides') {
				return instance[method].call(elem);
			} else { // the rest of the methods are chainable though
				instance[method].call(elem, param);
				return elem;                
			}
		}
	};
 
	$(document).ready(function () {
        $("[data-role='conventaccordion']").each(function (index, item) {
            if (!$(item).conventAccordion())
                $(item).conventAccordion();

            $(item).find("[data-role='conventaccordion']").each(function (index, nested2) {
                if (!$(nested2).conventAccordion())
                    $(nested2).conventAccordion();

                $(nested2).find("[data-role='conventaccordion']").each(function (index, nested3) {
                    if (!$(nested3).conventAccordion())
                        $(nested3).conventAccordion();

                    $(nested3).find("[data-role='conventaccordion']").each(function (index, nested4) {
                        if (!$(nested4).conventAccordion())
                            $(nested4).conventAccordion();
                    });
                });
            });
        });
    });

})(jQuery);
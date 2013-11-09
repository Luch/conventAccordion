##[conventAccordion](http://members.ziggo.nl/luch.klooster/)

conventAccordion is an accordion plugin for jQuery.

Demo page at http://members.ziggo.nl/luch.klooster/

***
###Styling

Styling options are given with the declaration of the ol (ordered list).

As class:

	theme					 // basic (default), dark, light, stitch or spineless
	rounded					 // not-rounded (default), rounded
	orientation				 // horizontal (default) or vertical
	
As style:

	width					 // in px, auto makes accordion responsive to window size change
	height					 // in px, auto makes height 1/3 of width
	list-style-type			 // decimal (default), decimal-leading-zero, lower-roman, upper-roman, lower-alpha, upper-alpha, upper-latin, none

***
###Options

These are the default settings for the conventAccordion plugin:

	pauseOnHover: false,	 // pause on hover
	actOnHover: false,		 // activate slide on hover
	
	autoPlay: false,		 // automatically cycle through slides
	slideInterval: 3000,	 // time between slide cycles
	continuous: true,		 // autoPlay one cycle or continuous
	
	startSlide: 1,			 // displays slide (n) on page load
	remember: true,          // display last active slide on page refresh	
	slideSpeed: 600,		 // slide animation speed
	easing: 'swing', 		 // custom easing function
	
	autoScaleImages: false,	 // if a single image is placed within the slide, this will be automatically scaled to fit
	minContainerWidth : 300, // minimum width the accordion will resize to
	maxContainerWidth : 960, // maximum width the accordion will resize to
	
	linkable : false         // link slides via hash			

	prevText: '&laquo;',	 // text of prev control
	nextText: '&raquo;',	 // text of next control
	playText: 'Play',		 // text of play control		 
	stopText: 'Stop',		 // text of stop control		
	prevTitle: 'Previous',	 // title of prev control
	nextTitle: 'Next',		 // title of next control
	playTitle: 'Play',		 // title of play control
	stopTitle: 'Stop'		 // title of stop control

***
###Methods

These are the methods for the conventAccordion plugin:

	play		 			 // trigger autoPlay on a stopped accordion
	stop					 // stop an accordion playing
	next					 // trigger the next slide
	prev				 	 // trigger the previous slide
	activate,n				 // trigger slide n
	destroy					 // remove the accordion, destroying all event handlers and styles (unstyled html content will remain)
	debug					 // returns a debug object
	navigation				 // create an external navigation structure
	current					 // current active slide
	totalslides				 // number of slides
	
All of these methods are chainable (i.e. they return the original DOM object) with the exception of the debug, current and totalslides method.  To call a method, use:

$('#yourdiv').conventAccordion('play');

To chain methods:

$('#yourdiv').conventAccordion('next').conventAccordion('next');

***
###Callbacks

These are the callbacks for the conventAccordion plugin:

	onActivate	 			 // callback on slide activate
	onSlideOpen				 // callback on slide open
	onSlideClose			 // callback on slide close
	onLoad				 	 // callback on accordion load

***
###Changelog

**v1.2.0** - 15/09/2013
 -  Second way to create conventAccordion using HTML5 data attributes without additional JavaScript code.
 -  Added option remember. true(default): last active slide is displayed on page refresh
                           false: startSlide is displayed on page refresh
 -  startSlide: 0, will now start accordion with all slides closed.

**v1.1.0** - 15/06/2013

 -  Added callback functions.

**v1.0.3** - 11/03/2013

 -  Added css files for vertical slides, gallery and rotating banner.

**v1.0.2** - 11/03/2013

 -  Update for publishing on plugins.jquery.com.

**v1.0.1** - 09/03/2013

 -  Corrected error in Manifest.

**v1.0.0** - 08/03/2013

 -  First full production version.
 -  Supports now spineless accordions to be used as gallery slidedeck and rotating banner.
 -	Extended navigation functions (external method navigation).

**v0.1.1** - 21/02/2013

 - corrected an error in the readme file.

**v0.1** - 26/01/2013

 - first release

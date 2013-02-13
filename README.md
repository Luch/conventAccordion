##[conventAccordion](http://nicolahibbert.com/demo/liteAccordion/)

conventAccordion is an accordion plugin for jQuery.

Demo page at http://members.ziggo.nl/luch.klooster/

***
###Styling

Styling options are given with the declaration of the ol (ordered list).
As class:
	theme								basic (default), dark, light or stitch
	rounded								
	orientation							horizontal (default) or vertical
	
As style:
	width								in px, auto makes accordion responsive to window size change
	height								in px, auto makes height 1/3 of width
	list-style-type						decimal (default, decimal-leading-zero, lower-roman, upper-roman, lower-alpha, upper-alpha, upper-latin, none


***
###Options

These are the default settings for the conventAccordion plugin:

	pauseOnHover: false,				// pause on hover
	actOnHover: false,					// activate slide on hover
	
	autoPlay: false,					// automatically cycle through slides
	slideInterval: 3000,				// time between slide cycles
	continuous: true,					// autoPlay one cycle or continuous
	
	startSlide: 1,						// displays slide (n) on page load
	slideSpeed: 600,					// slide animation speed
	easing: 'swing', 					// custom easing function
	
	autoScaleImages: false,				// if a single image is placed within the slide, this will be automatically scaled to fit
	minContainerWidth : 300,            // minimum width the accordion will resize to
	maxContainerWidth : 960,            // maximum width the accordion will resize to
	
	linkable : false                    // link slides via hash			

***
###Methods

These are the methods for the conventAccordion plugin:

	play									// trigger autoPlay on a stopped accordion
	stop									// stop an accordion playing
	next									// trigger the next slide
	prev									// trigger the previous slide
	active,n								// trigger slide n
	destroy									// remove the accordion, destroying all event handlers and styles (unstyled html content will remain)
	debug									// returns a debug object

All of these methods are chainable (i.e. they return the original DOM object) with the exception of the debug method.  To call a method, use:

$('#yourdiv').conventAccordion('play');

To chain methods:

$('#yourdiv').conventAccordion('next').conventAccordion('next');

***
###Changelog

**v0.1** - 26/01/2013

 - first release

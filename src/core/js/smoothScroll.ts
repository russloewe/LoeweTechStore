
(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 56)
        }, 1000, "easeInOutExpo");
        
        // insert current page into browser history
        let href = location;
        let title = location.hash.slice(1);
      //  window.history.pushState({"html":title,"pageTitle":title},"", href);
        return false;
      }
    }
  });
  
  // Dynamically change page title as page scrolls
    $(window).on('activate.bs.scrollspy', function () {
        let href = $('nav a.active').attr('href');
        let title: String = href.slice(1);
        document.title = title + " | YEETwoodMac";  // change page title
    });
    
  // Hande forward back buttons
    window.onpopstate = function(e){
        console.log(e);
		
    };
    
    
  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
    $('.dropdown-menu').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#navbar',
    offset: 156
  });

})(jQuery); // End of use strict


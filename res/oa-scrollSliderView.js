/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2014 OA Wu Design
 */

(function( factory ) {
  if ((typeof define === 'function') && define.amd) define (['jquery'], factory);
  else factory (jQuery);
}(function ($) {

  $.fn.extend ({
    OAscrollSliderView: function (opt) {
      var d4Opt = {
        selector: '.silder',
        defaultCount: 10,
        sildersWidth: '100%',
        arrow: {
          width: '40px',
          leftSvg: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="28" viewBox="0 0 20 28"><g id="icomoon-ignore"></g><path d="M18.297 4.703l-8.297 8.297 8.297 8.297q0.297 0.297 0.297 0.703t-0.297 0.703l-2.594 2.594q-0.297 0.297-0.703 0.297t-0.703-0.297l-11.594-11.594q-0.297-0.297-0.297-0.703t0.297-0.703l11.594-11.594q0.297-0.297 0.703-0.297t0.703 0.297l2.594 2.594q0.297 0.297 0.297 0.703t-0.297 0.703z" fill="#000000"></path></svg>',
          rightSvg: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="28" viewBox="0 0 20 28"><g id="icomoon-ignore"></g><path d="M17.297 13.703l-11.594 11.594q-0.297 0.297-0.703 0.297t-0.703-0.297l-2.594-2.594q-0.297-0.297-0.297-0.703t0.297-0.703l8.297-8.297-8.297-8.297q-0.297-0.297-0.297-0.703t0.297-0.703l2.594-2.594q0.297-0.297 0.703-0.297t0.703 0.297l11.594 11.594q0.297 0.297 0.297 0.703t-0.297 0.703z" fill="#000000"></path></svg>',
        },
        silder: {
          width: '360px',
          height: '230px',
          marginTop: '10px',
          marginBottom: '10px',
          marginRight: '20px',
          marginLeft: '10px'
        }
      },
      init = function (opt) {
        var timer = null,
            $silder = $(this).hide ().addClass ('oa-scrollSliderView').addClass ('oa-scrollSliderView-hide').data ('count', 0).css ({'width': opt.sildersWidth, 'height': parseFloat (opt.silder.height) + parseFloat (opt.silder.marginTop) + parseFloat (opt.silder.marginBottom) + 'px'}).children (opt.selector).clone (true, true).map (function () { return $(this).addClass ('oa-scrollSliderView-silder').css ({'width': parseFloat (opt.silder.width) + parseFloat (opt.silder.marginRight) + parseFloat (opt.silder.marginLeft) + 'px', 'height': 'calc(100% - ' + parseFloat (opt.silder.marginTop) + 'px' + ' - ' + parseFloat (opt.silder.marginBottom) + 'px' + ')', 'margin': opt.silder.marginTop + ' ' + opt.silder.marginRight + ' ' + opt.silder.marginBottom + ' ' + opt.silder.marginLeft}); }),
            $silders = $('<div />').addClass ('oa-scrollSliderView-silders').append ($silder.map (function () { return $(this).get (0); })),
            $container = $('<div />').addClass ('oa-scrollSliderView-container').css ({'width': 'calc(100% - ' + (parseFloat (opt.arrow.width) * 2) + 'px' + ')'}).append ($silders),
            $leftArrow = $('<div />').addClass ('oa-scrollSliderView-arrow-left').css ({'width': (parseFloat (opt.arrow.width) - 1) + 'px', 'line-height': opt.silder.height}).append (opt.arrow.leftSvg).hide (),
            $rightArrow = $('<div />').addClass ('oa-scrollSliderView-arrow-right').css ({'width': (parseFloat (opt.arrow.width) - 1) + 'px', 'line-height': opt.silder.height}).append (opt.arrow.rightSvg).hide ();

        $(this).empty ().append ($leftArrow).append ($rightArrow).append ($container).show ();
        
        var silderCount = opt.defaultCount && $silder.length > opt.defaultCount ? opt.defaultCount : $silder.length;
        var silderWidth = $silder[0] ? (parseFloat ($silder[0].css ('width')) + parseFloat ($silder[0].css ('margin-left')) + parseFloat ($silder[0].css ('margin-right'))) : 0,
            scrollTo = function (to, duration) {
                var start = $container.scrollLeft (),
                    change = to - start,
                    currentTime = 0,
                    increment = 20,
                    animateScroll = function () {
                      currentTime += increment;
                      $container.scrollLeft (easeInOutQuad (currentTime, start, change, duration));
                      if(currentTime < duration) timer = setTimeout (animateScroll, increment);
                    };

                clearTimeout (timer);
                animateScroll ();
            },
            easeInOutQuad = function (t, b, c, d) { return (t /= d / 2) < 1 ? (c / 2 * t * t + b) : (-c / 2 * (--t * (t - 2) - 1) + b); }
        
        $silders.css ({'width': (silderCount * silderWidth) + 'px' });
        if ((silderWidth * $(this).data ('count') + $container.width ()) < $silders.width ())
          $rightArrow.show ();

        $leftArrow.click (function () {
          if (!silderWidth) return;

          var count = Math.floor ($container.scrollLeft () / silderWidth);
          $(this).data ('count', --count < 0 ? 0 : count);

          if ((silderWidth * $(this).data ('count') + $container.width ()) > $silders.width ()) $rightArrow.hide ();
          if (!$(this).data ('count')) $leftArrow.fadeOut ();
          if (!$rightArrow.is (':visible') && ((silderWidth * $(this).data ('count') + $container.width ()) < $silders.width ())) $rightArrow.fadeIn ();

          scrollTo (silderWidth * count, 300);
        }.bind ($(this)));

        $rightArrow.click (function () {
          if (!silderWidth) return;

          var count = Math.floor ($container.scrollLeft () / silderWidth);
          $(this).data ('count', ++count < 0 ? 0 : count);

          if ((silderWidth * $(this).data ('count') + $container.width ()) > $silders.width ()) $rightArrow.fadeOut ();
          if (!$leftArrow.is (':visible')) $leftArrow.fadeIn ();

          scrollTo (silderWidth * $(this).data ('count'), 300);
        }.bind ($(this)));

        $(this).removeClass ('oa-scrollSliderView-hide');
      }

      opt = $.extend (true, d4Opt, opt);

      return $(this).each (function () {
        init.bind ($(this), opt).apply ();
      });
    }
  });
}));

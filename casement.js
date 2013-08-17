/*!
 * Casement.js jQuery plugin
 * Author: @jed_foster
 * Project home: jedfoster.github.io/Casement.js
 * Licensed under the MIT license
 */

;(function($) {

  var $dragging = sash_id = null;

  var casement = 'casement',
      defaults = {
        orientation: 'horizontal',
        // gutter: 0,
        onDragStart: $.noop,
        onDragEnd: $.noop,
        onDrag: $.noop
      };

  function Casement( element, options ) {
    this.element = element;

    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = casement;

    this.init();
  }

  Casement.prototype = {

    init: function() {
      var $this = this,
          height = $($this.element).innerHeight()
          columns = $($this.element).children().length,
          paneSize = ( 100 / columns );

      $($this.element).css({position: 'relative'});

      $($this.element).children().each(function(index) {
        $(this).css({
          width: paneSize + '%',
          left: (paneSize * index) + '%',
          position: 'absolute'
        });

        if(index !== columns - 1) {
          $('<div/>').addClass('vertical sash').css({
            left: (paneSize * (index + 1)) + '%',
            height: height,
          }).attr('id', 'sash' + (index + 1))
          .mouseenter(function() {
            sash_id = 'sash' + (index + 1);
          })
          .mouseleave(function() {
            sash_id = null;
          })
          .insertAfter($(this));
        }
      });

      $(document.documentElement).bind("mousedown.casement", function (event) {
        if (sash_id !== null) {
          $dragging = null;

          $('<div class="sashShim"></div>').insertAfter(sash_id); // Somehow makes the mouseup event actually release the sash handle

          if( ! $(event.target).hasClass('sash') ) {
            event.stopPropagation();
            return false;
          }

          $('body').css('cursor', 'col-resize');

          $dragging = $(event.target);

          return false;
        }
      })
      .bind("mouseup.casement", function (e) {
        $dragging = null;
        $('div.sashShim').remove();
        $('body').css('cursor', 'auto');
      })
      .bind("mousemove.casement", function(event) {
        if ($dragging !== null) {
          $this.resize($dragging, {
            // top: event.pageY,
            left: event.pageX
          });
          return false;
        }
      });

    },

    percentage: function(int) {
      //       console.log(int);
      // console.log($(this.element).innerWidth());
      // 
      // console.log(( Math.round(int) /  ( $(this.element).innerWidth() * 0.01 ) ));
      // console.log(Math.abs( int /  ( $(this.element).innerWidth() * 0.01 ) ));
      return  Math.abs( int /  ( $(this.element).innerWidth() * 0.01 ) );
    },

    resize: function(handle, offset) {
      var
        a = '', // Left: left offset
        b = '', // Left: outer width
        c = '', // Handle: left offset
        d = '', // Right: left offset
        e = '', // Right: outer width
        f = '', // NextHandle: left offset || Right: right edge; d + e
        g = ''; // ParentElement: inner width

      var
        h = '', // Handle: NEW left offset
        i = handle.offset().left - offset.left, // Diff: amount of movement; c - h
        j = '', // Left: NEW width; b - i
        k = '', // Right: NEW left offset; d - i
        l = ''; // RIGHT: NEW width; e + i




      var
          diff = handle.offset().left - offset.left,
          handleNewOffset = (offset.left - $(this.element).offset().left),

          leftNewWidth = handle.prev().outerWidth() - diff,

          rightNewWidth = handle.next().outerWidth() + diff,
          rightNewOffset = (handle.next().offset().left - diff  - $(this.element).offset().left),

          leftLimit = handle.prev().offset().left - $(this.element).offset().left,

          // rightLimit = ;
          rightLimit = handle.siblings('#' + handle.attr('id') + ' ~ .sash').first().length > 0 ? handle.siblings('#' + handle.attr('id') + ' ~ .sash').first().offset().left - $(this.element).offset().left : (rightNewWidth + rightNewOffset);

          


          console.log(diff);
      // console.log('left edge: ' + (leftNewWidth + leftNewOffset));
      console.log('right edge: ' + (rightNewWidth + rightNewOffset));
      console.log('rightNewOffset: ' + rightNewOffset);
      console.log('rightNewWidth: ' + rightNewWidth);

      console.log('leftLimit: ' + leftLimit);
      console.log('leftNewWidth: ' + leftNewWidth);
      // console.log(handle);
      // console.log(this.percentage(handle.offset().left));
      console.log('rightLimit: ' + rightLimit);
      console.log('handleNewOffset: ' + handleNewOffset);

      console.log($(this.element).innerWidth() + $(this.element).offset().left);


      if (handleNewOffset >= rightLimit  || handleNewOffset <= leftLimit || handleNewOffset >= (rightNewWidth + rightNewOffset) || offset.left >= $(this.element).innerWidth() + $(this.element).offset().left) {
        console.log('noop');
return;
        // handleNewOffset = (rightNewWidth + rightNewOffset);
      }

      else {
        // console.log('handle b: ' + handleNewOffset);

        handle.css({left: (this.percentage(handleNewOffset)) + '%'});
        handle.prev().css({width: (this.percentage(leftNewWidth)) + '%'});

        handle.next().css({
          width: (this.percentage(rightNewWidth)) + '%',
          left: (this.percentage(rightNewOffset)) + '%'
        });
      }

      console.log('---');
    },
  },

  $.fn[casement] = function( options ) {
    var args = arguments;
    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
        if (!$.data(this, 'plugin_' + casement)) {
          $.data(this, 'plugin_' + casement, new Casement( this, options ));
        }
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
      return this.each(function () {
        var instance = $.data(this, 'plugin_' + casement);
        if (instance instanceof Casement && typeof instance[options] === 'function') {
          instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
        }
      });
    }
  }
})(jQuery);

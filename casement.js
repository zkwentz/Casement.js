/*!
 * Casement.js jQuery plugin
 * Author: @jed_foster
 * Project home: jedfoster.github.io/Casement.js
 * Licensed under the MIT license
 */

;(function($) {

  var $dragging = null;

  var casement = 'casement',
      defaults = {
        limit: 100,
        orientation: 'horizontal',
        positions: [ '50%' ],
        gutter: 4,
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
          paneSize = ( (100 - this.options.gutter * (columns - 1)) / columns  );

      $($this.element).css({position: 'relative'});

      $($this.element).children().each(function(index) {
        $(this).css({
          width: paneSize + '%',
          left: (paneSize * index) + ( (index > 0) ? $this.options.gutter * index : 0 )  + '%',
          position: 'absolute'
        });

        if(index !== columns - 1) {

          $('<div/>').addClass('vertical sash').css({
            left: (paneSize * (index + 1)) + ( $this.options.gutter * index + 1.25)  + '%',
            position: 'absolute',
            backgroundColor: '#f0f',
            width: '4px',
            height: height,
            overflowX: 'auto',
            overflowY: 'auto',
            zIndex: 9999
          }).attr('id', 'sash' + (index + 1)).insertAfter($(this));

          $($this.element).bind("mousedown.casement", function (event) {
            $dragging = null;

            if( ! $(event.target).hasClass('sash') ) {
              event.stopPropagation();
              return false;
            }

            $('body').css('cursor', 'col-resize');

            $dragging = $(event.target);

            return true;
          })
          .bind("mouseup.casement", function (e) {
            $dragging = null;

            $('body').css('cursor', 'auto');

            return true;
          })
          .bind("mousemove.casement", function(event) {
            if ($dragging) {
              $this.resize($dragging, {
                // top: event.pageY,
                left: event.pageX
              });
            }
            return true;
          });
        }
      });
    },

    percentage: function(int) {
      return  Math.abs( int /  ( $(this.element).innerWidth() * 0.01 ) );
    },

    resize: function(handle, offset) {
      var diff = handle.offset().left - offset.left,
          leftNewWidth = this.percentage(handle.prev().width() - diff),
          rightNewWidth = this.percentage(handle.next().width() + diff),
          rightNewOffset = this.percentage(handle.next().offset().left - diff  - $(this.element).offset().left);

      handle.css({left: (this.percentage(offset.left  - $(this.element).offset().left )) + '%'});
      handle.prev().css({width: (leftNewWidth) + '%'});

      handle.next().css({
        width: (rightNewWidth) + '%',
        left: (rightNewOffset) + '%'
      });
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

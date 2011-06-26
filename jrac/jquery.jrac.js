/* jQuery Resize And Crop (jrac)
 * Version 1.0-beta1 - 25 jun 2011
 * A jQuery 1.4+ and jQueryUi 1.8+ plugin under GNU GENERAL PUBLIC LICENSE version 2 lisense.
 * Copyright (c) 2011 Cedric Gampert - cgampert@gmail.com
 */

(function( $ ){

  $.fn.jrac = function(options) {

    // Default settings
    var settings = {
      'crop_width': 200,
      'crop_height': 100,
      'crop_left': 0,
      'crop_top': 0,
      'crop_resize': true,
      'image_width': null,
      'image_height': null,
      'zoom_min': 100,
      'zoom_max': 3000,
      'viewport_onload': null
    };

    // Apply the resize and crop tools to each images
    return this.each(function() {

      if (!$(this).is('img')) {
        return;
      }

      // Read options
      if ( options ) {
        $.extend( settings, options );
      }

      // Prepare image
      var $image = $(this).hide().css('position','absolute').wrap('<span class="jrac_container"><div class="jrac_viewport"></div></span>');

      // Get viewport and container references
      var $viewport = $image.parent();
      var $container = $image.parents('.jrac_container');

      // Add a waiting on load input image
      var $loading = $('<div class="jrac_loading" />');
      $viewport.append($loading);

      // Wait on image load to build the next processes
      $('<img>').attr('src', $image.attr('src')).load(function(){

        // Save the original image size
        var image_width = $image.width();
        var image_height = $image.height();

        // Set given optional image size
        $image.width(settings.image_width).height(settings.image_height);

        // Create the zoom widget which permit to resize the image
        var zoom_widget = $('<div class="jrac_zoom_slider"><div class="ui-slider-handle"></div></div>')
        .width($viewport.width())
        .slider({
          value: $image.width(),
          min: settings.zoom_min,
          max: settings.zoom_max,
          slide: function(event, ui) {
            $image.width(ui.value+"px");
            $viewport.observator.notify('image_width', ui.value);
            $viewport.observator.notify('image_height', $image.height());
          }
        });
        $container.append(zoom_widget);

        // Make the viewport resizeable
        $viewport.resizable({
          resize: function(event, ui) {
            zoom_widget.width(ui.size.width);
          }
        });

        // Enable the image draggable interaction
        $image.draggable({
          drag: function(event, ui) {
            if (ui.position.left != ui.originalPosition.left) {
              $viewport.observator.notify_crop_x();
            }
            if (ui.position.left != ui.originalPosition.left) {
              $viewport.observator.notify_crop_y();
            }
          }
        });

        // Build the select crop
        var $crop = $('<div class="jrac_select" />')
        .css({
          'width': settings.crop_width,
          'height': settings.crop_height,
          'left':settings.crop_left,
          'top':settings.crop_top
        }).draggable({
          containment: $viewport,
          drag: function(event, ui) {
            if (ui.position.left != ui.originalPosition.left) {
              $viewport.observator.notify_crop_x();
            }
            if (ui.position.left != ui.originalPosition.left) {
              $viewport.observator.notify_crop_y();
            }
          }
        });
        if (settings.crop_resize) {
          $crop.resizable({
            containment: $viewport,
            resize: function(event, ui) {
              if (ui.size.width != ui.originalSize.width) {
                $viewport.observator.notify('crop_width', ui.size.width);
              }
              if (ui.size.height != ui.originalSize.height) {
                $viewport.observator.notify('crop_height', ui.size.height);
              }
            }
          })
        }
        $viewport.append($crop);

        // Extend viewport witch usefull objects as it will be exposed to user
        // functions interface
        $.extend($viewport, {
          $image: $image,
          $crop: $crop,
          // Let me introduce the following Terminator's friend which handle the
          // creation of the viewport events.
          observator: {
            items: {},
            // Register an event with a given element
            register: function(event_name, element, onevent_callback) {
              if (event_name && element) {
                this.items[event_name] = {
                  element: element,
                  callback: onevent_callback
                };
              }
            },
            // Unregister an event
            unregister: function(event_name) {
              delete this.items[event_name];
            },
            // Trigger a event and optionally supply a value
            notify: function(event_name, value) {
              if (this.items[event_name]) {
                var element = this.items[event_name].element;
                var onevent_callback = this.items[event_name].callback;
                element.trigger(event_name,[$viewport, value]);
                if ($.isFunction(onevent_callback)) {
                  onevent_callback.call($viewport, event_name, this.items[event_name].element, value);
                }
              }
              $image.trigger('viewport_events',[$viewport]);
            },
            notify_all: function() {
              this.notify_crop_x();
              this.notify_crop_y();
              this.notify_crop_size();
              this.notify_image_size();
            },
            notify_crop_x: function() { // relative to image
              var position = this.crop_position();
              this.notify('crop_x', position.x);
            },
            notify_crop_y: function() { // relative to image
              var position = this.crop_position();
              this.notify('crop_y', position.y);
            },
            notify_crop_size: function() {
              this.notify('crop_width', $crop.width());
              this.notify('crop_height', $crop.height());
            },
            notify_image_size: function() {
              this.notify('image_width', $image.width());
              this.notify('image_height', $image.height());
            },
            // Return crop position relative to $image
            crop_position: function() {
              return {
                x: $crop.position().left - $image.position().left,
                y: $crop.position().top - $image.position().top
              };
            },
            // Does the crop is completely inside the image?
            crop_consistent: function() {
              return this.crop_position().x>=0 && this.crop_position().y>=0
              && this.crop_position().x + $crop.width()<=$image.width()
              && this.crop_position().y + $crop.height()<=$image.height();
            },
            // Set a property (which his name is one of the event) with a given
            // value then notify this operation
            set_property: function(what,value) {
              value = parseInt(value);
              if (isNaN(value)) return;
              switch (what) {
                case 'crop_x':
                  $crop.css('left',value + $image.position().left);
                  break;
                case 'crop_y':
                  $crop.css('top',value + $image.position().top);
                  break;
                case 'crop_width':
                  $crop.width(value);
                  break;
                case 'crop_height':
                  $crop.height(value);
                  break;
                case 'image_width':
                  $image.width(value);
                  break;
                case 'image_height':
                  $image.height(value);
                  break;
              }
              this.notify(what,value);
            }
          }
        })

        // Trigger the viewport_onload callback
        if ($.isFunction(settings.viewport_onload)) {
          settings.viewport_onload.call($viewport);
          $viewport.observator.notify_all();
        }
      });

      // Hide the loading notice
      $loading.hide();

      // Finally display the image
      $image.show();

    })
  };
})( jQuery );

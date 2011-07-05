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
      var $image = $(this).hide().css('position','absolute').wrap('<div class="jrac_container"><div class="jrac_viewport"></div></div>');

      // Get viewport and container references
      var $viewport = $image.parent();
      var $container = $viewport.parent();

      // Add a waiting on load input image
      var $loading = $('<div class="jrac_loading" />');
      $viewport.append($loading);

      // Wait on image load to build the next processes
      $('<img>').attr('src', $image.attr('src')).load(function(){

        // Add some custom properties to $image
        $.extend($image, {
          scale_proportion_locked: true,
          originalWidth: $image.width(),
          orignalHeight: $image.height()
        });

        // Set given optional image size
        $image.width(settings.image_width).height(settings.image_height);

        // Create the zoom widget which permit to resize the image
        var $zoom_widget = $('<div class="jrac_zoom_slider"><div class="ui-slider-handle"></div></div>')
        .width($viewport.width())
        .slider({
          value: $image.width(),
          min: settings.zoom_min,
          max: settings.zoom_max,
          start: function(event, ui) {
            $.extend($zoom_widget,{
              on_start_width_value: ui.value,
              on_start_height_value: $image.height()
            })
          },
          slide: function(event, ui) {
            var height = Math.round($zoom_widget.on_start_height_value * ui.value / $zoom_widget.on_start_width_value);
            $image.height(height);
            $image.width(ui.value);
            $viewport.observator.notify('image_height', height);
            $viewport.observator.notify('image_width', ui.value);
          }
        });
        $container.append($zoom_widget);

        // Make the viewport resizeable
        $viewport.resizable({
          resize: function(event, ui) {
            $zoom_widget.width(ui.size.width);
          }
        });

        // Enable the image draggable interaction
        $image.draggable({
          drag: function(event, ui) {
            if (ui.position.left != ui.originalPosition.left) {
              $viewport.observator.notify('crop_x', $viewport.observator.crop_position_x());
            }
            if (ui.position.left != ui.originalPosition.left) {
              $viewport.observator.notify('crop_y', $viewport.observator.crop_position_y());
            }
          }
        });

        // Build the crop element
        var $crop = $('<div class="jrac_crop" />')
        .css({
          'width': settings.crop_width,
          'height': settings.crop_height,
          'left':settings.crop_left,
          'top':settings.crop_top
        }).draggable({
          containment: $viewport,
          drag: function(event, ui) {
            if (ui.position.left != ui.originalPosition.left) {
              $viewport.observator.notify('crop_x', $viewport.observator.crop_position_x());
            }
            if (ui.position.left != ui.originalPosition.left) {
              $viewport.observator.notify('crop_y', $viewport.observator.crop_position_y());
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
          $container: $container,
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
            // Trigger an event and optionally supply a value
            notify: function(event_name, value) {
              if (this.items[event_name]) {
                var element = this.items[event_name].element;
                var onevent_callback = this.items[event_name].callback;
                element.trigger(event_name,[$viewport, value]);
                if ($.isFunction(onevent_callback)) {
                  onevent_callback.call($viewport, event_name, element, value);
                }
              }
              $image.trigger('viewport_events',[$viewport]);
            },
            notify_all: function() {
              this.notify('crop_x', this.crop_position_x());
              this.notify('crop_y', this.crop_position_y());
              this.notify('crop_width', $crop.width());
              this.notify('crop_height', $crop.height());
              this.notify('image_width', $image.width());
              this.notify('image_height', $image.height());
            },
            // Return crop x position relative to $image
            crop_position_x: function() {
              return $crop.position().left - $image.position().left;
            },
            // Return crop y position relative to $image
            crop_position_y: function() {
              // The following Math.ceil() is a quick fix with an issue where 
              // firefox return some float value (e.g 100.00001525878906) for 
              // some top position.
              return Math.ceil($crop.position().top - $image.position().top);
            },
            // Does the crop is completely inside the image?
            crop_consistent: function() {
              return this.crop_position_x()>=0 && this.crop_position_y()>=0
              && this.crop_position_x() + $crop.width()<=$image.width()
              && this.crop_position_y() + $crop.height()<=$image.height();
            },
            // Set a property (which his name is one of the event) with a given
            // value then notify this operation
            set_property: function(that, value) {
              value = parseInt(value);
              if (isNaN(value)) {
                return;
              }
              switch (that) {
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
                  if ($image.scale_proportion_locked) {
                    var image_height = Math.round($image.height() * value / $image.width());
                    $image.height(image_height);
                    this.notify('image_height', image_height);
                  }
                  $image.width(value);
                  $zoom_widget.slider('value', value);
                  break;
                case 'image_height':
                  if ($image.scale_proportion_locked) {
                    var image_width = Math.round($image.width() * value / $image.height());
                    $image.width(image_width);
                    this.notify('image_width', image_width);
                    $zoom_widget.slider('value', image_width);
                  }
                  $image.height(value);
                  break;
              }
              this.notify(that, value);
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

* SUMMARY *

jQuery Resize And Crop (jrac) is a jQuery plugin that build a viewport around a
given image permitting to visually resize an image and place a crop. Then it is
possible to use the coordinates data to be used for any purpose.


* DEMO *

http://www.lacordeaucou.net/z/jrac/example/


* FEATURES *

- Resize and move image
- Resize and move crop
- Resize viewport
- Aims to be integrated with any server side image processor


* INSTRUCTIONS *

The 'rac' method take an optional setting object:

  $('img').rac();

The default setting is the following:

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

The 'viewport_onload' property can take an function callback which interface is:

  function() // which the context is $viewport

The $viewport argument is div mapped jquery object that surround the taget
image. This object get the following subsequent properties:
  - $viewport.$image: the target image jquery mapped
  - $viewport.$crop: the crop object.
  - $viewport.observator: an object which process all event of the viewport.

The main method of the $viewport.observator is 'register' which register an
element for an event:

  $viewport.observator.register(string event_name, dom element, callback optional onevent_callback)

The observator events are the following which you can then trigger some actions 
on:

  crop_x
  crop_y
  crop_width
  crop_height
  image_width
  image_height

Sample:

  $('img').rac({'viewport_onload', function() {
    var $viewport = this
    viewport.register('crop_x', $('input#cropx'), function(event_name, element, value) {
      element.val(value)
    }
  }

There is also an event 'viewport_events' which is triggered on every events of
the previous decribed viewport observator.


* REQUIEREMENTS *

jrac use jQuery and jQuery UI.

- Developped with jQuery 1.6.1 and jQuery-UI 1.8.13
- Tested with jQuery 1.4.4 and jQuery-UI 1.8.7


* ACKNOWLEDGEMENT *

- The jrac/images/loading.gif come from http://www.ajaxload.info/.
- The example picture is provided (perhaps) by courtesy of Loulou from Sos-Chats Geneve.


* CHANGELOG *

** Version 1.0-beta1 - 25 jun 2011
Initial release

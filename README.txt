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

The 'jrac' method implement the whole business which can take an optional 
setting object argument:

  $('img').jrac();

The default setting object is the following:

  var settings = {
    'crop_width': 200,
    'crop_height': 100,
    // The two following properties define the crop position (relative to the 
    // image).
    'crop_x': 0,
    'crop_y': 0,
    'crop_resize': true,
    'image_width': null,
    'image_height': null,
    'zoom_min': 100,
    'zoom_max': 3000,
    // The two following properties allow to position the content (negative 
    // value allowed). It can be use to focus the viewport on the cropped 
    // part of the image. 
    'viewport_content_x': 0,
    'viewport_content_y': 0,
    // Submit here a callback function (context is the viewport), see below.
    'viewport_onload': null
  };

The 'viewport_onload' property can take an function callback which interface is:

  function() // which the context is $viewport

The $viewport argument is a div jQuery wrapped element that surround the target
image. This object get the following subsequent properties:

  - $viewport.$container: a container holding the viewport and the zoom widget.
  - $viewport.$image: the target image jQuery wrapped.
  - $viewport.$crop: the crop object.
  - $viewport.observator: an object which process all events of the viewport.

The main method of the $viewport.observator is 'register' which register an
element for an event:

  $viewport.observator.register(String event_name, jQuery wrapped elements[, callback onevent_callback])

To unregister an event use:

  $viewport.observator.unregister(string event_name)

The observator events are the following which you can then trigger some actions 
on with the jQuery bind method or by giving a function to the onvevent_callback 
argument:

  crop_x
  crop_y
  crop_width
  crop_height
  image_width
  image_height

Example:

  $('img').rac({'viewport_onload', function() {
    var $viewport = this;
    $viewport.register('crop_x', $('input#cropx'), function(event_name, element, value) {
      element.val(value);
    }
  }

There is also an event 'viewport_events' which is triggered on every events of
the previous decribed viewport observator. Use the jQuery bind methode to act on
it.


* REQUIEREMENTS *

jrac use jQuery and jQuery-UI.

- Developped with jQuery 1.6.1 and jQuery-UI 1.8.13
- Tested with jQuery 1.4.4 and jQuery-UI 1.8.7


* ACKNOWLEDGEMENT *

- The jrac/images/loading.gif image file come from http://www.ajaxload.info/.
- The picture used in the example is provided (perhaps) by courtesy of Loulou 
from Sos-Chats Geneve.
- Syntax Highlighting in JavaScript (SHJS) used for the display of the code in 
the example, http://shjs.sourceforge.net/.


* DOWNLOAD *

https://github.com/trepmag/jrac


* CHANGELOG *

** Version 1.0-beta1 - 25 jun 2011
Initial release

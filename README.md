# SUMMARY

jQuery Resize And Crop (jrac) is a jQuery plugin that build a viewport around a
given image permitting to visually resize an image and place a crop. Then it is
possible to use the coordinates data to be used for any purpose.

## DOWNLOAD
https://github.com/trepmag/jrac

or install with bower:
```bash
bower install --save jrac
```


## DEMO

http://www.trepmag.ch/z/jrac/example/


## FEATURES

- Resize and move image
- Resize and move crop
- Resize viewport
- Aims to be integrated with any server side image processor


## INSTRUCTIONS

The `jrac` method implement the whole business which can take an optional
setting object argument:
```javascript
  $('img').jrac();
```
The default setting object is the following:
```javascript
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
    'viewport_image_surrounding': false, // Set the viewport to surround the image on load
    'viewport_width': null,
    'viewport_height': null,
    'viewport_resize': true,
    // The two following properties allow to position the content (negative
    // value allowed). It can be use to focus the viewport on the cropped
    // part of the image.
    'viewport_content_x': 0,
    'viewport_content_y': 0,
    // Submit here a callback function (context is the viewport), see below.
    'viewport_onload': null
  };
```
The `viewport_onload` property can take an function callback which interface is:
```javascript
  function() // which the context is $viewport
```
The `$viewport` context is a `div` jQuery wrapped element that surrounds the target
image. This object has the following subsequent properties:

  - `$viewport.$container`: a container holding the viewport and the zoom widget.
  - `$viewport.$image`: the target image, jQuery-wrapped.
  - `$viewport.$crop`: the crop object.
  - `$viewport.observator`: an object which processes all events of the viewport.

The main method of the `$viewport.observator` is `register` which registers an
element for an event:
```javascript
  $viewport.observator.register(String event_name, jQuery wrapped elements[, callback onevent_callback])
```
To unregister an event, use:
```javascript
  $viewport.observator.unregister(string event_name)
```

The observator events are the following which you can then trigger some actions
on with the jQuery `bind` method or by giving a function to the `onevent_callback`
argument:

  - `jrac_crop_x`
  - `jrac_crop_y`
  - `jrac_crop_width`
  - `jrac_crop_height`
  - `jrac_image_width`
  - `jrac_image_height`

Example:
```javascript
  $('img').jrac({'viewport_onload', function() {
    var $viewport = this;
    $viewport.register('jrac_crop_x', $('input#cropx'), function(event_name, element, value) {
      element.val(value);
    }
  }
```

There is also an event `jrac_events` which is triggered on every events of
the previous decribed viewport observator. Use the jQuery `bind` method to act on
it.

Destroy jrac (not much tested) is done by running jrac with the `destroy` argument:
```javascript
  $('img').jrac('destroy');
```


## ACKNOWLEDGEMENT

- The jrac/images/loading.gif image file come from http://www.ajaxload.info/.
- The picture used in the example is provided (perhaps) by courtesy of Loulou
from Sos-Chats Geneve http://www.sos-chats.ch/.
- Syntax Highlighting in JavaScript (SHJS) used for the display of the code in
the example, http://shjs.sourceforge.net/.

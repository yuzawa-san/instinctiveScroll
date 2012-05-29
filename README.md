# intuitiveScroll

*version 1.1*

James Yuzawa: 
[http://www.jyuzawa.com](http://www.jyuzawa.com/)

Released under MIT License

A jQuery plugin for horizontal scrolling using mouse location in an element.
Moving mouse to the right of the element will make it scroll to the right.
Moving mouse to the left of the element will make it scroll to the left.
Similar to mousemove implementation of [Mootools Scroller](http://demos111.mootools.net/Scroller).

## Options

| **key**                    | **type**             | **default value** | **description**                                                       |
|:---------------------------|:---------------------|:------------------|:---------------------------------------------------------------------|
| `buffer`                   | int (px)             | `75`              | The width of the buffer in the left and right of the element in which to bind the scroll event. |
| `speed`                    | int (px/interval)    | `100`             | The maximum number of pixels to jump every time the the scroll action is fired. |
| `interval`                 | int (ms)             | `50`              | The number of milliseconds to delay between firing the scroll action. |
| `scroller`                 | boolean              | `true`            | Display a scroller. |
| `locking`                  | boolean              | `false`           | Do not allow the scroll events if the mouse enters from the left or right from the outside |
| `scrollerColor`            | int[3]               | `[100,100,100]`   | A triple of RGB color values 0-255 |
| `scrollerOpacity`          | float                | `0.8`             | An alpha parameter from 0 to 1 |
| `scrollerInactiveOpacity`  | float                | `0.3`             | An alpha parameter from 0 to 1 |
| `startCallback`            | function             | `null`            | Callback function fired when scroll begins |
| `stopCallback`             | function             | `null`            | Callback function fired when scroll stops |

## Usage

Demo html:

    <div id="myContainer">
        <div id="myContent">
            <div class="block">Wide Content Here</div>
            <div class="block">Wide Content Here</div>
            <div class="block">Wide Content Here</div>
            <div class="block">Wide Content Here</div>
            <div class="block">Wide Content Here</div>
            <div class="block">Wide Content Here</div>
        </div>
    </div>

with css:

    #myContainer {
        width: 500px;
        border: 1px solid black;
    }
    #myContent {
        width:1000px;
        background: gray;
    }
    .block {
        width: 150px;
        float:left;
        height:200px;
        background:red;
        color:white;
        padding: 3px;
        margin: 3px;
    }

with JavaScript:

    $("#myContainer").instinctiveScroll();
    
or JavaScript with options (see below for details):

    $("#myContainer").instinctiveScroll({
        buffer: 100,
        scroller: false,
        scrollerOpacity: 0.95,
    });
    
This usage demo is implemented in full in `demo.html`.

## Notes

* Window can be resized changing element size, scrolling still will work and scrollbar will properly be redrawn.
* Cursor will indicated scrolling when mouse in the left/right buffer region of an element.
* Speed increases quadratically (to `speed` parameter) as the mouse goes further into the buffer region.

## Todo

* fix random bugs with `locking` parameter

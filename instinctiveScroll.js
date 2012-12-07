/*
    instinctiveScroll v1.2
    James Yuzawa (http://www.jyuzawa.com/)
    released under MIT License
*/

(function($) {
    // bind it to jquery
    $.fn.instinctiveScroll = function(options) {
        this.each(function(){
            return new InstinctiveScroll(this, options);
        });
    };
    
    var InstinctiveScroll = function(elem, userOpts) {
        // plugin globals
        var self = this;
        var $elem = $(elem);
        var itemWidth = $elem.width();
        var itemHeight = $elem.height();
        var innerWidth = $elem.children().width();
        var hScrollTimer = null;
        var hScrollDelta=0;
        var entered=true;
        var scrollerRatio=itemWidth/innerWidth;
        var inBuf=false;
        var mouseWheelTimer=null;
        
        // options
        var opts = {
            buffer: 75,
            speed: 100,
            interval: 50,
            scroller: true,
            locking: false,
            scrollerColor: [100,100,100],
            scrollerOpacity: 0.8,
            scrollerInactiveOpacity: 0.3,
            startCallback: null,
            stopCallback: null,
            handleMouseScroll: true,
            iOSDirection: true
        };
        
        // overwrite defaults with user opts
        for (var i in userOpts) {
            if (userOpts[i] !== undefined) {
                opts[i] = userOpts[i];
            }
        }
        
        // apply css to element
        $elem.css({
            "overflow":"auto",
            "overflow-x":"hidden",
            "overflow-y":"auto",
            "position":"relative" 
        });
        
        // scroller stuff
        var activeScrollerColor = "rgba("+opts.scrollerColor[0]+","+opts.scrollerColor[1]+","+opts.scrollerColor[2]+","+opts.scrollerOpacity+")";
        var inactiveScrollerColor = "rgba("+opts.scrollerColor[0]+","+opts.scrollerColor[1]+","+opts.scrollerColor[2]+","+opts.scrollerInactiveOpacity+")";
        var scroller = $("<div/>").css({
            "background":inactiveScrollerColor,
            "margin":"5px",
            "position":"absolute",
            "border-radius":"5px",
            "bottom": "0px",
            "left":"0px",
            "width":"30px",
            "height":"8px"
        });
        if(opts.scroller){
            if(scrollerRatio<=1){
                scroller.width(scrollerRatio*itemWidth);
            }else{
                scroller.hide();
            }
            $elem.prepend(scroller);
        }
        
        // function called at intervals to run scroll
        var doScrollHorizontal = function(){
            execScroll(hScrollDelta);
        };
        
        // do scroll, called from mousemove or mousewheel
        var execScroll = function(delta){
            orig=$elem.scrollLeft();
            calc=orig+delta;
            if(calc<0){
                calc=0; // fix left
            }
            if(calc>(innerWidth-itemWidth)){
                calc=(innerWidth-itemWidth); // fix right
            }
            $elem.scrollLeft(calc);
            if(opts.scroller){ // move scroller
                est=calc+(calc/innerWidth)*(itemWidth-14);
                scroller.css('left',est+"px");
            }
            if(calc==(innerWidth-itemWidth) || calc==0){ // stop at ends of content
                if(opts.stopCallback){
                    opts.stopCallback();
                }
                $elem.css("cursor","");
                clearInterval(hScrollTimer);
                hScrollTimer=null;
            }
        };
        
        // see if we are in the buffer zone in the left or right of the element
        $elem.mousemove(function(e){
            var parentOffset = $(this).offset(); 
            var relX = (e.pageX - parentOffset.left);
            rightBox = (relX > (itemWidth-opts.buffer));
            leftBox = (relX < opts.buffer);
            
            orig=$elem.scrollLeft();
            if(scrollerRatio<=1 && (rightBox || leftBox)){
                if(rightBox){
                    hScrollDelta=Math.pow((1-((itemWidth-relX)/opts.buffer)),2)*opts.speed;
                    if(hScrollTimer===null && orig!=(innerWidth-itemWidth) && entered){
                        $elem.css("cursor","e-resize");
                        hScrollTimer=setInterval(doScrollHorizontal,opts.interval);
                        if(opts.startCallback){
                            opts.startCallback(1);
                        }
                    }
                }
                if(leftBox){
                    hScrollDelta=Math.pow((1-(relX/opts.buffer)),2)*-opts.speed;
                    if(hScrollTimer===null && orig !==0 && entered){
                        $elem.css("cursor","w-resize");
                        hScrollTimer=setInterval(doScrollHorizontal,opts.interval);
                        if(opts.startCallback){
                            opts.startCallback(-1);
                        }
                    }
                }
                inBuf=true;
            }else{
                if(inBuf && opts.stopCallback){
                    inBuf=false;
                    opts.stopCallback();
                }
                entered=true;
                $elem.css("cursor","");
                clearInterval(hScrollTimer);
                hScrollTimer=null;
            }
        });
        
        // change scroller and lock scrolling when entering the element
        $elem.mouseover(function(){
            if(opts.scroller){
                scroller.css("background",activeScrollerColor);
            }
            if(opts.locking){
                entered=false;
            }
        });
        
        // change scroller and release scrolling when exiting the element
        $elem.mouseleave(function(){
            if(inBuf && opts.stopCallback){
                inBuf=false;
                opts.stopCallback();
            }
            $elem.css("cursor","");
            clearInterval(hScrollTimer);
            hScrollTimer=null;
            if(opts.scroller){
                scroller.css("background",inactiveScrollerColor);
            }
        });
        
        // handle trackpad or mousewheel events
        if(opts.handleMouseScroll){
            // run wheel event when scrolling is 'done'
            doWheelEvent=function(prevWheel){
                if(opts.iOSDirection){
                    execScroll(prevWheel);
                }else{
                    execScroll(-prevWheel);
                }
                clearTimeout(mouseWheelTimer);
                mouseWheelTimer=setTimeout(function() {
                    if(opts.stopCallback){
                        opts.stopCallback();
                    }
                }, 250);
            };
            
            // webkit, etc
            $elem.bind('mousewheel', function(e){
                doWheelEvent(e.originalEvent.wheelDeltaX);
            });
            
            // for picky mozilla
            elem.addEventListener('MozMousePixelScroll', function(e) {
                if(e.axis==e.HORIZONTAL_AXIS){
                    doWheelEvent(e.detail);
                }
            });
        }
        
        // update metrics when window resizes in case element's frame changed
        $(window).resize(function() {
            itemWidth = $elem.width();
            itemHeight = $elem.height();
            scrollerRatio=itemWidth/innerWidth;
            if(opts.scroller){
                scroller.width(scrollerRatio*itemWidth);
                if(scrollerRatio<=1){
                    scroller.show();
                }else{
                    scroller.hide();
                }
            }
        });
    };
})(jQuery);

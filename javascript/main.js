var MOBILE_WIDTH = 992;

function slickInit(selector) {
    if ($(selector).length > 0) {
        $(selector).slick({
            dots: false,
            infinite: true,
            speed: 500,
            fade: true,
            prevArrow: '<button type="button" class="slick-slider__prev">prev</button>',
            nextArrow: '<button type="button" class="slick-slider__next">next</button>',
            responsive: [{
                breakpoint: 600,
                settings: {
                    arrows: false
                }
            }]
        });
    }
}

function strechSliderPage() {
    if ($('.slider-page').length > 0) {

        // var sliderMain = $('main'),
        //     sliderMainHeight = sliderMain.innerHeight(),
        //     page = $('.slider-page'),
        //     footerHeight = $('footer').innerHeight(),
        //     paddingTop = parseInt($('body').css('padding-top'), 10),
        //     height = (sliderMainHeight + footerHeight + paddingTop);

        // page.css('min-height', height);

        // var top = (page.innerHeight() - sliderMain.innerHeight()) / 2;
        // console.log(top);
        // sliderMain.css('top', top);


    }
}

function initPreLoader() {


    function animatePreloader($el, attrs, speed) {
        // duration in ms
        speed = speed || 400;
        var start = {}, // object to store initial state of attributes
            timeout = 20, // interval between rendering loop in ms
            steps = Math.floor(speed/timeout), // number of cycles required
            cycles = steps; // counter for cycles left
        // populate the object with the initial state
        $.each(attrs, function(k,v) {
            start[k] = $el.attr(k);
        });

        (function loop() {

            $.each(attrs, function(k,v) {  // cycle each attribute
                var pst = (v - start[k])/steps;  // how much to add at each step
                $el.attr(k, function(i, old) {
                    return +old + pst;  // add value do the old one
                });
            });
            if (--cycles) // call the loop if counter is not exhausted
                {
                    setTimeout(loop, timeout);
                }
            else // otherwise set final state to avoid floating point values
                {
                    $el.attr(attrs);
                    $('body').removeClass('preloader-visible');

                }
        })(); // start the loop
    }
    animatePreloader($('.preloader_mask'), {y: 0}, 2000);
}
$(document).ready(function($) {
// init events
 initEvents();
});


function initResizeGalleryImgs() {
    //all img have same width
    function resizeImgs() {
        window.galleryItemsWidth = $(galleryItemList[0]).innerWidth();
        for (var i = galleryItemsLength - 1; i >= 0; i--) {

            $item = $(galleryItemList[i]);

            var itemAttrWidth = $item.attr('width'),
                itemAttrHeight = $item.attr('height')
            itemCurrentHeight = Math.floor(galleryItemsWidth * itemAttrHeight / itemAttrWidth);
            $item.height(itemCurrentHeight);
        };
    }

    resizeImgs();

    $(window).resize(function() {
        resizeImgs()
    });
}

function setScrollVideoPosition(scrollTop) {
    for (var i = scrollVideos.videoMap.length - 1; i > 0; i--) {
        if ((scrollTop > scrollVideos.videoMap[i].begin) && (scrollTop < scrollVideos.videoMap[i].end)) {
            break;
        };
    }

    if (scrollVideos.currentVideo !== i) {
        scrollVideos.currentVideo = i;
        $(scrollVideos.videos).addClass('hidden');
        $(scrollVideos.videos[i]).removeClass('hidden');
    }
}

function getScrollvideoMap() {
    scrollVideos.videoMap = [];
    for (var i = 0; i < scrollVideos.videos.length; i++) {
        var videoCord = {},
            currentItem = $(scrollVideos.videos[i]);

        videoCord.end = currentItem.offset().top + currentItem.innerHeight();
        videoCord.begin = currentItem.offset().top - currentItem.innerHeight();
        scrollVideos.videoMap.push(videoCord);
    };
}

function initScrollEffect() {
    if ($('.scrollEffect').length == 0) {
        return false;
    }

    window.scrollVideos = {};
    scrollVideos.videoMap = [];
    scrollVideos.videos = $('.full-screen-widget--video');
    scrollVideos.currentVideo = 10;

    getScrollvideoMap();
    setScrollVideoPosition($(window).scrollTop());
    $(window).scroll(function() {
        setScrollVideoPosition($(window).scrollTop());
    });
    $(window).resize(function() {
        getScrollvideoMap();
        setScrollVideoPosition($(window).scrollTop());
    });
    //$(window).load(function() {
    if (MOBILE_WIDTH < $(window).innerWidth()) {
        var videos = $('.js-resizebleVideo');

        for (var i = videos.length - 1; i >= 0; i--) {
            videos.get(i).play();
        }
    }
    //});
}

function initMasonry(containerSelector, childSelector) {

    var $grid = $(containerSelector).isotope({
        // options
        itemSelector: childSelector,
        columnWidth: childSelector,
    });

    // filter items on button click
    $('.filter-button-group').on( 'click', 'button', function() {
      var filterValue = $(this).attr('data-filter');
      $grid.isotope({ filter: filterValue });
      console.log(this)
      $('.info-tab__item').removeClass('info-tab__item--active');
      $(this).addClass('info-tab__item--active')

    });

    $(window).load(function(){
      $grid.isotope('layout');
    });
}

function initLazyLoad(imgSelector) {
    $(imgSelector).lazyload({
        effect: "fadeIn"
    });
}

function initArchiveGallery() {
    window.galleryItemList = $('.lazy');
    window.galleryItemsLength = $('.lazy').length;

    if (galleryItemsLength > 0) {
        initResizeGalleryImgs();
        initMasonry('#archive-gallery', '.archive-gallery__item');
        initLazyLoad('.lazy');
    }
}

function setHeightVideo() {
    var parentHeight;

    parentHeight = $(window).innerHeight();


    width = Math.floor(parentHeight / 0.542);


    if (width <= $(window).innerWidth()) {
        width = $(window).innerWidth()
    };
    $('.js-resizebleVideo').width(width);
}

function resizeVideo() {
    if ($('.js-resizebleVideo').length > 0) {
        setHeightVideo();
        $(window).resize(setHeightVideo);
    }
}

function addBgToImgParent(imgSelector, parentClass) {
    var src, imgList = $(imgSelector, parentClass);

    for (var i = 0; i < imgList.length; i++) {
        src = $(imgList[i]).attr('src');
        $(imgList[i]).parent().css('background-image', 'url(\'' + src + '\')');
    }
}

function initMobileMenu() {
    $('.header__mobile-menu-btn').click(function() {
        $('.header-nav').toggleClass('header-nav--open');
    });
}

function changeTab() {
    var activeClass = $('.tabs__item--active').attr('data-content');
    $('.tabs__content').removeClass('tabs__content--active');
    $('.' + activeClass).addClass('tabs__content--active');
}

function initTabs() {
    changeTab();

    $('a', '.tabs').click(function() {
        $('.tabs__item--active').removeClass('tabs__item--active');
        $(this).addClass('tabs__item--active');
        changeTab();
        return false;
    })
}

function initHtmlVideos() {
    $(window).load(function() {
        $('.video-widget').hover(function(e) {
            if (window.innerWidth > MOBILE_WIDTH) {
                $('video', this).get(0).play();
            }
        }, function() {
            if (window.innerWidth > MOBILE_WIDTH) {
                $('video', this).get(0).pause();
            }
        });
    })
}

function fixContainerHeightInIE() {
    var minHeight = $('body').innerHeight() - parseInt($('body').css('padding-top'), 10) - parseInt($('body').css('padding-bottom'), 10);
    $('.inner-container').css('min-height', minHeight)
}

function pauseVideoInSlider(currentSlide) {
    var sliderItems = $('.slick-slide');
    $("video", $(sliderItems[currentSlide])).each(function() {
        this.pause();
    });
}



function initEvents() {


    $(document).ready(
        function() {

            strechSliderPage();
            initTabs();

            initArchiveGallery();

            addBgToImgParent('img', '.background-section');

            fixContainerHeightInIE();
            slickInit('#js-slick-slider');

            $('#js-slick-slider').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
                pauseVideoInSlider(currentSlide);
            });

            $(document).tooltip({
                track: true
            });

            initMobileMenu();
            resizeVideo();
            initScrollEffect();
            initHtmlVideos();
            initPreLoader();


        });
    $(window).load(function() {
        strechSliderPage();

    });

    $(window).resize(function() {
        initHtmlVideos();
        strechSliderPage();
    });
}
//for touch devices
$('html.touchevents .full-screen-widget--video').find('video').hide();
$('html.touchevents .full-screen-widget--video').find('i').show();
// $(".embed-container").fitVids();

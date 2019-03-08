/**
 * Global variables.
 */
var autoAdjusted = false;
/**
 * Customizes jQuery functions.
 */
($ => {
    /**
     * Sets up a Flex Gallery.
     * @param {Object} options - the custom arguments
     * @return {jQuery}
     */
    $.fn.flexGallery = function(options) {
        /**
         * Default options for the flex gallery.
         */
        let settings = $.extend({
            margin: '0.5vmin',
            minHeightRatioWindow: null,
            minHeightRatioScreen: null,
            fadeInDuration: 1000,
            checkPeriod: 100, 
            autoAdjust: true
        }, options);
        /**
         * Calculates the minimum height of each row.
         *
         * If no ratios are defined, it takes 0.25 window height in default.
         * If both ratios are defined, the smaller computed height will be applied.
         */
        if(!settings.minHeightRatioWindow && !settings.minHeightRatioScreen)
            settings.minHeightRatioWindow = 0.25;
        let minHeightWindow = minHeightScreen = Number.MAX_SAFE_INTEGER;
        if(settings.minHeightRatioWindow)
            minHeightWindow = window.innerHeight * settings.minHeightRatioWindow;
        if(settings.minHeightRatioScreen)
            minHeightScreen = screen.height * settings.minHeightRatioScreen;
        let minHeight = Math.min(minHeightWindow, minHeightScreen);
        /**
         * Listen on window size change.
         */
        if(!autoAdjusted && settings.autoAdjust) {
                $(window).on('resize', () => {
                    if(settings.minHeightRatioWindow)
                        minHeightWindow = window.innerHeight * settings.minHeightRatioWindow;
                    minHeight = Math.min(minHeightWindow, minHeightScreen);
                    $('.flex-gallery-a').each((index, element) => {
                        let img = $(element).children()[0];
                        $(element).css('width', minHeight * img.naturalWidth / img.naturalHeight);
                    });
                });
                autoAdjusted = true;
        }
        /**
         * Make all elements flex.
         */
        return this.each(() => {
            this.addClass("flex-gallery-container")
                .css('margin', settings.margin)
                .children("a")   .addClass("flex-gallery-a")
                                 .css('margin', settings.margin)
                                 .each((index, element) => {
                                     /**
                                      * Checks sizes of every images being loading
                                      * so that we are able to set up the sizes of <a>s in advance.
                                      * Otherwise, the screen will flickers due to the images loaded early or late.
                                      *
                                      * However, naturalWidth and naturalHeight do not work in IE8 or below
                                      */
                                     let poll = setInterval(() => {
                                         let img = $(element).children("div").children("img")[0];
                                         if (img.naturalWidth) {
                                             clearInterval(poll);
                                             $(element).css({
                                                 'width': minHeight * img.naturalWidth / img.naturalHeight,
                                                 'flex-grow': img.naturalWidth / img.naturalHeight
                                             });
                                         }
                                     }, settings.checkPeriod);
                                 })
                .children("div") .addClass("flex-gallery-div")
                .children("img") .addClass("flex-gallery-img")
                                 .css("display", "none")
                                 .on('load', function(event) {
                                     /**
                                      * Make each image invisible first and then fade in an image
                                      * when it is loaded completely.
                                      */
                                     $(event.target).fadeIn(
                                        settings.fadeInDuration,
                                        /**
                                         * After an image is loaded, the initial animation and
                                         * event listeners are then applied to itself.
                                         */
                                        function() {
                                            $(this).parents("a").each(
                                                 /**
                                                  * The first animation of each image behaves weirdly unless
                                                  * we do a invisible initial animation at the beginning.
                                                  */
                                                 function(index) { hideText(this); }
                                             ).hover(
                                                 function() { showText(this); },
                                                 function() { hideText(this); }
                                             )
                                        });
                                 })
                .siblings("span").addClass('flex-gallery-text')
                                 .css('opacity', 0);
        });
    };
    /**
     * Sets up the needed methods for an flex-gallery-img.
     * @param {Object} media - an object of images and links
     * @param {Boolean} shuffling - whether to shuffle the image list or not
     * @return {jQuery}
     *
     * In `media`, `images` is required while `links` not. They are both Arrays.
     * The hyperlink will be set as the image url if `links` is not given.
     */
    $.fn.addFlexImages = function(media, shuffling=false) {
        if(!media.images)
            throw "Error: images not found.";
        if(media.links && media.images.length != media.links.length)
            throw "Error: # of images and # of links are not the same.";
        /**
         * Clone the image array.
         */
        let images = links = media.images.slice(), texts;
        if(media.links)
            links = media.links.slice();
        if(media.texts)
            texts = media.texts.slice();
        else
            texts = Array(images.length).fill("");
        /**
         * Add images to the page.
         */
        return this.each(() => {
            /**
             * Get a randomly permutated indices.
             */
            let indices = randPerm(media.images.length);
            /**
             * Puts images into the #container.
             */
            indices.forEach((index) => {
                /**
                 * Creates and inserts <a> with <img> in the container.
                 */
                $("#container").append(
                    $("<a>").attr("href", links[index]).append(
                        $("<div>").append(
                            $("<img>").attr("src", images[index]) //** this image should be a thumbnail
                        ).append(
                            $('<span>').text(texts[index])
                        )
                    )
                );
            });
        });
    };
}) (jQuery);

/**
 * Swaps elements in an array randomly.
 * The contents are reordered in place.
 * @param {Array} array - the array to be shuffled
 * @return {None}
 */
function shuffle(array) {
    for(let i in array) {
        let j = Math.floor(Math.random() * array.length);
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Randomly permutate a list of indices.
 * @param {Number} length - the number of indices
 * @return {Array} an randomly permutated array
 */
function randPerm(length) {
    let array = Array.from({length: length}, (v, k) => k);
    shuffle(array)
    return array
}

/**
 * Show the text in the flex image.
 * @param {Object} elem - an flex image element
 */
function showText(elem) {
    /**
     * Make the div behind the image black.
     */
    $(elem).find('.flex-gallery-div').each(function(index) {
        dynamics.css(this, {
            background: 'black'
        });
    });
    /**
     * Darken the image.
     */
    $(elem).find('.flex-gallery-img').each(function(index) {
        dynamics.animate(this, {
            opacity: 0.5
        }, {
            type: dynamics.easeOut,
            friction: 140,
            duration: 400
        });
    })
    /**
     * Bring the text out.
     */
    $(elem).find('.flex-gallery-text').each(function(index) {
        dynamics.animate(this, {
            opacity: 1,
            scale: 1
        }, {
            type: dynamics.spring,
            frequency: 200,
            friction: 380,
            duration: 800
        });
    });
}

/**
 * Hide the text in the flex image.
 * @param {Object} elem - an flex image element
 */
function hideText(elem) {
    /**
     * Bounce back the image.
     */
    $(elem).find('.flex-gallery-img').each(function(index) {
        dynamics.animate(this, {
            opacity: 1
        }, {
            type: dynamics.easeOut,
            friction: 140,
            duration: 400,
            /**
             * Make the background white after the image is not transparent.
             */
            complete: function() {
                $(elem).find('.flex-gallery-div').each(function(index) {
                    dynamics.css(this, {
                        background: 'white'
                    });
                });
            }
        });
    })
    /**
     * Conceal the text.
     */
    $(elem).find('.flex-gallery-text').each(function(index) {
        dynamics.animate(this, {
            opacity: 0,
            scale: 0.1
        }, {
            type: dynamics.spring,
            frequency: 200,
            friction: 380,
            duration: 800
        });
    });
}

/**
 * Adds a click function on document for debugging.
 */
$(document).on('click', (e) => {
    // $("img").css({'--natural-size-ratio': '100px'});
    // $(':root').css('--img-min-height', '100px');
});

/**
 * Sigmoid function.
 * @param {Number} t
 * @return {Number} sigmoid of t
 */
// function sigmoid(t) {
//     return 1 / (1 + Math.pow(Math.E, -t));
// }

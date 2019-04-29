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
        return this.find("*").addBack().filter(".fg-container").each((index, fgContainer) => {
            $(fgContainer).css('margin', settings.margin);
            $(fgContainer).find(".fg-item")
                .css('margin', settings.margin)
                .each((index, fgItem) => {
                   /**
                    * Checks sizes of every images being loading
                    * so that we are able to set up the sizes of <a>s in advance.
                    * Otherwise, the screen will flickers due to the images loaded early or late.
                    *
                    * However, naturalWidth and naturalHeight do not work in IE8 or below
                    */
                    $(fgItem).find(".fg-img")
                        .css("display", "none")
                        .on('load', (e) => {
                            /**
                             * Make each image invisible first and then fade in an image
                             * when it is loaded completely.
                             */
                            $(e.target).fadeIn(
                                settings.fadeInDuration,
                                /**
                                 * After an image is loaded, the initial animation and
                                 * event listeners are then applied to itself.
                                 */
                                () => $(fgItem).each(
                                    () => hideText(fgItem)
                                ).hover(
                                    () => showText(fgItem), () => hideText(fgItem)
                                )
                            );
                        })
                        .each((index, fgImg) => {
                            let poll = setInterval(() => {
                                let img = $(fgImg).get(0);
                                if (img.naturalWidth) {
                                    clearInterval(poll);
                                    $(fgItem).css({
                                        'width': minHeight * img.naturalWidth / img.naturalHeight,
                                        'flex-grow': img.naturalWidth / img.naturalHeight
                                    });
                                }
                            }, settings.checkPeriod);
                            $(fgImg).attr("src", $(fgImg).attr("fg-img-src"));
                        });
                    /**
                     * Hide the descriptions initially.
                     */
                    $(fgItem).find(".fg-text")
                        .css('opacity', 0);
                });
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
            let indices;
            if(shuffling) {
                /**
                 * Get a randomly permutated indices.
                 */
                indices = randPerm(media.images.length);
            } else {
                /**
                 * Get ordered indices.
                 */
                indices = orderedPerm(media.images.length);
            }
            /**
             * Puts images into the #container.
             */
            indices.forEach((index) => {
                /**
                 * Creates and inserts <a> with <img> in the container.
                 */
                $("#container").addClass("fg-container").append(
                    $("<div>").addClass("fg-item").append(
                        $("<a>").attr("href", links[index]).append(
                            $("<img>").addClass("fg-img")
                                      .attr("fg-img-src", images[index])  //** this image is a thumbnail
                        )
                    ).append(
                        $("<span>").addClass("fg-text")
                                   .text(texts[index])
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
 * Generate a list of [0, 1, ..., length-1]
 * @param {Number} length - the number of indices
 * @return {Array} an ordered index array
 */
function orderedPerm(length) {
    // let array = Array.from({length: length}, (v, k) => k);
    let array = [...Array(length).keys()];
    return array
}

/**
 * Randomly permutate a list of indices.
 * @param {Number} length - the number of indices
 * @return {Array} an randomly permutated array
 */
function randPerm(length) {
    let array = orderedPerm(length);
    shuffle(array)
    return array
}

/**
 * Show the text in the flex image.
 * @param {Object} elem - an flex image element
 */
function showText(fgItem) {
    /**
     * Make the div behind the image black.
     */
    $(fgItem).each((index, element) => {
        dynamics.css(element, {
            background: 'black'
        });
    });
    /**
     * Darken the image.
     */
    $(fgItem).find('.fg-img').each((index, element) => {
        dynamics.animate(element, {
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
    $(fgItem).find('.fg-text').each((index, element) => {
        dynamics.animate(element, {
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
function hideText(fgItem) {
    /**
     * Bounce back the image.
     */
    $(fgItem).find('.fg-img').each((index, element) => {
        dynamics.animate(element, {
            opacity: 1
        }, {
            type: dynamics.easeOut,
            friction: 140,
            duration: 400,
            /**
             * Make the background white after the image is not transparent.
             */
            complete: function() {
                $(fgItem).each((index, element) => {
                    dynamics.css(element, {
                        background: 'white'
                    });
                });
            }
        });
    })
    /**
     * Conceal the text.
     */
    $(fgItem).find('.fg-text').each((index, element) => {
        dynamics.animate(element, {
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
 *
 */
function parseUnit(unit, parentValue) {
    // 16px == 12pt == 1em == 1rem (== 100%)
    unit = unit.trim();
    let multiplier = 1;
    if(isNumber(unit)) {
        multiplier = parentValue;
    } else if(unit.endsWith('px')) {
        multiplier = 1;
        unit = unit.replace('px', '');
    } else if(unit.endsWith('pt')) {
        multiplier = 4.0 / 3.0;
        unit = unit.replace('pt', '');
    } else if(unit.endsWith('em')) {
        multiplier = 16;
        unit = unit.replace('em', '');
    } else if(unit.endsWith('rem')) {
        multiplier = 16;
        unit = unit.replace('rem', '');
    } else if(unit.endsWith('%', '')) {
        multiplier = parentValue / 100.0;
        unit = unit.replace('%', '')
    }
    return Number(unit) * multiplier;
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

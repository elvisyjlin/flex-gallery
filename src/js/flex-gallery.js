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
        var settings = $.extend({
            margin: '0.5vmin',
            minHeightRatio: 0.25,
            fadeInDuration: 1000,
            checkPeriod: 100
        }, options);
        /**
         * Calculates the minimum height of each row.
         */
        var minHeight = screen.height * settings.minHeightRatio;
        /**
         * Make all elements flex.
         */
        return this.each(() => {
            this.addClass("flex-gallery-container")
                .css('margin', settings.margin)
                .children("a")  .addClass("flex-gallery-a")
                                .css('margin', settings.margin)
                                .each(function() {
                                    /**
                                     * Checks sizes of every images being loading
                                     * so that we are able to set up the sizes of <a>s in advance.
                                     * Otherwise, the screen will flickers due to the images loaded early or late.
                                     * 
                                     * However, naturalWidth and naturalHeight do not work in IE8 or below
                                     */
                                    var poll = setInterval(() => {
                                        var img = $(this).children()[0];
                                        if (img.naturalWidth) {
                                            clearInterval(poll);
                                            $(this).css({
                                                'width': minHeight * img.naturalWidth / img.naturalHeight, 
                                                'flex-grow': img.naturalWidth / img.naturalHeight
                                            });
                                        }
                                    }, settings.checkPeriod);
                                })
                .children("img").addClass("flex-gallery-img")
                                .css("display", "none")
                                .on('load', function() {
                                    /**
                                     * Let each image invisible first and then fade in an image when it is loaded completely.
                                     */
                                    $(this).fadeIn(settings.fadeInDuration)
                                });
        });
    };
    /**
     * Sets up the needed methods for an flex-gallery-image.
     * @param {Array} imgs - the image list to be displayed
     * @param {Boolean} shuffling - whether to shuffle the image list or not
     * @return {jQuery}
     */
    $.fn.addFlexImages = function(imgs, shuffling=false) {
        /**
         * Clones the image array.
         */
        imgs = imgs.slice();
        return this.each(() => {
            /**
             * Shuffles the images if shuffling is true.
             */
            if(shuffling) { shuffle(imgs); }
            /**
             * Puts images into the #container.
             */
            imgs.forEach((element) => {
                /**
                 * Creates and inserts <a> with <img> in the container.
                 */
                $("#container").append(
                    $("<a>").attr("href", element).append(
                        $("<img>").attr("src", element) //** this image should be a thumbnail
                    )
                );
            });
        });
    };
}) (jQuery);

/**
 * Swaps elements in an array randomly.
 * The contents are reordered directly.
 * @param {Array} array - the array to be shuffled
 * @return {None}
 */
function shuffle(array) {
    for(var i in array) {
        var j = Math.floor(Math.random() * array.length);
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Adds click function on document for debugging.
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

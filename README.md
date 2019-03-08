# Flex Gallery

Demo: https://elvisyjlin.github.io/flex-gallery/examples/demo.html

[![Demo](examples/readme_img_t.png "Demo")](https://elvisyjlin.github.io/flex-gallery/examples/demo.html)

Flex Gallery is a flexible responsive justified image gallery with CSS and jQuery.

A good layout is the key to grab readers' attention. Up to today, 
many people have dedicated to presenting awesome ways to display contents on webpages.
Websites like [Google Photos](https://photos.google.com) or [Pexels](https://www.pexels.com/) 
did a great job on the so-called **justified layout**. 
Yet most of the current implementations are based on calculations in javascripts. 

Thanks to the innovation of 
[flexible box layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout) 
in [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3), 
autolayouting images in a web page became much easier than before.
Moreover, justifying images with pure CSS is no longer difficult.
The Flex Gallery is implemented by mainly CSS and some jQuery code (unavoidable pre-calculating spaces for images), 
utilizing the effectiveness and efficiency of the flexible box layout.

* **Easy to use:** simply include Flex Gallery's js and css files.
* **Easy to load:** either the size of sources or computation time is pretty lightweight.
* **Easy to integrate:** no requirement for server side programming.


## How to use it?

### To Include

Flex Gallery needs _jQuery_ and _Dynamics.js_.
```html
<!-- Include jQuery locally -->
<script type="text/javascript" src="../src/js/jquery-3.2.1.min.js"></script>
<!-- Include jQuery from a CDN -->
<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
<!-- Include Dynamics.js locally -->
<script type="text/javascript" src="../src/js/dynamics.min.js"></script>
```

Then include Flex Gallery's javascript source and css style sheet.
```html
<script type="text/javascript" src="js/flex-gallery.js"></script>
<link rel="stylesheet" type="text/css" href="css/flex-gallery.css">
```

### To Create

Flex Gallery can be built in a `<div>`. An element with an ID is recommended. 
An ID helps access and modify the element later. For example, I created a `<div>` with ID="container" here.
```html
<div id="container"></div>
```

### To Call

Flex Gallery accepts an object, called as *media*, containing a list of images and a list of links.  
Simply set images in a container by `addFlexImages()` and call `flexGallery()` to make it *flex*.
```javascript
$('#container').addFlexImages(media).flexGallery();
```

*media* looks like this. It is an object containing images you want to display and corresponding links.
```javascript
media = {
    images: ['img/image1_t.jpg', 'img/image2_t.jpg', 'img/image3_t.jpg'],
    links: ['img/image1.jpg', 'img/image2.jpg', 'img/image3.jpg']
}
```

If you want the images displayed in a random order, set shuffling to true.
```javascript
$('#container').addFlexImages(media, shuffling=true).flexGallery();
```

### To Customize

You can also construct the container by yourself.
A container is supposed to be structured as shown below.
```html
<div id="container">
    <a href="img/image1.jpg">
        <img src="img/image1_t.jpg">
        <span>description 1</span>
    </a>
    <a href="img/image2.jpg">
        <img src="img/image2_t.jpg">
        <span>description 2</span>
    </a>
    <!-- more images -->
</div>
```

Don't forget calling `flexGallery()` to make the container *flex* at the end.
```javascript
$('#container').flexGallery();
```

Moreover, custom parameters are accepted by `flexGallery()`. It is easy to arrange the layout of Flex Gallery.
```javascript
/* These are default values for flexGallery() */
$('#container').flexGallery({
    margin: '0.5vmin', 
    minHeightRatioWindow: 0.25, 
    fadeInDuration: 1000, 
    checkPeriod: 100
});
```

##### Optional Parameters

Parameter               | Description
:---------------------- | :----------------------
*margin*                | An string in CSS style specifies the width of half margin. E.g. '1vmin' or '2vh'.
*minHeightRatioWindow*  | An float that specifies the min-height ratio of browser window height for each row.
*minHeightRatioScreen*  | An float that specifies the min-height ratio of screen height for each row.
*fadeInDuration*        | An integer that specifies the fade-in time of an images after it is loaded.
*checkPeriod*           | An integer that specifies the period of checking the size of each image.

If neither *minHeightRatioWindow* nor *minHeightRatioScreen* is specified, it will take 0.25 browser windo height in default. 
If both of them are specified, the smaller computed height will be applied to the page.

Note that `margin` can be either absolute (`px`, `em`) or relative (`vw`, `vh`, `vmin`) unit, 
while percentage (`%`) padding or margin in flex element is not supported by some browsers (e.g. Firebox, Edge, ...).


## How it works?

#### Flexible Box Layout

The main idea is to let images grow (or extend) by flexible box layout algorithm.

The elements styled
```css
flex-grow: 1; /* the value is its allocating weight */
```
in a container (such as `<div>`) with
```css
display: flex;
flex-wrap: wrap;
```
will extend their size if there is space left.

So the images in a row can grow to the same height if their `flex-grow` are assigned in proportion to their aspect ratios (width / height).

Other modifications are done to deal with detailed problems.

#### addFlexImages()

`addFlexImages()` iterates through the given array and create `<a>` and `<img>` according to the URLs in it.

#### flexGallery()

`flexGallery()` assigned flex-gallery classes for `<div>`, `<a>`, and `<img>` of a Flex Gallery. 
Also, it configures the style of the gallery with input arguments, 
especially the fade-in effect for postponed displayed. Moreover, 
the image size pre-calculating is also performed in it. To be exact, 
`setTimeInterval()` is used to check the sizes periodically.

#### Why not simply wrap an image in a `<img>`?

An outer element of `<img>`, here we use a `<a>`, helps occupy the space for the image before it is fully loaded.
Without the outer element, the view will flicker during the time it loads images.
And the layout would not be consistent because images come in asynchronously.
Therefore, I choose to set all images invisible first, read sizes, using `naturalWidth` and `naturalHeight`, 
and allocate spaces for images in advance. Each image will be displayed when loading completed.


## Supported Browser

Most popular browsers would support Flex Gallery, such as Chrome, Firefox, Safari, Edge, Opera, and so on.  
However, IE 10 or below does not support the flexible box layout, vmin property, and naturalWidth&naturalHeight image properties.


## TODO

What I am planning to do in the future:  
- [x] To make Flex Gallery responsive when the window is resized.
- [x] To allow Flex Gallery accept thumbnails as well as original images. 
- [ ] To create a customizable min-height for developers to utilize.
- [ ] To implement lazy loading when dealing with a large amount of images.
- [ ] To implement popup box with a caption after a image is clicked.
- [x] To add a description for each flex image.
- [ ] Fly in images with animations beyond fading.


## Reference

This project is inspired from a [blog](https://github.com/xieranmaya/blog/issues/4) by [xieranmaya](https://github.com/xieranmaya), 
discussing about the justified image layout and introducing the implementation of flexible box layout in 
[Google Photos](https://photos.google.com)-like or [500px](https://500px.com/)-like image layout.

All images in the demo are from [Pixabay](https://pixabay.com/), which is a Creative Commons image sharing platform. 
They are purely used for development and demonstration. 
The variety of aspect ratios helped a lot in revising the algorithm to justify images.

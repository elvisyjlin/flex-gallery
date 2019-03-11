# Define paths
in_js="../js/flex-gallery.js"
out_js="../../dist/flex-gallery.js"
min_js="../js/flex-gallery.min.js"
in_css="../css/flex-gallery.css"
out_css="../../dist/flex-gallery.css"
min_css="../../dist/flex-gallery.min.css"
# Build
cp $in_js $out_js
cp $in_css $out_css
curl -X POST -s --data-urlencode 'input@../js/flex-gallery.js' https://javascript-minifier.com/raw > $min_js
curl -X POST -s --data-urlencode 'input@../../dist/flex-gallery.css' https://cssminifier.com/raw > $min_css
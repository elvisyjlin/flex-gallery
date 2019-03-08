#!/usr/bin/python

###
# A tool to generate thumbnails for images in a folder.
# E.g. the thumbnail of `im01.jpg` is named as `im01_t.jpg`
###

import argparse
import os
from glob import glob
from PIL import Image


IMG_EXTS = ['.jpg', '.jpeg', '.png', '.bmp', '.tif', '.tiff']

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--path', type=str, default='.')
    parser.add_argument('--size', type=int, default=512)
    args = parser.parse_args()
    
    for ext in IMG_EXTS:
        for file in glob(os.path.join(args.path, '*'+ext)):
            if file.endswith('_t'+ext):
                continue
            try:
                im = Image.open(file)
                im.thumbnail((args.size,args.size), Image.ANTIALIAS)
                out_file = file.replace(ext, '_t'+ext)
                im.save(out_file)
            except IOError:
                print('Cannot create thumbnail for', file)

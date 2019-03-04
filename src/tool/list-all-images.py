#!/usr/bin/python

###
# A simple tool to generate an array of images in the media folder.
# Coded in Python so you have to install Python first.
###

from os import listdir
from os.path import join

MEDIA_PATH = '../media'
FILE_PATH = '../js/media-list.js'

content = 'media_list = [\'' + '\', \''.join('../src/media/' + path for path in listdir(MEDIA_PATH)) + '\'];\n'
with open(FILE_PATH, 'w') as f:
	f.write(content)

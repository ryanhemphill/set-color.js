# set-color.js

# Description
This tool can accept color expressed in all web formats (rgb, rgba, hex, hsl, hsla) in a variety of formats (array, object, string/css expression) and perform conversions to other formats. 

# Requirements: NONE
Plugin is agnostic, no supporting javascript libraries required.

# Future Release / Update Notes:
Current version does not support conversion of alpha transparency values to non alpha transparencies. Future versions will provide settings to fill in this gap via 2 strategies: 
(a) ignore alpha transparency
(b) compute foreground color with alpha transparency based on a background color.

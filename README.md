# set-color.js

### Description
This tool converts color expressed in all web formats (rgb, rgba, hex, hsl, hsla) in a variety of formats (array, object, string/css expression) and perform conversions to other formats. Performs autodetection of incoming formats. 

### Requirements: 
None. Plugin is agnostic, no supporting javascript libraries required.

### Notes:
1. hsl/hsla values must be strings with % symbol to be autodetected accurately.
2. values with alpha transparency below 100%/1 DO NOT convert to non-alpha transparency formats. (See future release for how this will be addressed)

### Future Release / Update Notes:
Current version does not support conversion of alpha transparency values to non alpha transparencies. Future versions will provide settings to fill in this gap via 2 strategies: 
1. ignore alpha transparency
2. compute foreground color with alpha transparency based on a background color.

Also to come in future releases:
*web-color formatting*
1. accept web-color name (input)
2. closest approximate web-color name (output)


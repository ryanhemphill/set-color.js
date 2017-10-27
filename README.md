# set-color.js

### Description
This tool converts color expressed in all web formats (rgb, rgba, hex, hsl, hsla) in a variety of formats (array, object, string/css expression) and perform conversions to other formats. Performs autodetection of incoming formats. <br>
#### New features: 
1. RGBA > RGB conversion via calculated color based on background color
2. closest approximate web-color name function
3. web-color name-to-hex lookup function

### Requirements: 
None. Plugin is agnostic, no supporting javascript libraries required.

### Notes:
1. hsl/hsla values must be strings with % symbol to be autodetected accurately.
2. values with alpha transparency below 100%/1.0 throw an error (fix by using nonAlpha conversion)

### Future Release / Update Notes:
1. option to ignore alpha channel when faced with alpha transparency conversion conflicts

#### Click here for usage (wiki page)...
https://github.com/ryanhemphill/set-color.js/wiki


// set-color.js

function convertColorFormat(colorData, desiredColorType, desiredDataType) {
  if(!desiredColorType)                                     { desiredColorType  = 'rgba';   }
  if(desiredColorType == 'hex'  || desiredDataType == 'css')    { desiredDataType = 'string'; }
  if(!desiredDataType)                                      { desiredDataType = 'object'; }
  // colorType options = 'hex','rgb','rgba','hsl','hsla'
  // desiredDataType  = 'css'>'string', 'object', 'array'

  var colorData_formatted = {}, colorData_result, colorData_converted; // 
  desiredDataType   = desiredDataType.toLowerCase();
  desiredColorType  = desiredColorType.toLowerCase();

  // convert colorData_result to reflect desiredDataType?
  if(desiredDataType == 'object')   { colorData_result = {}; } // object/array values presented as numbers, not strings, unless hex values
  if(desiredDataType == 'array' )   { colorData_result = []; } 
  if(desiredDataType == 'string')   { colorData_result = ''; }
  
  // define current data format
  var colorData_dataType  = defineDataType(colorData);
  // define current colorType
  var colorData_colorType = defineColorType(colorData, colorData_dataType);
  // based on knowing current colorFormat and dataFormat and the desiredColorType/desiredDataType, get results
  var colorData_converted = reformatColor(colorData, colorData_colorType, colorData_dataType, desiredColorType, desiredDataType);
  
  return colorData_converted;
}


function reformatColor(colorDataArg, currentColorFormat, currentDataType, desiredColorType, desiredDataType) {
  
  switch(desiredDataType) {
    case 'css'      : // 'css' translates as 'string'. css-style formatting will be applied.
    case 'string'   : colorData_desired = ''; desiredDataType = 'string'; break;
    case 'array'    : colorData_desired = [];                               break;
    case 'object'   : colorData_desired = {};                               break;
  }

  // START convert colorDataArg to object format, regardless of source
  if(currentDataType == 'string') {
    if(currentColorFormat == 'hex') {
      colorDataArg = hexToRgb(colorDataArg);
    } 
    else { // if it's a string and not hex, then it's a css > rgb/rgba/hsl/hsla, convert to colorObj
      colorDataArg = parseCssColorVal(colorDataArg);
      currentColorFormat = currentColorFormat.replace('css-', '');
      currentDataType    = 'object';
    }
  }
  else if(currentDataType == 'array') {
    colorDataArg = convertColorArrayToObject(colorDataArg, currentColorFormat);
  }
  colorData_object = colorDataArg; // set colorData_object = colorDataArg as default, update as required.
  // END convert colorDataArg to object format

  // START conversion of colorDataArg to colorData_object (based on desiredColorType param)
  if(currentColorFormat == 'rgb' || currentColorFormat == 'rgba' || currentColorFormat == 'hex') {
    // if(currentColorFormat == 'rgb' && desiredColorType == 'hex') { colorDataArg = rgbToHex(colorDataArg); }
    if(desiredColorType == 'rgb' || desiredColorType   == 'rgba' || desiredColorType   == 'hex') {
      colorData_object = colorDataArg;
      if(desiredColorType == 'rgba') { 
        if(colorDataArg.a >= 1 || (!colorDataArg.a && colorDataArg.a !== 0)) {
          colorData_object.a = 1.0; // normalize alpha channel at value of 1
        }
        else { colorData_object.a = colorDataArg.a; }
      } 
      else if(desiredColorType != 'rgba' && colorDataArg.a < 1) {
        console.log('ERROR > reformatColor() does not support conversion of rgba to non-alpha formats when alpha !>= 1');
        return false;
      } 
      if(desiredColorType == 'hex') {
        // colorData_object = rgbToHex(colorDataArg.r, colorDataArg.g, colorDataArg.b);
        if(currentColorFormat == 'rgb' || (currentColorFormat == 'rgba' && colorDataArg.a == 1)) {
          colorData_object = rgbToHex(colorDataArg.r, colorDataArg.g, colorDataArg.b);
        } else {
          console.log('ERROR > reformatColor() does not support conversion of rgba to hex when alpha != 1');
          return false;
        }
      }
    } 
    else if(desiredColorType == 'hsl' || desiredColorType == 'hsla') {
      if(currentColorFormat == 'hex' || currentColorFormat == 'rgb' || currentColorFormat == 'rgba') {
        colorData_object = rgbToHsl(colorDataArg.r, colorDataArg.g, colorDataArg.b);
        if(desiredColorType == 'hsla') {
          if(currentColorFormat == 'rgba') {
            colorData_object.a = colorDataArg.a;
          } 
        }
        else if(desiredColorType == 'hsl') {
          if(currentColorFormat == 'rgba') {
            if(colorDataArg.a < 1) {
              console.log('ERROR > reformatColor() does not support conversion of rgba to hsl when alpha != 1');
              return false;
            } 
            else { colorData_object.a = 1.0; }  // add alpha channel at value of 1 before converting
          }
        }
      }
    }
  }
  
  else if(currentColorFormat == 'hsl' || currentColorFormat == 'hsla') {
    if(desiredColorType == 'rgb' || desiredColorType == 'rgba' || desiredColorType == 'hex') {
      
      colorData_object = hslToRgb(colorDataArg.h, colorDataArg.s, colorDataArg.l);
      
      if(desiredColorType == 'rgba') {
        if(currentColorFormat == 'hsla') { colorData_object.a = colorDataArg.a; }
        else { colorData_object.a = 1.0; } // add alpha channel at value of 1 before converting
      }
      else if(desiredColorType != 'rgba' && colorDataArg.a < 1) {
        console.log('ERROR > reformatColor() does not support conversion of hsla to hex when alpha != 1');
        return false;
      }
      
      if(desiredColorType == 'hex') {
        if(currentColorFormat == 'hsl' || (currentColorFormat == 'hsla' && colorDataArg.a == 1)) {
          colorData_object = hslToHex(colorDataArg.h, colorDataArg.s, colorDataArg.l);
        } else {
          console.log('ERROR > reformatColor() does not support conversion of hsla to hex when alpha != 1');
          return false;
        }
      }
      
    } 
    else if(desiredColorType == 'hsl' || desiredColorType == 'hsla') {
      colorData_object == colorDataArg;
      colorData_object.h = Number(colorData_object.h);
      colorData_object.s = Number(colorData_object.s);
      colorData_object.l = Number(colorData_object.l);

      if(desiredColorType == 'hsla') {
        if(colorDataArg.a || colorDataArg.a === 0) {
          colorData_object.a = Number(colorDataArg.a);
        } 
        else { colorData_object.a = 1.0; } // add alpha channel at value of 1 before converting
      } 
      else if(desiredColorType == 'hsl' && colorDataArg.a < 1) {
        console.log('ERROR > reformatColor() does not support conversion of hsla to hsl when alpha != 1');
        return false;
      }  
    }
  }
  // END conversion of colorDataArg to colorData_object (based on desiredColorType param)




  // START define colorData_desired from colorData_object result (based on desiredDataType param)
  if(desiredDataType == 'object')     { colorData_desired = colorData_object; }
  else if(desiredDataType == 'array') { // applies only to rgb/rgba/hsl/hsla cases, hex is not supported
    if(desiredColorType != 'hex') {
      colorData_desired = convertColorObjectToArray(colorData_object);
    } 
    else {
      console.log('ERROR > reformatColor() does not support processing hex values as array');
      colorData_desired = false;
    }
  }
  else if(desiredColorType == 'hex' || desiredDataType == 'string') { // css-string will be used to express value
    colorData_desired = constructCssColorVal(colorData_object, desiredColorType);
  }
  // END define colorData_desired from colorData_object result (based on desiredDataType param)



  return colorData_desired;
}


// START tools
function defineDataType(dataArg) {
  if( Array.isArray(dataArg) )       { return 'array';  }
  else if( typeof(dataArg) == 'string' )  { return 'string'; }
  else if( typeof(dataArg) == 'number' )  { return 'number'; }
  else if( typeof(dataArg) == 'object' )  { return 'object'; }
  else { return false; }
}

function defineColorType(colorDataArg, dataType) { 
  // hsl/hlsa is only detected if sat. val is string and includes '%'
  // can only detect difference between rgb and hex by Number vs String dataTypes. Do not present rgb in an object as strings!
  if(!dataType) { dataType = defineDataType(colorDataArg); }
  
  if(dataType == 'array') {
    if(colorDataArg.length == 3) {
      if(defineDataType(colorDataArg[1]) == 'string'      && colorDataArg[1].indexOf('%'))  { return 'hsl'; }
      else if(defineDataType(colorDataArg[0]) == 'string')                                  { return 'hex'; }
      else                                                                                  { return 'rgb'; }
    }
    else if(colorDataArg.length == 4) {
      if(defineDataType(colorDataArg[1]) == 'string' && colorDataArg[1].indexOf('%')) { return 'hsla'; }
      else                                                                            { return 'rgba'; }
    }
    else { return false; }
  } 
  
  else if(dataType == 'object') {
    if(colorDataArg.r || colorDataArg.r === 0) {
      if(colorDataArg.a || colorDataArg.a === 0)          { return 'rgba';  }
      else if(defineDataType(colorDataArg.r) == 'string') { return 'hex';   }
      else                                                { return 'rgb';   }
    }
    else if(colorDataArg.h || colorDataArg.h === 0) {
      if(colorDataArg.a || colorDataArg.a === 0)          { return 'hsla'; }
      else                                                { return 'hsl';  }
    }
  }
  else if(dataType == 'string') {
    // [ TASK : set CSS formatting result ]
    if(colorDataArg.indexOf('rgba(') > -1)       { return 'css-rgba';  } 
    else if(colorDataArg.indexOf('rgb(') > -1)   { return 'css-rgb';   } 
    else if(colorDataArg.indexOf('hsl(') > -1)   { return 'css-hsl';   } 
    else if(colorDataArg.indexOf('hsla(') > -1)  { return 'css-hsla';  }
    else if(colorDataArg.indexOf('#') > -1)      { return 'hex';       }  
  }
  else { return false; }
}



function convertColorArrayToObject(colorArrayArg, colorFormatArg) {
  var colorData_object = {};
  if(colorFormatArg == 'rgb' || colorFormatArg == 'rgba') {
    colorData_object.r = colorArrayArg[0];
    colorData_object.g = colorArrayArg[1];
    colorData_object.b = colorArrayArg[2];
    if(colorArrayArg.length == 4) {
      colorData_object.a = colorArrayArg[3];
    } else if(colorFormatArg == 'rgba') {
      colorData_object.a = 1.0;
    }
  } else if(colorFormatArg == 'hsl' || colorFormatArg == 'hsla') {
    colorData_object.h = colorArrayArg[0];
    colorData_object.s = colorArrayArg[1];
    colorData_object.l = colorArrayArg[2];
    if(colorArrayArg.length == 4) {
      colorData_object.a = colorArrayArg[3];
    } else if(colorFormatArg == 'hsla') {
      colorData_object.a = 1.0;
    }
  } else if(colorFormatArg == 'hex') {
    var hexStringFormat = constructHexString(colorArrayArg);
    colorData_object = hexToRgb(hexStringFormat);
  }
  return colorData_object;
}

function convertColorObjectToArray(colorObjArg) {
  var colorArray = [];
  if(colorObjArg.r || colorObjArg.r === 0) { // rgb/rgba
    colorArray[0] = colorObjArg.r;
    colorArray[1] = colorObjArg.g;
    colorArray[2] = colorObjArg.b;
  } 
  else if(colorObjArg.h || colorObjArg.h === 0) { // hsl/hsla
    colorArray[0] = colorObjArg.h;
    colorArray[1] = colorObjArg.s;
    colorArray[2] = colorObjArg.l;
  }
  if(colorObjArg.a || colorObjArg.a === 0) {
    colorArray[3] = colorObjArg.a;
  }
  return colorArray;
}

function hslToRgb(hueValue, satValue, lumValue) {
  hueValue = Number(hueValue);
  if(hueValue > 1) { hueValue = hueValue/360; }
  satValue = Number(satValue);
  lumValue = Number(lumValue);
  var redValue, greenValue, blueValue;
  if (satValue == 0) { redValue = greenValue = blueValue = lumValue; } // achromatic 
  else {
    function hueToRgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }
    var q = lumValue < 0.5 ? lumValue * (1 + satValue) : lumValue + satValue - lumValue * satValue;
    var p = 2 * lumValue - q;

    redValue    = hueToRgb(p, q, hueValue + 1/3);
    greenValue  = hueToRgb(p, q, hueValue);
    blueValue   = hueToRgb(p, q, hueValue - 1/3);
  }

  // return [ r * 255, g * 255, b * 255 ];
  redValue    = parseInt(redValue    * 255);
  greenValue  = parseInt(greenValue  * 255);
  blueValue   = parseInt(blueValue   * 255);
  return { r: redValue, g: greenValue, b: blueValue };
}

function hslaToRgba(hueValue, satValue, lumValue, alphaValue) {
  var rgba_object = hslToRgb(hueValue, satValue, lumValue);
  rgba_object.a = alphaValue;
  return rgba_object;
}

function rgbToHsl(redValue, greenValue, blueValue) {
  if(redValue   !== 0)  { redValue    = redValue/255;   }
  if(greenValue !== 0)  { greenValue  = greenValue/255; }
  if(blueValue  !== 0)  { blueValue   = blueValue/255;  }
  var max = Math.max(redValue, greenValue, blueValue), min = Math.min(redValue, greenValue, blueValue);
  var hueValue, satValue, lumValue = (max + min) / 2;

  if (max == min) {
    hueValue = satValue = 0; // achromatic
  } else {
    var difference = max - min;
    satValue = lumValue > 0.5 ? difference / (2 - max - min) : difference / (max + min);

    switch (max) {
      case redValue   : hueValue = (greenValue  - blueValue)  / difference + (greenValue < blueValue ? 6 : 0); break;
      case greenValue : hueValue = (blueValue   - redValue)   / difference + 2; break;
      case blueValue  : hueValue = (redValue    - greenValue) / difference + 4; break;
    }
    hueValue = hueValue/6;
  }
  return { h: hueValue, s: satValue, l: lumValue };
}

function rgbaToHsla(redValue, greenValue, blueValue, alphaValue) {
  var hsla_object = rgbaToHsl(redValue, greenValue, blueValue);
  hsla_object.a = alphaValue;
  return hsla_object;
}

function hexToRgb(hexValue) {
  if (hexValue.lastIndexOf('#') > -1) { hexValue = hexValue.replace(/#/, '0x'); } 
  else { hexValue = '0x' + hexValue; }
  var redValue = hexValue >> 16;
  var greenValue = (hexValue & 0x00FF00) >> 8;
  var blueValue = hexValue & 0x0000FF;
  return {r:redValue, g:greenValue, b:blueValue};
}

function hexToHsl(hexValue) {
  var rgb_object = hexToRgb(hexValue);
  var hsl_object = rgbToHsl(rgb_object.r, rgb_object.g, rgb_object.b );
  return hsla_object;
}

function rgbToHex(redValue, greenValue, blueValue) { // exception: returns string, not object
  redValue = Number(redValue);
  greenValue = Number(greenValue);
  blueValue = Number(blueValue);
  function componentToHex(colorValueArg) {
    var hex = colorValueArg.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  return ("" + componentToHex(redValue) + componentToHex(greenValue) + componentToHex(blueValue)).toUpperCase();
}

function hslToHex(hueValue, satValue, lumValue) { // exception: returns string, not object
  var rgb_object = hslToRgb(hueValue, satValue, lumValue);
  var hexString = rgbToHex(rgb_object.r, rgb_object.g, rgb_object.b);
  return hexString;
}

function constructHexString(hexData) {
  var hexRedValue, hexGreenValue, hexBlueValue;
  if(defineDataType(hexData) == 'array') {
    hexRedValue   = hexData[0];
    hexGreenValue = hexData[1];
    hexBlueValue  = hexData[2];
  } else { // is object
    hexRedValue   = hexData.r;
    hexGreenValue = hexData.g;
    hexBlueValue  = hexData.b;
  }
  return '#' + hexRedValue + hexGreenValue + hexBlueValue;
}

function normalizeCssColorVal() {
  // regEx cleanup tasks, spaces
}

function normalizeColorObject(colorDataArg, colorTypeArg) {
  // rgb values
  if(colorDataArg.r > 255)                  { colorDataArg.r = 255; }
  if(colorDataArg.r < 0)                    { colorDataArg.r = 0;   }
  if(colorDataArg.g > 255)                  { colorDataArg.g = 255; }
  if(colorDataArg.g < 0)                    { colorDataArg.g = 0;   }
  if(colorDataArg.b > 255)                  { colorDataArg.b = 255; }
  if(colorDataArg.b < 0)                    { colorDataArg.b = 0;   }
  // hsl values
  if(colorDataArg.h > 360)                  { colorDataArg.h = colorDataArg.h-360; }
  if(colorDataArg.h < 0)                    { colorDataArg.h = 360-colorDataArg.h; }
  if(colorDataArg.s > 1)                    { colorDataArg.s = 1;   }
  if(colorDataArg.s < 0)                    { colorDataArg.s = 0;   }
  if(colorDataArg.l > 1)                    { colorDataArg.l = 1;   }
  if(colorDataArg.l < 0)                    { colorDataArg.l = 0;   }
  // alpha values
  if(colorDataArg.a > 1)                    { colorDataArg.a = 1.0  }
  if(colorDataArg.a < 0)                    { colorDataArg.a = 0.0  }
  
}

function parseCssColorVal(cssColorValue) { // returns color object
  var colorSansWrapper, colorArray, colorObject = {};
  // rgb/rgba parse
  if(cssColorValue.indexOf('rgb') > -1) {
    colorSansWrapper = cssColorValue.replace('rgb(', '').replace('rgba(', '').replace(')', '');
    colorArray = colorSansWrapper.split(',');
    // [ TASK : convert to number/integers, strings are no good ]
    colorObject.r = colorArray[0];
    colorObject.g = colorArray[1];
    colorObject.b = colorArray[2];
    if(colorArray.length == 4) {
      colorObject.a = Number(colorArray[3]).toFixed(2);
    }
  }
  
  // hsl/hsla parse
  else if(cssColorValue.indexOf('hsl') > -1) {
    colorSansWrapper = cssColorValue.replace('hsl(', '').replace('hsla(', '').replace(')', '').replace(/%/gi, '');
    colorArray = colorSansWrapper.split(',');
    // [ TASK : convert to hue val to integer, alpha to decimal number (do not leave as string) ]
    colorObject.h = Number(colorArray[0]/1).toFixed(0);
    colorObject.s = Number(colorArray[1]/100).toFixed(3);
    colorObject.l = Number(colorArray[2]/100).toFixed(3);
    if(colorArray.length == 4) {
      colorObject.a = Number(colorArray[3]/1).toFixed(2);
    }
  }

  // hex parse
  else if(cssColorValue.indexOf('#') > -1) {
    colorSansWrapper = cssColorValue.replace('#', '');
    colorObject = hexToRgb(colorSansWrapper);
  }
  else { 
    console.log('ERROR > parseCssColorVal() unable to parse value: ' + cssColorValue);
    return false
  }
  return colorObject;  
}

function constructCssColorVal(colorDataArg, colorTypeArg) { // only accepts objects
  var cssString = '';
  // rgb / rgba
  if(colorTypeArg == 'rgb' || colorTypeArg == 'rgba') {
    cssString = colorTypeArg + '(' + colorDataArg.r + ',' + colorDataArg.g + ',' + colorDataArg.b;
    if(colorTypeArg == 'rgba') {
      cssString = cssString + ',' + colorDataArg.a;
    }
    cssString = cssString + ')';
  }
  // hsl / hsla
  else if(colorTypeArg == 'hsl' || colorTypeArg == 'hsla') {
    if(colorDataArg.h > 1) { colorDataArg.h = colorDataArg.h/360; } // normalize
    cssString = colorTypeArg + '(' + Number(colorDataArg.h * 360).toFixed(0) + ',' + Number(colorDataArg.s * 100).toFixed(1) + '%,' + Number(colorDataArg.l * 100).toFixed(1) + '%';
    if(colorTypeArg == 'hsla') {
      if(colorDataArg.a || colorDataArg.a === 0) {
        cssString = cssString + ',' + Number(colorDataArg.a).toFixed(2);
      } 
      else {
        cssString = cssString + ',' + 1.0;
      }
      
    }
    cssString = cssString + ')';
  }
  // hex
  else if(colorTypeArg == 'hex') {
    if(defineDataType(colorDataArg) == 'string') {
      cssString = colorDataArg;
    }
    if(defineDataType(colorDataArg) == 'object') {
      cssString = colorDataArg.r + colorDataArg.g + colorDataArg.b;
    } 
    else if(defineDataType(colorDataArg) == 'array') {
      cssString = colorDataArg[0] + colorDataArg[1] + colorDataArg[2];
    }
    cssString = '#' + cssString;
  }
  return cssString;
}

// END tools
exports.formatHex = function formatHex(hex, hashSymbol = false) {
    if (hex[0] === "#") hex = hex.slice(1);
    if (hex.length === 3) {
        // Expand hex shorthand.
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    return hashSymbol ? "#" + hex : hex;
}

exports.formatRGB = function formatRGB(rgb, resolution = 0) {
    // Format a float-format RGB object as a displayable string.

    var str = "";

    str += (rgb.r * 256).toFixed(resolution || 0);
    str += ", ";
    str += (rgb.g * 256).toFixed(resolution || 0);
    str += ", ";
    str += (rgb.b * 256).toFixed(resolution || 0);

    return str;
}

exports.formatHSL = function formatHSL(hsl, resolution = 0, degreesSymbol = false, percentSymbol = true) {
    // Format a float-format HSL object as a displayable string.

    var str = "";

    str += (hsl.h * 360).toFixed(resolution || 0);
    if (degreesSymbol) str += "°";
    str += ", ";
    str += (hsl.s * 100).toFixed(resolution || 0);
    if (percentSymbol) str += "%";
    str += ", ";
    str += (hsl.l * 100).toFixed(resolution || 0);
    if (percentSymbol) str += "%";

    return str;
}

exports.isLightHex = function isLightHex(hex) {
    return parseInt(exports.formatHex(hex), 16) > parseInt("757575", 16);
}

/*
    These are a couple of modified Stack Overflow answers.
    TinyColor is still 30KB, and my goal is to make this app
    as absolutely tiny as possible.
*/

exports.rgbToHSL = function rgbToHSL(color) {
    var { r, g, b } = color;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);

    var h;
    var s;
    var l = (max + min) / 2;

    if (max == min) {
        h = s = 0;
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    console.log(h, s, l)

    return { h, s, l }
}

exports.hslToRGB = function hslToRGB(color) {
    var { h, s, l } = color;

    var r;
    var g;
    var b;

    if (s == 0) {
        r = g = b = l;
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r, g, b };
}

// With a way to transform between HSL and RGB, I just need a way
// to convert between hex and RGB and I have everything I need.

function decToHexString(number) {
    if (number < 0) {
        number = 0xFFFFFFFF + number + 1;
    }

    console.log(number);

    return Math.round(number).toString(16);
}

function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
}

exports.hexToRGB = function hexToRGB(hex) {
    hex = exports.formatHex(hex);

    console.log(hex);

    return {
        r: parseInt(hex.slice(0, 2), 16) / 256,
        g: parseInt(hex.slice(2, 4), 16) / 256,
        b: parseInt(hex.slice(4, 6), 16) / 256
    }
}

exports.rgbToHex = function rgbToHex(color) {
    console.log(color);

    var r = pad2(decToHexString(color.r * 256));
    var g = pad2(decToHexString(color.g * 256));
    var b = pad2(decToHexString(color.b * 256));

    if (r === "100") r = "FF";
    if (g === "100") g = "FF";
    if (b === "100") b = "FF";

    console.log(r, g, b);

    return "#" + r + g + b;
}
var sanitizer = require('cloud/sanitizer');

var escapeJs = function (text) {
    return sanitizer.sanitize(text, null, function (attr) {
        return attr;
    });
};

exports.escapeJs = escapeJs;
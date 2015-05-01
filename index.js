var alparser = require("accept-language-parser");

exports.register = function (plugin, options, next) {

    plugin.ext('onPreHandler', function(request, reply){
      request.pre = request.pre || {};
      request.pre.language = alparser.parse(request.raw.req.headers["accept-language"] || "");
      return reply.continue();
    });

    plugin.log(["accept-language"], "registered accept-language plugin");
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

var host = require('./host');

module.exports = {
    extract: function () {
        var links = [],
            elems = document.querySelectorAll('a');
        for (var x = 0, max = elems.length; x < max; x++) {
            var elem = elems[x];
            if (elem.getAttribute('href')) {
                var href = elem.getAttribute('href');
                links.push(href);
            }
        }
        return links;
    },
    filter: function (links) {
        var temp = [];
        for (var x = 0, max = links.length; x < max; x++) {
            var href = links[x];
            if (href.indexOf('?') !== -1) {
                href = href.substring(0, href.indexOf('?'));
            }
            if (href.indexOf('#') !== -1) {
                href = href.substring(0, href.indexOf('#'));
            }
            if (href && href[0] === '/' && temp.indexOf(href) === -1 && host.links.visited.indexOf(href) === -1 && host.links.cache.indexOf(href) === -1 && host.links.products.indexOf(href) === -1) {
                var productID = href.substring(href.lastIndexOf('/') + 1);
                if (parseInt(productID) > 0) {
                    host.links.products.push(href);
                } else {
                    temp.push(href);
                }
            }
        }
        return temp;
    },
    cache: function(links) {
        host.links.cache = host.links.cache.concat(this.filter(links));
    }
}
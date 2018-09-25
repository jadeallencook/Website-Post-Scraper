var host = require('./host'),
    fs = require('fs'),
    config = require('../config');

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
        var selected = config.selected,
            array = [];
        for (var x = 0, max = links.length; x < max; x++) {
            var link = links[x];
            link = (link.indexOf('?') !== -1) ? link.substring(0, link.indexOf('?')) : link;
            link = (link.indexOf('#') !== -1) ? link.substring(0, link.indexOf('#')) : link;
            link = (link.indexOf(host.url) !== -1) ? link.replace(host.url, '') : link;
            link = (link.indexOf('..') !== -1) ? link.replace('..', '') : link;
            link = (link[0] !== '/') ? '/' + link : link;
            if (
                link &&
                array.indexOf(link) === -1 &&
                host.links.visited.indexOf(link) === -1 &&
                host.links.cache.indexOf(link) === -1 &&
                host.links.products.indexOf(link) === -1 &&
                link.indexOf('http') === -1 &&
                link.indexOf(':') === -1
            ) {
                var saveable = false;
                if (selected.location === 'end') {
                    var dir = link.substring(link.lastIndexOf('/') + 1);
                    saveable = (selected.value === 'number') ? (parseInt(dir) > 0) : (dir !== selected.value);
                } else if (selected.location === 'contains') {
                    saveable = (link.indexOf(selected.value) !== -1);
                }
                if (saveable) {
                    host.links.products.push(link);
                }
                array.push(link);
            }
        }
        return array;
    },
    cache: function (links) {
        host.links.cache = host.links.cache.concat(this.filter(links));
    },
    import: function () {
        var path = './exports/' + host.name() + '.json';
        if (!fs.exists(path) || config.dev) {
            fs.write(path, JSON.stringify({
                visited: [],
                cache: [],
                products: []
            }), 'w');
        }
        host.links = require('.' + path);
    }
}
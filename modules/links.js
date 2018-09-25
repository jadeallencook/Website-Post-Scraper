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
            temp = [];
        for (var x = 0, max = links.length; x < max; x++) {
            var link = links[x];
            if (link.indexOf('?') !== -1) {
                link = link.substring(0, link.indexOf('?'));
            }
            if (link.indexOf('#') !== -1) {
                link = link.substring(0, link.indexOf('#'));
            }
            if (link.indexOf(host.url) !== -1) {
                link = link.replace(host.url, '');
            }
            if (link.indexOf('..') !== -1) {
                link = link.replace('..', '');
            }
            if (link[0] !== '/') {
                link = link = '/' + link;
            }
            var test = (
                temp.indexOf(link) === -1 &&
                host.links.visited.indexOf(link) === -1 &&
                host.links.cache.indexOf(link) === -1 &&
                host.links.products.indexOf(link) === -1 && 
                link.indexOf('http') === -1 &&
                link.indexOf(':') === -1
            );
            if (test && link) {
                if (selected.location === 'end') {
                    var id = link.substring(link.lastIndexOf('/') + 1);
                    if (selected.value === 'number') {
                        test = (parseInt(id) !== 0);
                    } else {
                        test = (id !== selected.value);
                    }
                } else if (selected.location === 'contains') {
                    test = (link.indexOf(selected.value) !== -1);
                }
                if (test) {
                    host.links.products.push(link);
                } else {
                    temp.push(link);
                }
            }
        }
        return temp;
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
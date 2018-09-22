/*
    Coast Stores Item Scraper 2018
    Developed by Jade Allen Cook 
    Written in ES5 & CasperJS
*/

(function () {

    var casper = require('casper').create(),
        fs = require('fs'),
        config = require('./config.json'),
        host = {
            url: config.host.url,
            links: {
                visited: [],
                cache: [],
                products: [],
                queued: 0
            }
        }

    function write() {
        var json = {
            visited: host.links.visited,
            cache: host.links.cache,
            products: host.links.products
        }
        json = JSON.stringify(json);
        fs.write(outputPath, json, 'w');
        console.log(filter.domain(host.url) + ': \x1b[32msaved json\x1b[0m (exports/' + filter.domain(host.url) + '.json)');
    }

    var scrape = {
        links: function () {
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
        }
    }

    var filter = {
        links: function (links) {
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
        domain: function (url) {
            url = url.replace('https://www.', '');
            url = url.replace('.com', '');
            return url;
        }
    }

    // import any data we have from site
    var outputPath = './exports/' + filter.domain(host.url) + '.json';
    if (!fs.exists(outputPath)) {
        fs.write(outputPath, JSON.stringify({}), 'w');
    }
    var output = require(outputPath);
    fs.write('./exports/' + filter.domain(host.url) + '-backup.json', JSON.stringify(output), 'w');
    if (output.visited) {
        host.links.visited = output.visited;
    }
    if (output.cache) {
        host.links.cache = output.cache;
    }
    if (output.products) {
        host.links.products = output.products;
    }

    console.log(filter.domain(host.url) + ': starting up \x1b[36m(vroom vroom)\x1b[0m...');
    casper.start(host.url).then(function () {

        console.log(filter.domain(host.url) + ': \x1b[32msuccessfully connected!\x1b[0m\n');
        var links = this.evaluate(scrape.links);
        host.links.cache = host.links.cache.concat(filter.links(links));

        function gatherLinks(link) {
            var href = link;
            link = host.url + href;
            casper.thenOpen(link, function () {
                links = this.evaluate(scrape.links);
                host.links.cache = host.links.cache.concat(filter.links(links));
                host.links.visited.push(href);
                host.links.cache.splice(host.links.cache.indexOf(href), 1);
                console.log(filter.domain(host.url) + ': ' + link);
                console.log(filter.domain(host.url) + ': \x1b[36m' + host.links.products.length + '\x1b[0m product pages saved');
            }).then(function () {
                host.links.queued = host.links.cache.length;
                write();
                console.log(filter.domain(host.url) + ': \x1b[33m' + host.links.cache.length + ' links left\x1b[0m\n');
                if (host.links.queued === 0) {
                    console.log(filter.domain(host.url) + ': could not find any more links, complete!\n');
                    if (host.links.cache.length > 0) {
                        scrapeCachedLinks();
                    }
                }
            });
        }

        function scrapeCachedLinks() {
            if (host.links.cache.length === 0) {
                console.log(filter.domain(host.url) + ': looks like everything is \x1b[32mcomplete!\x1b[0m\n');
            }
            for (var x = 0, max = host.links.cache.length; x < max; x++) {
                gatherLinks(host.links.cache[x]);
            }
        }
        scrapeCachedLinks();
    });

    // init 
    casper.run();
})();
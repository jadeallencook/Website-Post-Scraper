/*
    Coast Stores Item Scraper 2018
    Developed by Jade Allen Cook 
    Written in ES5 & CasperJS
*/

(function () {

    // dependencies
    var casper = require('casper').create(),
        fs = require('fs');

    // modules
    var backup = require('./modules/backup'),
        sync = require('./modules/sync'),
        links = require('./modules/links');

    // config
    var config = require('./config.json'),
        host = require('./modules/host');
    host.url = config.host.url;

    function write() {
        backup.now({
            visited: host.links.visited,
            cache: host.links.cache,
            products: host.links.products
        });
    }

    var filter = {
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
    if (output.visited) {
        host.links.visited = output.visited;
    }
    if (output.cache) {
        host.links.cache = output.cache;
    }
    if (output.products) {
        host.links.products = output.products;
    }

    // other config
    var print = require('./modules/print');
    print.prefix = filter.domain(host.url);
    backup.filename = filter.domain(host.url);

    casper.start(host.url).then(function () {

        print.message('successfully connected\n', 'successfully', 'green');
        links.cache(this.evaluate(links.extract));

        function gatherLinks(link) {
            var href = link;
            link = host.url + href;
            casper.thenOpen(link, function () {
                links.cache(this.evaluate(links.extract));
                host.links.visited.push(href);
                host.links.cache.splice(host.links.cache.indexOf(href), 1);
                print.message(link);
                print.message(host.links.products.length + ' pages saved', host.links.products.length, 'green');
            }).then(function () {
                host.links.queued = host.links.cache.length;
                write();
                print.message(host.links.cache.length + ' links left \n', host.links.cache.length, 'yellow');
                if (host.links.queued === 0) {
                    print.message('could not find any more links, complete!\n');
                    if (host.links.cache.length > 0) {
                        scrapeCachedLinks();
                    }
                }
            });
        }

        function scrapeCachedLinks() {
            for (var x = 0, max = host.links.cache.length; x < max; x++) {
                gatherLinks(host.links.cache[x]);
            }
        }
        if (host.links.cache.length === 0) {
            print.message('no more links found\n', 'no more links found', 'yellow');
        } else {
            backup.now();
            scrapeCachedLinks();
        }
    });

    // init 
    casper.run();
})();
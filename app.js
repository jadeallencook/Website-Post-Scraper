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
        links = require('./modules/links'),
        print = require('./modules/print'),
        host = require('./modules/host');

    // config
    var config = require('./config.json');
    host.url = config.host.url;
    print.prefix = host.name();
    backup.filename = host.name();
    links.import();

    // init
    casper.start(host.url).then(function () {
        print.message('successfully connected\n', 'successfully', 'green');
        links.cache(this.evaluate(links.extract));
        if (host.links.cache.length === 0) {
            print.message('no more links found\n', 'no more links found', 'yellow');
        } else {
            backup.now();
            for (var x = 0, max = host.links.cache.length; x < max; x++) {
                var link = host.links.cache[x];
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
                    backup.now(host.links);
                    print.message(host.links.cache.length + ' links left \n', host.links.cache.length, 'yellow');
                    if (host.links.queued === 0) {
                        print.message('could not find any more links, complete!\n');
                        if (host.links.cache.length > 0) {
                            scrapeCachedLinks();
                        }
                    }
                });
            }
        }
    }).run();
})();
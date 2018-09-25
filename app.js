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

    function scrape() {
        const href = host.links.cache[0],
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
            if (host.links.queued > 0) {
                print.message(host.links.queued + ' links left \n', host.links.cache.length, 'yellow');
                scrape();
            } else {
                print.message('\ncould not find any more links, complete!\n');
            }
        });
    }

    // init
    print.message('loading...\n', 'loading', 'yellow');
    casper.start(host.url).then(function () {
        print.message('successfully connected\n', 'successfully', 'green');
        links.cache(this.evaluate(links.extract));
        if (host.links.cache.length === 0) {
            print.message('no more links found\n', 'no more links found', 'yellow');
        } else {
            backup.now();
            scrape();
        }
    }).run();
})();
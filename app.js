/*
    web post scraper 2018
    developed by @jadeallencook
    written with casperjs
*/

(function () {

    // dependencies
    var casper = require('casper').create();

    // modules
    var backup = require('./modules/backup'),
        links = require('./modules/links'),
        print = require('./modules/print'),
        host = require('./modules/host'),
        scrape = require('./modules/scrape');

    // config
    var config = require('./config.json');
    host.url = config.host.url;
    print.prefix = host.name();
    backup.filename = host.name();
    links.import();

    // init
    print.message('pinging server', 'pinging', 'yellow');
    casper.start(host.url).then(function () {
        print.message('successfully connected', 'successfully', 'green');
        links.cache(this.evaluate(links.extract));
        if (host.links.cache.length === 0) {
            print.message('no more links found\n', 'no more links found', 'yellow');
        } else {
            backup.now();
            scrape.links(casper);
        }
    }).run();
})();
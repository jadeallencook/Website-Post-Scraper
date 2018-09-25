const host = require('./host'),
    links = require('./links'),
    backup = require('./backup'),
    print = require('./print');

module.exports = {
    links: function (casper) {
        const href = host.links.cache[0],
            link = host.url + href;
        host.links.cache.splice(0, 1);
        host.links.queued = host.links.cache.length;
        casper.thenOpen(link, function () {
            links.cache(this.evaluate(links.extract));
            host.links.visited.push(href);
            print.message(link);
            print.message(host.links.products.length + ' pages saved', host.links.products.length, 'green');
        }).then(function () {
            backup.now(host.links);
            if (host.links.queued > 0) {
                this.links(casper);
                print.message(host.links.queued + ' links left \n', host.links.cache.length, 'yellow');
            } else {
                host.links.queued = null;
                print.message('complete\n', 'complete', 'green');
            }
        }.bind(this));
    }
}
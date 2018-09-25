const host = require('./host'),
    links = require('./links'),
    backup = require('./backup'),
    time = require('./time'),
    print = require('./print');

module.exports = {
    links: function (casper) {
        const href = host.links.cache[0],
            link = host.url + href;
        host.links.cache.splice(0, 1);
        var start = Date.now();
        casper.thenOpen(link, function () {
            host.links.visited.push(href);
            links.cache(this.evaluate(links.extract));
            host.links.queued = host.links.cache.length;
            print.message(href);
            print.message(host.links.products.length + ' link(s) saved', host.links.products.length, 'green');
        }).then(function () {
            backup.now(host.links);
            if (host.links.queued > 0) {
                this.links(casper);
                var end = Date.now(),
                    average = time.duration(start, end);
                time.times.push(average);
                average = time.average();
                print.message((host.links.cache.length + 1) + ' link(s) left', (host.links.cache.length + 1), 'yellow');
                print.message('~' + average + ' minutes(s) \n', '~' + average, 'blue');
            } else {
                host.links.queued = null;
                print.message('complete\n', 'complete', 'green');
            }
        }.bind(this));
    }
}
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
        host.links.queued = host.links.cache.length;
        var start = Date.now();
        casper.thenOpen(link, function () {
            links.cache(this.evaluate(links.extract));
            host.links.visited.push(href);
            print.message(href);
            print.message(host.links.products.length + ' links saved', host.links.products.length, 'green');
        }).then(function () {
            backup.now(host.links);
            if (host.links.queued > 0) {
                this.links(casper);
                var end = Date.now(),
                    average = time.duration(start, end);
                time.times.push(average);
                average = time.average();
                print.message(host.links.queued + ' links left', host.links.cache.length, 'yellow');
                print.message('~' + average + ' min(s) \n', '~' + average, 'blue');
            } else {
                host.links.queued = null;
                print.message('complete\n', 'complete', 'green');
            }
        }.bind(this));
    }
}
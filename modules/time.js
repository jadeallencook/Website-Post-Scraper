var host = require('./host');

module.exports = {
    duration: function (start, end) {
        return end - start;
    },
    average: function () {
        var minutes = this.times.reduce(function (a, b) {
            return a + b;
        }, 0)
        minutes = minutes / this.times.length;
        minutes = host.links.queued * minutes;
        minutes = minutes / 1000;
        minutes = Math.ceil(minutes / 60);
        return minutes;
    },
    times: []
}
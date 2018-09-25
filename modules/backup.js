var fs = require('fs'),
    print = require('./print');

module.exports = {
    timestamp: null,
    location: 'exports/',
    filename: 'data',
    extension: 'json',
    now: function (obj) {
        var filename = this.filename + '.' + this.extension,
            path = this.location + filename;
        if (!obj && !this.timestamp) {
            this.timestamp = Date.now();
            var backup = this.location + 'backups/' + filename,
                source = require('../' + path);
            if (source) {
                fs.write(backup, JSON.stringify(source), 'w');
                print.message('backed up previous data\n', 'backed up', 'blue');
            }
        } else {
            obj = JSON.stringify(obj);
            fs.write(path, obj, 'w');
            print.message('JSON updated', 'JSON', 'blue');
        }
    }
}
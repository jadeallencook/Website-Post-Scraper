var fs = require('fs'),
    print = require('./print');

module.exports = {
    timestamp: null,
    location: 'exports/',
    filename: 'data',
    extension: 'json',
    now: function (obj) {
        var filename = this.filename;
        filename += '.' + this.extension;
        var path = this.location;
        path += filename;
        if (!obj && !this.timestamp) {
            this.timestamp = Date.now();
            var backup = this.location;
            backup += 'backups/';
            backup += filename;
            var source = require('../' + path);
            if (source) {
                fs.write(backup, JSON.stringify(source), 'w');
                print.message('previous data backed up\n', 'backed up', 'blue');
            }
        } else {
            obj = JSON.stringify(obj);
            fs.write(path, obj, 'w');
            print.message('new data written to json', 'written', 'blue');
        }
    }
}
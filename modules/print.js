module.exports = {
    prefix: 'n/a',
    message: function (string, select, color) {
        if (color) {
            if (color === 'green') {
                color = '\x1b[32m';
            } else if (color === 'blue') {
                color = '\x1b[36m'
            } else if (color === 'yellow') {
                color = '\x1b[33m'
            }
        } else {
            color = '\x1b[31m'
        }
        if (string.indexOf(select) !== -1) {
            string = string.replace(select, (color + select + '\x1b[0m'))
        }
        console.log(this.prefix + ': ' + string);
    }
}
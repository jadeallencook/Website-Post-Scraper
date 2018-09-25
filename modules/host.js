module.exports = {
    url: null,
    name: function() {
        var url = this.url;
        url = url.replace('https://www.', '');
        url = url.replace('.com', '');
        return url;
    },
    links: {
        visited: [],
        cache: [],
        products: [],
        queued: 0
    }
}
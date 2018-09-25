module.exports = {
    url: null,
    name: function() {
        var url = this.url;
        url = url.replace('https://', '');
        url = url.replace('http://', '');
        url = url.replace('www.', '');
        url = url.replace('.com', '');
        url = url.replace('.net', '');
        url = url.replace('.org', '');
        return url;
    },
    links: {
        visited: [],
        cache: [],
        products: [],
        queued: 0
    }
}
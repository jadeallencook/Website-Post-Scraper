# Website Post Scraper

Backup blogs, products, and more with this easy to use website scraper!

## Getting Started

To get started, all you need to do is configure your settings (config.json)!

```js
// https://www.store.com/products/item/123456
{
    "host": {
        "url": "https://www.store.com"
    },
    "selected": {
        "location": "end",
        "value": "number"
    }
}
```

The "selected" object relies on two parameters:

- Location (end/contains): Location of value in url
- Value (number/string): Unique value in url 

Here's a couple examples of how you would configure for a url with no numbers:

```js
// https://www.store.com/products/item/my-item
{
    "location": "contains",
    "value": "/products/item/"
}

// https://www.store.com/products/123123123/item
{
    "location": "end",
    "value": "/item"
}
```
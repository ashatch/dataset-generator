# mongodb-datasets

[![build status](https://secure.travis-ci.org/imlucas/mongodb-datasets.png)](http://travis-ci.org/imlucas/mongodb-datasets)

What's a database without any data? With mongodb-datasets you never worry about
how to populate your MongoDB database with the data as you wish. Unlike a simple
populator, mongodb-datasets is designed to offer you the maximum control of the
data to be in your database.

## A Simple Example

```javascript
var datasets = require('mongodb-datasets');
var opts = {
  host: 'localhost',
  port: '27017',
  db: 'company',
  collection: 'employee',
  size: 50,
  schema: {
    _id: '{{counter()}}',
    name: '{{chance.name()}}',
    phones: [ 3, '{{chance.phone()}}' ],
    title: 'Software {{util.sample(["Engineer", "Programmer"])}}'
  }
};

datasets.populate(opts, function () {
  console.log('This will be called when populating is complete.');
});
```

## Usage

### Options

* `uri` - the URI of the target MongoDB database. Alternatively, you can
  specify each components respectively: `host`, `port`, `db`
* `collection` - the collection to store the sample data
* `size` - the number of documents to be populated
* `schema` - a Javascript object representing the template schema of your data.
* Or `schemaPath` - if you want to define your schema in a `.json` file

If any required option is missing, the default will be used.
```js
uri: 'mongodb://localhost:27017/test/',
collection: 'dataset',
size: 100,
schemaPath: './me_in_a_nutshell.json'
```

### Command line

You can also invoke mongodb-datasets in cli

    $ mongodb-datasets --schemaPath=./schema.json --size=100 --collection=temp --uri=mongodb://localhost:27017/test

### Building your schema

The schema is a JSON or Javascript object which is used as the template of every
single document to be inserted into MongoDB database. The following content in
this section discusses how to specify the value of each name/value pair of the
object.

#### Basics

The value can be any primitive data types, such as boolean, number, array, and
object. When the value is a string, it can be used to evaluate Javascript
expressions. All string segments intended to be treated as expressions must be
surrounded by `{{ <expr> }}`. A mix of regular string and expressions are
allowed, whereas a mix of different types is not. Some examples:
* `{ "boolean": true }`
* `{ "brackets_parade": [ { 1: { 2: [ { 3: 3 } ] } } ] }`
* `{ "mix": "1 + 1 = {{ 1+1 }}" }`

#### Random data

This project uses [chance.js](http://chancejs.com/) and
[faker.js](https://github.com/FotoVerite/Faker.js) as the internal random data
generator. To invoke them, simply do, for instance:
* `{ "use_chance": "{{ chance.name({ gender: 'female' }) }}" }`
* `{ "use_faker": "{{ faker.Company.catchPhrase() }}" }`

#### Type conversion

Maybe you've already noticed. It's not very useful to generate a string from
`"{{chance.year()}}"` which is expected to apply commands such as `$gte`.
Since its MongoDB-specific nature, the package currently supports common bson
types as in [bson](https://github.com/mongodb/js-bson) module, such as Double,
Timestamp, Date, and ObjectID. Note that once conversion is triggered, the
target object will be the only produced content. Some examples:
* `{ "date": "{{ Date(chance.date()) }}" }` becomes `ISODate(...)` in MongoDB
* `{ "two": "{{ Double(1) + Double(1) }}" }` produces `{ "two": 1 }`

#### Document-level scope

You can make use of `this` keyword in expressions to get access to values of
other name/value pairs. But its behavior is different from the default `this`
in a Javascript object in the sense that all properties must correspond to
a name/value pair. Using values not yet generated is also supported, and the
invoked values will not be generated more than once per inserted document.
* `{ "one": 1, "two: "{{ Double(this.one + 1) }}" }`
* `{ "first_name": "{{ this.name.first }}",
     "name": { "first": "{{ chance.first() }}" } }` produces consistent result.
* `{ "echo": {{ Object.keys(this) }} }` returns `{ "echo": [ "echo" ] }`

#### Utility methods

#### Imperfections

1. underscore
2. _state
3. no legality check

## Purpose of this project

With the explosion of data volume and availability, users are
transitioning their focus to analysis and data-mining on these vast
datasets. We believe MongoDB is ideally positioned to provide the
backbone to meet these market needs. While several users have already
begun to exploit this, it requires substantial sunk costs including
mapping the aggregation framework to their current mental model,
designing efficient schemas, and acquiring datasets for prototyping.
Work to humanize the aggregation framework is already underway. We
believe supplying users with example schemas for common use cases,
such as user activity streams, time series data, and entity management,
and more importantly, corresponding datasets for prototyping will
establish MongoDB as a leader in this emerging market.

## License

MIT

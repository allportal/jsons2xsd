# jsons2xsd

JSON-Schema to XML schema converter written in JavaScript

## Usage

After installation require / import the module and use it like this:
```js
// import module
const XsdGenerator = require('jsons2xsd');

// do whatever needed to get your schema as either a string or a JSON object
const jsonSchema = getJsonSchema();

// create Generator instance 
const Generator = new XsdGenerator(jsonSchema);

// get a pretty formatted XSD based on the schema
const xsdString = Generator.convert().xmlString;
```

## Not yet implemented

There is a bunch of features which are currently not implemented. Here is a list:
- References (`$ref` property in JSON-Schema)
- Arrays on root level
- Different JSON-Schema Draft versions
- Custom XSD Namespacing (namespace is set to http://www.w3.org/2001/XMLSchema)
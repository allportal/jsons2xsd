const JsonNode = require('./JsonSchemaMapper/JsonNode');
const XmlNode = require('./JsonSchemaMapper/XmlNode');
const Constants = require('./JsonSchemaMapper/Constants');

class Converter
{
    constructor(jsonSchema) {
        try {
            this.jsonSchema = typeof jsonSchema === 'object' ? jsonSchema : JSON.parse(jsonSchema);
        } catch (error) {
            throw new Error('provided json schema is either not an object or not a valid json string');
        }
    }

    convert() {
        const jsonRootNode = new JsonNode(this.jsonSchema);
        const xmlRootNode = new XmlNode('xs:schema');
        xmlRootNode.addAttribute('xmlns:xs', 'http://www.w3.org/2001/XMLSchema');

        const type = jsonRootNode.type;
        if (type === null) {
            throw new Error('type property of the root element must be defined');
        }

        switch (type) {
            case 'array':
                this.handleArrayRoot(jsonRootNode, xmlRootNode);
                break;
            case 'object':
                this.handleObjectRoot(jsonRootNode, xmlRootNode);
                break;
            default:
                throw new Error(`unknown root type "${type}`);
        }

        this.xml = xmlRootNode.object;
        return this;
    }

    handleArrayRoot(jsonNode, xmlNode) {
        if (jsonNode.items === null) {
            throw new Error('required property "properties" is missing');
        }

        xmlNode = this.createComplexType(xmlNode, jsonNode);

        // there is only one type possible
        if (!Array.isArray(jsonNode.items)) {
            xmlNode = this.doIterate(jsonNode.items, xmlNode, jsonNode.requiredList);
        } else {
            // need to implement
        }

        return xmlNode;
    }

    handleObjectRoot(jsonNode, xmlNode) {
        const properties = jsonNode.properties;
        if (properties === null) {
            throw new Error('required property "properties" is missing');
        }

        xmlNode = this.createComplexType(xmlNode, jsonNode);

        return this.doIterate(jsonNode.properties, xmlNode, jsonNode.requiredList);
    }

    doIterate(node, xmlNode, requiredList) {
        if (Array.isArray(node)) {

        } else if (typeof node === 'object') {
            const element = new JsonNode(node);
            element.fields.forEach(fieldName => {
                this.doIterateSingle(element.getField(fieldName), fieldName, requiredList.indexOf(fieldName) >= 0, xmlNode);
            });
        }
    }

    doIterateSingle(node, field, isRequired, xmlNode) {
        const xsdType = this.determineXsdType(node, field);

        xmlNode.addNode('xs:element', {name: field});
        if ([Constants.XSD_TYPE_OBJECT, Constants.XSD_TYPE_ARRAY].indexOf(xsdType) < 0) {
            xmlNode.addAttribute('type', `xs:${xsdType}`);
        }

        if (!isRequired) {
            xmlNode.addAttribute('minOccurs', 0);
        }

        switch (xsdType) {
            case Constants.XSD_TYPE_DECIMAL:
            case Constants.XSD_TYPE_INT:
                this.handleNumber(node, xmlNode, xsdType);
                break;
            case Constants.XSD_TYPE_STRING:
                this.handleString(node, xmlNode);
                break;
            case Constants.XSD_TYPE_ENUM:
                this.handleEnum(node, xmlNode);
                break;
            case Constants.XSD_TYPE_ARRAY:
                this.handleArray(node, xmlNode, field);
                break;
            case Constants.XSD_TYPE_OBJECT:
                this.handleObject(node, xmlNode, field);
                break;
            default:
        }

        xmlNode.up();
    }

    handleString(jsonNode, xmlNode) {
        if (jsonNode.minLength === null && jsonNode.maxLength === null && jsonNode.pattern === null) {
            return;
        }

        xmlNode.removeAttribute('type')
            .addNode('xs:simpleType')
            .addNode('xs:restriction', {base: `xs:${Constants.XSD_TYPE_STRING}`});

        if (jsonNode.minLength !== null) {
            xmlNode.addNode('xs:minLength', {value: jsonNode.minLength})
                .up();
        }

        if (jsonNode.maxLength !== null) {
            xmlNode.addNode('xs:maxLength', {value: jsonNode.maxLength})
                .up();
        }

        if (jsonNode.pattern !== null) {
            xmlNode.addNode('xs:pattern', {value: jsonNode.pattern})
                .up();
        }

        xmlNode.up(2);
    }

    handleNumber(jsonNode, xmlNode, xsdType) {
        if (jsonNode.minimum === null && jsonNode.maximum === null) {
            return;
        }

        xmlNode.removeAttribute('type')
            .addNode('xs:simpleType')
            .addNode('xs:restriction', {base: `xs:${xsdType}`});

        if (jsonNode.minimum !== null) {
            xmlNode.addNode('minInclusive', {value: jsonNode.minimum})
                .up();
        }

        if (jsonNode.maximum !== null) {
            xmlNode.addNode('maxInclusive', {value: jsonNode.maximum})
                .up();
        }

        xmlNode.up(2);
    }

    handleEnum(jsonNode, xmlNode) {
        xmlNode.removeAttribute('type')
            .addNode('xs:simpleType')
            .addNode('xs:restriction', {base: 'xs:string'});

        jsonNode.enum.forEach(value => {
            xmlNode.addNode('xs:enumeration', {value})
                .up();
        });

        xmlNode.up(2);
    }

    handleObject(jsonNode, xmlNode, field) {
        if (jsonNode.properties !== null) {
            const nodeName = xmlNode.name;
            xmlNode.addNode('xs:complexType');

            if (nodeName !== Constants.XSD_ELEMENT) {
                xmlNode.addAttribute('name', field);
            }

            xmlNode.addNode('xs:sequence');
            this.doIterate(jsonNode.properties, xmlNode, jsonNode.requiredList);
            xmlNode.up(2);
        }
    }

    handleArray(jsonNode, xmlNode, field) {
        const xsdType = this.determineXsdType(jsonNode.getField('items'), field);
        xmlNode.addNode('xs:complexType')
            .addNode('xs:sequence')
            .addNode('xs:element');

        if (xsdType === Constants.XSD_TYPE_OBJECT) {
            const name = jsonNode.title !== null ? jsonNode.title : 'item';
            xmlNode.addAttribute('name', name);
            this.handleObject(jsonNode.getField('items'), xmlNode, name);
        } else {
            xmlNode.addAttribute('name', field);
            xmlNode.addAttribute('type', xsdType);
        }

        xmlNode.up(3);
    }

    createComplexType(xmlNode, jsonNode) {
        xmlNode.addNode('xs:element');
        xmlNode.addAttribute('name', jsonNode.title !== null ? jsonNode.title : jsonNode.type);

        xmlNode.addNode('xs:complexType')
            .addNode('xs:sequence');

        return xmlNode;
    }

    determineXsdType(jsonNode, field) {
        const type = jsonNode.type;
        const format = jsonNode.format;

        if (jsonNode.isEnum) {
            return Constants.XSD_TYPE_ENUM;
        } else if (jsonNode.type === Constants.JSON_TYPE_OBJECT) {
            return Constants.XSD_TYPE_OBJECT;
        } else if (jsonNode.type === Constants.JSON_TYPE_ARRAY) {
            return Constants.XSD_TYPE_ARRAY;
        }

        if (type === null) {
            throw new Error(`type mus be specified on node "${field}"`);
        }

        const mappingTypeKey = type + (format !== '' ? `|${format}` : '');

        if (Constants.TYPE_MAPPING.hasOwnProperty(mappingTypeKey)) {
            return Constants.TYPE_MAPPING[mappingTypeKey];
        } else {
            throw new Error(`unknown XSD type for json type: ${type} and format: ${format}`);
        }
    }

    get xmlString() {
        return this.xml.end({pretty: true});
    }
}

module.exports = Converter;
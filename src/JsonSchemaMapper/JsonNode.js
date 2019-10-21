const Constants = require('./Constants');

class JsonNode
{
    constructor(jsonElement) {
        this.object = jsonElement;
    }

    getField(field) {
        return this.object.hasOwnProperty(field) ? new JsonNode(this.object[field]) : null;
    }

    get node() {
        return this.object;
    }

    get requiredList() {
        if (!this.object.hasOwnProperty(Constants.PROP_REQUIRED)) {
            return [];
        }

        if (!Array.isArray(this.object[Constants.PROP_REQUIRED])) {
            throw new Error('"required" property must be of type array');
        }

        this.object[Constants.PROP_REQUIRED].forEach(key => {
            if (typeof key !== 'string') {
                throw new Error('required keys must be of type string');
            }
        });

        return this.object[Constants.PROP_REQUIRED];
    }

    get title() {
        return this.object.hasOwnProperty(Constants.PROP_TITLE) ? this.object[Constants.PROP_TITLE] : null;
    }

    get type() {
        return this.object.hasOwnProperty(Constants.PROP_TYPE) ?
            this.object[Constants.PROP_TYPE].toLowerCase() : null;
    }

    get format() {
        return this.object.hasOwnProperty(Constants.PROP_FORMAT) ?
            this.object[Constants.PROP_FORMAT].toLowerCase() :
            '';
    }

    get items() {
        return this.object.hasOwnProperty(Constants.PROP_ITEMS) ? this.object[Constants.PROP_ITEMS] : null;
    }

    get properties() {
        return this.object.hasOwnProperty(Constants.PROP_PROPERTIES) ? this.object[Constants.PROP_PROPERTIES] : null;
    }

    get fields() {
        return typeof this.object === 'object' ? Object.keys(this.object) : [];
    }

    get isEnum() {
        return this.object.hasOwnProperty(Constants.PROP_ENUM);
    }

    get enum() {
        return this.isEnum ? this.object[Constants.PROP_ENUM] : null;
    }

    get minLength() {
        return this.object.hasOwnProperty(Constants.PROP_MIN_LENGTH) ?
            parseInt(this.object[Constants.PROP_MIN_LENGTH]) : null;
    }

    get maxLength() {
        return this.object.hasOwnProperty(Constants.PROP_MAX_LENGTH) ?
            parseInt(this.object[Constants.PROP_MAX_LENGTH]) : null;
    }

    get pattern() {
        return this.object.hasOwnProperty(Constants.PROP_PATTER) ?
            this.object[Constants.PROP_PATTER] : null;
    }

    get minimum() {
        return this.object.hasOwnProperty(Constants.PROP_MINIMUM) ?
            this.object[Constants.PROP_MINIMUM] : null;
    }

    get maximum() {
        return this.object.hasOwnProperty(Constants.PROP_MAXIMUM) ?
            this.object[Constants.PROP_MAXIMUM] : null;
    }

    get oneOf() {
        return this.object.hasOwnProperty(Constants.PROP_ONE_OF) ?
            this.object[Constants.PROP_ONE_OF] : null;
    }
}

module.exports = JsonNode;
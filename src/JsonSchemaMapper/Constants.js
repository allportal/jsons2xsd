exports.PROP_REQUIRED = 'required';
exports.PROP_TYPE = 'type';
exports.PROP_FORMAT = 'format';
exports.PROP_ITEMS = 'items';
exports.PROP_PROPERTIES = 'properties';
exports.PROP_TITLE = 'title';
exports.PROP_ENUM = 'enum';
exports.PROP_MIN_LENGTH = 'minLength';
exports.PROP_MAX_LENGTH = 'maxLength';
exports.PROP_PATTER = 'pattern';
exports.PROP_MINIMUM = 'minimum';
exports.PROP_MAXIMUM = 'maximum';
exports.PROP_ONE_OF = 'oneOf';

exports.JSON_TYPE_OBJECT = 'object';
exports.JSON_TYPE_ARRAY = 'array';
exports.JSON_TYPE_STRING = 'string';
exports.JSON_TYPE_NUMBER = 'number';
exports.JSON_TYPE_INTEGER = 'integer';
exports.JSON_TYPE_BOOLEAN = 'boolean';

exports.XSD_TYPE_ENUM = 'enum';
exports.XSD_TYPE_OBJECT = 'object';
exports.XSD_TYPE_ARRAY = 'array';

exports.XSD_TYPE_STRING = 'string';
exports.XSD_TYPE_INT = 'int';
exports.XSD_TYPE_LONG = 'long';
exports.XSD_TYPE_DECIMAL = 'decimal';

exports.XSD_TYPE_BOOLEAN = 'boolean';
exports.XSD_TYPE_DATE = 'date';
exports.XSD_TYPE_TIME = 'time';
exports.XSD_TYPE_DATETIME = 'dateTime';

exports.XSD_ELEMENT = 'xs:element';

exports.TYPE_MAPPING = {
    'string': 'string',
    'string|uri': 'anyURI',
    'string|email': 'string',
    'string|phone': 'string',
    'string|date-time': 'dateTime',
    'string|date': 'date',
    'string|time': 'time',
    'string|utc-millisec': 'long',
    'string|regex': 'string',
    'string|color': 'string',
    'string|style': 'string',

    'number': 'decimal',
    'boolean': 'boolean',
    'integer': 'int',

    'object': 'object',
    'array': 'array'
};
const builder = require('xmlbuilder');

class XmlNode
{
    constructor(name) {
        this.object = builder.create(name);
    }

    addAttribute(name, value) {
        this.object = this.object.att(name, value);
        return this;
    }

    removeAttribute(name) {
        this.object = this.object.removeAttribute(name);
        return this;
    }

    addNode(name, attributes) {
        this.object = this.object.ele(name, attributes || {});
        return this;
    }

    up(levels) {
        levels = levels || 1;
        for (let i = 0; i < levels; i++) {
            this.object = this.object.up();
        }
        return this;
    }

    get name() {
        return this.object.name;
    }
}

module.exports = XmlNode;
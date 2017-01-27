"use strict";
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
const assign = require("object-assign");
const createInnerCallback = require("./createInnerCallback");
const getInnerRequest = require("./getInnerRequest");

const startsWith = (string, searchString) => {
	const stringLength = string.length;
	const searchLength = searchString.length;

	// early out if the search length is greater than the search string
	if(searchLength > stringLength) {
		return false;
	}
	let index = -1;
	while(++index < searchLength) {
		if(string.charCodeAt(index) !== searchString.charCodeAt(index)) {
			return false;
		}
	}
	return true;
}

class AliasPlugin {
	constructor(source, options, target) {
		this.source = source;
		this.name = options.name;
		this.alias = options.alias;
		this.onlyModule = options.onlyModule;
		this.target = target;
	}

	apply(resolver) {
		const target = this.target;
		const name = this.name;
		const alias = this.alias;
		const onlyModule = this.onlyModule;
		resolver.plugin(this.source, (request, callback) => {
			const innerRequest = getInnerRequest(resolver, request);
			if(!innerRequest) return callback();
			if(innerRequest === name || (!onlyModule && startsWith(innerRequest, name + "/"))) {
				if(innerRequest !== alias && !startsWith(innerRequest, alias + "/")) {
					const newRequestStr = alias + innerRequest.substr(name.length);
					const obj = assign({}, request, {
						request: newRequestStr
					});
					return resolver.doResolve(target, obj, "aliased with mapping '" + name + "': '" + alias + "' to '" + newRequestStr + "'", createInnerCallback((err, result) => {
						if(arguments.length > 0) return callback(err, result);

						// don't allow other aliasing or raw request
						callback(null, null);
					}, callback));
				}
			}
			return callback();
		});
	}

}

module.exports = AliasPlugin;

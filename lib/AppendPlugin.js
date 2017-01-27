"use strict";
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
const assign = require("object-assign");

class AppendPlugin {
	constructor(source, appending, target) {
		this.source = source;
		this.appending = appending;
		this.target = target;
	}

	apply(resolver) {
		const target = this.target;
		const appending = this.appending;
		resolver.plugin(this.source, (request, callback) => {
			const obj = assign({}, request, {
				path: request.path + appending,
				relativePath: request.relativePath && (request.relativePath + appending)
			});
			resolver.doResolve(target, obj, appending, callback);
		});
	}

}

module.exports = AppendPlugin;

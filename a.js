(function (globe) {
	function mul(str, n) {
		if (n <= 0) return "";
		if (n == 1) return str;
		if (n % 2 != 0) return str + mul(str, n - 1);
		var temp = mul(str, n / 2);
		return temp + temp;
	}
	
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (obj) {
			for (var i = 0; i < this.length; i++) {
				if (this[i] === obj) {
					return i;
				}
			}
			return -1;
		}
	}
	
	globe.toString = function (obj, space, level, maxlevel, metObjects) {
		space = space || 4;
		level = level || 0;
		maxlevel = maxlevel || 5;
		metObjects = metObjects || [];
		switch (typeof(obj)) {
		case "undefined": return "(undefined)";
		case "function": return "(function)";
		case "object":
			if (obj === null) {
				return "(null)";
			} else if (level < maxlevel && metObjects.indexOf(obj) == -1) {
				metObjects.push(obj);
				if (obj instanceof Array) {
					var result = "[", i;
					for (i = 0; i < obj.length; i++) {
						if (i !== 0) result += ", ";
						result += toString(obj[i], space, level + 1, maxlevel, metObjects);
					}
					result += "]";
					return result;
				} else {
					var result = "{";
					var needSeperator = false;
					for (i in obj) {
						if (needSeperator) result += ",";
						else needSeperator = true;
						result += "\n" + mul(" ", (level + 1) * space) + i + ": "
								  + toString(obj[i], space, level + 1, maxlevel, metObjects);
					}
					result += "\n" + mul(" ", level * space) + "}";
					return result;
				}
				metObjects.pop();
			} else {
				return obj instanceof Array ? "[...]" : "{...}";
			}
		}
		return "(" + typeof obj + ") " + obj.toString();
	}
	
	function appendText(element, text) {
		element.appendChild(document.createTextNode(text));
		return element;
	}
	
	function createDescElement(desc) {
		var result = document.createElement("span");
		result.className = "desc desc-" + desc;
		return result;
	}
	
	function createDescTypenameElement(type, extraSpace) {
		var result = createDescElement("typename desc-typename-" + type);
		appendText(result, "(" + type + ")" + (extraSpace ? " " : ""));
		return result;
	}

	globe.toHTMLDescription = function (obj, space, level, maxlevel, metObjects) {
		space = space || 4;
		level = level || 0;
		maxlevel = maxlevel || 10;
		metObjects = metObjects || [];
		switch (typeof obj) {
		case "undefined": case "function":
			return createDescTypenameElement(typeof obj);
		case "object":
			if (obj === null) {
				return createDescTypenameElement("null");
			} else if (level < maxlevel && metObjects.indexOf(obj) == -1) {
				var result = createDescElement("container");
				metObjects.push(obj);
				if (obj instanceof Array) {
					appendText(result, "[");
					for (var i = 0; i < obj.length; i++) {
						if (i !== 0) appendText(result, ", ");
						result.appendChild(toHTMLDescription(obj[i], space, level + 1, maxlevel, metObjects));
					}
					appendText(result, "]");
				} else {
					appendText(result, "{");
					var needSeperator = false;
					for (i in obj) {
						if (needSeperator) appendText(result, ",");
						else needSeperator = true;
						appendText(result, "\n" + mul(" ", (level + 1) * space));
						result.appendChild(appendText(createDescElement("key"), i));
						appendText(result, ": ");
						result.appendChild(toHTMLDescription(obj[i], space, level + 1, maxlevel, metObjects));
					}
					appendText(result, "\n" + mul(" ", level * space) + "}");
				}
				metObjects.pop();
				return result;
			} else {
				var s = obj instanceof Array ? "[...]" : "{...}";
				var result = createDescElement("container");
				return appendText(result, s);
			}
		}
		var result = createDescElement(typeof obj)
		result.appendChild(createDescTypenameElement(typeof obj, true));
		return appendText(result, obj.toString());
	}
})(window);
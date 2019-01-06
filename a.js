function toString(obj, space = 4, level = 0, maxlevel = 10, metObjects = []) {
	function mul(str, n) {
		if (n <= 0) return "";
		if (n == 1) return str;
		if (n % 2 != 0) return str + mul(str, n - 1);
		var temp = mul(str, n / 2);
		return temp + temp;
	}
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
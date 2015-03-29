String.generate = function(length, symbols){
	length = length || 10;

	symbols = symbols || '1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm';
	var max = symbols.length - 1;
	var x = '';

	for (var i = 0; i < length; i++) {
		x = x + symbols[Math.getRandom(0, max)];
	}

	return x;
};


var syntax = {'^': 'i', '*': 'b', '_': 'u'};
var lineSyntax = { '==': 'hr', '': 'br' };
var headers = { '#': 'h1', '##': 'h2', '###': 'h3', '####': 'h4', '#####': 'h5', '######': 'h6' };

var textBlock = function (txt) {
	this.text = txt;
	var _parsing = '';
	this.html = '';
};

textBlock.prototype.parseBasicSymbol = function(sym) {

	var regex = new RegExp('(?:[^\\' + sym + '\\\\]|\\\\.)*', 'g');
	var chunks = _parsing.match(regex);
	if (chunks[chunks.length - 1] === '') {
		chunks.pop();
	}

	var inTag = false;
	var result = '';
	for (var i = 0; i < chunks.length; i++) {
		if (chunks[i] === '') {
			result += (inTag ? '</' : '<') + syntax[sym] + '>';
			inTag = !inTag;
		} else {
			result += chunks[i];
		}
	}

	if (inTag) {
		result += '</' + syntax[sym] + '>';
	}
	_parsing = result;
};

textBlock.prototype.parseAllBasicSymbols = function() {

	for (var sym in syntax) {
		this.parseBasicSymbol(sym);
	}
};

textBlock.prototype.parseLineSymbol = function(sym) {
	
	if (_parsing === sym) {
		_parsing = '<' + lineSyntax[sym] + '>';
		return true;
	}
	
	return false;
};

textBlock.prototype.parseAllLineSymbols = function() {

	for(var sym in lineSyntax) {
		if (this.parseLineSymbol(sym)) {
			return true;
		}
	}
	
	return false;
	
};

textBlock.prototype.parseHeaders = function () {
	
	if (_parsing.charAt(0) !== '#') {
		return false;
	}

	for (var i = 1; i < 7; i++) {
		if (_parsing.charAt(i) !== '#' || i == 6) {
			_parsing = '<h' + i + '>' + _parsing.substring(i) + '</h' + i + '>';
			return true;
		}
	}

	return true;
}

textBlock.prototype.parseLinks = function() {

	var regex = new RegExp(/\[(.*?)\]\((.*?)\)/, 'g');
	var links = regex.exec(_parsing);

	if (links == null) {
		return;
	}

	var result = '';
	var prevIndex = 0;
	while (links != null) {
		result += _parsing.substring(prevIndex, links['index']) + '<a href="' + links[2] + '" target="_blank">' + links[1] + '</a>';
		prevIndex = regex.lastIndex;
		links = regex.exec(_parsing);
	}

	_parsing = result + _parsing.substring(prevIndex);
};

textBlock.prototype.stripEscapes = function() {
	_parsing = _parsing.replace(/\\/g, '');
};

textBlock.prototype.parse = function() {
	
	_parsing = this.text;

	if (this.parseHeaders() || this.parseAllLineSymbols()) {
		this.html = _parsing;
		return;
	}

	this.parseLinks();

	this.parseAllBasicSymbols();
	
	this.stripEscapes();

	this.html = '<p>' + _parsing + '</p>';
}

function generateMarkdown(text) {

	var lines = text.split('\n');
	var output = "";

	//Process each line separately
	for (var i = 0; i < lines.length; i++) {
		var block = new textBlock(lines[i]);
		block.parse();
		output = output + block.html;
	}

	return output;
}
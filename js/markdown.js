var syntax = {'^': 'i', '*': 'b', '_': 'u'};
var lineSyntax = { '==': 'hr' };
var headers = { '#': 'h1', '##': 'h2', '###': 'h3', '####': 'h4', '#####': 'h5', '######': 'h6' };

var textBlock = function (txt) {
	this.text = txt;
};

textBlock.prototype.replaceBasicSymbol = function(sym) {

	var regex = new RegExp('(?:[^\\' + sym + '\\\\]|\\\\.)*', 'g');
	var chunks = this.text.match(regex);
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
	this.text = result;
};

textBlock.prototype.replaceLineSymbol = function(sym) {
	
	if (this.text === sym) {
		this.text = '<' + lineSyntax[sym] + '>';
		return true;
	}
	
	return false;
};

textBlock.prototype.replaceHeaders = function () {
	
	if (this.text.charAt(0) !== '#') {
		return false;
	}

	for (var i = 1; i < 7; i++) {
		if (this.text.charAt(i) !== '#' || i == 6) {
			this .text = '<h' + i + '>' + this.text.substring(i) + '</h' + i + '>';
			return true;
		}
	}

	return true;
}

textBlock.prototype.replaceLinks = function() {

	var regex = new RegExp(/\[(.*?)\]\((.*?)\)/, 'g');
	var links = regex.exec(this.text);

	if (links == null) {
		return;
	}

	var result = '';
	var prevIndex = 0;
	while (links != null) {
		result += this.text.substring(prevIndex, links['index']) + '<a href="' + links[2] + '" target="_blank">' + links[1] + '</a>';
		prevIndex = regex.lastIndex;
		links = regex.exec(this.text);
	}

	this.text = result + this.text.substring(prevIndex);
};

textBlock.prototype.stripEscapes = function() {
	this.text = this.text.replace(/\\/g, '');
};

function generateMarkdown(text) {

	var lines = text.split('\n');
	var output = "";

	//Process each line separately
	for (var i = 0; i < lines.length; i++) {
		output = output + processBlock(lines[i]);
	}

	return output;
}

function processBlock(line) {

	var block = new textBlock(line);
	
	if (block.replaceHeaders() || block.replaceLineSymbol('==')) {
		return block.text;
	}
	
	block.replaceLinks();
	
	block.replaceBasicSymbol('*');
	block.replaceBasicSymbol('_');
	block.replaceBasicSymbol('^');
	
	block.stripEscapes();
	
	return '<p>' + block.text + '</p>';
}

var syntax = {'^': 'i', '*': 'b', '_': 'u'};


var textBlock = function (text) {
	this.text = text;
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

textBlock.prototype.stripEscapes = function() {
	this.text = this.text.replace(/\\/g, '');
};

textBlock.prototype.generateLinks = function() {

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
}

function generateMarkdown(text) {

	var lines = text.split('\n');
	var output = "";

	//Process each line separately
	for (var i = 0; i < lines.length; i++) {
		output = output + processBlock(lines[i]) + '<br>';
	}

	return output;
}

function processBlock(line) {

	var block = new textBlock(line);
	block.generateLinks();
	block.replaceBasicSymbol('*');
	block.replaceBasicSymbol('_');
	block.replaceBasicSymbol('^');
	block.stripEscapes();
	return block.text;
}
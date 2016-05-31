var lineRules = {
	'QUOTE': /^>(.*)/,
	'LIST': /^((?:  )*)-/,
	'HR': /^==$/,
	'BR': /^\s*$/
};

var tagMap = {
	'BOLD': { md: '#', html: 'b' },
	'UND': { md: '_', html: 'u' },
	'ITAL': { md: '*', html: 'i' },
	'H1': { md: '!', html: 'h1' },
	'H2': { md: '!!', html: 'h2' },
	'H3': { md: '!!!', html: 'h3' },
	'H4': { md: '!!!!', html: 'h4' },
	'H5': { md: '!!!!!', html: 'h5' },
	'H6': { md: '!!!!!!', html: 'h6' }
};

var textLine = function(src) {

	this.src = src;
	this.openTags = [];

	this.type = '';
	for (var r in lineRules) {
		if (lineRules[r].exec(src)) {
			this.type = r;
			return;
		}
	}

	if (this.type === '') {
		this.type = 'TXT';
	}
};

textLine.prototype.parse = function() {
	var output = '';
	var text = this.src;
	var cap = [];
	var pos = 0;

	while(text) {

		switch (text.charAt(0)) {

			//Escape character
			case '\\':
				output += text.charAt(1);
				text = text.substring(2);
				break;

			//Bold, italic, underline, header
			case '#':
			case '*':
			case '_':
			case '!':
				var type = '';
				if (text.charAt(0) === '#') {
					type = 'BOLD';
				} else if (text.charAt(0) === '*') {
					type = 'ITAL';
				} else if (text.charAt(0) === '_') {
					type = 'UND';
				} else {
					var i = 1;
					while (text.charAt(i) === '!' && i < 6) {
						i++;
					}
					text = text.substring(i - 1);
					type = 'H' + i;
				}

				/***** break this into a separate function so switch case isn't so redundant */
				/* Param: type, return: output */
				/* How to push/splice from open tags though??? */
				if ((pos = this.openTags.indexOf(type)) === -1) {
					output += '<' + tagMap[type].html + '>';
					this.openTags.push(type);
				} else {
					output += '</' + tagMap[type].html + '>';
					this.openTags.splice(pos, 1);
				}
				text = text.substring(1);
				/******************************/
				break;

			//Link
			case '[':
				if (cap = /\[([^\]]+)\]\((\S+(?=\)))\)/.exec(text)) {
					output += '<a href="' + cap[2] + '" target="_blank">' + cap[1] + '</a>';
					text = text.substring(cap[0].length);
				} else {
					output += text.charAt(0);
					text = text.substring(1);
				}
				break;

			//Plain text
			default:
				if (cap = /^([^#!_\\\*]+)/.exec(text)) {
					output += cap[1];
					text = text.substring(cap[1].length);
				} else { //Should never reach this, just here to avoid possible infinite loop
					output += text.charAt(0);
					text = text.substring(1);
				}
				break;
		}
	}
	
	while (this.openTags.length > 0) {
		output += '</' + tagMap[this.openTags.pop()].html + '>';
	}
	return output;
};

/******************************************************************************/

var textBlock = function(src) {

	this.openBlock = false;
	this.listDepth = 0;
	this.lines = [];

	var input = src.split('\n');
	for (var i = 0; i < input.length; i++) {
		this.lines.push(new textLine(input[i]));
	}
};

textBlock.prototype.parse = function() {

	var output = [];
	for (var i = 0; i < this.lines.length; i++) {

		//Unset the block quote flag if the line after a block quote isn't a b.q.
		if (this.openBlock && this.lines[i].type !== 'QUOTE') {
			this.openBlock = false;
			output.push('</blockquote>');
		}

		//Close list(s) if the line after a list isn't a list
		while (this.listDepth > 0 && this.lines[i].type !== 'LIST') {
			output.push('</ul>');
			this.listDepth--;
		}

		switch (this.lines[i].type) {

			case 'TXT':
				output.push('<p>' + this.lines[i].parse() + '</p>');
				break;

			case 'HR':
				output.push('<hr>');
				break;

			case 'BR':
				output.push('<br>');
				break;

			case 'QUOTE':

				//Remove the block quote character at beginning of line ( > )
				this.lines[i].src = this.lines[i].src.substring(1);

				//Handle the first line of a block quote section
				if (!this.openBlock) {
					this.openBlock = true;
					output.push('<blockquote><p>' + this.lines[i].parse() + '</p>');

				//Handle any block quote line other than the first in a section
				} else {
					output.push('<p>' + this.lines[i].parse() + '</p>');
				}
				break;
				
			case 'LIST':

				//Determine new list depth
				var cap = lineRules['LIST'].exec(this.lines[i].src);
				var newDepth = (cap[1].length / 2) + 1;

				//Adjust to new list depth
				while (this.listDepth > newDepth) {
					output.push('</ul>');
					this.listDepth--;
				}
				while (this.listDepth < newDepth) {
					output.push('<ul>');
					this.listDepth++;
				}

				//Parse line
				this.lines[i].src = this.lines[i].src.substring(((newDepth - 1) * 2) + 1);
				output.push('<li>' + this.lines[i].parse() + '</li>');
				break;
		}
	}
	
	//Close the open block quote if the last line of input was a block quote
	if (this.openBlock) {
		this.openBlock = false;
		output.push('</blockquote>');
	}
	
	//Close any open lists
	while (this.listDepth > 0) {
		output.push('</ul>');
		this.listDepth--;
	}
	
	return output.join('');
};

function generateMarkdown(text) {
	var block = new textBlock(text);
	return block.parse();
}
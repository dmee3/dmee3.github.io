var Spotify = function() {

	'use strict';
	var baseURI = 'https://api.spotify.com/v1/';

	function request(query, params, callback) {
		var ajax = new XMLHttpRequest();
		var url = buildURL(query, params);

		ajax.onreadystatechange = function() {
			if (ajax.readyState === 4 && ajax.status === 200) {
				var response = JSON.parse(ajax.responseText);
				callback(response);
			}
		}

		ajax.open('GET',url,true);
		ajax.send();
	}

	function buildURL(query, params) {
		var url = baseURI + query + '?';
		for (var k in params) {
			url += encodeURIComponent(k) + '=' + encodeURIComponent(params[k]) + '&';
		}

		return url.substring(0, url.length - 1);
	}

	this.searchArtist = function(query, callback) {
		var params = {
			q:query,
			type:'artist',
			market:'US'
		}

		return request('search', params, callback);
	};
};
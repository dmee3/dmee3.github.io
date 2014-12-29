var Spotify = function() {

	'use strict';
	var baseURI = 'https://api.spotify.com/v1/';

	function asyncRequest(url, callback) {
		var ajax = new XMLHttpRequest();

		ajax.onreadystatechange = function() {
			if (ajax.readyState === 4 && ajax.status === 200) {
				var response = JSON.parse(ajax.responseText);
				callback(response);
			}
		}

		ajax.open('GET',url,true);
		ajax.send();
	}

	function buildURL(queryType, params) {
		var url = baseURI + queryType + '?';
		for (var k in params) {
			url += encodeURIComponent(k) + '=' + encodeURIComponent(params[k]) + '&';
		}

		return url.substring(0, url.length - 1);
	}

	/*
	 * Searches for an artist.
	 *
	 * @param {String} query - the string to search for
	 * @param {function(Object)} callback - function to manipulate returned data once
	 *     async request has been completed.  The passed in parameter stores the result
	 *     of the query.
	 */
	this.searchArtist = function(query, callback) {
		var params = {
			q:query,
			type:'artist',
			market:'US'
		}
		asyncRequest(buildURL('search', params), callback);
	};
	
	/*
	 * Searches for an album.
	 *
	 * @param {String} query - the string to search for
	 * @param {function(Object)} callback - function to manipulate returned data once
	 *     async request has been completed.  The passed in parameter stores the result
	 *     of the query.
	 */
	this.searchAlbum = function(query, callback) {
		var params = {
			q:query,
			type:'album',
			market:'US'
		}
		asyncRequest(buildURL('search', params), callback);
	};
	
	/*
	 * Returns details on a given album.
	 *
	 * @param {String} id - the Spotify id of the album to be retrieved
	 * @param {function(Object)} callback - function to manipulate returned data once
	 *     async request has been completed.  The passed in parameter stores the result
	 *     of the query.
	 */
	this.getAlbum = function(id, callback) {
		var url = baseURI + 'albums/' + id;
		asyncRequest(url, callback);
	}
};

var spot = new Spotify();

//Process results from artist search
var searchArtist = function(res) {
	var result = res['artists']['items'];
	document.getElementById('SpotAPI').innerHTML = '';

	for (var i = 0; i < result.length; i++) {
		var entry = '<li class="spot-search-result artist" data-artistid="' + result[i]['id'] + '">';
		if (result[i]['images'].length > 0) {
			entry += '<img class="album-art" src="' + result[i]['images'][0]['url'] + '" height="80px" width="80px" /><div class="spot-search-result-title"><p>' + result[i]['name'];
		} else {
			entry += '<div class="no-album-art"></div><div class="spot-search-result-title"><p>' + result[i]['name'];
		}

		if (result[i]['genres'].length > 0) {
			entry += '<span style="color: #777; font-weight:400;"> | ' + result[i]['genres'][0] + '</span>';
		}

		entry += '</p></div></li><li class="spot-search-result-border"></li>';
		document.getElementById('SpotAPI').innerHTML += entry;
	}
};

//Process results from album search
var searchAlbum = function(res) {
	var result = res['albums']['items'];
	document.getElementById('SpotAPI').innerHTML = '';

	for (var i = 0; i < result.length; i++) {

		var id = result[i]['id'];
		spot.getAlbum(id, function(res) {

			var entry = '<li class="spot-search-result album">';
			if (res['images'].length > 0) {
				entry += '<img class="album-art" src="' + res['images'][0]['url'] + '" height="80px" width="80px" /><div class="spot-search-result-title"><p>' + res['name'];
			} else {
				entry += '<div class="no-album-art"></div><div class="spot-search-result-title"><p>' + res['name'];
			}

			if (res['artists'].length > 0) {
				entry += '<span style="color: #777; font-weight:400;"> | ' + res['artists'][0]['name'] + '</span>';
			}

			entry += '</p></div><ul class="track-list">';

			for (var i = 0; i < res['tracks']['items'].length; i++) {
				var cur = res['tracks']['items'][i];
				
				entry += '<li class="track-border"></li><li class="track" data-trackid="' + cur['id'] + '"><p>' + cur['name'];
				var min = Math.floor(Math.floor(cur['duration_ms'] / 1000) / 60);
				var sec = Math.floor(cur['duration_ms'] / 1000) % 60;
				entry += '<span style="color: #777; font-weight:400;"> | ' + min.toString() + ':' + sec.toString() + '</span></p></li>';
			}

			entry += '</ul></li><li class="spot-search-result-border"></li>';

			document.getElementById('SpotAPI').innerHTML += entry;
		});
	}
};

//Search Spotify
$('#SpotAPI-form').on('submit', function(e) {
	e.preventDefault();
	if ($('#radio-album').is(':checked')) {
		spot.searchAlbum($('#search-text').val(),searchAlbum);
	} else {
		spot.searchArtist($('#search-text').val(),searchArtist);
	}
});

//Display album contents
$(document).on('click', '.album', function() {
	$('.track-list').slideUp(500);
	$(this).children('.track-list').slideDown(500);
});


/*
 * Bubble click functions
 */
$('.bubble').hover(function() {
	$(this).fadeTo(500, 0.5);
}, function() {
	$(this).fadeTo(500, 1);
});

$('#bubble-me').click(function() {
	$('#me').slideDown(500);
	$('.content-text').not('#me').slideUp(500);
});

$('#bubble-school').click(function() {
	$('#school').slideDown(500);
	$('.content-text').not('#school').slideUp(500);
});

$('#bubble-work').click(function() {
	$('#work').slideDown(500);
	$('.content-text').not('#work').slideUp(500);
});

$('#bubble-stacker').click(function() {
	$('#stacker').slideDown(500);
	$('.content-text').not('#stacker').slideUp(500);
});

$('#bubble-iMusic').click(function() {
	$('#iMusic').slideDown(500);
	$('.content-text').not('#iMusic').slideUp(500);
});

$('#bubble-SpotAPI').click(function() {
	$('#SpotAPI-wrapper').slideDown(500);
	$('.content-text').not('#SpotAPI-wrapper').slideUp(500);
});

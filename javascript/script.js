var spot = new Spotify();

var searchArtist = function(res) {
	var result = res['artists']['items'];
	document.getElementById('SpotAPI').innerHTML = '';
	console.log(result);

	for (var i = 0; i < result.length; i++) {
		var entry = "";
		if (result[i]['images'].length > 0) {
			entry = '<div class="spot-search-result"><img class="album-art" src="' + result[i]['images'][0]['url'] + '" height="80px" width="80px" /><div class="spot-search-result-title"><p>' + result[i]['name'];
		} else {
			entry = '<div class="spot-search-result"><div class="no-album-art"></div><div class="spot-search-result-title"><p>' + result[i]['name'];
		}

		if (result[i]['genres'].length > 0) {
			entry += '<span style="color: #777; font-weight:400;"> | ' + result[i]['genres'][0] + '</span>';
		}

		entry += '</p></div></div><div class="spot-search-result-border"></div>';
		document.getElementById('SpotAPI').innerHTML += entry;
	}
};

var searchAlbum = function(res) {
	var result = res['albums']['items'];
	document.getElementById('SpotAPI').innerHTML = '';
	console.log(result);

	for (var i = 0; i < result.length; i++) {
		var entry = "";
		if (result[i]['images'].length > 0) {
			entry = '<div class="spot-search-result"><img class="album-art" src="' + result[i]['images'][0]['url'] + '" height="80px" width="80px" /><div class="spot-search-result-title"><p>' + result[i]['name'];
		} else {
			entry = '<div class="spot-search-result"><div class="no-album-art"></div><div class="spot-search-result-title"><p>' + result[i]['name'];
		}

		entry += '</p></div></div><div class="spot-search-result-border"></div>';
		document.getElementById('SpotAPI').innerHTML += entry;
	}
};

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

$('#SpotAPI-form').on('submit', function(e) {
	e.preventDefault();
	if ($('#radio-album').is(':checked')) {
		spot.searchAlbum($('#search-text').val(),searchAlbum);
	} else {
		spot.searchArtist($('#search-text').val(),searchArtist);
	}
});
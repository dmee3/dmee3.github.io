var spot = new Spotify();

var setArtistSearch = function(res) {
	var artists = res['artists']['items'];
	document.getElementById('SpotAPI').innerHTML = '';
	console.log(artists);

	for (var i = 0; i < artists.length; i++) {
		var entry = "";
		if (artists[i]['images'].length > 0) {
			entry = '<div class="spot-search-result"><img class="album-art" src="' + artists[i]['images'][0]['url'] + '" height="80px" width="80px" /><div class="spot-search-result-title"><p>' + artists[i]['name'];
		} else {
			entry = '<div class="spot-search-result"><div class="no-album-art"></div><div class="spot-search-result-title"><p>' + artists[i]['name'];
		}

		if (artists[i]['genres'].length > 0) {
			entry += '<span style="color: #777; font-weight:400;"> | ' + artists[i]['genres'][0] + '</span>';
		}

		entry += '</p></div></div><div class="spot-search-result-border"></div>';
		document.getElementById('SpotAPI').innerHTML += entry;
	}
}

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
	spot.searchArtist($('#search-text').val(),setArtistSearch);
});
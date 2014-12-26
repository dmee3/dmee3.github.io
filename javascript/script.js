$('.bubble').hover(function () {
  $(this).fadeTo(500, 0.5);
}, function () {
  $(this).fadeTo(500, 1);
});

$('#bubble-me').click(function () {
  $('#me').slideDown(500);
  $('.content-text').not('#me').slideUp(500);
});

$('#bubble-school').click(function () {
  $('#school').slideDown(500);
  $('.content-text').not('#school').slideUp(500);
});

$('#bubble-work').click(function () {
  $('#work').slideDown(500);
  $('.content-text').not('#work').slideUp(500);
});

$('#bubble-stacker').click(function () {
  $('#stacker').slideDown(500);
  $('.content-text').not('#stacker').slideUp(500);
});

$('#bubble-iMusic').click(function () {
  $('#iMusic').slideDown(500);
  $('.content-text').not('#iMusic').slideUp(500);
});


















	var baseURI = 'https://api.spotify.com/v1/';
    
    request = function(query, params) {
        ajax = new XMLHttpRequest();
        url = buildURL(query, params);
        
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                document.getElementById('artist').innerHTML = ajax.responseText;
            }
        }
        ajax.open('GET',url,true);
        document.getElementById('artist').innerHTML=url;
        ajax.send();
    }
    
    buildURL = function(query, params) {
        var url = baseURI + query + '?';
        for (var k in params) {
            url += encodeURIComponent(k) + '=' + encodeURIComponent(params[k]) + '&';
        }
        return url.substring(0, url.length - 1);
    }
    
	search = function(query) {
        var params = {
            q:query,
            type:'artist',
            market:'US'
        }
        request('search', params);
	}

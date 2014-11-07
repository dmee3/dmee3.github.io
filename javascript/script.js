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
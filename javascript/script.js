$('.bubble').hover(function () {
  $(this).fadeTo(500, 0.5);
}, function () {
  $(this).fadeTo(500, 1);
});

$('.bubble-text').hover(function () {
  $(this).fadeTo(500, 1);
}, function () {
  $(this).fadeTo(500, 0);
});
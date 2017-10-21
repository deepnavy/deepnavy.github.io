

// make equal height of cards
$('.card').responsiveEqualHeightGrid();
// make card clickable
$('.card').click(function() {
  var href = $(this).find('a').attr('href');
  window.location.href = href;
});







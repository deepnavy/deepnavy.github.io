

// make equal height of cards
$('.card').responsiveEqualHeightGrid();
// make card clickable
$('.card').click(function() {
  var href = $(this).find('a').attr('href');
  window.location.href = href;
});

var elementsCount = $('.related-news-item').length;

//choosing the grid class depending on elements count
if (elementsCount != 0){

  var elementsCount = $('.related-news-item').length;

  if (elementsCount < 3) {
    $('.related-news-item').removeClass('col-md-4 col-sm-6 ');
    if (elementsCount == 2) {
      $('.related-news-item').addClass('col-md-6 col-sm-6');
    }
    else if (elementsCount == 1) {
      $('.related-news-item').addClass('col-md-12');
    }
  }

}







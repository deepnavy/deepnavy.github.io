

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

$('.nav-tabs-dropdown').each(function(i, elm) {
  $(elm).text($(elm).next('ul').find('li.active a').text());
});

$('.nav-tabs-dropdown').on('click', function(e) {

  e.preventDefault();
  $(e.target).toggleClass('open').next('ul').slideToggle();
});

$('#nav-tabs-wrapper a[data-toggle="tab"]').on('click', function(e) {
  e.preventDefault();
  $(e.target).closest('ul').hide().prev('a').removeClass('open').text($(this).text());
});







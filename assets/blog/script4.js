

// make card clickable
$('.card').click(function() {
var href = $(this).find('a').attr('href');
window.location.href = href;
});


// navtabs responsive
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









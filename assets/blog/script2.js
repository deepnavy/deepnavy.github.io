data = [
    {title:"Як перевірити колишнього директора?", imgscr: "736.png", description:"За останній рік в Україні змінилося 127 079 директорів. Це 8% від загальної кількості."},
    {title:"Чому судові рішення публікують із затримкою?", imgscr: "735.png", description:"За останній рік в Україні змінилося 127 079 директорів. Це 8% від загальної кількості."},
    {title:"Чи можна використовувати зброю для самооборони?", imgscr: "733.png", description:"Голову Київобленерго вбили у власному будинку. Якби у нього була вогнепальна зброя — він зміг би захистити себе та свою родину від злочинців"},
    {title:"Маркер незрілості: В 53% засновник є директором компанії", imgscr: "732.png", description:"Українські підприємці не готові делегувати управлінські функції"},
    {title:"Суддя передумав. Як винести два вироки по одній справі", imgscr: "731.png", description:"Вирок не може бути змінений. Для його оскарження потрібен апеляційний суд. Але є випадки, в яких суди вирішують “виправити” суть вироку"},
    {title:"Про що говорить статутний капітал?", imgscr: "728.png", description:"Статутний капітал не розповість про репутацію контрагента"},
    {title:"Як перевірити колишнього директора?", imgscr: "736.png", description:"За останній рік в Україні змінилося 127 079 директорів. Це 8% від загальної кількості."},
    {title:"Чому судові рішення публікують із затримкою?", imgscr: "735.png", description:"За останній рік в Україні змінилося 127 079 директорів. Це 8% від загальної кількості."},
    {title:"Чи можна використовувати зброю для самооборони?", imgscr: "733.png", description:"Голову Київобленерго вбили у власному будинку. Якби у нього була вогнепальна зброя — він зміг би захистити себе та свою родину від злочинців"},
]


var card = _.template($("#card-template").html()); 


data.forEach(function(item, i, arr) {
  $("#insert-cards").append(card(item));
});

// make equal height of cards
$('.card').responsiveEqualHeightGrid();
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





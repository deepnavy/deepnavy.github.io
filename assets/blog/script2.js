// data = [
//     {title:"Як перевірити колишнього директора?", imgscr: "736.png", description:"За останній рік в Україні змінилося 127 079 директорів. Це 8% від загальної кількості."},
//     {title:"Чому судові рішення публікують із затримкою?", imgscr: "735.png", description:"За останній рік в Україні змінилося 127 079 директорів. Це 8% від загальної кількості."},
//     {title:"Чи можна використовувати зброю для самооборони?", imgscr: "733.png", description:"Голову Київобленерго вбили у власному будинку. Якби у нього була вогнепальна зброя — він зміг би захистити себе та свою родину від злочинців"},
//     {title:"Маркер незрілості: В 53% засновник є директором компанії", imgscr: "732.png", description:"Українські підприємці не готові делегувати управлінські функції"},
//     {title:"Суддя передумав. Як винести два вироки по одній справі", imgscr: "731.png", description:"Вирок не може бути змінений. Для його оскарження потрібен апеляційний суд. Але є випадки, в яких суди вирішують “виправити” суть вироку"},
//     {title:"Про що говорить статутний капітал?", imgscr: "728.png", description:"Статутний капітал не розповість про репутацію контрагента"},
//     {title:"Як перевірити колишнього директора?", imgscr: "736.png", description:"За останній рік в Україні змінилося 127 079 директорів. Це 8% від загальної кількості."},
//     {title:"Чому судові рішення публікують із затримкою?", imgscr: "735.png", description:"За останній рік в Україні змінилося 127 079 директорів. Це 8% від загальної кількості."},
//     {title:"Чи можна використовувати зброю для самооборони?", imgscr: "733.png", description:"Голову Київобленерго вбили у власному будинку. Якби у нього була вогнепальна зброя — він зміг би захистити себе та свою родину від злочинців"},
// ]


// var card = _.template($("#card-template").html()); 


// data.forEach(function(item, i, arr) {
//   $("#insert-cards").append(card(item));
// });

// make equal height of cards
$('.equal-height').responsiveEqualHeightGrid();
// make card clickable
$('.card').click(function() {
  var href = $(this).find('a').attr('href');
  if(!event.ctrlKey && !event.metaKey) {
    window.location.href = href;
  }
});

//make contact widget clicable
$('.contact-widget').click(function() {
  var href = $(this).find('a').attr('href');
  if(!event.ctrlKey && !event.metaKey) {
    window.location.href = href;
  }
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

// journalists landing e-mail validation

var jForm = $('.email-cta form');

if (jForm.length){
  jForm.validator().on('submit', function (e) {
  

    if (e.isDefaultPrevented()) {
      console.log('errors in form');
    } else {
      // var url = "contact.php";
      // $.ajax({
      //     type: "POST",
      //     url: url,
      //     data: $(this).serialize(),
      //     success: function (data)
      //     {
      //         var messageAlert = 'alert-' + data.type;
      //         var messageText = data.message;

      //         var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
      //         if (messageAlert && messageText) {
      //             $('#basicform').find('.messages').html(alertBox);
      //             $('#basicform')[0].reset();
      //         }
      //     }
      // });
      // return false;

      e.preventDefault();
      jForm.hide(100)
      $('.email-cta .alert-success').show(100);

      console.log('Form submitted');
    }
  })
}


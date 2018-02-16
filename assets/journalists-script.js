
$(function() {


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
});
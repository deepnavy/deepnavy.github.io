$(function() {
    $('.chat-input').on('keypress', function (e) {
        if (e.which == 13) {
            $('.send-btn').click();
        }
    });

    $('.send-btn').on('click', function () {
        var $message = $('.chat-input').val();
        $.ajax({
            url    : 'chat/send',
            dataType : 'json',
            method : 'POST',
            beforeSend : function () {
                $showSend = '<li class="mar-btm">'+
                    '<div class="media-right">'+
                    '<img src="http://bootdey.com/img/Content/avatar/avatar2.png" class="img-circle img-sm" alt="Profile Picture">'+
                    '</div>'+
                    '<div class="media-body pad-hor speech-right">'+
                    '<div class="speech">'+
                    '<a href="#" class="media-heading">Вы</a>'+
                    '<p>'+$message+'</p>'+
                    '<p class="speech-time">'+
                    '<i class="fa fa-clock-o fa-fw"></i> 09:23AM</p></div></div></li>';
                $(".media-block").append($showSend);
                $('.chat-input').val("");
            },
            data   : {
                message : $message
            },
            success : function (answer) {
                $showSend = '<li class="mar-btm">'+
                    '<div class="media-left">'+
                    '<img src="http://bootdey.com/img/Content/avatar/avatar1.png" class="img-circle img-sm" alt="Profile Picture">'+
                    '</div>'+
                    '<div class="media-body pad-hor">'+
                    '<div class="speech">'+
                    '<a href="#" class="media-heading">OpenDataBot</a>'+
                    '<p>'+answer+'</p>'+
                    '<p class="speech-time">'+
                    '<i class="fa fa-clock-o fa-fw"></i> 09:23AM</p></div></div></li>';
                $(".media-block").append($showSend);
            }
        })
    });

    $('.tender-info').on('click', function () {
        $('.info-letter').hide();
        $id = $(this).data('id');
        $code = $(this).data('code');
        $name = $(this).children('#loser-name').html();
        $email = $(this).children('#loser-email').html();
        if ($('#loser-'+$id+'-'+$code).lenght > 0) {
            $('#loser-'+$id+'-'+$code).show();
        }
        $.ajax({
            url    : 'black-list',
            dataType : 'json',
            method : 'POST',
            data   : {
                id : $id,
                name : $name,
                email : $email
            },
            success : function (answer) {
                var text = "<div class='info-letter' id='loser-"+$id+"-"+$code+"'>"+answer+"</div>";
                $('.info-letters').append(text);
            }
        })
    });

    var clipboard = new Clipboard('#copy_embed');

    clipboard.on('success', function(e) {
        alert('Теперь ви можете вставити віджет цієї компанії на своєму сайті');
        e.clearSelection();
    });

    $('.datetimepicker').datetimepicker({
        pickTime: false,
        autoclose: true
    });

    $('#clear_start_date').click(function (e) {
        $('#from').val('');
    });

    $('#clear_end_date').click(function (e) {
        $('#to').val('');
    });

    if ($(".company-page").size() === 1) {
        var id = $('#company_id').val();
        $.ajax({
            url : '/embed/getData',
            dataType : 'json',
            method : 'POST',
            data : {
                code : id
            },
            beforeSend : function() {
                $('.attention').addClass('preloader');
            }
        }).done(function (answer) {
            $('.attention').removeClass('preloader');
            var html = '';
            $.each(answer, function (key, value) {
                html += "<p>"+value+"</p>";
            });
            $('.attention').append(html);
        });
    }

    function validate(e)
    {
        if(e === "invalid")
            setTimeout(submitName, 0);
    }


    if ($('.wait').length) {
        changeCheckStatus();
    }
    
    function changeCheckStatus() {
        $('.wait').find('.payment-message-success').hide();
        $('.wait').find('.payment-message-wait').show();
        var order = $('.order').val();

        setTimeout(function go() {
            $.ajax({
                url : '/payment/getCheckStatus',
                dataType : 'json',
                method : 'POST',
                data : {
                    'order' : order
                }
            }).done(function (answer) {
                if(answer.transactionStatus != 'Approved') {
                    setTimeout(go, 5000);
                } else {
                    $('.wait').find('.payment-message-success').show();
                    $('.wait').find('.payment-message-wait').hide();
                }
            });
        }, 5000);
        // $.ajax({
        //     url : '/payment/getCheckStatus',
        //     dataType : 'json',
        //     method : 'POST',
        //     data : {
        //         'order' : order
        //     }
        // }).done(function (answer) {
        //     console.log(answer);
        // });
    }
    
});



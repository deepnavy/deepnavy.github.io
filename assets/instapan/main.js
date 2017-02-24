Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

window.onload = function () {

  'use strict';

  var Cropper = window.Cropper;
  var URL = window.URL || window.webkitURL;
  var container = document.querySelector('.container');
  var image = document.querySelector('#image');
  var download = document.getElementById('download');
  var actions = document.getElementById('actions');
  var imageQuant = 2;
  var ua = window.navigator.userAgent;


  var options = {
        aspectRatio: 2,
        zoomable: false,
        movable: false,
        rotatable: false,
        scalable: false,
        ready: function (e) {
          console.log(e.type);
        },
        cropstart: function (e) {
          console.log(e.type, e.detail.action);
        },
        cropmove: function (e) {
          console.log(e.type, e.detail.action);
        },
        cropend: function (e) {
          console.log(e.type, e.detail.action);
        },
        crop: function (e) {
          var data = e.detail;

         
        },
        zoom: function (e) {
          console.log(e.type, e.detail.ratio);
        }
      };
  var cropper = new Cropper(image, options);
  var originalImageURL = image.src;
  var uploadedImageURL;

  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();


  // Buttons
  if (!document.createElement('canvas').getContext) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }

    // Download
  if (typeof download.download === 'undefined') {
    download.className += ' disabled';
  }




  // Options
  actions.querySelector('.docs-toggles').onchange = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var cropBoxData;
    var canvasData;
    var isCheckbox;
    var isRadio;

    if (!cropper) {
      return;
    }

    

    if (target.tagName.toLowerCase() === 'label') {
      target = target.querySelector('input');
    }

    isCheckbox = target.type === 'checkbox';
    isRadio = target.type === 'radio';

    if (isCheckbox || isRadio) {
      if (isCheckbox) {
        options[target.name] = target.checked;
        cropBoxData = cropper.getCropBoxData();
        canvasData = cropper.getCanvasData();

        options.ready = function () {
          console.log('ready');
          cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
        };
      } else {
        options[target.name] = target.value;
        imageQuant = target.value;
        options.ready = function () {
          console.log('ready');
        };
      }
      
      // Restart
      cropper.destroy();
      cropper = new Cropper(image, options);

      

      
    }

    // Methods
  actions.querySelector('.docs-buttons').onclick = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var result;
    var input;
    var data;

    if (!cropper) {
      return;
    }

    while (target !== this) {
      if (target.getAttribute('data-method')) {
        break;
      }

      target = target.parentNode;
    }

    if (target === this || target.disabled || target.className.indexOf('disabled') > -1) {
      return;
    }

    data = {
      method: target.getAttribute('data-method'),
      target: target.getAttribute('data-target'),
      option: target.getAttribute('data-option'),
      secondOption: target.getAttribute('data-second-option')
    };

    if (data.method) {
      if (typeof data.target !== 'undefined') {
        input = document.querySelector(data.target);

        if (!target.hasAttribute('data-option') && data.target && input) {
          try {
            data.option = JSON.parse(input.value);
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      if (data.method === 'getCroppedCanvas') {
        data.option = JSON.parse(data.option);
      }

      result = cropper[data.method](data.option, data.secondOption);

      switch (data.method) {
        case 'scaleX':
        case 'scaleY':
          target.setAttribute('data-option', -data.option);
          break;

        case 'getCroppedCanvas':
          if (result) {

            // Bootstrap's Modal
            $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

            if (!download.disabled) {
              download.href = result.toDataURL('image/jpeg');
            }
          }

          break;

        case 'destroy':
          cropper = null;

          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
            uploadedImageURL = '';
            image.src = originalImageURL;
          }

          break;
      }

      if (typeof result === 'object' && result !== cropper && input) {
        try {
          input.value = JSON.stringify(result);
        } catch (e) {
          console.log(e.message);
        }
      }
    }
  };

    // Import image
  var inputImage = document.getElementById('inputImage');

  if (URL) {
    inputImage.onchange = function () {
      var files = this.files;
      var file;

      if (cropper && files && files.length) {
        file = files[0];

        if (/^image\/\w+/.test(file.type)) {
          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
          }

          image.src = uploadedImageURL = URL.createObjectURL(file);
          cropper.destroy();
          cropper = new Cropper(image, options);
          inputImage.value = null;
        } else {
          window.alert('Please choose an image file.');
        }
      }
    };
  } else {
    inputImage.disabled = true;
    inputImage.parentNode.className += ' disabled';
  }

  $("#aspectRatio2").prop("checked", true)
    
    
  };


  
$( "#download" ).click(function() {
        var result = cropper.getCroppedCanvas();

        var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
        var webkit = !!ua.match(/WebKit/i);
        var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

        console.log('iOSSafari: ' + iOSSafari);
        
        console.log(result);
        // canvas context
        var context = result.getContext("2d");
        // get the current ImageData for the canvas
        var data = context.getImageData(0, 0, result.width, result.height);
        // store the current globalCompositeOperation
        var compositeOperation = context.globalCompositeOperation;
        // set to draw behind current content
        context.globalCompositeOperation = "destination-over";
        //set background color
        context.fillStyle = "#FFFFFF";
        // draw background/rectangle on entire canvas
        context.fillRect(0,0,result.width,result.height);

        var tempCanvas = document.createElement("canvas"),
            tCtx = tempCanvas.getContext("2d");

        tempCanvas.width = result.height;
        tempCanvas.height = result.height;

        var hrefs=[]
        console.log(imageQuant);
        for (var i = 0; i < imageQuant; i++){
            tCtx = tempCanvas.getContext("2d");
            tCtx.drawImage(result,-i*result.height,0);
            hrefs.push(tempCanvas.toDataURL("image/png"));
        }

        console.log(hrefs);

        // write on screen
        //download.href = tempCanvas.toDataURL("image/png");
        if (!iOSSafari){
          downloadAll(hrefs);
        }
        else  {
          iOsAddImagesOnPage(hrefs);
        }

    });
  
    /* Download an img */
    function downloadOne(img, number) {
        var link = document.createElement("a");
        link.href = img;
        link.download = "croppedImage" + (number + 1);
        link.style.display = "none";
        var evt = new MouseEvent("click", {
            "view": window,
            "bubbles": true,
            "cancelable": true
    });

        document.body.appendChild(link);
        link.dispatchEvent(evt);
        document.body.removeChild(link);
        console.log("Downloading...");
    }

    /* Download all images in 'imgs'. 
    * Optionaly filter them by extension (e.g. "jpg") and/or 
    * download the 'limit' first only  */

    function downloadAll(links, ext, limit) {
        /* If specified, filter images by extension */
        if (ext) {
            ext = "." + ext;
            links = [].slice.call(links).filter(function(link) {
                var src = link;
                return (src && (src.indexOf(ext, src.length - ext.length) !== -1));
            });
        }

        /* Determine the number of images to download */
        limit = (limit && (0 <= limit) && (limit <= links.length))
                ? limit : links.length;

        /* (Try to) download the images */
        for (var i = 0; i < limit; i++) {
            var img = links[i];
            downloadOne(img, i);
        }
    }


    function iOsAddImagesOnPage(links){
        var div = document.getElementById("imgsPlaceholder");
        if (div) {
          div.remove();
        }
        div = document.createElement("div");
        div.className = "row";
        div.id = "imgsPlaceholder";
        container.appendChild(div);
        for (var link in links){
          var elem = document.createElement("img");
          elem.src = links[link];
          div.appendChild(elem);
        }


    }

    $(function () {
        $(":file").change(function () {
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = imageIsLoaded;
                reader.readAsDataURL(this.files[0]);
            }
        });
    });

    function imageIsLoaded(e){
        cropper.destroy();
        cropper.replace(e.target.result);
        image = document.querySelector('#image');

        console.log(cropper.getCanvasData());


    }

  
};
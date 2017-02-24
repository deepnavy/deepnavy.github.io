window.onload = function () {

  'use strict';

  var Cropper = window.Cropper;
  var URL = window.URL || window.webkitURL;
  var image = document.querySelector('#image');
  var download = document.getElementById('download');
  var actions = document.getElementById('actions');
  var imageQuant = 1;

  var options = {
        aspectRatio: 16 / 9,
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

    
    
  };


  
$( "#download" ).click(function() {
        var result = cropper.getCroppedCanvas();
        
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

        downloadAll(hrefs);
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
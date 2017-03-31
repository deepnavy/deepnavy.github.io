var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
};

console.log('start');

getJSON('https://opendatabot.com/api/statistics/FOPOpenClose',
function(err, rawData) {
  if (err != null) {
    console.log('Something went wrong');
  } else {

    // mungling data for chart3 - new-close fop
    date = rawData.map(function(id) {
        return id.date;
      });
    count_close = rawData.map(function(id) {
        return id.count_close;
      });
    count_close.forEach(function(item, i, arr) {
      arr[i] = -item;
    });
    count_new = rawData.map(function(id) {
        return id.count_new;
      });

      var min = Math.min.apply(null, count_close),
    max = Math.max.apply(null, count_close);

    console.log(min);
    

    var options = {
      axisX: {
        divisor: 5,
        labelInterpolationFnc: function(value) {
          return moment(value).format('MMM D');
        }
      }
    };

    var data1 = {
      labels: date.slice(1, 15),
      series: [count_new.slice(-15, count_close.length)]
    };

    var data2 = {
      labels: date.slice(1, 15),
      series: [count_close.slice(1, 15)]
    };

    var data3 = {
      labels: date.slice(-15, date.length),
      series: [count_close.slice(-15, count_close.length), count_new.slice(-15, count_new.length)]
    };

    new Chartist.Line('#chart1', data1, options);
    new Chartist.Line('#chart2', data2, options);
    new Chartist.Line('#chart3', data3, options);
  }
});



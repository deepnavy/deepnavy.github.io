moment.locale('uk');

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
      type: 'line',
      data: {
        labels: date.slice(-15, date.length),
        datasets: [{
          fill: false,
          label: 'Відкрито',
          data: count_new.slice(-15, count_new.length),
          borderColor: '#9BC53D',
          borderWidth: 3,
          pointRadius: 2,
          pointBackgroundColor: '#9BC53D',
          backgroundColor: '#9BC53D',
        }, {
          fill: false,
          label: 'Закрито',
          data: count_close.slice(-15, count_close.length),
          borderColor: '#E55934',
          borderWidth: 3,
          pointRadius: 2,
          pointBackgroundColor: '#E55934',
          backgroundColor: '#E55934',
        }]
      },
      options: {
        maintainAspectRatio: false,
        legend: {
            position: 'bottom'
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            },
            type: 'time',
            time: {
              displayFormats: {
                        'millisecond': 'DD.MM',
                        'second': 'DD.MM',
                        'minute': 'DD.MM',
                        'hour': 'DD.MM',
                        'day': 'DD.MM',
                        'week': 'DD.MM',
                        'month': 'DD.MM',
                        'quarter': 'DD.MM',
                        'year': 'DD.MM',
                    },
              tooltipFormat: 'DD MMMM YYYY'

            }
          }],
          yAxes: [{
            ticks: {
              min: -90000
            },
            gridLines: {
              borderDash: [3, 3]
            },
          }]
        },
      }
    };

    var options2 = {
      type: 'line',
      data: {
        labels: date.slice(-15, date.length),
        datasets: [{
          fill: false,
          label: 'Зареєстровано',
          data: count_new.slice(0, 15),
          borderColor: '#9BC53D',
          borderWidth: 3,
          pointRadius: 2,
          pointBackgroundColor: '#9BC53D',
          backgroundColor: '#9BC53D',
        }]
      },
      options: {
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            },
            type: 'time',
            time: {
              displayFormats: {
                        'millisecond': 'DD.MM',
                        'second': 'DD.MM',
                        'minute': 'DD.MM',
                        'hour': 'DD.MM',
                        'day': 'DD.MM',
                        'week': 'DD.MM',
                        'month': 'DD.MM',
                        'quarter': 'DD.MM',
                        'year': 'DD.MM',
                    },
              tooltipFormat: 'DD MMMM YYYY'

            }
          }],
          yAxes: [{
            gridLines: {
              borderDash: [3, 3]
            },
          }]
        },
      }
    };

    var ctx = document.getElementById('openCloseChart').getContext('2d');
    var myChart = new Chart(ctx, options);

    var ctx2 = document.getElementById('qChart').getContext('2d');
    var myChart2 = new Chart(ctx2, options2);
  }
});




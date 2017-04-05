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

    countTotal = rawData.map(function(id) {
        return id.total;
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
    


    var optionsline = {
      type: 'bar',
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
          pointHitRadius: 7,
        }, {
          fill: false,
          label: 'Закрито',
          data: count_close.slice(-15, count_close.length),
          borderColor: '#E55934',
          borderWidth: 3,
          pointRadius: 2,
          pointBackgroundColor: '#E55934',
          backgroundColor: '#E55934',
          pointHitRadius: 7,
        }]
      },
      options: {

        maintainAspectRatio: false,
        legend: {
            position: 'bottom'
        },
        scales: {
          xAxes: [{
            barThickness: 6,
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
            stacked: true,
            /*ticks: {
              min: -90000
            },*/
            gridLines: {
              borderDash: [3, 3]
            },
          }]
        },
      }
    };

    var options = {
      type: 'bar',
      data: {
        labels: date.slice(-15, date.length),
        datasets: [{
          fill: false,
          label: 'Відкрито',
          data: count_new.slice(-15, count_new.length),
          borderColor: '#9BC53D',
          borderWidth: 3,
          //pointRadius: 2,
          pointBackgroundColor: '#9BC53D',
          backgroundColor: '#9BC53D',
          //pointHitRadius: 7,
        }, {
          fill: false,
          label: 'Закрито',
          data: count_close.slice(-15, count_close.length),
          borderColor: '#E55934',
          borderWidth: 3,
          pointRadius: 2,
          pointBackgroundColor: '#E55934',
          backgroundColor: '#E55934',
          //pointHitRadius: 7,
        }]
      },
      options: {
        tooltips: {
            callbacks: {
                title: function(tooltipItems, data) {
                  
                    return moment(data.labels[tooltipItems[0].index]).format('DD MMMM YYYY');
                },

                label: function(tooltipItems, data) {
                    return  data.datasets[tooltipItems.datasetIndex].label + ": " +
                    Math.abs(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]) +
                    ' ФОП';
                }
            }
        },
        maintainAspectRatio: false,
        legend: {
            position: 'bottom'
        },
        scales: {
          xAxes: [{
            barThickness: 10,
            gridLines: {
              display: false
            },
            /*type: 'time',
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

            }*/

            ticks: {
                    // Create scientific notation labels
                    callback: function(value, index, values) {
                        return moment(value).format('DD.MM');
                    }
                }
          }],
          yAxes: [{
            stacked: true,
            /*ticks: {
              min: -90000
            },*/
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
          data: countTotal.slice(-15, countTotal.length),
          borderColor: '#9BC53D',
          borderWidth: 3,
          pointRadius: 2,
          pointBackgroundColor: '#9BC53D',
          backgroundColor: '#9BC53D',
          pointHitRadius: 7,
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
            ticks: {
              min: 1700000
            }
          }]
        },
        annotation: {
          annotations: [{
            id: 'a-line-1', // optional
            type: 'line',
            mode: 'vertical',
            scaleID: 'y-axis-0',
            value: 1,
            borderColor: 'red',
            borderWidth: 2,
            borderDash: [2, 2],
            label: {
              // Background color of label, default below
              backgroundColor: 'rgba(0,0,0,0.8)',

              // Font family of text, inherits from global
              fontFamily: "sans-serif",

              // Font size of text, inherits from global
              fontSize: 12,

              // Font style of text, default below
              fontStyle: "bold",

              // Font color of text, default below
              fontColor: "#fff",

              // Padding of label to add left/right, default below
              xPadding: 6,

              // Padding of label to add top/bottom, default below
              yPadding: 6,

              // Radius of label rectangle, default below
              cornerRadius: 6,

              // Anchor position of label on line, can be one of: top, bottom, left, right, center. Default below.
              position: "center",

              // Adjustment along x-axis (left-right) of label relative to above number (can be negative)
              // For horizontal lines positioned left or right, negative values move
              // the label toward the edge, and negative values toward the center.
              xAdjust: 0,

              // Adjustment along y-axis (top-bottom) of label relative to above number (can be negative)
              // For vertical lines positioned top or bottom, negative values move
              // the label toward the edge, and negative values toward the center.
              yAdjust: 0,

              // Whether the label is enabled and should be displayed
              enabled: true,

              // Text to display in label - default is null
              content: "Закон прийнято"
            },

            // Fires when the user clicks this annotation on the chart
            // (be sure to enable the event in the events array below).
            onClick: function(e) {
              // `this` is bound to the annotation element
            }
          }],

          // Defines when the annotations are drawn.
          // This allows positioning of the annotation relative to the other
          // elements of the graph.
          //
          // Should be one of: afterDraw, afterDatasetsDraw, beforeDatasetsDraw
          // See http://www.chartjs.org/docs/#advanced-usage-creating-plugins
          drawTime: 'afterDraw', // (default)

          // Mouse events to enable on each annotation.
          // Should be an array of one or more browser-supported mouse events
          // See https://developer.mozilla.org/en-US/docs/Web/Events
          events: ['click'],
        }
      }
    };

    var ctx = document.getElementById('openCloseChart').getContext('2d');

    
    var myChart = new Chart(ctx, options, {
        tooltipEvents: ["mousemove", "touchstart", "touchmove"],
    });

    var ctx2 = document.getElementById('qChart').getContext('2d');
    var myChart2 = new Chart(ctx2, options2, {
        tooltipEvents: ["mousemove", "touchstart", "touchmove"],
    });
  }
});




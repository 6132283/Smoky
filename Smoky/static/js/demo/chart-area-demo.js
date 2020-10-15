// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

var num_of_graph_points = 0;
var id_lastread=0;
var displayCoSensore1 = true;
var displaySmokeSensore1 = true;
var displayLpgSensore1 = true;



function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}


function addData(chart, id_new, co_new, smoke_new, lpg_new, date_new, sensor_id) {

    if(id_new > localStorage.getItem("last_id_displayed")) {
    console.log("Id:" + id_new + " co:" + co_new + " smoke: " + smoke_new +" gas: "+ lpg_new +" data: "+ date_new+" sensor ID: "+sensor_id);

        chart.data.labels.push(date_new.slice(11,19));
        chart.data.datasets[2].data.push(co_new);
        chart.data.datasets[0].data.push(smoke_new);
        chart.data.datasets[1].data.push(lpg_new);


              if (num_of_graph_points > 8){
                  chart.data.labels.shift();
                  chart.data.datasets.forEach((dataset) => {
                  dataset.data.shift();})
              }

              else
                {num_of_graph_points++;}

  chart.update();
}
}


function askServer(chart, sensorIDToAsk){

  $.ajax({
  method: 'GET',
  url: 'http://smokysmokysmoky.com/sensor_getlastdata.php',
  dataType: 'json', //change the datatype to 'jsonp' works in most cases
  data: {
    sensorID: sensorIDToAsk,
  },

  success: (res) => {
    addData(chart, res[0].ID, res[0].co2, res[0].smoke, res[0].gas, res[0].date, res[0].sensorID);
    id_lastread = res[0].ID;
    localStorage.setItem("last_id_displayed",res[0].ID);

  }

});
}

function ready() {
    alert('DOM is ready');
  }

function switchOnOffDataset(chart, sensorAttribute){ //sensorNumber e' 1 o 2 con 2 dispositivi

  let variableToModify;
  let indexOfMeasurement; //identifica quale linea del grafico va a toccare
  let sensorSpecific; //es. sensore 1 lpg

  switch(sensorAttribute) {

    case "lpg":
      indexOfMeasurement = 1;
      variableToModify = displayLpgSensore1;
      displayLpgSensore1 = !displayLpgSensore1;
      break;

    case "co":
      indexOfMeasurement = 2;
      variableToModify = displayCoSensore1;
      displayCoSensore1 = !displayCoSensore1;
      break;

    case "smoke":
      indexOfMeasurement = 0;
      variableToModify = displaySmokeSensore1;
      displaySmokeSensore1 = !displaySmokeSensore1;
      break;
  }

        chart.data.datasets[indexOfMeasurement].hidden = !chart.data.datasets[indexOfMeasurement].hidden;

};




// Area Chart Example
var ctx = document.getElementById("myAreaChart");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: "Smoke",
      lineTension: 0.3,
      backgroundColor: "rgba(255, 24, 25, 0.05)",
      borderColor: "rgba(255, 24, 25, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(255, 24, 25, 1)",
      pointBorderColor: "rgba(255, 24, 25, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(255, 24, 25, 1)",
      pointHoverBorderColor: "rgba(255, 24, 25, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: [],
    },
      {
      label: "Gpl",
      lineTension: 0.3,
      backgroundColor: "rgba(100, 115, 223, 0.05)",
      borderColor: "rgba(100, 115, 223, 1)",
      pointRadius: 2,
      pointBackgroundColor: "rgba(78, 115, 223, 1)",
      pointBorderColor: "rgba(78, 115, 223, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
      pointHoverBorderColor: "rgba(78, 115, 223, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: [],
    },
      {
      label: "CO",
      lineTension: 0.3,
      backgroundColor: "rgba(255, 165, 0, 0.05)",
      borderColor: "rgba(255, 165, 0, 1)",
      pointRadius: 2,
      pointBackgroundColor: "rgba(255, 165, 0, 1)",
      pointBorderColor: "rgba(255, 165, 0, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(255, 165, 0, 1)",
      pointHoverBorderColor: "rgba(255, 165, 0, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: [],
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 20
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 7
        },
        scaleLabel: {
        display: true,
        labelString: 'Orario campionamento'
      }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 6,
          padding: 10,
          beginAtZero: true,

        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        },
       scaleLabel: {
        display: true,
        labelString: 'Concentrazione (in ppm)'
      }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': ' + number_format(tooltipItem.yLabel)+' ppm';
        }
      }
    }
  }
});

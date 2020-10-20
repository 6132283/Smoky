// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function SensorRow() {
  this.num_of_graph_points = 0;
  this.id_lastread = 0;
}


function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  let n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      let k = Math.pow(10, prec);
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


function addData(chart, id_new, co_new, smoke_new, lpg_new, date_new, sensor_id, sensorRow) {

    if(id_new > sensorRow.id_lastread) {
    console.log("Id:" + id_new + " co:" + co_new + " smoke: " + smoke_new +" gas: "+ lpg_new +" data: "+ date_new+" sensor ID: "+sensor_id);

        chart.data.labels.push(date_new.slice(11,19));
        chart.data.datasets[2].data.push(co_new);
        chart.data.datasets[0].data.push(smoke_new);
        chart.data.datasets[1].data.push(lpg_new);


              if (sensorRow.num_of_graph_points > 8){ //questo deve essere un attributo di classe, altrimenti i pallini del secondo grafico non vengono messi
                  chart.data.labels.shift();
                  chart.data.datasets.forEach((dataset) => {
                  dataset.data.shift();})
              }

              else
                {sensorRow.num_of_graph_points++;}

  chart.update();
}
}


function createGraphSpace(areaChartId)
{
  let g = document.createElement('canvas');
  g.setAttribute("id", areaChartId);
  document.getElementsByClassName("graph-place-holder")[0].append(g);
}

function askServer(chart, sensorIDToAsk, sensorRow){
  $.ajax({
  method: 'GET',
  url: 'http://smokysmokysmoky.com/sensor_getlastdata.php',
  dataType: 'json', //change the datatype to 'jsonp' works in most cases
  data: {
    sensorID: sensorIDToAsk,
  },

  success: (res) => {
    addData(chart, res[0].ID, res[0].co2, res[0].smoke, res[0].gas, res[0].date, res[0].sensorID, sensorRow);
    sensorRow.id_lastread = res[0].ID;

  }

});
}






function switchOnOffDataset(chart, sensorAttribute){ //sensorNumber e' 1 o 2 con 2 dispositivi

  let indexOfMeasurement;

  switch(sensorAttribute) {

    case "lpg":
      indexOfMeasurement = 1;
      break;

    case "co":
      indexOfMeasurement = 2;
      break;

    case "smoke":
      indexOfMeasurement = 0;
      break;
  }

        chart.data.datasets[indexOfMeasurement].hidden = !chart.data.datasets[indexOfMeasurement].hidden;

}

function switchOnOffDatasetCO(chart){
          chart.data.datasets[2].hidden = !chart.data.datasets[2].hidden;
}

function switchOnOffDatasetSmoke(chart){
          chart.data.datasets[0].hidden = !chart.data.datasets[0].hidden;
}

function switchOnOffDatasetLpg(chart){
          chart.data.datasets[1].hidden = !chart.data.datasets[1].hidden;
}



function createGraph(graphName, sensorToAsk) {
// Area Chart Example
  let ctx = document.getElementById(graphName);
  let sensorRow = new SensorRow();

  let myLineChart = new Chart(ctx, {
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
          label: function (tooltipItem, chart) {
            let datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ': ' + number_format(tooltipItem.yLabel) + ' ppm';
          }
        }
      }
    }
  });

    setInterval(async function () {
    askServer(myLineChart,sensorToAsk,sensorRow);
    }, 2000);

    return myLineChart;
}


function createNewSensorGraph(graphName, sensorNumber) {
  let node = document.getElementById("graph-row");
  let clone = node.cloneNode(true);
  clone.getElementsByClassName("chart-area")[0].innerHTML = "<canvas id = '" + graphName + "'></canvas>";
  clone.getElementsByClassName("graph-title")[0].innerHTML= graphName;
  document.getElementById("graph-body").appendChild(clone);
  newChart1 = createGraph(graphName, sensorNumber); //dato un Id che do in input posso creare un grafico autoaggiornante

  coButtonid = graphName + "0";
  smokeButtonid = graphName + "ciao1";
  gplButtonid = graphName + "ciao2";

  coButton = "<div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='"+ coButtonid +"'  onclick='switchOnOffDatasetCO(newChart1);'+' checked><label class='custom-control-label' for='"+coButtonid+"'>CO</label></div>";
  smokeButton = "<div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='"+ smokeButtonid +"'  onclick='switchOnOffDatasetSmoke(newChart1);'+' checked><label class='custom-control-label' for='" + smokeButtonid + "'>Fumo</label></div>";
  gplButton = "<div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='"+ gplButtonid +"'  onclick='switchOnOffDatasetLpg(newChart1);'+' checked><label class='custom-control-label' for='" + gplButtonid + "'>Gpl</label></div>";
  clone.getElementsByClassName("bottoniera")[0].innerHTML = coButton + smokeButton + gplButton;

}
createGraphSpace("myAreaChart");//questa funzione e' da generalizzare
newChart = createGraph("myAreaChart",1); //dato un Id che do in input posso creare un grafico autoaggiornante

const varToString = varObj => Object.keys(varObj)[0];
let ok = document.getElementById("customSwitches1");
ok.setAttribute("onclick","switchOnOffDataset(" + varToString({newChart}) +",'co');");
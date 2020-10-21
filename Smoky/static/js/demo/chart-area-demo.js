// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

let obj = "ok";

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


function getAllCsv(){

  $.ajax({
  method: 'GET',
  url: 'http://smokysmokysmoky.com/sensor.php',
  dataType: 'json',


  success: (res) => {
    var data = new Blob([convert(res)], {type : 'application/json'});
    var url = window.URL.createObjectURL(data);
    document.getElementById('download_link').href = url;
  }

});
}

document.getElementById("download_link" ).click();

	/**
	 *
	 * CSVJSON.json2csv(data, options)
	 *
	 * Converts JSON to CSV
	 *
	 * Available options:
	 *  - separator: Character which acts as separator. For CSV use a comma (,).
	 *               For TSV use a tab (\t).
   *  - flatten: Boolean indicating whether to flatten nested arrays or not.
   *             Optional. Default false.
   *  - output_csvjson_variant: Boolean indicating whether to output objects and
   *             arrays as is as per the CSVJSON format variant. Default is false.
	 *
	 * Copyright (c) 2018-2019 Martin Drapeau
	 *
	 */

	var errorMissingSeparator = 'Missing separator option.',
		  errorEmpty = 'JSON is empty.',
		  errorEmptyHeader = 'Could not detect header. Ensure first row contains your column headers.',
		  errorNotAnArray = 'Your JSON must be an array or an object.',
		  errorItemNotAnObject = 'Item in array is not an object: {0}';

  function flattenArray(array, ancestors) {
    ancestors || (ancestors = []);

    function combineKeys(a, b) {
      var result = a.slice(0);
      if (!Array.isArray(b)) return result;
      for (var i = 0; i < b.length; i++)
        if (result.indexOf(b[i]) === -1) result.push(b[i]);
      return result;
    }

    function extend(target, source) {
      target = target || {};
      for (var prop in source) {
        if (typeof source[prop] === 'object') {
          target[prop] = extend(target[prop], source[prop]);
        } else {
          target[prop] = source[prop];
        }
      }
      return target;
    }

    var rows = [];
    for (var i = 0; i < array.length; i++) {
      var o = array[i],
          row = {},
          orows = {},
          count = 1;



      var keys = getKeys(o);
      for (var k = 0; k < keys.length; k++) {
        var value = o[keys[k]],
            keyChain = combineKeys(ancestors, [keys[k]]),
            key = keyChain.join('.');
        if (Array.isArray(value)) {
          orows[key] = flattenArray(value, keyChain);
          count += orows[key].length;
        } else {
          row[key] = value;
        }
      }

      if (count == 1) {
        rows.push(row);
      } else {
        var keys = getKeys(orows);
        for (var k = 0; k < keys.length; k++) {
          var key = keys[k];
          for (var r = 0; r < orows[key].length; r++) {
            rows.push(extend(extend({}, row), orows[key][r]));
          }
        }
      }
    }
    return rows;
  }

  function isObject(o) {
    return o && typeof o == 'object';
  }

  function getKeys(o) {
    if (!isObject(o)) return [];
    return Object.keys(o);
  }
	function convert(data, options) {
		options || (options = {});


    if (!Array.isArray(data)) data = [data];

    var separator = options.separator || ',';
		if (!separator) throw errorMissingSeparator;

    var flatten = options.flatten || false;
    if (flatten) data = flattenArray(data);

    var allKeys = [],
        allRows = [];
    for (var i = 0; i < data.length; i++) {
    	var o = data[i],
    			row = {};

    	var keys = getKeys(o);
    	for (var k = 0; k < keys.length; k++) {
    		var key = keys[k];
    		if (allKeys.indexOf(key) === -1) allKeys.push(key);
    		var value = o[key];
    		if (value === undefined && value === null) continue;
        if (typeof value == 'string') {
          row[key] = '"' + value.replace(/"/g, options.output_csvjson_variant ? '\\"' : '""') + '"';
          if (options.output_csvjson_variant) row[key] = row[key].replace(/\n/g, '\\n');
        } else {
          row[key] = JSON.stringify(value);
          if (!options.output_csvjson_variant && (isObject(value) || Array.isArray(value)))
            row[key] = '"' + row[key].replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
        }
    	}
    	allRows.push(row);
    }

    keyValues = [];
    for (var i = 0; i < allKeys.length; i++) {
      keyValues.push('"' + allKeys[i].replace(/"/g, options.output_csvjson_variant ? '\\"' : '""') + '"');
    }

    var csv = keyValues.join(separator)+'\n';
    for (var r = 0; r < allRows.length; r++) {
    	var row = allRows[r],
    			rowArray = [];
    	for (var k = 0; k < allKeys.length; k++) {
    		var key = allKeys[k];
    		rowArray.push(row[key] || (options.output_csvjson_variant ? 'null' : ''));
    	}
    	csv += rowArray.join(separator) + (r < allRows.length-1 ? '\n' : '');
    }

    return csv;
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



function createNewSensorGraph(graphName, sensorNumber) {
  let node = document.getElementById("graph-row");
  let clone = node.cloneNode(true);
  clone.getElementsByClassName("chart-area")[0].innerHTML = "<canvas id = '" + graphName + "'></canvas>";
  clone.style["display"] = "flex";
  clone.getElementsByClassName("graph-title")[0].innerHTML = graphName;
  clone.getElementsByClassName("sensors-text")[0].textContent ="HEY HEY";  //TODO modificare questo testo (con linea precedente)
  document.getElementById("graph-body").appendChild(clone);
  newChart1 = createGraph(graphName, sensorNumber); //dato un Id che do in input posso creare un grafico autoaggiornante
  let random = Math.random().toString(36).substring(7);
  coButtonid = graphName + "coButton" + random;
  smokeButtonid = graphName + "smokeButton" + random;
  gplButtonid = graphName + "gplButton" + random;
  coButton = "<div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='"+ coButtonid +"'  onclick='switchOnOffDatasetCO(newChart1);'+' checked><label class='custom-control-label' for='"+coButtonid+"'>CO</label></div>";
  smokeButton = "<div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='"+ smokeButtonid +"'  onclick='switchOnOffDatasetSmoke(newChart1);'+' checked><label class='custom-control-label' for='" + smokeButtonid + "'>Fumo</label></div>";
  gplButton = "<div class='custom-control custom-switch'><input type='checkbox' class='custom-control-input' id='"+ gplButtonid +"'  onclick='switchOnOffDatasetLpg(newChart1);'+' checked><label class='custom-control-label' for='" + gplButtonid + "'>Gpl</label></div>";
  clone.getElementsByClassName("bottoniera")[0].innerHTML = coButton + smokeButton + gplButton;


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

}


document.getElementById("newGraphButton").onclick = function(){

  graphName = document.getElementById("graphname").value;
  sensorNumber = document.getElementById("sensorid").value;
  createNewSensorGraph(graphName,sensorNumber)

};


function prova1(){
    var elmnt = document.getElementById("creators");
  elmnt.scrollIntoView();
}




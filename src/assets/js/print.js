
/* Zebra Printer Print Barcode */

var available_printers = null;
var selected_category = null;
var default_printer = null;
var selected_printer = null;
var format_start = "^XA^LL200^FO80,50^A0N36,36^FD";
var format_end = "^FS^XZ";
var default_mode = true;

function checkZebraPrinter(callback) {
  selected_printer = null;
  available_printers = null;
  default_printer = null;

  BrowserPrint.getDefaultDevice('printer', function(printer) {
      default_printer = printer
      if ((printer != null) && (printer.connection != undefined)) {
        selected_printer = printer;
        callback({status:'success',message:'Printer is available',printer:printer});
      }
      BrowserPrint.getLocalDevices(function(printers) {
        available_printers = printers;
        var printers_available = available_printers.length>0?true:false;
        if(!printers_available) {
          callback({status:'error',message:'No Zebra Printers could be found!'});
          return;
        }
      }, undefined, 'printer');
    },
    function(error_response) {
      callback({status:'error',message:"Failed to connect zebra printer. Please contact admin."});
    });
};

function printBarcode(selected_printer,barcodeNo,callback) {
  checkPrinterStatus(function(text) {
    if (text == "Ready to Print") {
      model=selected_printer.name;
      labelText = "^XA"; // Start command
      labelText += "^CF0,12"; // Font size
      labelText += "^FO20,115^FDModel: " + model + "^FS"; // Set Model
      labelText += "^BY2,2,74^FT45,90^B3N,N,,Y,N"; // Set barcode format
      labelText += "^FD" + barcodeNo + "^FS"; // Set barcode data
      labelText += "^PQ1,0,1,Y^XZ"; // End command

      selected_printer.send(labelText, ()=>{
        callback({status:'success',message:'Print completed'});
      }, (error)=>{
        callback({status:'error',message:'Failed to take print: '+error});
      });
    } else {
      callback({status:'error',message:'Failed to take print: '+text});
    }
  });
};



function checkPrinterStatus(finishedFunction) {
  selected_printer.sendThenRead("~HQES",
    function(text) {
      var that = this;
      var statuses = new Array();
      var ok = false;
      var is_error = text.charAt(70);
      var media = text.charAt(88);
      var head = text.charAt(87);
      var pause = text.charAt(84);
      // check each flag that prevents printing
      if (is_error == '0') {
        ok = true;
        statuses.push("Ready to Print");
      }
      if (media == '1')
        statuses.push("Paper out");
      if (media == '2')
        statuses.push("Ribbon Out");
      if (media == '4')
        statuses.push("Media Door Open");
      if (media == '8')
        statuses.push("Cutter Fault");
      if (head == '1')
        statuses.push("Printhead Overheating");
      if (head == '2')
        statuses.push("Motor Overheating");
      if (head == '4')
        statuses.push("Printhead Fault");
      if (head == '8')
        statuses.push("Incorrect Printhead");
      if (pause == '1')
        statuses.push("Printer Paused");
      if ((!ok) && (statuses.Count == 0))
        statuses.push("Error: Unknown Error");
      finishedFunction(statuses.join());
    }, printerError);
};

function printerError(text) {
  console.log("An error occurred while printing. Please try again." + text);
}
function openInNewTab(href) {
  Object.assign(document.createElement('a'), {
    target: '_blank',
    rel: 'noopener noreferrer',
    href: href,
  }).click();
}

function objectToParams(data) {
  return Object.keys(data).map(key => `${key}=${encodeURIComponent(typeof(data[key])!='undefined'?data[key]:'')}`).join('&');
}

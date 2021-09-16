






//caricamento dei valori dal local storage alle variabili per generare il json
var buisnessName = localStorage.getItem('NOMERES');
var startDate = localStorage.getItem('STARTRES');
var endDate = localStorage.getItem('ENDRES');



function setAccountingInfo(bodyData, buisnessName, startDate, endDate) {

  // Set accounting info

  let accountingInfoDocChange = {

    "document": {

      "fileVersion": "1.0.0",

      "creator": {

        "name": "FinancialPlaWriter",

        "version": "1.0.0"

      },

      "dataUnits": [

        {

          "nameXml": "FileInfo",

          "data": {

            "rowLists": [

              {

                "rows": [

                  // defined aftewards

                ]

              }

            ]

          }

        }

      ]

    }

  };



  // Define accounting's header

  // See https://www.banana.ch/doc/en/node/9641#properties_of_dataunits

  accountingInfoDocChange.document.dataUnits[0].data.rowLists[0].rows.push(

    {

      "fields": {

        "SectionXml": "Base",

        "IdXml": "HeaderLeft",

        "ValueXml": buisnessName

      },

      "operation": {

        "name": "modify"

      }

    }

  );



  // Define accounting's start date

  accountingInfoDocChange.document.dataUnits[0].data.rowLists[0].rows.push(

    {

      "fields": {

        "SectionXml": "AccountingDataBase",

        "IdXml": "OpeningDate",

        "ValueXml": startDate.split("-").join("")

      },

      "operation": {

        "name": "modify"

      }

    }

  );



  // Define accounting's end date

  accountingInfoDocChange.document.dataUnits[0].data.rowLists[0].rows.push(

    {

      "fields": {

        "SectionXml": "AccountingDataBase",

        "IdXml": "ClosureDate",

        "ValueXml": endDate.split("-").join("")

      },

      "operation": {

        "name": "modify"

      }

    }

  );



  bodyData.data.data.push(accountingInfoDocChange);

};



function setAccountingLiquid(bodyData, repeatLiquid, dateLiquid, importLiquid){

  

  let accountingAccountsTableDocChange = {

    "document": {

      "fileVersion": "1.0.0",

      "creator": {

        "name": "FinancialPlaWriter",

        "version": "1.0.0"

      },

      "dataUnits": [

        {

          "nameXml": "Accounts",

          "data": {

            "rowLists": [

              {

                "rows": [

                  // defined aftewards

                ]

              }

            ]

          }

        }

      ]

    }

  };

  // Define accounts

  // See https://www.banana.ch/doc/en/node/9641#properties_of_dataunits

  accountingAccountsTableDocChange.document.dataUnits[0].data.rowLists[0].rows.push(

    {

      "fields": {

        "Account": "1000",

        "Description": "liquidità",

        "Opening": importLiquid,

        "BClass": "1",

        "Gr" : "11"

      },

      "operation": {

        "name": "add"

      }

    }

  );

  bodyData.data.data.push(accountingAccountsTableDocChange);


    // Set budget transactions

  bodyData.data.data.push(

    {

      "document": {

        "fileVersion": "1.0.0",

        "creator": {

          "name": "FinancialPlaWriter",

          "version": "1.0.0"

        },

        "dataUnits": [

          {

            "nameXml": "Budget",

            "data": {

              "rowLists": [

                {

                  "rows": [

                    {

                      "fields": {

                        "Date": dateLiquid.split("-").join(""),

                        "Repeat": repeatLiquid,

                        "Description": "Total montly sales",

                        "AccountDebit": "1000",

                        "Amount": importLiquid

                      },

                      "operation": {

                        "name": "add"

                      }

                    }

                  ]

                }

              ]

            }

          }

        ]

      }

    }

  );

  

};



async function sendJsonData() {
  // Documentation:
  // - bodyData: http request POST "/v1/doc" see https://github.com/BananaInternal/financial-forecast-data-entry/blob/main/doc/banana-api.md
  // - bodyData.data: see documenthchange documentation https://www.banana.ch/doc/en/node/9641
  // - bodyData.command.code: see https://www.banana.ch/doc/en/node/4714
  // Define initial structure of body data
  // See https://github.com/BananaInternal/financial-forecast-data-entry/blob/main/doc/banana-api.md

  //inizalizzazione valori liquidità
  var repeatLiquid = document.getElementById("repeatLiquid").value;
  var dateLiquid = document.getElementById("dateLiquid").value;
  var importLiquid = document.getElementById("importLiquid").value;

  // Define document body data
  let bodyData = {

    "fileType": {

      "accountingType": {

        "docGroup": 100,

        "docApp": 100,

        "decimals": 2

      }

    },

    "data": {

      "format": "documentchange",

      "error": "",

      "data": [

        // document change data is inserted afterwards

      ]

    },

    "command": {

      "language": "js",

      "code": "", // code is inserted afterwards

      "content-type": "application/json"

    }

  };
  // Define document change data --> bodyData.data.data
  // See https://www.banana.ch/doc/en/node/9641

  let documentChange = {

    "format": "documentchange",

    "error": "",

    "data": [

      // document change data is inserted afterwards

    ]

  };
  bodyData.data = documentChange;

  //load first information
  setAccountingInfo(bodyData, buisnessName, startDate, endDate);
  
  //load liquid registration
  if ( document.getElementsByClassName("infoReadButton liquid infoUnreadButton").length > 0 ) {
    setAccountingLiquid(bodyData, repeatLiquid, dateLiquid, importLiquid);
  }
  
  // Script to be executed on the accounting by Banana
  // See https://www.banana.ch/doc/en/node/4714
  let commnadScript = function (param) {

    var result = {};

    // Banana.document.budgetBalances see See https://www.banana.ch/doc/en/node/7711

    result.TimeEndVerify = Banana.document.endPeriod();

    // Banana.console.log see https://www.banana.ch/doc/en/node/8370

    Banana.console.log(result.TimeEndVerify);

    return JSON.stringify(result);

  };

  // Prepare script to be inserted in the command property
  // Stringify it and rename the function to be 'exec(param)'
  let commandJsonScript = commnadScript.toString();
  commandJsonScript = commandJsonScript.replace(/function *\(param\)/, "function exec(param)");
  bodyData.command.code = commandJsonScript;
  console.log(JSON.stringify(bodyData, null, '   '));

  let response = await fetch('http://localhost:8081/v1/doc?show', {

    method: 'POST', // or 'PUT'

    headers: {

      'Content-Type': 'application/json',

    },

    body: JSON.stringify(bodyData),

  })

  let text = await response.text(); // read response body as text

  console.log(JSON.parse(text));

  let jsonObj = JSON.parse(text);

  //verifico che il json abbia raggiunto il client di banana
  //chiedendogli la data di fine contabilità
  // se una data esiste nel client di Banana allora il file json è stato inviato correttamente e si può proseguire 
  if(jsonObj.TimeEndVerify.length < 10){
    document.location.href="index.html";
    alert("oh no! something is wrong");
  } else {
    //document.location.href="";
    alert("it's working");
  }

  //vengono immagazzinati i valori precedentemente salvati nella pagina index.html
  // nel caso di chiusura della pagina gli stessi valori saranno presenti nella pagina se riaperta
  localStorage.setItem("NOMERES", buisnessName);
  localStorage.setItem("STARTRES", startDate);
  localStorage.setItem("ENDRES", endDate);
  
  return;
};
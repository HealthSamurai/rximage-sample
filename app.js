var app = angular.module('app', []);

function searchResource ($http, scope, opts) {
    $http(
	{	method: 'GET',
		url: 'https://open-ic.epic.com/FHIR/' + opts.fhirServiceUrl + '/Patient/' + opts.patientId
	}).then(
	    function(resp) {
		scope[opts.key].push(resp.data);
		//console.log(resp);
	    }, 
	    function(err) { 
		console.error(err);
	    });
}

function searchMedicationStatements ($http, scope, opts) {
    
    $http({
	method: 'GET',
	url: 'https://open-ic.epic.com/FHIR/' + opts.fhirServiceUrl + '/MedicationStatement?patient=' + opts.patientId
    }).then(
	function(resp) {
	    scope[opts.key] = resp.data.entry.map((x)=>{return x.resource;});
	    //console.log(scope[opts.key]);
            //console.log(resp);
	}, 
	function(err) { 
	    console.error(err);
	});
}

function searchRxImage($http, scope, med) {
    $http({
        method: 'GET',
        url: "https://rximage.nlm.nih.gov/api/rximage/1/rxnav",
        params: {rxcui: med.medicationCodeableConcept.coding[0].code}
    }).then(function(resp) {
        scope.images = resp.data;
    }, function(err) { console.error(err); });
}


function searchMeds($http, pt, scope){
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    variable
}


function rootCtrl($http) {
    var $scope = this;
    var fhirServiceUrl = getQueryVariable("fhirServiceUrl");
    var patientId = getQueryVariable("patientId");

    console.log(fhirServiceUrl);
    console.log(patientId);
    
    $scope.patients = [];
    
    
    /* Patients
       with medications
       
       TiJ59owlXkDJCHUrYIjshK5eGNI5bO14fBmpv5vssdw8B
       TUKRxL29bxE9lyAcdTIyrWC6Ln5gZ-z7CLr2r-2SY964B
       Tbt3KuCY0B5PSrJvCu2j-PlK.aiHsu2xUjUM8bWpetXoB
       
       no medications
       
       ToHDIzZiIn5MNomO309q0f7TCmnOq6fbqOAWQHA1FRjkB
       Tn5PIy82IrFp7xASQoAb5J45HAll2Sap3SzQnHBPM.kIB
       TG9gWZbqlRvTPVZRM5ZE0sDSvsfTDu8MjhLKdTTHClQkB
       TRvrqLQ7wHP8v1BfKkYOvbrFj1ZAhteRv6Tcv40nTTYoB
       Tj3ASWM6fYfjPJ8IMdK4vrLvyd8vR1crSY1EYPap14hMB
       Tt.ozkoEh2-Kc6KfzsnFFLb-bD-FGZJk6gCno4QlSN7oB
       TwncfOQytqCYtmJKvdpDOSU7U1upj6s9crg-PFHQgSO0B
       TjCjF-tnRjUTB4LE.iDJUsNHYATLKtDUSAurMUsjaqIAB
       TzsTawqL3L-YctlpY-FKySaxDr3NUZjpC.AXIXO3s4AQB
       TQrAIkvOPU0QOc1wFKimzNmqYKpt8BGbWLpUKG5vttAYB
       T8jqzCgsOmWCtYJedjRsW.iKTpNDaPR.3u0kFzRE8QCgB
       TiJ59owlXkDJCHUrYIjshK5eGNI5bO14fBmpv5vssdw8B
    */
    
    searchResource($http, $scope, {fhirServiceUrl: fhirServiceUrl, patientId: patientId, key: "patients"});
    // searchResource($http, $scope, {patientId: 'Tbt3KuCY0B5PSrJvCu2j-PlK.aiHsu2xUjUM8bWpetXoB', key: "patients"});
    // searchResource($http, $scope, {patientId: 'TUKRxL29bxE9lyAcdTIyrWC6Ln5gZ-z7CLr2r-2SY964B', key: "patients"});

    
    
    this.selectPt  = (pt)=>{
        $scope.pt = pt;
        searchMedicationStatements($http, $scope, {fhirServiceUrl: fhirServiceUrl, patientId: pt.id, key: "medications"});
    };
    
    this.selectMed  = (med)=>{
        $scope.med = med;
        searchRxImage($http, $scope, med);
    };
    
    /* searchResource($http, $scope, {resourceType: "Patient", key: "patients"}, {_elements: 'id,name'});

       this.selectPt  = (pt)=>{
       $scope.pt = pt;
       searchResource($http, $scope, {resourceType: "MedicationStatement", key: "medications"}, {patient: pt.id});
       };

       this.selectMed  = (med)=>{
       $scope.med = med;
       searchRxImage($http, $scope, med);
       };*/
};

app.controller('root', rootCtrl);

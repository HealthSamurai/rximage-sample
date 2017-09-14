console.log("here");

var app = angular.module('app', []);

function searchResource($http, scope, opts, params) {
    $http({
        method: 'GET',
        url: 'https://sansara.health-samurai.io/' + opts.resourceType,
        params: params
    }).then(function(resp) {
        scope[opts.key] = resp.data.entry.map((x)=>{return x.resource;});
    }, function(err) { console.error(err);});
}

function searchRxImage($http, scope, med) {
    $http({
        method: 'GET',
        url: "https://rximage.nlm.nih.gov/api/rximage/1/rxnav",
        params: {rxcui: med.medication.CodeableConcept.coding[0].code}
    }).then(function(resp) {
        scope.images = resp.data;
    }, function(err) { console.error(err); });
}


function searchMeds($http, pt, scope){
}

function rootCtrl($http) {
    var $scope = this;

    searchResource($http, $scope, {resourceType: "Patient", key: "patients"}, {_elements: 'id,name'});

    this.selectPt  = (pt)=>{
        $scope.pt = pt;
        searchResource($http, $scope, {resourceType: "MedicationStatement", key: "medications"}, {patient: pt.id});
    };

    this.selectMed  = (med)=>{
        $scope.med = med;
        searchRxImage($http, $scope, med);
    };
};

app.controller('root', rootCtrl);

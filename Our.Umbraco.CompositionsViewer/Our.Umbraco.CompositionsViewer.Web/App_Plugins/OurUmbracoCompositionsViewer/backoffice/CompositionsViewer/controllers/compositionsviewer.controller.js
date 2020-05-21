angular.module("umbraco").controller("compositionsviewercontroller", function (contentTypeResource, localizationService) {
    var vm = this;
    vm.title = "";
    vm.description = "";
    vm.results = [];
    
    vm.init = function() {
        var labelKeys = [
            "compositionsViewer_title",
            "compositionsViewer_description"
        ];

        localizationService.localizeMany(labelKeys).then(function (data) {
            vm.title = data[0];
            vm.description = data[1];
        });
    }

    vm.getData = function() {
        contentTypeResource.getAll().then(
            function(allDocTypes) {
                angular.forEach(allDocTypes,
                    function(docType) {
                        contentTypeResource.getWhereCompositionIsUsedInContentTypes(docType.id).then(
                            function (response) {
                                if (response.length > 0) {
                                    var documentTypes = [];
                                    angular.forEach(response,
                                        function (item) {
                                            documentTypes.push(item);
                                        });
                                    var resultItem = { composition: docType, documentTypes: documentTypes };
                                    vm.results.push(resultItem);
                                }
                            });
                    });
                console.log(vm.results);
            });
    }

    vm.getData();

    vm.init();

    vm.goToNode = function (id) {
        window.location.replace('#/settings/documentTypes/edit/'+id);
    }

});
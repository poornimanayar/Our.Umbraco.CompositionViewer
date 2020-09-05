angular.module("umbraco").controller("compositionsviewercontroller", function (contentTypeResource, editorService, localizationService, $scope) {
    var vm = this;
    vm.title = "";
    vm.description = "";
    vm.results = [];
    vm.selectedcomposition = null;
    $scope.initialising = true;

    vm.init = function () {
        var labelKeys = [
            "compositionsViewer_title",
            "compositionsViewer_description"
        ];

        localizationService.localizeMany(labelKeys).then(function (data) {
            vm.title = data[0];
            vm.description = data[1];
        });
    }

    vm.getData = function () {
        contentTypeResource.getAll().then(
            function (allDocTypes) {
                angular.forEach(allDocTypes,
                    function (docType) {
                        contentTypeResource.getWhereCompositionIsUsedInContentTypes(docType.id).then(
                            function (response) {
                                if (response.length > 0) {
                                    var documentTypes = [];
                                    angular.forEach(response,
                                        function (item) {
                                            documentTypes.push(item);
                                        });
                                    var resultItem = { composition: docType, documentTypes: documentTypes, show: '1' };
                                    vm.results.push(resultItem);
                                }
                            });
                    });
                $scope.initialising = false;
            });
    }

    vm.getData();

    vm.init();

    vm.goToNode = function (id) {

        var options = {
            id: id,
            submit: function () {
                // when the user saves the doctype, 
                // you could refresh the view ? 
                // (they might have added / removed compositions)
                editorService.close();
            },
            close: function () {
                editorService.close();
            }
        };

        editorService.documentTypeEditor(options);
    }

    vm.filter = function () {
        if (vm.selectedcomposition === null) {
            vm.results.forEach(function (result) {
                result.show = '1';
            });
        } else {
            vm.results.forEach(function (result) {
                if (result.composition.id === vm.selectedcomposition) {
                    result.show = '1';
                }
                else {
                    result.show = '0';
                }
            });
        }
    }
});
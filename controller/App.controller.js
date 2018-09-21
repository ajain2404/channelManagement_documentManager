sap.ui.define([
	"com/evonik/appsDocumentManager/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.evonik.appsDocumentManager.controller.App", {
		onInit: function(){
			console.log(this.getRepositoryName());
		}
	});
});
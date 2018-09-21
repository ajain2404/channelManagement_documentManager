sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/evonik/appsDocumentManager/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("com.evonik.appsDocumentManager.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			var oStartupParameters = undefined;
				
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			//get the document service repository name in query parameter
			console.log(this.getComponentData( ).startupParameters);
		}
	});
});
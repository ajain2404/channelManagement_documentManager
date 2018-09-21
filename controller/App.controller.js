sap.ui.define([
	"com/evonik/appsDocumentManager/controller/BaseController",
	"sap/m/Text",
	"sap/m/Button",
	"sap/m/Dialog"
], function(BaseController, Text, Button, Dialog) {
	"use strict";

	return BaseController.extend("com.evonik.appsDocumentManager.controller.App", {
		onInit: function(){
		},
		onExit: function() {
			if(this._oFileUploadDialog){
				this._oFileUploadDialog.destroy();
			}
		},
		onListUpdateFinished: function(){
			this.getModel("appDataModel").setProperty("/uploadURL","/docservice/DocumentManager/DirectoryList/" + this.getRepositoryName());                        
		},
		onAddDocument: function() {
			if (!this._oFileUploadDialog) {
				this._oFileUploadDialog = sap.ui.xmlfragment("com.evonik.appsDocumentManager.view.UploadFileDialog", this);
				this._oFileUploadDialog.setModel(this.getModel("i18n"), "i18n");
				this._oFileUploadDialog.setModel("appDataModel", this.getModel("appDataModel"));
			}
			this._oFileUploadDialog.open();
		},
		handleUploadPress: function(oEvent) {
			var oFileUploader = sap.ui.getCore().byId("fileUploader");
			oFileUploader.upload();
		},
		handleUploadCancel: function(){
			this._oFileUploadDialog.close();
		},
		handleUploadComplete: function(oEvent) {
			var sStatus = oEvent.getParameter("status");
			if (sStatus && sStatus === 200) {
				/*				var sMsg = "";
								var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
								if (m[1] === "200") {
									sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Success)";
									oEvent.getSource().setValue("");
								} else {
									sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Error)";
								}
								sap.m.MessageToast.show(sMsg);*/
				sap.m.MessageToast.show(this.resourceBundle.getText("msgFileUploadSuccess"));
				//this.getView().getModel().setData(JSON.parse(sResponse.match('\\[.*\\]')[0]));
				//this.getView().getModel().refresh(true);
				this.getView().getModel().loadData("/docservice/DocumentManager/DirectoryList/" + this.getRepositoryName());
			} else {
				sap.m.MessageToast.show(this.resourceBundle.getText("msgFileUploadFail"));
			}
			this._oFileUploadDialog.close();
		},
		handleDelete: function(oEvent) {
			//console.log(oEvent);
			var docIdToBeDeleted = this.getView().getModel().getProperty(oEvent.getParameters().listItem.getBindingContextPath()).id;
			var dialog = new Dialog({
				title: this.resourceBundle.getText("deleteDialogTitle"),
				type: 'Message',
				content: new Text({
					text: this.resourceBundle.getText("txtConfirmDeleteFile")
				}),
				beginButton: new Button({
					text: this.resourceBundle.getText("deleteDialogPositive"),
					press: function() {
						//MessageToast.show('Submit pressed!');
						var payload = {
							"docId": docIdToBeDeleted
						};
						$.ajax({
							url: "/docservice/DocumentManager/DirectoryList/" + this.getRepositoryName(),
							contentType: "application/json",
							data: JSON.stringify(payload),
							dataType: "json",
							type: "DELETE",
							success: function(result) {
								this.getView().getModel().setData(result);
								this.getView().getModel().refresh(true);
								sap.m.MessageToast.show(this.resourceBundle.getText("msgDeleteFileSuccess"));
							}.bind(this),
							error: function(error) {
								sap.m.MessageToast.show(this.resourceBundle.getText("msgDeleteFileFail") + error);
							}
						});
						dialog.close();
					}.bind(this)
				}),
				endButton: new Button({
					text: this.resourceBundle.getText("deleteDialogNegative"),
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();

		}
	});
});
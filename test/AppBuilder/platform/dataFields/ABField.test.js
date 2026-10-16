import assert from "assert";
import ABFieldImage from "../../../../AppBuilder/platform/dataFields/ABFieldImage.js";
import ABFieldFile from "../../../../AppBuilder/platform/dataFields/ABFieldFile.js";

describe("ABField customEdit", function () {
   let mockUploader;
   let fileDialogCalledWith = null;
   let original$;
   const mockAB = {
      on: () => {},
      notify: { developer: () => {} },
   };

   beforeEach(function () {
      fileDialogCalledWith = null;
      mockUploader = {
         fileDialog: (opt) => {
            fileDialogCalledWith = opt;
         },
      };
      original$ = global.$$;
      global.$$ = (id) => {
         if (id === "uploader-123") return mockUploader;
         return original$(id);
      };
   });

   afterEach(function () {
      global.$$ = original$;
   });

   describe("ABFieldImage.customEdit", function () {
      it("handles (row, node, id, evt) without App argument (as called by FNAbviewformCustomComponent)", function () {
         const field = new ABFieldImage(
            { id: "field_1", key: "image", columnName: "photo" },
            { AB: mockAB }
         );

         const row = { id: "row_1" };
         const domNode = {
            dataset: { uploaderId: "uploader-123" },
         };
         const formItemId = "ABViewFormItem_xxx_formItem";
         const evt = { target: { className: "customField" } };

         // Calling with 4 arguments: (row, node, id, evt) - App omitted
         assert.doesNotThrow(() => {
            field.customEdit(row, domNode, formItemId, evt);
         });

         assert.deepStrictEqual(fileDialogCalledWith, { rowid: "row_1" });
      });

      it("handles legacy (row, App, node, id, evt) with App argument", function () {
         const field = new ABFieldImage(
            { id: "field_1", key: "image", columnName: "photo" },
            { AB: mockAB }
         );

         const row = { id: "row_2" };
         const mockApp = { unique: (id) => `unique_${id}` };
         const domNode = {
            dataset: { uploaderId: "uploader-123" },
         };
         const formItemId = "ABViewFormItem_xxx_formItem";
         const evt = { target: { className: "customField" } };

         assert.doesNotThrow(() => {
            field.customEdit(row, mockApp, domNode, formItemId, evt);
         });

         assert.deepStrictEqual(fileDialogCalledWith, { rowid: "row_2" });
      });

      it("does not throw if dataset is missing or uploader not found", function () {
         const field = new ABFieldImage(
            { id: "field_1", key: "image", columnName: "photo" },
            { AB: mockAB }
         );

         assert.doesNotThrow(() => {
            field.customEdit({ id: "row_3" }, {}, "formItem", {});
         });
      });
   });

   describe("ABFieldFile.customEdit", function () {
      it("handles (row, node) without App argument", function () {
         const field = new ABFieldFile(
            { id: "field_2", key: "file", columnName: "attachment" },
            { AB: mockAB }
         );

         const row = { id: "row_4", attachment: null };
         const domNode = {
            dataset: { uploaderId: "uploader-123" },
         };

         assert.doesNotThrow(() => {
            field.customEdit(row, domNode);
         });

         assert.deepStrictEqual(fileDialogCalledWith, { rowid: "row_4" });
      });

      it("handles legacy (row, App, node) with App argument", function () {
         const field = new ABFieldFile(
            { id: "field_2", key: "file", columnName: "attachment" },
            { AB: mockAB }
         );

         const row = { id: "row_5", attachment: null };
         const mockApp = { unique: (id) => `unique_${id}` };
         const domNode = {
            dataset: { uploaderId: "uploader-123" },
         };

         assert.doesNotThrow(() => {
            field.customEdit(row, mockApp, domNode);
         });

         assert.deepStrictEqual(fileDialogCalledWith, { rowid: "row_5" });
      });
   });
});

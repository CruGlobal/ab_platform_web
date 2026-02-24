import assert from "assert";
import ABFactory from "../../../../AppBuilder/ABFactory";
import ABViewContainer from "../../../../AppBuilder/platform/views/ABViewContainer";
import ABViewComponent from "../../../../AppBuilder/platform/views/viewComponent/ABViewComponent";

describe("ABViewDetail plugin", function () {

   let AB;
   let application;
   let viewDetail;

   before(function () {
      AB = new ABFactory();
      // Only load plugins so "detail" is registered; skip full init() to avoid Network/socket.io in test env.
      AB.pluginLocalLoad();
      application = AB.applicationNew({});
      viewDetail = application.viewNew({ key: "detail" }, application);
   });

   it("can pull a view from ABFactory given { key: 'detail' } values", function () {
      assert.ok(viewDetail, "viewNew({ key: 'detail' }) should return a view");
   });

   it("the resulting object is a type of ABViewContainer class", function () {
      assert.ok(
         viewDetail instanceof ABViewContainer,
         "Detail view should extend ABViewContainer"
      );
   });

   it("the object has .component() method", function () {
      assert.strictEqual(
         typeof viewDetail.component,
         "function",
         "Detail view should have a .component() method"
      );
   });

   it(".component() returns an object of type ABViewComponent class", function () {
      const result = viewDetail.component();
      assert.ok(
         result instanceof ABViewComponent,
         ".component() should return an instance of ABViewComponent"
      );
   });

});

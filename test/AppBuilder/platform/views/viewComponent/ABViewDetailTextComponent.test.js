import assert from "assert";
import ABFactory from "../../../../../AppBuilder/ABFactory";
import { getDetailClasses } from "../viewHelper";

function getTarget() {
   const AB = new ABFactory();
   const { ABViewDetailText, ABViewDetailTextComponent } = getDetailClasses(AB);
   const application = AB.applicationNew({});
   const detailTextView = new ABViewDetailText({}, application);
   return new ABViewDetailTextComponent(detailTextView);
}

describe("ABViewDetailTextComponent item widget", function () {
   // Tested in Common.test.JS
   // eslint-disable-next-line mocha/no-skipped-tests
   it.skip(".ui - should return UI json that has properly .id", function () {
      const target = getTarget();
      const result = target.ui();

      assert.equal(true, result != null);
      assert.equal(target.ids.component, result.id);
      assert.equal("ab-text", result.css);
   });
});

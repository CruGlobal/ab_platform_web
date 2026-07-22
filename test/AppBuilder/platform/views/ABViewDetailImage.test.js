import assert from "assert";
import ABFactory from "../../../../AppBuilder/ABFactory";
import { getDetailClasses } from "./viewHelper";

function getTarget() {
   const AB = new ABFactory();
   const { ABViewDetailImage } = getDetailClasses(AB);
   const application = AB.applicationNew({});
   return new ABViewDetailImage({}, application);
}

describe("ABViewDetailImage widget", function () {
   it(".component - should return a instance of ABViewDetailImageComponent", function () {
      const target = getTarget();

      const result = target.component();

      assert.equal(true, result instanceof target.constructor.Component);
   });
});

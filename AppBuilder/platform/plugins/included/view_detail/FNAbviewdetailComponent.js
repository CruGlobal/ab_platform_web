export default function FNAbviewdetailComponent({
   /*AB,*/
   ABViewComponentPlugin,
}) {
   return class ABAbviewdetailComponent extends ABViewComponentPlugin {
      constructor(baseView, idBase, ids) {
         super(
            baseView,
            idBase || `ABViewDetail_${baseView.id}`,
            Object.assign({ detail: "" }, ids)
         );
      }

      ui() {
         const settings = this.settings;
         const _uiDetail = {
            id: this.ids.detail,
            view: "dataview",
            type: {
               width: 1000,
               height: 30,
            },
            template: (item) => {
               if (!item) return "";
               return JSON.stringify(item);
            },
         };

         // set height or autoHeight
         if (settings.height !== 0) _uiDetail.height = settings.height;
         else _uiDetail.autoHeight = true;

         const _ui = super.ui([_uiDetail]);

         delete _ui.type;

         return _ui;
      }

      async init(AB) {
         await super.init(AB);

         const dc = this.datacollection;

         if (!dc) return;

         // bind dc to component
         dc.bind($$(this.ids.detail));
      }
   };
}

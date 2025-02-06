import { defineComponent, h ,provide} from "vue";
import MttkWrapComp from "./MttkWrapComp.vue";

export function compGenerator(
  contextWrapper,
  callback,
  // configStd
) {
  //
  const methodsReal = {};

  //
  // const slotsReal = {};
  //
  const comp = defineComponent({
    setup(props, context) {
      //Replace it!
      contextWrapper.context=context
      //
      provide('contextOfLastFuncComp',contextWrapper)
    // @ts-ignore
      const c = props.config || {};
      //
      const result = callback(c, contextWrapper);
      //
      let config=undefined
      let methods=undefined
      //
      if(typeof result=='object' && (result['~']||result['~component'])){
        //the callback result is a simple config without method
        config=result
      }else{
        config=result.config
        methods=result.methods||{}
      }

      // console.log(c,config)
      //
      if (methods) {
        for (const key of Object.keys(methods)) {
          //
          methodsReal[key] = methods[key];
        }
      }
      //If configStd has defined slot ,copy to config so it will take affect
      // for(const key of Object.keys(configStd)){
      //   if(!(key && typeof key=='string' && key.startsWith('#'))){
      //     continue;
      //   }
      //   config[key]=configStd[key]
      // }
      // console.log(config,configStd)
      //Try to convert all the #slotName to proper function
      //convertSlotInherit(config,context)
      //
      // console.log('6565',config,config['#icon']())
      // // //
      // for (const key of Object.keys(configStd)) {
      //   if (!key.startsWith("#")) {
      //     continue;
      //   }
      //   //
      //   console.log(configStd);
      //   const slotConfig = configStd[key];
      //   console.log(key, slotConfig);
      // }
      //   //
      //

      //   if (slotConfig.type != "inherit") {
      //     continue;
      //   }
      //   //
      //   const slotNameNew =
      //     slotConfig.value || (key == "#" ? "default" : key.substring(1));
      //   // console.log("3333:" + key, slotConfig.type, slotConfig, slotNameNew);
      //   //
      //   // slotsReal[slotNameNew] = (sp) => {
      //   //   return context.slots[slotNameNew](sp) || undefined;
      //   // };
      //   // slotsReal[slotNameNew] = ()=>h('div',{},'foo')
      // }
      //  const slotIcon=contextParent.slots['icon']
      // console.log(contextParent,contextParent.slots,contextParent.slots['icon'],contextParent.slots['icon']())

      // if(slotIcon && typeof slotIcon=='function'){
      //   console.log('call me 2')
      //   // slotsReal['icon'] = ()=>h('div',{},'*')
      //   slotsReal['icon']= ()=>slotIcon()
      // }

      // slotsReal['icon'] = ()=>h('div',{},'*')
      // slotsReal["icon"] = () => {
      //   const slotIcon = contextParent.slots["icon"];
      //   if (slotIcon && typeof slotIcon == "function") {
      //     console.log("call me 2222");
      //     return slotIcon();
      //   } else {
      //     console.log("call me 1111");
      //     return h("div", {}, "P");
      //   }
      // };

      // console.log(2, JSON.stringify(slotsReal), slotsReal);
      // if(context.slots['icon'] && typeof context.slots['icon']=='function'){
      //  slotsReal['icon']= context.slots['icon']() || 'NONE';
      // }
      // slotsReal['icon']=  'NONE';

      //
      return () => {
        //
        return h(
          MttkWrapComp,
          {
            config: config,
            // contextParent: props.contextParent,
            contextParent: contextWrapper,
            // @ts-ignore
            slotPara: props.slotPara,
          }
          //,slotsReal
        );
      };
    },
    props:{
      config: {
          type: Object,
          required: true,
          default() {
              return {}
          }
      },
      contextParent: {
          type: Object,
          required: false,
          default() {
              return undefined
          }
      },
      slotPara: {
          type: Object,
          required: false,
          default() {
              return undefined
          }
      },
  },
    methods: methodsReal,

  });

  //
  return comp;
}

  //Here is a tricky, if no slot config in config, add it to inherit slot
// export function calSlotsInherit(contextParent, configStd) {
//   //
//   const slotsInherit = {};
// // console.log(contextParent)
//   //Calculate the slot inherit needed
//   const slots = contextParent.slots;

//   if (slots && typeof slots == "object") {
//     for (const key of Object.keys(slots)) {

//       if (configStd.hasOwnProperty("#" + key)) {
//         continue;
//       }
//       //
//       slotsInherit['#'+key]='#'+key
//     }
//   }
//   //
//   return slotsInherit;
// }

//
// function  convertSlotInherit(config,context){
//   if (!(config && typeof config=='object')){
//     return
//   }
//   for (const key of Object.keys(config)) {
//     if(!(key && typeof key=='string' && key.startsWith('#'))){
//       continue;
//     }
//     //
//     const value=config[key]
//     // if(value)
//   }
// }

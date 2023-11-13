import { computed, h, isVNode, isRef } from "vue";
import MttkWrapHtml from "./MttkWrapHtml.vue";
import MttkWrapComp from "./MttkWrapComp.vue";
// import { calSlotsInherit } from "./compGenerator";
import { findProperContext, genUniqueStr } from "./compBaseUtil";

export function buildSlots(contextWrapper, configStd) {
  //
  const properContext=findProperContext(contextWrapper)
  //
  return computed(
    () => {
      //
      const slots = {};
      //
      for (const key of Object.keys(configStd)) {
        if (!key.startsWith("#")) {
          continue;
        }
        //
        slots[key == "#" ? "default" : key.substring(1)] = function (slotPara) {
          const result = [] as Object[];
          handleSlotSingle(contextWrapper,properContext, result, slotPara, configStd[key]);
          // console.log(result)
          //
          if (result.length == 0) {
            //return undefined means no slot is defined, use slot default content
            return undefined;
          } else {
            return result;
          }
        };
        // }
      }
      //
      return slots;
    }
    // {
    //   onTrack(e) {
    //     // 当 count.value 被追踪为依赖时触发
    //     console.log("onTrack", arguments);
    //   },
    //   onTrigger(e) {
    //     // 当 count.value 被更改时触发
    //     // debugger
    //     console.log("onTrigger", arguments);
    //   },
    // }
  );
}
//
function handleSlotSingle(contextWrapper, properContext,result, slotPara, slotConfig) {
  if(isRef(slotConfig)){
    slotConfig=slotConfig.value
  }
  // const slotParaStackNew=[...props.slotParaStack,slotPara]
  if (slotConfig == undefined) {
    //do nothing
  } else if (Array.isArray(slotConfig)) {
    //if it is array,handle each array item
    for (const item of slotConfig) {
      handleSlotSingle(contextWrapper, properContext,result, slotPara, item);
    }
  } else if (typeof slotConfig == "function") {
    //  console.log("1111",JSON.stringify( slotPara));
    handleSlotSingle(
      contextWrapper,properContext,
      result,
      slotPara,
      slotConfig(slotPara, contextWrapper)
    );
    // console.log("2222", slotPara);
  } else if (typeof slotConfig == "string") {
    if (slotConfig.startsWith("#")) {
      //consider it as slot name
      const slotName = slotConfig == "#" ? "default" : slotConfig.substring(1);
      //Here find the proper context to append slot
      //If it is inside a function component, find the function component context
      //Otherwise try to find the ROOT context.
      //This behavior is quite similar as normal vue file, no matter which level you define slot,
      // it will be raised to TOP level.
      const slot = properContext.context.slots[slotName];
      //
      if (slot && typeof slot == "function") {
        //This means the parent component has defined the slot
        result.push(slot(slotPara));
      } else {
        //Do nothing so the slot default  will be used
      }
    } else {
      //If it is not start with '#',consider it as HTML
      result.push(
        h(MttkWrapHtml, {
          html: slotConfig,
        })
      );
    }
  } else if (isVNode(slotConfig)) {
    //
    result.push(slotConfig);
  } else if (typeof slotConfig == "object") { 
    // //
    let key=slotConfig['~key']||''
    if('_UNIQUE'==key){
      key=genUniqueStr()
    }
    result.push(
      h(MttkWrapComp, {
        config: slotConfig,
        contextParent: contextWrapper,
        slotPara: slotPara,
        //Generate a unique key,so the CompWrap will NOT be reused
        //Reuse will cause page not be refreshed
        //This will cause component to be create/destroy every render,so it is not a good idea to do so
        key,
      })
    );
  } else {
    result.push("Unsuported slot config:" + slotConfig);
  }
}


import { computed, unref, toRaw, vShow, withDirectives, h } from "vue";
import { computedAsync } from "@vueuse/core";
import { standardizedConfig, genUniqueStr } from "./compBaseUtil";
import { buildModelValue } from "./compBaseModelValue";
import { buildMisc } from "./compBaseMisc";
import { buildInstance } from "./compBaseInstance";
import { buildProps } from "./compBaseProp";
import { buildEvents } from "./compBaseEvent";
import { buildSlots } from "./compBaseSlot";
import { buildLifeCycle } from "./compBaseLifecycle";

// export interface contextWrapType{
//   parent: contextWrapType|undefined,
//   slotPara: object,
//   getRef:(instanceKey:string)=>any,
//   instanceKey: string|Symbol,
//   //Internal use only
//   props:object，
//   context:any,
//   modelValue:any,
//   configStd:object,
//   }

export function useCompBase(props, context) {
  //Here we have the standard config
  //Since some attributes of contextWrap is unavailable, so here call buildContextBasic
  //change to computed at 2023/12/18,otherwise the change to props.config will not take affect
  const contextBasic = buildContextBasic();
  const configStd = computed( () => {
    return standardizedConfig(contextBasic, props.config);
  });
  // console.log("EVAL", JSON.stringify(configStd.value));
  //modelValue
  const { hasModelValue, modelValue, modelValueName } =
    buildModelValue(configStd);
  //
  const { setComponentInstance, getRef } = buildInstance(configStd);
  //contextWrap of this component
  const contextWrap = buildContext(contextBasic);
  //
  const { baseComponent, ifFlag, hasShowFlag, showFlag } = buildMisc(
    contextWrap,
    configStd
  );
  //Props,use computed to avoid evaluate each time render is called
  const propsReal = buildProps(contextWrap, configStd);
  //
  const eventsReal = buildEvents(contextWrap, configStd);

  //
  // eventsReal(propsMost);
  //These are props copy
  // propsReal(propsMost);
  //modelValue should be evaluated every render, so put it into computed
  const propsAll = computed(() => {
    const all = {
      //ref
      ref: setComponentInstance,
      key: configStd.value["~instanceKey"],

      ...propsReal.value,
      ...eventsReal.value,
    };

    //Add modelValue if modelValue is configured
    if (hasModelValue.value) {
      //model value
      (all[modelValueName.value] = modelValue.value),
        (all["onUpdate:" + modelValueName.value] = (value) => {
          modelValue.value = value;
        });
    }
    //
    return all;
  });

  //slots
  const slots = buildSlots(contextWrap, configStd);

  //
  //
  //The final render function
  function wrapRender(): any {
    // console.log(ifFlag.value,configStd)
    if (!ifFlag.value) {
      // console.log('#################',configStd)
      return undefined;
    }
    //
    // console.log('render is called',unref(baseComponent), unref(propsAll))
    //

    const result = h(unref(baseComponent), unref(propsAll), unref(slots));
    if (hasShowFlag.value) {
      return withDirectives(result, [[vShow, unref(showFlag)]]);
    } else {
      return result;
    }
  }

  //To avoid  JS Hoisting since modelValue is unavailable during this call
  function buildContextBasic() {
    return {
      props: toRaw(unref(props)), //Internal use only
      context: context, //Internal use only
      parent: props.contextParent,
      slotPara: props.slotPara,
    };
  }
  //Because of the JS Hoisting, parseConfig can not access contextWrap directly
  //Error:  can't access lexical declaration 'contextWrap' before initialization
  //This is the contextWrap of THIS CompWrap component
  function buildContext(contextBasic) {
    // return {
    //   ...contextBasic,
    //   modelValue,
    //   getRef,
    //   instanceKey: configStd.value["~instanceKey"],
    //   configStd, //Internal use only
    // };
    //Changed by Jamie @2024/01/16
    //Reuse contextBasic so we could get the below attributes from contextBasic after then
    contextBasic.modelValue = modelValue;
    contextBasic.getRef = getRef;
    contextBasic.instanceKey = configStd.value["~instanceKey"];
    contextBasic.configStd = configStd;
    //
    //
    return contextBasic;
  }

  //
  const registerLifeCycles = buildLifeCycle(contextWrap, configStd);
  registerLifeCycles();
  //
  return { wrapRender, info: { getRef, contextWrap } };
}

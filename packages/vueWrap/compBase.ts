import {
  computed,
  unref,
  toRaw,
  vShow,
  withDirectives,
  h,
  SetupContext,
} from "vue";
import { standardizedConfig, getRawValue } from "./compBaseUtil.ts";
import { buildModelValue } from "./compBaseModelValue.ts";
import { buildMisc } from "./compBaseMisc.ts";
import { buildInstance } from "./compBaseInstance.ts";
import { buildProps } from "./compBaseProp.ts";
import { buildEvents } from "./compBaseEvent.ts";
import { buildSlots } from "./compBaseSlot.ts";
import { buildLifeCycle } from "./compBaseLifecycle.ts";
import { WrapPropsType, ContextWrapType } from "./types.ts";

export function useCompBase(props: WrapPropsType, context: SetupContext) {
  //Here we have the standard config
  //Since some attributes of contextWrap is unavailable, so here call buildContextBasic
  //change to computed at 2023/12/18,otherwise the change to props.config will not take affect
  const contextBasic = buildContextBasic();
  const configStd = computed(() => {
    return standardizedConfig(contextBasic, props.config);
  });
  // console.log("EVAL", JSON.stringify(configStd.value));
  //modelValue
  const { tryApplyModelValue } = buildModelValue(configStd);
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

    //
    tryApplyModelValue(all);
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
  function buildContextBasic(): ContextWrapType {
    return {
      props: getRawValue(props), //Internal use only
      context: context, //Internal use only
      parent: props.contextParent,
      slotPara: props.slotPara,
      instanceKey: "",
    };
  }
  //Because of the JS Hoisting, parseConfig can not access contextWrap directly
  //Error:  can't access lexical declaration 'contextWrap' before initialization
  //This is the contextWrap of THIS CompWrap component
  function buildContext(contextBasic: ContextWrapType): ContextWrapType {
    // return {
    //   ...contextBasic,
    //   modelValue,
    //   getRef,
    //   instanceKey: configStd.value["~instanceKey"],
    //   configStd, //Internal use only
    // };
    //Changed by Jamie @2024/01/16
    //Reuse contextBasic so we could get the below attributes from contextBasic after then
    //contextBasic.modelValue = modelValue;
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
  return { wrapRender, contextWrap };
}

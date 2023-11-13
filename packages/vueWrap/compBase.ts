import { computed, unref, toRaw, vShow, withDirectives, h } from "vue";
import { standardizedConfig, genUniqueStr } from "./compBaseUtil";
import { buildModelValue } from "./compBaseModelValue";
import { buildMisc } from "./compBaseMisc";
import { buildInstance } from "./compBaseInstance";
import { buildProps } from "./compBaseProp";
import { buildEvents } from "./compBaseEvent";
import { buildSlots } from "./compBaseSlot";
import { buildLifeCycle } from "./compBaseLifecycle";

export function useCompBase(props, context) {
  //Here we have the standard config
  //Since some attributes of contextWrap is unavailable, so here call buildContextBasic
  const configStd = standardizedConfig(buildContextBasic(), props.config);

  //modelValue
  const { modelValue, modelValueName } = buildModelValue(configStd);
  //
  const { setComponentInstance, getRef } = buildInstance(configStd);
  //contextWrap of this component
  const contextWrap = buildContext();
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
    return {
      //ref
      ref: setComponentInstance,

      //model value
      [modelValueName.value]: modelValue.value,
      ["onUpdate:" + modelValueName.value]: (value) => {
        modelValue.value = value;
      },
      ...propsReal.value,
      ...eventsReal.value,

    };
  });

  //slots
  const slots = buildSlots(contextWrap, configStd);

  //
  //
  //The final render function
  function wrapRender(): any {
    if (!ifFlag.value) {
      return undefined;
    }
    //
    //  console.log('render is called',unref(baseComponent), unref(propsAll))
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
  function buildContext() {
    return {
      ...buildContextBasic(),
      modelValue,
      getRef,
      instanceKey: configStd["~instanceKey"],
      configStd, //Internal use only
    };
  }

  //
  const registerLifeCycles = buildLifeCycle(contextWrap, configStd);
  registerLifeCycles();
  //
  return { wrapRender, getRef };
}

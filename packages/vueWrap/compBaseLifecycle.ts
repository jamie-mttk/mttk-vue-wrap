import {
onMounted,
onUpdated,
onUnmounted,
onBeforeMount,
onBeforeUpdate,
onBeforeUnmount,
onErrorCaptured,
onActivated,
onDeactivated,
} from "vue";


export function buildLifeCycle(contextWrap,configStd){

    //
  function registerLifeCycles() {
    onMounted(() => invokeLifecycle("onMounted"));
    onUpdated(() => invokeLifecycle("onUpdated"));
    onUnmounted(() => invokeLifecycle("onUnmounted"));
    onBeforeMount(() => invokeLifecycle("onBeforeMount"));
    onBeforeUpdate(() => invokeLifecycle("onBeforeUpdate"));
    onBeforeUnmount(() => invokeLifecycle("onBeforeUnmount"));
    onActivated(() => invokeLifecycle("onActivated"));
    onDeactivated(() => invokeLifecycle("onDeactivated"));
    onErrorCaptured((err, instance, info) =>
      invokeLifecycle("onErrorCaptured", err, instance, info)
    );
  }
  //lifecycle
  function invokeLifecycle(type: string, ...args) {
    // console.log('**************'+type,contextWrap)
    const handler = configStd["^" + type];
    if (!handler) {
      return;
    }
    if (Array.isArray(handler)) {
      for (const single of handler) {
        if (typeof single == "function") {
          single(contextWrap, ...args);
        } else {
          throw Error("Unsuported handler for lifecycle:" + type + " in array");
        }
      }
    } else if (typeof handler == "function") {
      handler(contextWrap, ...args);
    } else {
      throw Error("Unsuported handler for lifecycle:" + type);
    }
  }
  //
  return registerLifeCycles
}
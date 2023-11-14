import {computed,defineAsyncComponent,resolveComponent,unref} from 'vue'
import {  isPromise } from "./compBaseUtil";
import { compGenerator } from "./compGenerator";

//
export function buildMisc(contextWrap,configStd){
    //
  // const component = computed(() => configStd["~component"] || configStd["~"]);

  // const isFuncComp = computed(() => typeof component == "function");
  //Parse component
  //if it is a promise, consider it is imported as "() => import('xxx')", do not use "() => import('xxx')
  //if it is a function,consider it as a our function component
  //Otherwise consider it is a component(and try to resolve if it is a string)
  const baseComponent = computed(() => {
    const component = configStd["~component"] || configStd["~"];
    //
    if (!component) {
      return "div";
    }
    //
    if (isPromise(component)) {
      return defineAsyncComponent(() => component);
    } else if (typeof component == "function") {
      //
      return compGenerator(contextWrap, component);
    } else if (typeof component == "string") {
      //
      return smartResolveComponent(component);
    } else {
      return component;
    }
    //
    // return toRaw(component);
  });
  //handing possible v-if
  const ifFlag = computed(() => {
    const ret = configStd["~if"];
    if (ret == undefined) {
      return true;
    }
    //
    // console.log(ret,configStd)
    //
    return !!unref(ret);
  });
  //Whether there is a v-sow setting
  //true means there is a v-show setting
  const hasShowFlag = computed(() => {
    return configStd["~show"]!=undefined;
  });
  //handling possible v-show
  const showFlag = computed(() => {
    const ret = configStd["~show"];
    if (ret == undefined) {
      return true;
    }
    //
    return !!unref(ret);
  });
  //Component key
  const keyComp=computed(()=>{
    
  })
  //
  return {baseComponent,ifFlag,hasShowFlag,showFlag}
}


//Smart resolve component, skip resolve of some name like 'div','span' to resolve veu3 warning
function smartResolveComponent(component) {
    if (component == "div" || component == "span") {
      return component;
    }
    //
    return resolveComponent(component);
  }
  
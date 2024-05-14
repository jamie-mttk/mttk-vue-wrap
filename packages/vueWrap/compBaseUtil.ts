import { isRef, isReactive, toRaw, inject } from "vue";

//Conver to standard format if the config is flat format
//Add missing fields: so far only instanceKey is added
export  function standardizedConfig(contextWrap, config) {
  //eval if config is a funciton
  if (typeof config == "function") {
    config = config(contextWrap);
  // }else if (isPromise(config)){
  //   config=await config(contextWrap)
  }
  //
  //get raw config,consider ref or reactive
  config = getRawValue(config);
  //copy it
  // config={...config}
  //
  //apply instance key if it is not provided
  //if there is no instanceKey,add a unique one
  const instanceKey = config["~instanceKey"];
  if (!instanceKey) {
    //Create a unique one if there is no instance key
  
    config["~instanceKey"] = genUniqueStr();
  }
  //This is a tricky, if it is first level component,set all attrs into config
  // if (!contextWrap.parent) {
  //   //first level...
  //   console.log(contextWrap, contextWrap.context.attrs);
  //   for (const key of Object.keys(contextWrap.context.attrs)) {
  //     const value = contextWrap.context.attrs[key];
  //     //Here we do not check whether it is a function or not since it has the same effect during render stage(XXX)
  //     if (/^on[A-Z].*$/.test(key) && typeof value == "function") {
  //       //this is a event handler，convert to event name
  //       console.log(
  //         "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",
  //         "@" + key.substring(2, 3).toLowerCase() + key.substring(3),
  //         typeof value,
  //         value
  //       );
  //       value();
  //       const v =
  //         config["@" + key.substring(2, 3).toLowerCase() + key.substring(3)];
  //       console.log("%%%%%%%%%", v);
  //       v();
  //       console.log("########", typeof v, v);

  //       config["@" + key.substring(2, 3).toLowerCase() + key.substring(3)] =
  //         value;
  //         config["@" + key.substring(2, 3).toLowerCase() + key.substring(3)] =
  //         function(){
  //           console.log('@@@@@@@@@@@@@@@@@@@####s')
  //         };
      
  //       } else {
  //       config[key] = value;
  //     }
  //   }
  //   //
  //   console.log(contextWrap, contextWrap.context.attrs);
  // }
  //
  // console.log(config)
  //
  return config;
}

//Generate a unique string as component key
export function genUniqueStr() {
  let time = Date.now().toString(36);
  let random = Math.random().toString(36);
  random = random.substring(2, random.length);
  return random + time;
}

//GET raw value,consider ref or reactive
export function getRawValue(value: any) {
  if (isRef(value)) {
    return value.value;
  } else if (isReactive(value)) {
    //
    return toRaw(value);
  } else {
    return value;
  }
}

//Check whether the input is a Promise
export function isPromise(value: any) {
  return typeof value.then == "function" && typeof value.catch == "function";
}

//Find proper context
//Find the parent context untill
//1)find one funiton component from provide/inject
//2)Find root component
export function findProperContext(contextWrap) {
  const contextLast = inject("contextOfLastFuncComp", undefined);
  if (contextLast) {
    return contextLast;
  }
  //
  return findContexWrappertRoot(contextWrap);
}

function findContexWrappertRoot(contextWrap) {
  let contextThis = contextWrap;
  //
  //  let count=1;
  while (true) {
    //  console.log(count++,contextThis)
    if (contextThis.parent) {
      contextThis = contextThis.parent;
    } else {
      return contextThis;
    }
  }
}

import { provide, inject, reactive } from "vue";
//
export function buildInstance(configStd) {
  //since provide/inject should be called in setup,so save here
  const instances = obtainInstances();
  //
  //Inject(Get from parent component) or provide (Creat a new and provide to children) instances
  //Instances is a map to store component key and component $el
  function obtainInstances() {
    const instancesExist = inject("mttkVueWrapInstances", undefined);
    if (instancesExist != undefined) {
      return instancesExist;
    }
    //
    const instancesNew = {};
    provide("mttkVueWrapInstances", instancesNew);
    //
    return instancesNew;
  }
//This function is to set this component instance to global(use obtainInstances) storage
function setComponentInstance(el) {
    let key = configStd.value["~instanceKey"];
    // console.log(key,el)
    if (!key) {
      //since key is always set,so the code should NOT go here
      return;
    }
    //
    if (el) {
      //add
      instances[key] = el;
    } else {
      //remove
      delete instances[key];
    }
  }
  //
  function getRef(instanceKey: string) {
    //if instanceKey is not provided,assume to get the current component
    if (!instanceKey) {
      instanceKey = configStd.value["~instanceKey"];
    }
    //
    if (!instanceKey || !instances) {
      //Maybe component is not intitialized
      return undefined;
    }
    //
    //
    return instances[instanceKey];
  }
  //
  return { setComponentInstance,getRef };
}

import { computed, isRef, unref } from "vue";
import { getByPath, setByPath } from "./pathUtil";
import {WrapConfigType}   from './types.ts'

export function buildModelValue(configStd:WrapConfigType) {
  //Add modelValue if modelValue is configured
  function tryApplyModelValue(all: any) {
    if ( !configStd ||unref(configStd) == undefined){
      return
     }
    //获取configStd可能的配置
   tryApplyModelValueInternal(all,configStd)
   //Check whether there is ~mvs
   const mvs=unref(unref(configStd)['~mvs'])
   
   if(!mvs||!Array.isArray(mvs)||mvs.length==0){
    return
   }   
   //
   for(const c of mvs){    
    tryApplyModelValueInternal(all,c)
   }
  }
   //
  return {tryApplyModelValue };
}
 //
 function tryApplyModelValueInternal(all: any, configSingle: any) {
  
  //whether modelValue is configured.If not, do not build modelValue otherwise it may have unexpected result
  if (
    !configSingle ||
   unref(configSingle) == undefined ||
      ! (unref(configSingle).hasOwnProperty("~modelValue"))
  ) {
    return;
  }
  
  //modelValue
  const modelValue = computed({
    get() {
      let modelValuePath = unref(configSingle)["~modelValuePath"];
      if (modelValuePath) {
        return getByPath(
          unref(unref(configSingle)["~modelValue"]),
          modelValuePath
        );
      } else {
        return unref(unref(configSingle)["~modelValue"]);
      }
    },
    set(valueNew) {
      //
      let modelValuePath = unref(configSingle)["~modelValuePath"];
      if (modelValuePath) {
        setByPath(
          unref(unref(configSingle)["~modelValue"]),
          modelValuePath,
          valueNew
        );
      } else {
        if (isRef(unref(configSingle)["~modelValue"])) {
          unref(configSingle)["~modelValue"].value = valueNew;
        } else {
          unref(configSingle)["~modelValue"] = valueNew;
        }
      }
    },
  });
  //modelValueName
  const modelValueName = computed(() => {
    //
    return unref(configSingle)["~modelValueName"] || "modelValue";
  });
  //Add model value related properties
  all[modelValueName.value] = modelValue.value,
  all["onUpdate:" + modelValueName.value] = (value: any) => {
    modelValue.value = value;
  }
  //
  return modelValue
  
}
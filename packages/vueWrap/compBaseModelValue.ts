
import {computed,isRef,unref} from 'vue'
import { getByPath, setByPath } from "./pathUtil";

export  function buildModelValue(configStd){
    //modelValue
  const modelValue = computed({
    get() {
      //
      if (!configStd) {
        return undefined;
      }
      let modelValuePath = configStd["~modelValuePath"];
      if (modelValuePath) {
        return getByPath(unref(configStd["~modelValue"]), modelValuePath);
      } else {
        return unref(configStd["~modelValue"]);
      }
    },
    set(valueNew) {
      //
      if (!configStd) {
        return ;
      }
      //
      if (!configStd.hasOwnProperty("~modelValue")) {
        //do nothing
        return;
      }
      //
      let modelValuePath = configStd["~modelValuePath"];
      if (modelValuePath) {
        setByPath(unref(configStd["~modelValue"]), modelValuePath, valueNew);
      } else {
        if (isRef(configStd["~modelValue"])) {
          configStd["~modelValue"].value = valueNew;
        } else {
          configStd["~modelValue"] = valueNew;
        }
      }
    },
  });
  //modelValueName
  const modelValueName = computed(() => {
    //
    return configStd["~modelValueName"] || "modelValue";
  });
  //
  return {modelValue,modelValueName} 
}
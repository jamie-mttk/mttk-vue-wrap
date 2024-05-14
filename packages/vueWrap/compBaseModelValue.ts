import { computed, isRef, unref } from "vue";
import { getByPath, setByPath } from "./pathUtil";

export function buildModelValue(configStd) {
  //whether modelValue is configured.If not, do not build modelValue otherwise it may have unexpected result
  const hasModelValue = computed(() => {
    return  (configStd && configStd.value != undefined && configStd.value.hasOwnProperty("~modelValue")) 
  });
  //modelValue
  const modelValue = computed({
    get() {
      //
      if (!hasModelValue.value) {
        return undefined;
      }
      let modelValuePath = configStd.value["~modelValuePath"];
      if (modelValuePath) {
        return getByPath(unref(configStd.value["~modelValue"]), modelValuePath);
      } else {
        return unref(configStd.value["~modelValue"]);
      }
    },
    set(valueNew) {
      //
      if (!hasModelValue.value) {
        return;
      }
      //
      // if (!configStd.value.hasOwnProperty("~modelValue")) {
      //   //do nothing
      //   return;
      // }
      //
      let modelValuePath = configStd.value["~modelValuePath"];
      if (modelValuePath) {
        setByPath(
          unref(configStd.value["~modelValue"]),
          modelValuePath,
          valueNew
        );
      } else {
        if (isRef(configStd.value["~modelValue"])) {
          configStd.value["~modelValue"].value = valueNew;
        } else {
          configStd.value["~modelValue"] = valueNew;
        }
      }
    },
  });
  //modelValueName
  const modelValueName = computed(() => {
    //
    return configStd.value["~modelValueName"] || "modelValue";
  });
  //
  return {hasModelValue, modelValue, modelValueName };
}

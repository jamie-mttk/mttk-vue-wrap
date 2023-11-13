import { computed, unref } from "vue";
//Props,use computed to avoid evaluate each time render is called
export function buildProps(contextWrapper, configStd) {
    return  computed(() => {
    //If component is function ,wrap all the props into config prop
    let component = configStd["~component"] || configStd["~"];
    if (typeof component == "function") {
      return { config: configStd };
    }
    //
    const result = {};
    //
    for (const key of Object.keys(configStd)) {
      // if (
      //   key.startsWith("~") ||
      //   key.startsWith("!")||
      //           key.startsWith("@") ||
      //           key.startsWith("#") ||
      //           key.startsWith("$") ||
      //   key.startsWith("^") 
      
      // ) {
      //   continue;
      // }
      if(!/^[A-Za-z]/.test(key.charAt(0))){
        //If it is not started with letter, ignore
        continue;
      }
      //please note,unref is used here
      result[key] = unref(configStd[key]);
      //style
      handlePossibleStyle(result)
      //class
      handlePossibleClass(result)
    }
    //
    return result;
  })}

  function handlePossibleStyle(result){
    const style=result['style']
    if(typeof style!='object'){
      return 
    }
    //
    const resultStyle={}
    //
    for(const key of Object.keys(style)){
      const value=style[key]
      //try to eval value if needed
      resultStyle[key]=unref(value)
    }
    //
    result['style']=resultStyle
  }

  function handlePossibleClass(result){
    const classDefined=result['class']
    if(!Array.isArray(classDefined)){
      return 
    }
    //
    const resultClass=[]
    //
    for(const value of classDefined){
      resultClass.push(unref(value))
    }
    //
    result['class']=resultClass

  }
import { computed ,withModifiers} from "vue";
import { findProperContext } from "./compBaseUtil";

export function buildEvents(contextWrap, configStd: any) {
  let properContext = findProperContext(contextWrap);

  return computed(() => {
    //
    const result = {};
    //
    for (const key of Object.keys(configStd.value)) {
      if (!key.startsWith("@")) {
        continue;
      }
      //
      const eventValue = configStd.value[key];
      //
      const eventConfigStd = formatEventConfig(key, eventValue);
      //
      if (!eventConfigStd||!eventConfigStd.value==undefined) {
        continue;
      }

      //this is the event key
      const {eventKey,modifiers} = formatEmitKeyAndModifiers(key);

      const eventHandler=buildEventHandler(contextWrap,properContext,eventConfigStd,key,eventValue)
      if(!eventHandler){
        continue;
      }
      //
      if(modifiers && modifiers.length>0){
        result[eventKey]=withModifiers(eventHandler,modifiers)
      }else{
        result[eventKey]=eventHandler
      }
      
    }
    //
    // console.log(configStd,result)
    //
    return result;
  });
}
//
// function wrapEventFunction(eventValue) {
//   return function (...args) {
//     eventValue(args);
//   };
// }

//Format event key to render event key and withModifiers
//.passive、.capture and .once will be added after event key and others will return in modifiers 
//return empty array if there is no modifiers
//format event key from @click to onClick and []
//another sanmple, @row-dbclick.stop. to onRowDbclickStop
function formatEmitKeyAndModifiers(key: String) {
  let eventKey = key
  if (eventKey.startsWith('@')) {
    eventKey = eventKey.slice(1);
  }
  //Find possible modifier part
  const index=eventKey.indexOf('.')
  const modifierPart=index>=0?eventKey.substring(index+1):undefined
  if(index>=0){
    eventKey=eventKey.substring(0,index)
  }
  //
  //Convert to standard format
  eventKey = "on-" + eventKey;
  eventKey = eventKey.replace(/[-](\w)/g, function (match, letter) {
    return letter.toUpperCase();
  });
  //
  const modifiers=[] as String[]
  if(modifierPart){
    const modifiersRaw=modifierPart.split('.')
    for(const m of modifiersRaw){
      if(m=='passive'||m=='capture'||m=='once'){
        //This three modifiers can not be used in withModifiers
        eventKey=eventKey+m.substring(0,1).toUpperCase()+m.substring(1)
      }else{
        modifiers.push(m)
      }
    }
  }
  return {eventKey,modifiers};
}
//Format emit event name,removing @ and possible Modifiers
function formatEmitEventName(key: string, eventValue: any) {
  if (eventValue) {
    if (eventValue.startsWith("@")) {
      return eventValue.substring(1);
    } else {
      return eventValue;
    }
  }
  let index = key.indexOf(".");
  if (index >= 0) {
    //start from 1 to remove the prepending @
    return key.substring(1, index);
  } else {
    return key.substring(1);
  }
}

function formatEventConfig(key, eventValue) {
  //
  if (eventValue == undefined || typeof eventValue == "string") {
    return  {
      type: "inherit",
      value: eventValue == undefined ? key : eventValue,
    };
  } else if (typeof eventValue == "function") {
    return  {
      type: "function",
      value: eventValue == undefined ? key : eventValue,
    };
  } else if (typeof eventValue == "object") {
    return  eventValue;
  } else {
    console.log("unsupported event[" + key + "]:" + eventValue);
    //  continue;
    return undefined
  }
  
}

function buildEventHandlerOfFunc(eventConfigStd, contextWrap) {
  //para mode
  // raw - the original event parameter
  // contextFirst(default) add context as the first parameter
  // contextLast add context as the last parameter
  // combine      combile context/para into one object
  //
  const paraMode = eventConfigStd.paraMode || "contextFirst";
  const funcEvent = eventConfigStd.value;
  if (typeof funcEvent != "function") {
    console.log("function value should be type of funciton", eventConfigStd);
    return undefined;
  }
  if ("raw" == paraMode) {
    return funcEvent;
  } else if ("contextLast" == paraMode) {
    return function (...args) {
      funcEvent(...args, contextWrap);
    };
  } else if ("combine" == paraMode) {
    return function (...args) {
      funcEvent({ context: contextWrap, args });
    };
  } else {
    //others, consider as contextFirst
    return function (...args) {
      // console.log('$$$$$$$$$$$$CONTEXT FIRST',contextWrap, args)
      funcEvent(contextWrap, ...args);
    };
  }
}

//Please note:argsFinal is not the raw event argument;it is the arguments finally trigger the event
function emitEvent(contextWrap,properContext,eventName,...argsFinal){
   //raw
  //  console.log( eventName, properContext);
   if(!properContext.parent){
     //If it is root we need to manuallly call the functions defined in config
     const  eventConfigPossible=properContext.configStd.value['@'+eventName]
     if(eventConfigPossible){
      const eventConfigStd=formatEventConfig('@'+eventName,eventConfigPossible)
      if(eventConfigStd.type=='function'){
        const eventHandler=buildEventHandlerOfFunc(eventConfigStd,contextWrap)
        if(eventHandler){
          eventHandler(...argsFinal)
        }
      }
      
     }
   }
   //
   properContext.context.emit(eventName, ...argsFinal);
}

//build event handler function,return undefined is not created
function buildEventHandler(contextWrap,properContext,eventConfigStd,key,eventValue){
  const type = eventConfigStd.type;
      if (type == "inherit") {
        //
        const eventName = formatEmitEventName(key, eventConfigStd.value);
        //
        // The default para mode is raw
        const paraMode = eventConfigStd.paraMode || "raw";
        return function (...args) {
          if (
            (key == eventValue || key == "@" + eventValue) &&
            properContext.instanceKey == contextWrap.instanceKey
          ) {
            //This is a tricky,if event name is not changed and it is the current component ,do not emit
            //otherwise it will cause infinit loop
            //
            return;
          }
          //
          if ("contextFirst" == paraMode) {
            //The second contextWrap is the event argument
            emitEvent(contextWrap,properContext,eventName,contextWrap,...args)
          } else if ("contextLast" == paraMode) {
            emitEvent(contextWrap,properContext,eventName,...args,contextWrap)
          } else if ("combine" == paraMode) {
            emitEvent(contextWrap,properContext,eventName,{ context: contextWrap, args})
          } else {
            //raw
            emitEvent(contextWrap,properContext,eventName,...args)
          }
        };
      } else if (type == "function") {
        // console.log('@@@@@@@@@@@@FUNCTION',key ,configStd )
        // console.log(eventKey,eventValue)
        return  buildEventHandlerOfFunc(eventConfigStd, contextWrap);        
      } else {
        console.log("unsupported event object [" + key + "]:" + eventValue);
        return undefined;
      }
}
import { createVNode, render} from 'vue'
import type { AppContext } from 'vue'
import MttkWrapComp  from './MttkWrapComp.vue'
import {WrapConfigType,DynamicRenderOptionType} from   './types'

//config: 
//options
//appendTo: where to append,null will append to root(document.body),it can be a string or html element
//removeEvent: if provide, this event will automatically trigger remove handler to remove appended div
export default function dynamicRender(config:WrapConfigType, appContext: AppContext, options :DynamicRenderOptionType) {
  const mountNode = document.createElement('div')
  const appendTo = getAppendToElement()
  const remove = function () {
    render(null, mountNode)
    appendTo.removeChild(mountNode)
  }
  //Record the info returned by init event
  let contextWrap=undefined;
  function handleInitWrap(contextWrapNew:any){
    contextWrap=contextWrapNew
  }

  const vNode = createVNode(MttkWrapComp, { config: getConfig(),onInitWrap:handleInitWrap })
  //
  vNode.appContext = appContext
  //
  render(vNode, mountNode)
  appendTo.appendChild(mountNode)
  //
  return { remove, mountNode, vNode ,contextWrap}

  function getConfig() {
    const removeEvent = options.removeEvent
    if (!removeEvent) {
      return config
    }
    //
    const configModified = { ...config }
    configModified['@' + removeEvent] = remove
    //
    // console.log(configModified)
    return configModified
  }
  function getAppendToElement() {
    const appendTo:any = options.appendTo
    if (appendTo) {
      if (typeof appendTo == 'string') {
        return document.querySelector(appendTo)
      }
      if (appendTo instanceof Element) {
        return appendTo
      }
    }
    return document.body
  }
}

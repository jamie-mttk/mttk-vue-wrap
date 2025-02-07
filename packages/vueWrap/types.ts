
import {SetupContext} from 'vue'

//VueWrap config 
type WrapConfigFuncType = (context:ContextWrapType) =>WrapConfigType
export type WrapConfigType =Record<string, any>|WrapConfigFuncType;

//Slot para type
export type SlotParaType=any|undefined



//VueWrap context
export type ContextWrapType={
    parent: ContextWrapType|undefined,
    slotPara: SlotParaType,
    getRef?:(instanceKey:string)=> HTMLInputElement | null,
    instanceKey: string|Symbol,
    //Internal use only
    props?:WrapPropsType,
    context?:SetupContext,
    // modelValue:any,
    configStd?:object,
}

//Below are type definitions for MttkWrapComp props
export type WrapPropsType={
    config:WrapConfigType,
    contextParent?:ContextWrapType,
    slotPara?:SlotParaType
}

//Dynamic Render options
export type DynamicRenderOptionType={
    appendTo:string|Element|undefined,
    removeEvent:Function|undefined
}
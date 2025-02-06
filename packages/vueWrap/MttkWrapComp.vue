<script lang="ts">
import {defineComponent,provide,SetupContext} from 'vue'
import { useCompBase } from './compBase'
import {WrapPropsType,WrapConfigType,SlotParaType,ContextWrapType} from './types'


//
export default defineComponent({
    //Set to false to avoid events set on MttkWrapComp to be automatically apply to config root component
    inheritAttrs: true,
    emits: ['initWrap'],
    props: {
        //Standard config 
        config:{
            type:Object as () => WrapConfigType
        },
        //To build the component hierachy
        contextParent: {
            type: Object  as () => ContextWrapType,
            required: false,
            default() {
               //If not provided, try to inject from parent's provide
               // return inject('contextWrap')
                 return undefined
            }
        },
        //The slot para if it is under a slot;undefined if it is a root component
        slotPara: {
            type: Object as () => SlotParaType,
            required: false,
            default() {
                return undefined
            }
        },
    },
    setup(props:WrapPropsType, context:SetupContext) { 
        //
  

        const {wrapRender,contextWrap} = useCompBase(props, context)
        //
        // regiesterLifeCycles()
        // Expose public function 
        //getRef: return the component instance
        context.expose(contextWrap);
        //
        provide('contextWrap',contextWrap)
        //
        context.emit('initWrap',contextWrap)
        //
        return () => wrapRender()
    },
})
</script>
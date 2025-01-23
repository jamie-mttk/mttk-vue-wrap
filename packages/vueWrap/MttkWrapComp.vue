<script lang="ts">
import {defineComponent,provide,inject} from 'vue'
import { useCompBase } from './compBase'
export default defineComponent({
    //Set to false to avoid events set on MttkWrapComp to be automatically apply to config root component
    inheritAttrs: true,
    emits: ['init'],
    props: {
        //Standard config 
        // config: {
        //     type: Object,
        //     required: true,
        //     default() {
        //         return {}
        //     }
        // },
        config:[Object, Function],
        //To build the component hierachy
        contextParent: {
            type: Object,
            required: false,
            default() {
               //If not provided, try to inject from parent's provide
               // return inject('contextWrap')
                 return undefined
            }
        },
        //The slot para if it is under a slot;undefined if it is a root component
        slotPara: {
            type: Object,
            required: false,
            default() {
                return undefined
            }
        },
    },
    setup(props, context) { 
        //
        // console.log('1111', context.attrs)
        //  console.log('2222',context)


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
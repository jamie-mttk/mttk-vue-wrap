<script lang="ts">
import { useCompBase } from './compBase'
export default {
    //Set to false to avoid events set on MttkWrapComp to be automatically apply to config root component
    inheritAttrs: false,
    props: {
        //Standard config 
        config: {
            type: Object,
            required: true,
            default() {
                return {}
            }
        },
        //To build the component hierachy
        contextParent: {
            type: Object,
            required: false,
            default() {
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
        // console.log(context)
        const { wrapRender, getRef } = useCompBase(props, context)
        //
        // regiesterLifeCycles()
        // Expose public function 
        //getRef: return the component instance
        context.expose({ getRef });
        //
        return () => wrapRender()
    },
}
</script>
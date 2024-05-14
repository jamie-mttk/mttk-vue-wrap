import MttkWrapComp from './vueWrap/MttkWrapComp.vue'
import MttkWrapHtml from './vueWrap/MttkWrapHtml.vue'
import MttkWrapText from './vueWrap/MttkWrapText.vue'
import {genUniqueStr} from './vueWrap/compBaseUtil'
import dynamicRender from './vueWrap/dynamicRender'
//install
const install=app=>{
    app.component('MttkWrapComp',MttkWrapComp)
    app.component('MttkWrapHtml',MttkWrapHtml)
    app.component('MttkWrapText',MttkWrapText)
}
//
const Mttk_Vue_Wrap={install}
//
// export {CompWrap}
export default Mttk_Vue_Wrap
export {genUniqueStr,MttkWrapComp,MttkWrapHtml,MttkWrapText,dynamicRender}

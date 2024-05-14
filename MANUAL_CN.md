# 开发者手册 

[English manual](https://github.com/jamie-mttk/mttk-vue-wrap/blob/master/MANUAL.md)

## 安装 

运行以下命令将 mttk-vue-wrap 添加到项目中

···sh
npm install mttk-vue-wrap --save
···

## 使用

您可以在 main.ts/main.js 中全局导入组件

···sh
import MttkVueWrap from 'mttk-vue-wrap';
// 创建 Vue 应用
const app = createApp(App)
// 全局注册 MttkWrapComp
app.use(MttkVueWrap);
···

然后 MttkWrapComp 可以在任何地方使用

或者在需要时导入

···sh
import { MttkWrapComp } from 'mttk-vue-wrap'
···

## 配置

### 通常

我们强烈建议先查看所有演示，然后阅读本手册。
下面的介绍基于[element plus](https://github.com/element-plus)。但是该项目也可以与其他基于 Vue3 的组件库一起使用。
配置是一个 JavaScript 对象（稍后称为 JSON）。键的第一个字符表示类型，例如基本、props、slots、events 等。

以下是一个示例，将渲染一个 element-plus 的按钮。

···sh
{
  // 这意味着 el-button 将被渲染
  '~component': 'el-button',
  // props
  type: 'primary',
  size: 'large',
  // 插槽
  '#default': '测试按钮',
  // 事件
  '@click': () => { console.log('点击了', arguments) }
}
···

### 配置键

键的第一个字符的含义如下
| 键名     | 描述  |
|  ----  | ----  |
|  ~     | 基本，如组件、modelValue 等 |
| @      | 事件 |
| #      | 插槽 |
| ^      | 生命周期 |
| 其他  | 属性，如果键以字母开头，则视为是属性 |

### 配置计算

配置可以是 JSON 或函数。如果是函数，则参数是下面描述的上下文，并且返回值应该是本章描述的 JSON。

### 上下文Context

"上下文" 用于配置与渲染引擎的交互。
上下文包含以下内容。
| 键名         | 描述  |
|  ----      | ----         |
| slotPara   | 如果在插槽下，则为插槽参数 |
| parent     | 父级上下文 |
| modelValue | 此组件的 modelValue，如果未设置则返回 undefined |
| getRef     | 参考下面的 getRef 章节 |
| instanceKey| 此组件的实例键 |

### 基本

基本配置键以 '~' 开头

| 属性      | 描述  |
|  ----         | ----  |
| component     | 基本组件，'~component' 可以简化为 '~' |
| modelValue    | 参考 v-model  |
| modelValuePath| 参考 v-model  |
| modelValueName| 参考 v-model  |
| if            | 将设置为 v-if，值可以是计算属性或 ref/reactive 变量 |
| show          | 将设置为 v-show，值可以是计算属性或 ref/reactive 变量 |
| instanceKey   | 参考 instanceKey  |

#### component

'~component' 将根据数据类型进行评估为适当的组件。
| 类型      | 描述  | 示例 |
|  ----         | ----  |----  |
| 字符串   | 已注册的组件名称，通过 [app.component](https://vuejs.org/api/application.html#app-component) 注册  | '~component':'ElButton' 或  'el-button'|
| Promise  | 通常作为示例导入 | '~component':import('./Tester.vue')|
| 函数 | 函数组件 | 参考下面的函数组件章节|
| 组件|首先导入，然后使用|import Tester from './Tester.vue' <br> '~component':Tester|

如果未设置，则使用默认值 'div'。

#### v-model

如果基本组件没有 v-model（例如 e-row/el-col），则不需要设置 modelValue。
"modelValueName" 用于设置名称，如果没有设置使用默认值 'modelValue'。
有三种设置 v-model 的方法

1. v-model 由变量定义，只需将 modelValue 设置为该变量。支持ref和reactive.

···sh
    const valueInput = ref("InitValue")
    '~modelValue': valueInput
···

2. 可写计算属性 - 参考[vue3 手册](https://vuejs.org/guide/essentials/computed.html#writable-computed)

```sh
const valueInput = ref("InitValue");
// 下面的代码相当于 modelValue: valueInput，只是演示如何使用计算属性来设置 modelValue
'~modelValue': computed({
    get() {
    return valueInput.value
    },
    set(value) {
    valueInput.value=value
    }
})
```

3. modelValue + modelValuePath，典型用例是在表单内设置表单项值。

```sh
const formValue=reactive({})

'~component': "ElInput",
'~modelValue': formValue,
'~modelValuePath':'address'
```

请注意，在上面的示例中，类似 ***modelValue: formValue.address*** 这样的配置是无效的。

#### instanceKey

如果未设置值，引擎将自动创建唯一键。
"instanceKey" 用作 getRef 函数的参数，参考下面的 getRef 段落。
instanceKey 可以是字符串或 Symbol

### props

以字母开头的键被视为 props。

```sh
const inputSize=ref('small')

placeholder: "Please input value complex sample",
clearable: true,
prefixIcon: "Calendar",
disabled: false,
size: inputSize,
```

要动态更改 props 值，可以将 prop 值设置为 ref/computed 或 reactive。参考上面示例中的 size prop。如果 inputSize 的值发生更改，组件大小也会相应更改。

### 插槽

#### 结构

插槽的键以 '#' 开头

```sh
'#slot1': 插槽定义 1,
'#slot2': 插槽定义 2,
...

```

#### 插槽定义

插槽定义的数据类型将在下面解释
注意1:   '#default' 可以简化为 '#'
注意2：  slotPara 是插槽属性

|类型         | 描述  |
|  ----       | ----  |
| undefined | 生成空内容，通常用于显示插槽备用内容|
| 函数 | 使用参数 slotPara 和 context 进行评估，返回值将再次用此表解释|
| 字符串   | 如果以 '#' 开头，则视为插槽继承（稍后解释）；否则渲染为 HTML|
| vNode    | 直接渲染 |
| 对象   | 视为 Mttk Vue Wrap 配置，使用 MttkVueWrap 渲染|
| 其他    | 无意义 |

#### 插槽继承

插槽继承类似于定义一个新插槽供调用方使用。下面的代码是 vue3 标准插槽定义。

···sh
<slot name="header"></slot>
···

与以上代码相同，下面的代码定义了一个名为 header 的插槽在默认插槽下。

···sh
'#default':'#header'
···

插槽将链接到的位置非常有趣。通常，引擎将自动查找，直到找到函数组件或配置根。

### 事件

事件的键以 '@' 开头

···sh
'@event1': 事件处理程序1,
'@event2': 事件处理程序2
···

事件处理程序的数据类型将在下面解释
|类型         | 描述  |
|  ----       | ----  |
|undefined|与 {type:'inherit',value:事件键} 相同 |
|字符串|与 {type:'inherit',value:事件值} 相同 |
|函数|与 {type:'function',value:提供的函数} 相同|
|对象 | 解释如下|
|其他|无意义|

#### 事件对象

对象应具有以下属性
|属性         | 描述  |
|  ----       | ----  |
|type| 'inherit' 或 'function'|
|paraMode| 参数设置模式。如果类型是 inherit，则默认值为 raw；如果类型是 function，则默认值为 contextFirst|
|value|如果类型是 inherit，则为要发出的事件名称；如果类型是 function，则应为函数|

#### paraMode

它定义要传递给继承插槽或事件处理函数的参数。
|值         | 描述  |
|  ----       | ----  |
|raw | 原始事件参数 |
|contextFirst |  将上下文作为第一个参数添加，后面是事件的原始参数 |
|contextLast | 将上下文作为最后一个参数添加，前面面是事件的原始参数 |
|combine | 将上下文/参数组合为一个 JSON 对象，上下文键值为context,参数为args |

#### 事件继承

它类似于 vue3 context.emit(...)
捕获事件的组件逻辑与插槽继承相同。

#### 事件修饰符

事件修饰符通过添加 '.' 在后面添加。下面的示例是有效的。

```sh
'@click': 事件处理程序,
'@click.once': 事件处理程序,
'@row-dbclick.once.stop': 事件处理程序,
```

### 样式和类

它们被设置为普通 prop，键为 'style' 和 'class'。唯一的区别是引擎会尝试将值评估为对象或数组。

### 生命周期

生命周期的键以 '^' 开头

```sh
    '^onMounted': function () {
      console.log('组件已挂载>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    },
    '^onUnmounted':  ()=> {
      console.log('组件已卸载<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
    }
```

参考上面的示例，生命周期处理程序是一个函数。

### getRef

"getRef" 函数返回 Vue 组件实例。这是 MttkVueWrap 提供的一个函数。输入参数是 instanceKey。
下面是一个示例，其中一些配置被忽略。

```sh
{'~': XXX,
  '~instanceKey':'key1'
  '#':[{
    '~': YYY,
    '~instanceKey':'key2'
  },
  {
    '~': ZZZ,
    '~instanceKey':'key3'
  }]
}
```

因此，您可以使用以下代码来获取组件 XXX、YYY、ZZZ 的元素引用。请注意，返回值不是 ref，因此不需要在调用方法后添加 ".value"。

```sh
  context.getRef('key1')  // 返回 XXX 的引用
  context.getRef('key2')  // 返回 YYY 的引用
  context.getRef('key3')  // 返回 ZZZ 的引用
```

getRef 的参数是可选的，如果未提供，则使用当前组件的 instanceKey

## 函数组件

### 简介

函数组件的目标是将组件封装到一个函数中，该函数可以直接由 Mttk Vue Wrap 渲染。换句话说，它可以替代 .vue 文件。

### 函数参数

|参数         | 描述  |
|  ----       | ----  |
|config | 调用此函数组件的配置 |
|context | 上下文对象 |

### 返回值

返回值是一个 JSON，第一个属性是 config，是一个标准组件配置；第二个是通过属性methods返回一组方法（可选），返回可以通过此函数组件上的 getRef 调用的方法

### 示例

这里定义了一个简单的按钮函数组件。外部的 'div' 没有意义，仅用于演示。
还定义了两个名为 m1 和 m2 的方法。请注意，方法可以与 context 交互。

···sh
function buttonComp(c, context) {
  return {
    config: {
      '~': 'div',
      '#': {
        '~': 'el-button',
        'type': c.type || 'primary',
        '#': c.caption || 'Default button'
      }
    },
    methods: {
      'm1': () => { },
      'm2': () => { }
    }
  }
}
···

下面是使用上述函数组件的配置

```sh
const config = {
  '~': buttonComp,
  type: 'success',
  caption: '测试按钮'
}
```

## 发布说明

### v0.1.7 2023/11/10

1. 首次发布

### v0.2.6 2024/05/14

1. 少量修改和文档翻译
   
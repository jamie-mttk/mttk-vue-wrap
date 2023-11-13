# Developer Manual

## Installation

Run the below command to add vuewrapper into project

```sh
npm install vuewrapper -save
```

## Usage

You can import the component in main.ts/main.js globally

```sh
import WRAPPER from 'vuewrapper'
//Create vue app
const app=createApp(App)
//Install CompWrap globally
app.use(WRAPPER)
```

Then CompWrap can be used anywhere

Or import when needed

```sh
import {CompWrap} from 'vuewrapper'
```

## Configuration

### General

We highly recommand to go through all the demos first and then read this manual.
The below introduction is based on [element plus](https://github.com/element-plus/element-plus). But this project can work with other component library as well.
The structure of the config is as below. Since version 0.3.0, flat format config is supported,please refer to proper chapter below

```sh

{sys:{},
props:{},
slots:{},
events:{},
styles:{},
classes:[],
lifecycle:{}
}

```
The configuration can be a JSON or funciton. If it is a funciton the parameter is the context described below and the return value should be the JSON described in this chapter.

### Context

"context" is used to for the config to interact with engine.
The context has the follow contents
|key     | description  |
|  ----  | ----         |
| props  |The value returned by calling [defineProps in vue3](https://vuejs.org/guide/components/props.html).  |
| emit   |The value returned by calling [defineEmits in vue3](https://vuejs.org/guide/components/events.html#event-arguments). |
| modelValue | The modelValue of this component, undefined is returned if not set|
| getRef | Refer to the getRef chapter below|


The context is used as the paramter in configuration and slot function.

### sys

The sys element is the system level configuration with the following properties:
| property      | description  |
|  ----         | ----  |
| component     | The base component|
| modelValue    | Refer to v-model  |
| modelValuePath| Refer to v-model  |
| modelValueName| Refer to v-model  |
| if            | It will set to v-if, the value can be a computed or ref/reactive variable|
| show          | It will set to v-show, the value can be a computed or ref/reactive variable|
| instanceKey   | Refer to instanceKey  |
| instanceKeyAsKey   | Refer to instanceKey  |
| transform | Refer to transform chapter |

#### component

It is bind to component with [is attribute](https://vuejs.org/api/built-in-special-attributes.html#is). The possible types are listed below:

| Type      | Description  | Sample |
|  ----         | ----  |----  |
| String   | The component name which is registered with [app.component](https://vuejs.org/api/application.html#app-component)  | component:'ElButton'/ 'el-button'|
| Function | Import directly, refer to sample |  component:()=>import('./Tester.vue')|
| Component|Import first and then use it|import Tester from './Tester.vue' component:Tester|

If it is not set,use default value 'div'.


#### modelValue/modelValuePath/modelValueName

If the base component has no v-model( for example e-row/el-col), then modelValue is not necessary to set.
"modelValueName" is used to set the name if it is not veue3 default value 'modelValue'
There are three methods to set v-model

1. v-model is defined by a variable,just set the modelValue to that variable.  Refer to demo 'Concept' -  configInput2.

```sh
    const valueInput = ref("InitValue");

    modelValue: valueInput,
```

2. A wriable computed -  Refer to [vue3 manual](https://vuejs.org/guide/essentials/computed.html#writable-computed)

```sh
const valueInput = ref("InitValue");
//The below code equal to modelValue: valueInput,  just to demo how to use computed to set modelValue
modelValue: computed({
    get() {
    return valueInput.value
    },
    set(value) {
    valueInput.value=value
    }
}),
```

3. modelValue + modelValuePath, the typical use case is form. The form item value is a subset of form value.
Refer to demo 'Form' - formConfig1

```sh
sys: {
    component: "ElInput",
    modelValue: formValue,
    modelValuePath:'address',
},
```

Please note in the above example, config like ***modelValue: formValue.address*** does NOT work.

#### instanceKey/instanceKeyAsKey

If the value is not set the engine will automatically create a unique key.
"instanceKey" has two use cases: The first is used as the parameter of getRef function, refer to the getRef segment below; The second is set to [the vue special property key](https://vuejs.org/api/built-in-special-attributes.html#key) if instanceKeyAsKey is set to true(The default value of instanceKeyAsKey is false). Set a unique key can avoid vue to reuse the element/component which may cause lifecycles hook work incorrectly.

#### transform

"transform" is a user defined function to transform user defined config to vueWrapper standard config. 
verwrapper will try to get transform funciton from JSON configNew.sys.transform or '~transform'. If not found, the config will be consider as a vueWrapper standard format.
If found, the function will be called with below paramters and the function return will be considered as vueWrapper standard format.

Since the config will be processed multiple times, below is the process sequence.

1. Funtion check
  If the input config is a funciton, call this function with one paramter context and the function return will proceed
2. Tranform
   Call transform if it is provided
3. Flat format convert
  Conert to standard format if it is a flat format
4. Apply instanceKey
  If instanceKey is not provided, create a unique key and apply to it

### props

The idea to use [v-bind](https://vuejs.org/api/built-in-directives.html#v-bind) to bind all the props to component.
So it is a JSON, the value can be any type. Below is a sample.

```sh
const inputSize=ref('small')

  props: {
    placeholder: "Please input value complex sample",
    clearable: true,
    prefixIcon: "Calendar",
    disabled: false,
    size: inputSize,
  },
  ```

To dynamically change the props value, you can set the prop value to a ref or reactive. Refer to the size prop of the above example. If the value of inputSize is changed, the component size will change as well.


### slots

#### Structure

The structure of slots is as below. slot1/slot2 is the slot name, and slot define 1/slot define 2 is described below


```sh
{slot1:slot define 1,
slot2:slot define 2,
...
}
```

#### Slot define

A slot define can be a shortcut / JSON /  JSON array. JSON is the standard format of slot define which will be described later.The JSON array can be standard JSON or shortcut. Shortcut is kind of simplified configuration.
Shotcut can be the following types, they will be convert to standard JSON format automatically.

|Type                              | Converted to  |
|  ----                            | ----  |
| String                           | {type:'text',value:'xyz'} xyz is String of slot define|
| funciton                         | {type:'function',value:'xyz'} xyz is function of slot define|
| An object with no 'type' property| {type:'wrap',value:'xyz'} xyz is slot define|

#### Slot define JSON

It has two properties, one is key the other is value. The value is explained by key.
The value can be a array, the element of the array will be explained as the below table as well.

|key       | value  |
|  ----    | ----  |
| text     |{{value}} as vue Mustache syntax|
| html     |Insert as HTML with v-html directive  |
| component|Consider the value is a component  |
| function |Consider the value is function|
| wrap|Refer to slot define as a wrap|
| inherit|Expose the slot to parent component. The slot name is the value if it is provided, otherwise use the original slot name|

#### slotPara

The slot parameter(slotPara) is a JSON with following properties.

|key       | value  |
|----      | ----  |
|slotDefine|Slot define as desribed above. It can be used to pass customized information from definition.|
|slotValue |The slot parameter  passed to the slot from parent component.|
|context|Refer to context chapter|

"slotParaStack" is an array of slotPara, you can also consider it as a stack. It contains all the slotPara from root component to current component.
And slotParaStack can also be transfered among components and vueWrapper by parameters.

#### Slot define as a function 

The function paramters are as below, the return value will be inserted as HTML
|parameter       | description  |
|  ----    | ----  |
| slotPara | Described above|
| slotParaStack  | Described above|

#### Slot define as a component

If the slot is a vue component ,the following props will be set
|Prop       | description  |
|  ----    | ----  |
| slotPara | Described above|
| slotParaStack  | Described above|

#### Slot define as a wrap

The value can be a standard configuration as described in this manual, or it can be function which return a standard configuration or configuration array. The input argument of funtion is slot parameter, so the configuration can be generated by the input parameter.


```sh
{slot1:{
  type:'wrap',
  value:{ slot define JSON}
},
slot2:{ slot define JSON}
...
}
```
The above are two samples to use wrap type slot define. The slot2 define is simplified and vueWrapper will automatically convert to the format as slot1 define.

The wrap has two props:one is config,the other is slotParaStack

#### Slot define as a inherit

The following props will set as the inherited slot

|Prop       | description  |
|  ----    | ----  |
| slotValue | The original slot value will be set by vue v-bing, that means all the key/value of slot value will be set as seperated prop|
| slotDefine  | Slot define JSON|
| context  | Content object|


### events

The structure of events is a JSON/JS object as below

```sh
{'event1':event handle1,
'event2':event handle2
...
}
```

Event handle can be configed as below. 

1. function  
It is a funciton, and function will be called. The function argements are same as the event parameters.
2. JSON with property 'type' is 'function' and property 'value' is a function  
Execute the function provided in property 'value'
3. JSON, the property 'type' is 'inherit'  
Emit the event to parent component. If the proerty 'value' is available, use it as the event name; otherwise use the orginal event name.

#### Restriction of event

Event modifiers are not supported.

### styles

```sh
const myColor = ref("#ffff00");


  styles: {
    backgroundColor: myColor,
    border: "5px solid red",
  },
```

### class

```sh
 classes: ["testClass2"],
```

#### Restriction of class

The classes should be imported globally.

### lifecycle

```sh
  lifecycle: {
    onMounted: function () {
      console.log('Component is mounted>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    },
    onUnmounted:  ()=> {
      console.log('Component is unmounted<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
    }  
```

Refer to the above sample, the lifecycle handler is a function.
If lifecycle does not work as expected, refer to instanceKey segment


### method [Removed]

The root base component can be called by 'callMethod', refer to demo 'Table'.  
The first argument is the method name, the other arguments are the argument of the method to be called.

```sh
mainRef1.value.callMethod('clearSelection')
```

#### Restriction of method

Only the root base component can be called.
A mechenism to call all the children componets is under design.


### getRef

"getRef" function returns the vue component instance. The input parameter is the instanceKey.
Below is a example, some of the configurations are ignored.

```sh
    sys: {
      component: XXX,
      instanceKey:'key1'
    },
    slots:{
      "default":[{
        sys: {
          component: YYY,
          instanceKey:'key2'
      }},
      {    sys: {
        component: ZZZ,
        instanceKey:'key3'
      }}]
    }
```

So you could use the below code to get the element reference of component XXX,YYY,ZZZ. Please note the return value is NOT a ref, so no need to add ".value" after it to call method

```sh
  context.getRef('key1')  //Return the reference to XXX
  context.getRef('key2')  //Return the reference to YYY
  context.getRef('key3')  //Return the reference to ZZZ
```

And parameter of getRef is optional, it is not provided, the instanceKey of the current component is used

### Flat format config

The config format described above may have multiple levels. The target of flat format is to reduce the hierachy levels.
The idea is to set a prefix to each segment per the below table.

|Segment       | Prefix  |
|----   | ----  |
|sys    |~,the exceptions are styles/classes|
|props  |none|
|slots  |#|
|events |@|
|styles |~styles|
|classes|~classes|
|lifecycle|^|

Refer to sample "Concept" and "Form" for more detail


## Release note

### v0.4.5 2023/5/20

1. Add lifecycle
2. Add transform
3. Optimize and bug fix during mttk-lowcode project development

### v0.4.2 2023/4/12

1. Reactive property
The property can be reatived.
For example, the disabled property can be changed according to some other value.
It can be configured as this：

```sh
disabled: computed(()=>formValue.value.switch)
```
Please note it should be a computed.
2. v-show support

A new property "show" is added under sys. The value is a computed, it will be set to v-show.

```sh
show: computed(()=>formValue.value.switch)
```

3.modelValue name

A new property "modelValueName" is added under sys. It is used to set the v-model name if it is not modelValue.

   transform

A new property "transform" is added under sys. This is a funciton to convert unstandard config to standard config
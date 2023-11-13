# Developer Manual

## Installation

Run the below command to add mttk-vue-wrap into project

```sh
npm install mttk-vue-wrap -save
```

## Usage

You can import the component in main.ts/main.js globally

```sh
import MttkVueWrap from 'mttk-vue-wrap';
//Create vue app
const app=createApp(App)
//Install MttkWrapComp globally
  app.use(MttkVueWrap);
```

Then MttkWrapComp can be used anywhere

Or import when needed

```sh
import {MttkWrapComp} from 'mttk-vue-wrap'
```

## Configuration

### General

We highly recommand to go through all the demos first and then read this manual.
The below introduction is based on [element plus](https://github.com/element-plus/element-plus). But this project can work with other component library as well.
The config is a Javascript Object(Call JSON later). The first character of the key indicate the type, for example sys,props,slots,events,etc.

Here is a example,which will render a element-plus button.

```sh

{
  '~component': 'el-button',
  type: 'primary',
  '#default': 'Test button',
  '@click': () => { console.log('clicked', arguments) }
}

```

The meaning of the first character of the key is described below
|key     | description  |
|  ----  | ----  
|  ~     | Component basic configuration,such as component, modelValue,etc.|
| @      | Event|
| #      | Slot |
| ^      | Lifecycle |
| Other  | Props, if key is started with letter, consider it is a prop |

The configuration can be a JSON or a funciton. If it is a funciton the parameter is the context described below and the return value should be the JSON described in this chapter.

### Context

"context" is used to for the config to interact with engine.
The context has the follow contents. 
|key     | description  |
|  ----  | ----         |
| slotPara   | If it is under a slot, this is the slot parameter(s) |
| parent     | The parent context |
| modelValue | The modelValue of this component, undefined is returned if not set|
| getRef     | Refer to the getRef chapter below|
| instanceKey| Instance key of this component|



### basic

Basic configuration key is started with '~'

| property      | description  |
|  ----         | ----  |
| component     | The base component,'~component' can be simplified as '~'|
| modelValue    | Refer to v-model  |
| modelValuePath| Refer to v-model  |
| modelValueName| Refer to v-model  |
| if            | It will set to v-if, the value can be a computed or ref/reactive variable|
| show          | It will set to v-show, the value can be a computed or ref/reactive variable|
| instanceKey   | Refer to instanceKey  |


#### component

| Type      | Description  | Sample |
|  ----         | ----  |----  |
| String   | The component name which is registered with [app.component](https://vuejs.org/api/application.html#app-component)  | component:'ElButton'/ 'el-button'|
| Promise  | Normally it is an import as sample |  import('./Tester.vue')|
| Function | Function component | Refer to function component |
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

#### instanceKey

If the value is not set the engine will automatically create a unique key.
"instanceKey" is used as the parameter of getRef function, refer to the getRef segment below.
And instanceKey can be string or Symbol

### props

Keys start with letter are considered as props.

```sh
const inputSize=ref('small')


    placeholder: "Please input value complex sample",
    clearable: true,
    prefixIcon: "Calendar",
    disabled: false,
    size: inputSize,

  ```

To dynamically change the props value, you can set the prop value to a ref/computed or reactive. Refer to the size prop of the above example. If the value of inputSize is changed, the component size will change as well.


### slots

#### Structure

The key of slot is started with '#'

```sh
'#slot1':slot define 1,
'#slot2':slot define 2,
...
}
```

#### Slot define

The data type of the slot define will be explained as below
Note1:   '#default' can be simplified as '#'
Note2：  slotPara is the slot paramter

|Type         | Description  |
|  ----       | ----  |
| undeined | Generate nothing, normally to show the slot default content|
| function | Eval with parameter slotPara and contextWrapper,the return value will be re-explained with this table again|
| String   | If it is started with '#',consider as a slot inherit(Explain later);otherwise render as HTML|
| vNode    | Render directly |
| object   | Consider as a MttkVueWrap config,render with MttkVueWrap|
| Other    | No meaning |

#### Slot inherit
Slot inherit is something like define a new slot. Below code is vue3 standard slot define.

```sh

<slot name="header"></slot>

```

Same as the below code of this project which will define a slot named header under default slot.

```sh

'#default':'#header'

```

Where the slot will be linked is quite interesting. Normally engine will automatically find untill if there is a function component or the root the configuration.


### event

The key of the event is started with '@'

```sh
'@event1':event handle1,
'@event2':event handle2

}
```
The data type of the event handler will be explaiined as below


|Type         | Description  |
|  ----       | ----  |
|undefined|Same as {type:'inherit',value:key of the event} |
|string|Same as {type:'inherit',value:value of the event} |
|function|Same as {type:'function',}|
|object | Explain below|
|Other|No meaning|

#### Event object
The object should have following properties

|Prop         | Description  |
|  ----       | ----  |
|type| 'inherit' or 'function'|
|paraMode| The mode of setting parameter.If type is inherit, the default value is raw;if type is function ,the default value is contextFirst|
|value|If type is inherit, it is the event name to emit;if type is function,it should be a function |

#### paraMode
|Value         | Description  |
|  ----       | ----  |
|raw | the original event parameter |
|contextFirst |  add context as the first parameter |
|contextLast | add context as the last parameter |
|combine | combile context/para into one object |

#### Event inherit

It is something like vue3 context.emit(...)
The logic of which componne to catch the event is same as slot inherit.

#### Event modifiers 

Event modifier is supported by add after '.'. The below examples are valid.

```sh

'@click':event handler,
'@click.once':event handler,
'@row-dbclick.once.stop':event handler,

```

### style and class

They are set as normal prop with key 'style' and 'class'. The only difference is engine will try to eval the value into object or array.


### lifecycle

The key of the lifecycle is started with '^'

```sh
  
    '^onMounted': function () {
      console.log('Component is mounted>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    },
    '^onUnmounted':  ()=> {
      console.log('Component is unmounted<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
    }  
```

Refer to the above sample, the lifecycle handler is a function.


### getRef

"getRef" function returns the vue component instance. The input parameter is the instanceKey.
Below is a example, some of the configurations are ignored.

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

So you could use the below code to get the element reference of component XXX,YYY,ZZZ. Please note the return value is NOT a ref, so no need to add ".value" after it to call method

```sh
  context.getRef('key1')  //Return the reference to XXX
  context.getRef('key2')  //Return the reference to YYY
  context.getRef('key3')  //Return the reference to ZZZ
```

And parameter of getRef is optional, it is not provided, the instanceKey of the current component is used


## Function component

### General

The goal of function component is to encapsulate a component into a function which can be rendered by MttkWrapComp directly.

### Paramters

|Parameter         | Description  |
|  ----       | ----  |
|config | the configuration to call this function component |
|contextWrap | Context object |

### Return 

The return value is a JSON, the first prop is config which is a standard componnet config; the second one is methods(Optional),which returns methods which can be called by getRef of this function component

### Sample

Here defines a simple button function component. The outer 'div' has no meaning, it is only used for demostration.
And there are two methods defined with name m1 and m2

``` sh

function buttonComp(c, contextWrap) {
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

```

Below is the configuration to use the above function component

``` sh

const config = {
  '~': buttonComp,
  type: 'success',
  caption: 'Test button'
}

``` 

## Release note

### v0.1.5 2023/11/10

1. First release

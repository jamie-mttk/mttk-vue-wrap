# vueWrapper

## What is it?

This project implement Vue3 component with pure Javascript instead of Single-File Component(SFC) and could co-work with SFC together.
Generally a vue component includes tempalte/v-model/props/event/slot/method, this project will try to convert them to script with the same functionalities.
So developer could config a component with Javascript rather than to write a full SFC.

This project incldues two projects:

* [Core project] (https://github.com/jamie-mttk/vueWrapper) which implements the full functionalities
* [Demo project] (https://github.com/jamie-mttk/vueWrapperDemo) which is a demo to show how to use vuewrapper

We recommend to preview the project first and then read the [Developer Manual](https://github.com/jamie-mttk/vueWrapper/blob/master/MANUAL.md)

## Project preview

A live preview of the demo project is available [here](https://mttk.netlify.app/)


## Demo project Setup

Fork the demo project and then install with the below commands and then enjoy.

```sh
npm install
npm run dev
```

## Quick start

This project render vue compent from a JSON-like object.
Below is sample config to render a element plus input controller.

```sh
export const valueInput = ref("InitValue");

//A simple input configuration
export const configInput ={
  sys: {
    //
    component: "ElInput",
    modelValue: valueInput,
  },
  props: {
    placeholder: "Please input value",
    clearable: true,
  },
  slots: {},
  events: {},
}
```

Since version 0.3.0, flat format config is supported,so the config could look like below

```sh
export const valueInput = ref("InitValue");

//A simple input configuration
export const configInput ={
  //sys
    "~component": "ElInput",
    "~modelValue": valueInput,
  //props
    placeholder: "Please input value",
    clearable: true  
}
```

Then use CompWrap to render

```sh
<CompWrap :config="configInput"></CompWrap>
```

## Benifit

SFC includes template/script and style, but these three parts are quite different technologies during coding stage.
The idea of this project is to use pure script(javascript/typescript) to warpping a component. Script is easy to combine/transform/resue so more flexiblity could be gain. For example to add a table component into page, using SFC means to add a el-table and config el-column one by one, the code is long and mixed with template/script; by using this project, a simple pice of JS is enough.

And in the real project we may not care about all the features of the component, so configuration could be simplified and then use a piece of translation code to generate the config of the standard format. Refer to sample table/form/app1 for more detail.

And normally 80% pages are quite similiar or they could be summarized into several templates in a real project. So we could define the discrepancy into a config file, and then render the page according to the configuration. Refer to sample app1 for more detail.

And this project is also the fundamental technology of MTTK low code.

## Restriction

Type script is not well supported.
Some Vue 3 features can not not supported,refer to developer manual for more detail.

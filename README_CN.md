# Mttk Vue Wrap  

[English Readme](https://github.com/jamie-mttk/mttk-vue-wrap/blob/master/README.md)

## 项目介绍  

该项目使用纯JavaScript实现Vue3组件，而不是使用单文件组件(SFC)，并且可以与SFC一起共同使用。 
通常，一个Vue组件包括模板/v-model/属性/事件/插槽/方法，该项目将尝试将它们转换为具有相同功能的脚本。 
因此，开发人员可以使用JavaScript配置组件，而不必编写完整的SFC。 
该项目包括两个项目： 

* [核心项目](https://github.com/jamie-mttk/mttk-vue-wrap) 实现了完整功能 

* [演示项目](https://github.com/jamie-mttk/vueWrapperDemo) 是一个演示，展示如何使用vuewrapper [暂不可用] 
  
我们建议先预览项目，然后阅读[开发者手册](https://github.com/jamie-mttk/mttk-vue-wrap/blob/master/MANUAL.md) 

## 项目预览  

演示项目的实时预览可在[此处](https://mttk.netlify.app/)查看 [基于以前版本制作] 

## 演示项目设置  

克隆演示项目，然后使用以下命令安装，然后享受。
sh
npm install
npm run dev

## 快速开始  

该项目从类似JSON的对象渲染Vue组件。 
以下是渲染元素加输入控制器的示例配置。

```sh
export const valueInput = ref("InitValue"); 
//一个简单的输入配置 
export const configInput ={ 
'~component': "ElInput", 
'~modelValue': valueInput, 
placeholder: "请输入值", 
clearable: true}
```

然后使用MttkWrapComp来渲染

```sh
<MttkWrapComp :config="configInput"></MttkWrapComp>
```

## 优势  

SFC包括模板/脚本和样式，但这三个部分在编码阶段是完全不同的技术。 
该项目的理念是使用纯脚本(javascript/typescript)来包装一个组件。脚本易于组合/转换/重用，因此可以获得更多的灵活性。例如，要将表格组件添加到页面中，使用SFC意味着逐个添加el-table并配置el-column，代码很长并且与模板/脚本混合在一起；通过使用该项目，一个简单的JS片段就足够了。 
在实际项目中，我们可能并不关心组件的所有功能，因此配置可以简化，然后使用一小段转换代码生成标准格式的配置。有关更多详细信息，请参阅示例表格/表单/app1。 
通常，80%的页面非常相似，或者它们可以总结为实际项目中的几个模板。因此，我们可以将差异性定义为配置文件，然后根据配置呈现页面。有关更多详细信息，请参阅示例app1。 
而且，该项目也是MTTK低代码的基本技术。 

## 限制  

TypeScript支持不佳。 
某些Vue 3功能不受支持，请参阅开发者手册获取更多详细信息。

## 许可证  

Mttk Vue Wrap是根据MIT许可证的开源软件。
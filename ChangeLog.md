# Change Log

## Version 0.20  @ 2023/01/16

* First release

## Version 0.2.1 @2023/01/31

* Optimize README and manual, add Change Log

## Version 0.3.0 @2023/02/04

Support flat format config

## Version 0.3.2 @2023/02/06

Global function can be a function ,in previous version only JSON is supported
Add context to slot function

## Version 0.3.3 @2023/02/06

Fix callMethod bug - Error occure once reference to component is not initialized during componnet mount

## Version 0.4.0 @2023/02/10

Add component function:getRef
Remove callMethod and replaced with getRef
Add context to expose emit, props, getRef to config


## Version 0.4.1 @2023/02/13

Add context as the first paramter of event handler if it is a function.
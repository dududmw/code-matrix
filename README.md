# Code Matrix

## Purpose

Manage your code block use middleware model.

## Useage

* Install

```
npm i code-matrix --save
```

* Use

```
const Router=require('../dist/index.js').default;
let router=new Router();
router.use('/test/output0',function(next){
    this.text+=0;
    console.log(0);
    next();
});
router.use('/test/output1',function(next){
    this.text+=1;
    console.log(1);
    next();
});
router.use('/test/output2',function(next){
    this.text+=2;
    console.log(2);
    next();
});
router.send({
    whiteList:['/test'],
    blackList:['/test/output1'],
    text:''
}).then(function(context){
    console.log(context.text);
});
```
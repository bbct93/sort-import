# sort-import
调整import排序plugin
### 排序方法
```
npx fast-sort-import sort <file>
```
### 排序规则
```
1. import a from '@a/xx';
2. import a from '@/xx/xx';
3. import a from '/xx/xx';
4. import a from '../xx/xx';
```
### 支持文件类型
```
目前只支持.vue，.js文件，不支持ts语法和其他文件
```

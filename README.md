# fast-sort-import
调整import排序plugin
### 安装
```
npm install fast-sort-import -D
```
### 使用方法
```
fast-sort-import sort <file> <file> <file>
```
### 配合husky or gitHooks食用更佳
```json
  "lint-staged": {
    "*.{js,vue}": [
      "fast-sort-import sort"
      "prettier --write",
      "eslint",
      "git add"
    ]
  },
  
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },

  "gitHooks": {
    "pre-commit": "lint-staged"
  },

  

```
### 排序规则
```
0. import a from 'a';
1. import a from '@a/xx';
2. import a from '@/xx/xx';
3. import a from '/xx/xx';
4. import a from '../xx/xx';
```
### 支持文件类型
```
目前只支持.vue，.js文件，不支持ts语法和其他文件
```


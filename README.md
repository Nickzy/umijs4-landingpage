# umi project

## Getting Started

Install dependencies,

```bash
$ yarn
```

Start the dev server,

```bash
$ yarn start
```

Build the dev server,
```
$ yarn build
```

# 配置内容



*** 注意 ***
#### 安装包，一定使用yarn或者npm安装，cnpm包切片代码与其他两种安装有所不同
```
yarn or npm
vendor: {
    name: 'vendors',
    test: /^.*node_modules[\\/](?!ag-grid-|lodash|wangeditor|react-virtualized|rc-select|rc-drawer|rc-time-picker|rc-tree|rc-table|rc-calendar|echarts|echarts-gl|xlsx|@ant-design|antd|ali-oss).*$/,
    priority: -10,
    enforce: true,
},
```
```
cnpm
vendor: {
    name: 'vendors',
    test: /^.*node_modules[\\/](?!ag-grid-|_lodash|_wangeditor|_react-virtualized|_rc-select|_rc-drawer|_rc-time-picker|_rc-tree|_rc-table|_rc-calendar|_echarts|_echarts-gl|_xlsx|_@ant-design|_antd|_ali-oss).*$/,
    priority: -10,
    enforce: true,
},
```
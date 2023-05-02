## 搜索表单
一般配合table使用

### props

#### formItems
表单信息。
格式为:
{
    width: 8, // 占比多少，共24，默认为8，
    label: '', // 名称
    value: '', // 参数
    type: '', // 内容类型，暂时只有text(文本输入)、select(搜索)
    options: [ // 当type为select时，必传
        {
            value: '', // 值
            label: '', // 名称
            <!-- [disabled, key, title] -->
        }
    ], 
}

#### formData
可传入查询对象，作为响应式关联。(ps: 也可以作为默认查询信息)

### 事件

#### searchForm
查询事件，返回formData(表单信息)

#### clearForm
重置事件，清空表单，业务侧此时可以重新查询
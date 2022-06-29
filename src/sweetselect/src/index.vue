<template>
  <VueTreeselect
    v-model="selectValue"
    :options="optionTree"
    :class="className"
    :flat="flatable"
    :disable-branch-nodes="selectLeafNode"
    :default-expand-level="expandLevel"
    :multiple="multiple"
    :clearable="clearable"
    :placeholder="placeholder"
    @input="handleInput"
    @select="handleSelect"
    @deselect="handleRemove"
    :maxHeight="maxHeight"
    :disabled="disabled"
    :noOptionsText="emptyText"
  ></VueTreeselect>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import VueTreeselect from '@riophae/vue-treeselect';
import { treeToList } from '@/utils/tree.js';

export default {
  name: 'SweetSelect',
  components: {
    VueTreeselect,
  },
  props: {
    // v-model(v-bind:value & v-on:input)
    value: {},
    // data: { // 原始列表数据
    //   type: Array,
    // },
    // 树形列表数据
    tree: {
      type: Array,
    },
    // nodeKey: { // 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
    //   type: String
    // },
    // props: {
    //   type: Object,
    //   default() {
    //     return {
    //       label: 'label',
    //       children: 'children',
    //     }
    //   }
    // },
    // 是否默认展开所有节点
    defaultExpandAll: {
      type: Boolean,
      default: true,
    },
    // 只能选择末级节点
    selectLeafNode: {
      type: Boolean,
      default: false,
    },
    // 是否严格的遵循父子互相关联的做法
    strictly: {
      type: Boolean,
      default: true,
    },
    // 是否开启多选
    multiple: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    // 尺寸
    size: {
      type: String,
      default: 'small',
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    maxHeight: {
      type: Number,
      default: 200,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    emptyText: {
      type: String,
      default: '无数据',
    },
  },
  data() {
    return {
      selectValue: null,
      // selectNodes: [], // 选中节点数组
      optionTree: [],
      optionList: [],
    };
  },
  computed: {
    expandLevel() {
      if (this.defaultExpandAll) {
        return Infinity; // 全部展开
      }
      return 0;
    },
    // 平面模式 [平面模式就是不严格，严格就不是平面模式]
    flatable() {
      if (this.strictly) {
        return false;
      }
      return true;
    },
    // 定制尺寸
    className() {
      if (this.size === 'small') {
        return ['vue-treeselect--small'];
      }
      return null;
    },
  },
  watch: {
    value: {
      handler(value) {
        if (value) {
          this.selectValue = value;
        } else {
          this.selectValue = null;
        }
      },
      immediate: true,
    },
    tree: {
      handler(arr) {
        if (arr) {
          this.optionTree = arr;
          this.optionList = treeToList(arr);
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleInput(value) {
      // 触发父组件 v-model
      this.$emit('input', value);
      // 增加change事件，返回所有选中节点
      if (this.multiple) {
        const nodes = this.optionList.filter((x) => value.includes(x._id));
        this.$emit('change', nodes);
      } else {
        const node = this.optionList.find((x) => x._id === value);
        this.$emit('change', node);
      }
    },
    handleSelect(node) {
      this.$emit('select', node);
    },
    handleRemove(node) {
      this.$emit('remove', node);
    },
  },
};
</script>

<style lang="less">
.vue-treeselect--small {
  .vue-treeselect__control {
    height: 32px;
  }

  .vue-treeselect__placeholder,
  .vue-treeselect__single-value {
    line-height: 30px;
  }
}
.vue-treeselect--disabled {
  .vue-treeselect__control {
    border-color: #e4e7ed;
    background-color: #f5f7fa;
    cursor: not-allowed;
  }
  .vue-treeselect__single-value {
    color: #c0c4cc;
  }
}
</style>
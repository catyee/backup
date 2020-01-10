<template>
  <div class="address-modal" @click="hideAddressSelector" >
    <mt-picker :slots="slots"  class="address-selector"
    @change="onValuesChange" ></mt-picker>
  </div>
</template>
<script>
import { Picker } from "mint-ui";
import addressList from "@/static/address.json";
export default {
  methods: {
      // 值的切换
    onValuesChange(picker, values) {
        if(addressList[values[0]]){
            picker.setSlotValues(1,Object.keys(addressList[values[0]]));
            picker.setSlotValues(2,addressList[values[0]][values[1]]);
            this.myAddressProvince = values[0];
            this.myAddressCity = values[1];
            this.myAddresscounty = values[2];
            this.$emit('get-address-value', this.myAddressProvince,this.myAddressCity,this.myAddresscounty);

        }
    },

    // 关闭address selector
     hideAddressSelector() {
      this.$emit('close-address-selector');
    }
  },
  mounted() {
      this.$nextTick(() => {
          this.slots[0].defaultIndex = 0;
      })
  },
  data() {
    return {
      slots: [
        {
          flex: 1,
          defaultIndex: 1,
          values: Object.keys(addressList),
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot2"
        },
        {
          flex: 1,
          values: [],
          className: "slot3",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot4"
        },
        {
          flex: 1,
          values: [],
          className: "slot5",
          textAlign: "center"
        }
      ],
      myAddressProvince: "省",
      myAddressCity: "市",
      myAddresscounty: "区/县"
    };
  }
};
</script>


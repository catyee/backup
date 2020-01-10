<template>
    <div class="my-evalute-container">
        <div class="common-header-container">
            <mt-header fixed title="评价">
                <router-link to="/user-center" slot="left">
                    <mt-button icon="back"></mt-button>
                </router-link>
            </mt-header>
            <div class="common-header-height"></div>
        </div>
        <div class="evaluate-count">您已贡献了<span>{{count}}</span>条评价</div>

        <div ref="mescroll" class="mescroll">
            <ul class="pl-20 pr-20 evaluate-list" id="list">
                <li class="mb-20" v-for="(item, index) in myEvaluateList" :key="index">
                    <my-evaluate-list :item="item"></my-evaluate-list>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import MyEvaluateList from "@/components/my-evaluate/my-evaluate-list";
import './my-evaluate.scss';
import {Toast} from 'mint-ui';
import MeScroll from "mescroll.js";
import "mescroll.js/mescroll.min.css";
import CommonModule from "@/common/common.js";
export default {
    components: {
        'my-evaluate-list': MyEvaluateList,
    },
    data () {
        return {
            count: 0, // 评价数量
            myEvaluateList: [], // 评价列表
            page: 0,
            pageSize: 5,
        }
    },
    mounted() {
        this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: {
            // auto: true,
            callback: this.upCallback,
            page: {
                num: this.page,
                size: this.pageSize,
            },
            htmlNodata: '<p class="upwarp-nodata">暂无更多数据~</p>',
            noMoreSize: 5,
            empty: {
                warpId: "list", // 父布局的id; 如果此项有值,将不使用clearEmptyId的值;
                tip: "暂无相关数据~", // 提示
                icon: require('@/assets/empty.png'), // 无数据时显示图片
            },
        }
        });
        CommonModule.topAdaption('.mint-header');
        $api.dom('.common-header-height').style.height = $api.offset($api.dom('.mint-header')).h + 'px';
    },
    methods: {
        // 上拉加载的回调
        upCallback(page) {
            let url = '/qd/rest/evaluate';
            let data = {
                flag: 1, // flag=1 我对别人的评价 ,flag=2 别人对我的评价
                page: page.num,
                pageSize: page.size,
            };

            window/$api.get(url, data).then(res => {

                if (!res || !res.body || !res.code) {
                    this.$nextTick(() => {
                        this.mescroll.endSuccess(0);
                    });
                    Toast('服务器内部错误');
                    return;
                }

                if (page.num === 1) this.myEvaluateList = [];

                if (res.code && res.code === 200) {
                    this.count = res.body.totalCount;
                    this.myEvaluateList = this.myEvaluateList.concat(res.body.records);
                    // 数据渲染成功后,隐藏下拉刷新的状态
                    this.$nextTick(() => {
                        this.mescroll.endSuccess(res.body.records.length);
                    });
                } else {
                    Toast("服务器错误"+res.code)
                    this.mescroll.endErr();
                }

            }).catch(() => {
                this.mescroll.endErr();
                Toast("服务器错误")
            });
        },
    },
}
</script>
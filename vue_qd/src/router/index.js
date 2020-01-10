import Vue from "vue";
import VueRouter from "vue-router";
import CommonModule from "@/common/common.js";


// 路由懒加载

const getComponent = (name) => () => import(`@/pages/${name}`);

// Vue.use(VueRouter);


const router = [
    {
        path: '/login',
        name: 'Login',
        component: getComponent('login'),
        // 关闭toast
        beforeEnter: (to,from,next) =>{
            if(CommonModule.toastInstance){
                CommonModule.toastInstance.close();
            }
            next();
        }
    },
    {
        path: '/home',
        redirect: '/'
    },
    {
        path: '/agreement',
        name: 'Agreement',
        component: getComponent('agreement')
    },
    {
        path: '/',
        name: 'home',
        component: getComponent('home'),
        redirect: '/pick-order',
        children: [
            {
                path: 'pick-order',
                name: 'PickOrder',
                component: getComponent('pick-order'),
                // 关闭toast
                beforeEnter: (to,from,next) =>{
                    if(CommonModule.toastInstance){
                        CommonModule.toastInstance.close();
                    }
                    next();
                }

            },
            {
                path: 'order-manage',
                name: 'OrderManage',
                component: getComponent('order-manage'),
                beforeEnter: (to, from, next) => {
                    CommonModule.judgeAuthority().then(success => {
                        if (!success) {
                            next({ path: '/user-center', replace: true });
                        } else {
                            next();
                        }
                    });
        
                }
            },
            {
                path: 'user-center',
                name: 'UserCenter',
                component: getComponent('user-center')
            },
        ]
    },
    {
        // 个人信息
        path: '/register/:flag?',
        name: 'Register',
        component: getComponent('register'),
    },
    // 我的评价
    {
        path: '/user-center/my-evaluate',
        name: 'MyEvaluate',
        component: getComponent('my-evaluate'),
        beforeEnter: (to, from, next) => {
            CommonModule.judgeAuthority().then(success => {
                if (!success) {
                    next({ path: '/user-center', replace: true });
                } else {
                    next();
                }
            });

        }
    },
    // 收入明细
    {
        path: '/user-center/income-detail',
        name: 'IncomeDetail',
        component: getComponent('income-detail'),
        beforeEnter: (to, from, next) => {
            CommonModule.judgeAuthority().then(success => {
                if (!success) {
                    next({ path: '/user-center', replace: true });
                } else {
                    next();
                }
            });

        }
    },
    // 修改密码
    {
        path: '/user-center/modify-password',
        name: 'ModifyPassword',
        component: getComponent('modify-password'),
        beforeEnter: (to, from, next) => {
            CommonModule.judgeAuthority().then(success => {
                if (!success) {
                    next({ path: '/user-center', replace: true });
                } else {
                    next();
                }
            });

        }
    },
    // 找回密码
    {
        // path 需要根据登录模块定义的路由路径重新修改
        path: '/login/find-back-password',
        name: 'FindBackPassword',
        component: getComponent('find-back-password'),
    },
    // 重置密码
    {
        // path 需要根据登录模块定义的路由路径重新修改
        path: '/login/reset-password',
        name: 'ResetPassword',
        component: getComponent('reset-password'),
    },
    // 评价
    {
        path: '/evaluate/:taskId',
        name: 'Evaluate',
        component: getComponent('evaluate'),
    },
    // 我的订单-订单详情
    {
        path: '/order-detail',
        name: 'OrderDetail',
        component: getComponent('order-detail'),
        beforeEnter: (to, from, next) => {
            CommonModule.judgeAuthority().then(success => {
                if (!success) {
                    next({ path: '/user-center', replace: true });
                } else {
                    next();
                }
            });

        }
    },
    // 我的排班-订单详情
    {
        path: '/arrange-detail',
        name: 'ArrangeDetail',
        component: getComponent('arrange-detail'),
        beforeEnter: (to, from, next) => {
            CommonModule.judgeAuthority().then(success => {
                if (!success) {
                    next({ path: '/user-center', replace: true });
                } else {
                    next();
                }
            });

        }
    },
    // 注册手机号
    {
        path: '/register-mobile',
        name: 'RegisterMobile',
        component: getComponent('register-mobile'),
    },
    // 抢单详情
    {
        path: '/pick-order-detail/:orderId',
        name: 'PickOrderDetail',
        component: getComponent('pick-order-detail'),
        beforeEnter: (to, from, next) => {
            CommonModule.judgeAuthority().then(success => {
                if (!success) {
                    next({ path: '/user-center', replace: true });
                } else {
                    next();
                }
            });

        }
    }

]


export default new VueRouter({
    routes: router
})
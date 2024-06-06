import React from 'react'
import { AUTH_PREFIX_PATH, APP_PREFIX_PATH } from 'configs/AppConfig'

export const publicRoutes = [
    {
        key: 'login',
        path: `${AUTH_PREFIX_PATH}/login`,
        component: React.lazy(() => import('views/auth-views/authentication/login')),
    },
]

export const protectedRoutes = [
    {
        key: 'dashboard.default',
        path: `${APP_PREFIX_PATH}/dashboards/default`,
        component: React.lazy(() => import('views/app-views/dashboards/default/')),
    },
    {
        key: 'statistical-deposit',
        path: `${APP_PREFIX_PATH}/statistical/deposit`,
        component: React.lazy(() => import('views/app-views/statistical/deposit')),
    },
    {
        key: 'statistical-withdraw',
        path: `${APP_PREFIX_PATH}/statistical/withdraw`,
        component: React.lazy(() => import('views/app-views/statistical/withdraw')),
    },
    {
        key: 'statistical-history-deposit',
        path: `${APP_PREFIX_PATH}/statistical/history-deposit`,
        component: React.lazy(() => import('views/app-views/statistical/history-deposit')),
    },
    {
        key: 'statistical-history-withdraw',
        path: `${APP_PREFIX_PATH}/statistical/history-withdraw`,
        component: React.lazy(() => import('views/app-views/statistical/history-withdraw')),
    },
    {
        key: 'functions-product-management',
        path: `${APP_PREFIX_PATH}/functions/product-management`,
        component: React.lazy(() => import('views/app-views/functions/product-management/index')),
    },
    {
        key: 'functions-create-product',
        path: `${APP_PREFIX_PATH}/functions/product-management/create`,
        component: React.lazy(() => import('views/app-views/functions/product-management/create')),
    },
    {
        key: 'functions-update-product',
        path: `${APP_PREFIX_PATH}/functions/product-management/update`,
        component: React.lazy(() => import('views/app-views/functions/product-management/update')),
    },
    {
        key: 'functions-category-management',
        path: `${APP_PREFIX_PATH}/functions/category-management`,
        component: React.lazy(() => import('views/app-views/functions/category-management/index')),
    },
    {
        key: 'functions-create-category',
        path: `${APP_PREFIX_PATH}/functions/category-management/create`,
        component: React.lazy(() => import('views/app-views/functions/category-management/create')),
    },
    {
        key: 'functions-update-category',
        path: `${APP_PREFIX_PATH}/functions/category-management/update`,
        component: React.lazy(() => import('views/app-views/functions/category-management/update')),
    },
    {
        key: 'functions-user-management',
        path: `${APP_PREFIX_PATH}/functions/user-management`,
        component: React.lazy(() => import('views/app-views/functions/user-management')),
    },
    {
        key: 'functions-order-managements',
        path: `${APP_PREFIX_PATH}/functions/order-managements`,
        component: React.lazy(() => import('views/app-views/functions/order-managements/index')),
    },
    {
        key: 'functions-order-history',
        path: `${APP_PREFIX_PATH}/functions/order-managements/order-history`,
        component: React.lazy(() => import('views/app-views/functions/order-managements/order-history')),
    },
    {
        key: 'functions-image-management',
        path: `${APP_PREFIX_PATH}/functions/image-management`,
        component: React.lazy(() => import('views/app-views/functions/image-management')),
    }
]
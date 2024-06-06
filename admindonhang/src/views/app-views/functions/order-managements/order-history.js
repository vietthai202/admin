import { Button, Table, Tag, message, Card, Input, Select, Modal } from "antd";
import {  EditOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import formatDate from 'views/app-views/formatDate'
import { useNavigate } from "react-router-dom";
import utils from "utils";
import transactionService from "services/TransactionService";
import orderSettingService from "services/OrderSettingService";
import productService from "services/ProductService";
import userService from "services/UserService";


const USER_WITHDRAWAL = [
    {
        value: false,
        label: 'Moving',
    },
    {
        value: true,
        label: 'Done',
    },
]

export const VipManagement = () => {
    const format = formatDate;
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [listOrder, setListOrder] = useState([]);
    const [afterUpdate, setAfterUpdate] = useState(true);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const buttonDelete = async (id) => {
        setIsDeleteOpen(true);
        try {
            const [orderData, productData] = await Promise.all([
                orderSettingService.getOrderDetailByOrder(id),
                productService.getAllProduct()
            ]);
            const order = orderData;
            const productList = productData;
            const categoryMap = new Map(productList.map(product => [product.id, product.name]));
            const updatedOrderList = order.map(order => ({
                ...order,
                productName: categoryMap.get(order.productId) || ""
            }));

            setListOrder(updatedOrderList);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const cancelDelete = () => {
        setIsDeleteOpen(false);
    }

    const renderStatus = (roleValue) => {
        const role = USER_WITHDRAWAL.find(item => item.value === roleValue);
        let color = 'green';
        if (role && role.value === false) {
            color = 'volcano';
        }
        return (
            <Tag color={color} key={roleValue}>
                {role ? role.label : 'Chưa biết'}
            </Tag>
        );
    };

    const tableColumns = [
        {
            title: "Khách hàng",
            dataIndex: "userName",
            sorter: (a, b) => utils.antdTableSorter(a, b, "userName"),
        },
        {
            title: "Cân nặng",
            dataIndex: "freight",
            sorter: (a, b) => utils.antdTableSorter(a, b, "freight"),
        },
        {
            title: "Địa chỉ nhận hàng",
            dataIndex: "shipAddress",
            sorter: (a, b) => utils.antdTableSorter(a, b, "shipAddress"),
        },
        {
            title: "Phương thức thanh toán",
            dataIndex: "payment",
            sorter: (a, b) => utils.antdTableSorter(a, b, "payment"),
        },
        {
            title: "Ngày order",
            dataIndex: "orderDate",
            sorter: (a, b) => utils.antdTableSorter(a, b, "orderDate"),
            render: orderDate => format(orderDate)
        },
        {
            title: "Ngày nhận",
            dataIndex: "shippedDate",
            sorter: (a, b) => utils.antdTableSorter(a, b, "shippedDate"),
            render: shippedDate => format(shippedDate)
        },
        {
            title: "Trạng thái đơn",
            dataIndex: "status",
            sorter: (a, b) => utils.antdTableSorter(a, b, "status"),
            render: renderStatus
        },
        {
            title: "Hành động",
            dataIndex: "actions",
            render: (_, record) => (
                <div>
                    <Button classNames="mt-2" danger onClick={() => buttonDelete(record.id)}>
                        Thông tin
                    </Button>
                </div>
            ),
        },
    ];

    const tableColumnsOrder = [
        {
            title: "Tên sản phẩm",
            dataIndex: "productName",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",

        },
        {
            title: "Tổng tiền",
            dataIndex: "price",

        },
    ]

    const fetchData = async () => {
        setLoading(true);
        try {
            const [orderData, userData] = await Promise.all([
                transactionService.getAllOrder(),
                userService.getAllUser()
            ]);
            const order = orderData;
            const user = userData;
            const userMap = new Map(user.map(user => [user.id, user.lastName]));
            const updatedOrderList = order.map(order => ({
                ...order,
                userName: userMap.get(order.userId) || ""
            }));
            setList(updatedOrderList);
            setLoading(false)
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [afterUpdate]);

    return (
        <Card>
            
            <div className="table-responsive">
                <Table
                    columns={tableColumns}
                    dataSource={list}
                    loading={loading}
                />

                <Modal
                    okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                    title="Thông tin đơn hàng"
                    open={isDeleteOpen}
                    onCancel={cancelDelete}
                >
                    <Table
                        columns={tableColumnsOrder}
                        dataSource={listOrder}
                        loading={loading}
                        rowKey='id'
                    />
                </Modal>
            </div>
        </Card>
    )
}


export default VipManagement;
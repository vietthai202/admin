import { Card, Input, Table, Tag, Button, message, Modal } from 'antd';
import NumberFormat from 'react-number-format';
import formatDate from '../formatDate'
import { useEffect, useState } from 'react';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import transactionService from 'services/TransactionService';
import userService from 'services/UserService';
import utils from 'utils';

const Transaction = (dataType) => {
    const [list, setList] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const format = formatDate;
    const openDeleteConfirmation = () => {
        setIsDeleteOpen(true);
    };

    const closeDeleteConfirmation = () => {
        setIsDeleteOpen(false);
    };
    const confirmDelete = () => {
        const row = selectedRows[0];
        deleteRow(row);
        closeDeleteConfirmation();
    };

    const getType = type => {
        switch (type) {
            case 'NAPTIEN':
                return 'blue';
            default:
                return 'red';
        }
    };

    const getStatus = status => {
        switch (status) {
            case 1:
                return 'green';
            case 0:
                return 'blue';
            default:
                return 'red';
        }
    };
    const deleteTransaction = async (uuid) => {
        try {
            await transactionService.deleteTransaction(uuid);
            message.success('Xóa giao dịch thành công')
        } catch (error) {
            message.error('Xóa giao dịch thất bại')
            console.error('ERROR:', error);
        }
    };
    const deleteRow = row => {
        const objKey = 'id'
        let data = list
        data = utils.deleteArrayRow(data, objKey, row?.id)
        setList(data)
        deleteTransaction({ uuid: row?.uuid })

    }
    const tableColumns = [
        {
            title: 'ID',
            dataIndex: 'id'
        },
        {
            title: 'Số lượng',
            dataIndex: 'amount',
            render: price => (
                <div>
                    <NumberFormat
                        displayType={'text'}
                        value={(Math.round(price * 100) / 100).toFixed(2)}
                        prefix={'$'}
                        thousandSeparator={true}
                    />
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'amount')
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            render: (_, elm) => (
                <><Tag color={getType(elm.type)}>{elm.type === 'NAPTIEN' ? 'Nạp tiền' : 'Rút tiền'}</Tag></>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'type')
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (_, elm) => (
                <><Tag color={getStatus(elm.status)}>{elm.status === 1 ? 'Thành công' : 'Từ chối'}</Tag></>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'status')
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'user_id',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'user_id')
        },
        {
            title: 'Ngày cập nhập',
            dataIndex: 'updatedAt',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'updatedAt'),
            render: updatedAt => format(updatedAt)
        },
        {
            title: 'Hành động',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div>
                    <Button danger onClick={() => {
                        openDeleteConfirmation();
                        setSelectedRows([elm]);
                    }} className='m-1'>
                        <Flex alignItems="center">
                            <DeleteOutlined />
                            <span className="ml-2">Xóa</span>
                        </Flex>
                    </Button>
                </div>
            )
        }
    ];

    const rowSelection = {
        onChange: (key, rows) => {
            setSelectedRows(rows)
            setSelectedRowKeys(key)
        }
    };

    const onSearch = e => {
        const value = e.currentTarget.value
        if (!value) {
            fetchData()
        } else {
            const searchArray = e.currentTarget.value && list
            const data = utils.wildCardSearch(searchArray, value)
            setList(data)
            setSelectedRowKeys([])
        }
    }

    const fetchData = async () => {
        try {
            const [transactionData, userData] = await Promise.all([
                transactionService.getTypeTransaction({ type: dataType?.dataType }),
                userService.getAllUser(),
            ]);

            const transactionList = transactionData?.data;
            const userList = userData?.data;
            if (transactionList && transactionList.length > 0 && userList && userList.length > 0) {
                const filteredTransactions = transactionList.filter(transaction => transaction.status !== 0);
                if (filteredTransactions.length > 0) {
                    const userMap = new Map(userList.map(user => [user.id, user.full_name]));
                    const updatedTransactionList = filteredTransactions.map(transaction => ({
                        ...transaction,
                        user_id: userMap.get(transaction.user_id) || "Unknown",
                    }));
                    setList(updatedTransactionList);
                } else {
                    console.error("Không tìm thấy giao dịch sau khi lọc");
                }
            } else {
                console.error("Không tìm thấy dữ liệu giao dịch hoặc dữ liệu người dùng");
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Card>
            <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
                <Flex className="mb-1" mobileFlex={false}>
                    <div className="mr-md-3 mb-3">
                        <Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
                    </div>
                </Flex>

            </Flex>
            <div className="table-responsive">
                <Table
                    columns={tableColumns}
                    dataSource={list}
                    rowKey='id'
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        type: 'checkbox',
                        preserveSelectedRowKeys: false,
                        ...rowSelection,
                    }}
                />
                <Modal
                    okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                    title="Xóa giao dịch!"
                    open={isDeleteOpen}
                    onOk={confirmDelete}
                    onCancel={closeDeleteConfirmation}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <div className='flex flex-col items-center'>
                        Bạn có chắc chắn muốn xóa giao dịch này?
                    </div>
                </Modal>
            </div>
        </Card>
    )
}

export default Transaction

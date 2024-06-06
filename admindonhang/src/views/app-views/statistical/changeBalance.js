import { Card, Input, Table, Tag, Button, message, Modal } from 'antd';
import NumberFormat from 'react-number-format';
import { useEffect, useState } from 'react';
import { SearchOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import formatDate from '../formatDate'
import Flex from 'components/shared-components/Flex';
import transactionService from 'services/TransactionService';
import userService from 'services/UserService';
import utils from 'utils';
import AuthService from 'services/AuthService';

const ChangeBalance = (dataType) => {
    const [list, setList] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedRowData, setSelectedRowData] = useState()
    const [selectedRowType, setSelectedRowType] = useState()
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const format = formatDate;
    const getTypeType = type => {
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
            case 2:
                return 'red';
            default:
                return 'blue';
        }
    };
    const doBalance = async (row, uuid, type) => {
        try {
            if (AuthService.isLogger()) {
                if (type === 'accepted') {
                    await userService.confirmBalance(uuid)
                    deleteRow(row, "Chấp nhận giao dịch")
                } else {
                    await userService.refuseBalance(uuid)
                    deleteRow(row, "Từ chối giao dịch")
                }
            }
        } catch (error) {
            message.error('Cập nhập giao dịch thất bại')
            console.error('ERROR:', error);
        }
    };
    const deleteRow = (row, mess) => {
        message.success('Cập nhập giao dịch thành công: ' + mess)
        const objKey = 'id'
        let data = list
        data = utils.deleteArrayRow(data, objKey, row?.id)
        setList(data)
    }
    const openConfirmation = (row, type) => {
        setIsDeleteOpen(true);
        setSelectedRowData(row)
        setSelectedRowType(type)
    };
    const closeConfirmation = () => {
        setIsDeleteOpen(false);
    };
    const confirmAction = () => {
        doBalance(selectedRowData, { uuid: selectedRowData?.uuid }, selectedRowType)
        closeConfirmation();
    };
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
                <><Tag color={getTypeType(elm.type)}>{elm.type === 'NAPTIEN' ? 'Nạp tiền' : 'Rút tiền'}</Tag></>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'type')
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (_, elm) => (
                <><Tag color={getStatus(elm.status)}>{elm.status === 0 ? 'Chờ xử lý' : 'Không xác định'}</Tag></>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'status')
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'user_id',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'user_id')
        },
        {
            title: 'Ngày khởi tạo',
            dataIndex: 'createdAt',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'createdAt'),
            render: createdAt => format(createdAt)
        },
        {
            title: 'Hành động',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div>
                    <Button danger onClick={() => openConfirmation(elm, 'refuse')} className='m-1'>
                        <Flex alignItems="center">
                            <ExclamationCircleOutlined />
                            <span className="ml-2">Từ chối</span>
                        </Flex>
                    </Button>
                    <Button type="primary" onClick={() => openConfirmation(elm, 'accepted')} className='m-1'>
                        <Flex alignItems="center">
                            <CheckCircleOutlined />
                            <span className="ml-2">Chấp nhận</span>
                        </Flex>
                    </Button>
                </div>
            )
        }
    ];

    const rowSelection = {
        onChange: (key, rows) => {
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
                transactionService.getTypeTransaction({ type: dataType?.dataType, status: 0 }),
                userService.getAllUser(),
            ]);

            const transactionList = transactionData?.data;
            const userList = userData?.data;
            if (transactionList && transactionList.length > 0 && userList && userList.length > 0) {
                const userMap = new Map(userList.map(user => [user.id, user.full_name]));
                const updatedTransactionList = transactionList.map(transaction => ({
                    ...transaction,
                    user_id: userMap.get(transaction.user_id) || "Unknown",
                }));
                setList(updatedTransactionList);
            } else {
                console.error("Không tìm thấy giao dịch");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [selectedRowData, selectedRowType]);

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
                    title={selectedRowType === 'accepted' ? 'Chấp nhận giao dịch!' : 'Từ chối giao dịch!'}
                    open={isDeleteOpen}
                    onOk={confirmAction}
                    onCancel={closeConfirmation}
                    okText="Xác nhận"
                    cancelText="Hủy"
                >
                    <div className='flex flex-col items-center'>
                        {selectedRowType === 'accepted' ? 'Bạn có chắc chắn muốn chấp nhận giao dịch!' : 'Bạn có chắc chắn muốn từ chối giao dịch!'}
                    </div>
                </Modal>
            </div>
        </Card>
    )
}

export default ChangeBalance
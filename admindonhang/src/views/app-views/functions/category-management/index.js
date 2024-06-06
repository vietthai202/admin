import { Button, Card, Input, Table, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteOutlined, PlusCircleOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import Flex from 'components/shared-components/Flex';
import { useNavigate } from "react-router-dom";
import categoryService from 'services/CategoryService';
import utils from 'utils';
import { BACKEND_UPLOAD_URL } from 'constants/ApiConstant';
const CategoryManagement = () => {
    const navigate = useNavigate();
    const [list, setList] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
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
    const addCategory = () => {
        navigate(`/app/functions/category-management/create`)
    }
    const updateCategory = (categoryData) => {
        navigate('/app/functions/category-management/update', { state: { categoryData } });
    };
    const deleteCategory = async (uuid) => {
        try {
            await categoryService.deleteCategory(uuid);
            message.success('Xóa danh mục thành công')
        } catch (error) {
            message.error('Xóa danh mục thất bại')
            console.error('ERROR:', error);
        }
    };
    const deleteRow = row => {
        const objKey = 'id'
        let data = list
        data = utils.deleteArrayRow(data, objKey, row.id)
        setList(data)
        deleteCategory({ uuid: row.uuid })

    }
    const tableColumns = [
        {
            title: 'ID',
            dataIndex: 'id'
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'categoryName',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'description')
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
                    <Button onClick={() => updateCategory(elm)} type="primary" className='m-1'>
                        <Flex alignItems="center">
                            <EditOutlined />
                            <span className="ml-2">Sửa</span>
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
        await categoryService.getAllCategory().then((data) => {
            setList(data);
        }).catch((error) => {
            console.error("ERROR");
        })
    }
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Card>
            <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
                <Flex className="mb-1" mobileFlex={false}>
                    <div className="mr-md-3 mb-3">
                        <Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => (e)} />
                    </div>
                    <div className="mb-3">

                    </div>
                </Flex>
                <div>
                    <Button onClick={addCategory} type="primary" icon={<PlusCircleOutlined />} block>Thêm</Button>
                </div>
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
                    title="Xóa danh mục!"
                    open={isDeleteOpen}
                    onOk={confirmDelete}
                    onCancel={closeDeleteConfirmation}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <div className='flex flex-col items-center'>
                        Bạn có chắc chắn muốn xóa danh mục này?
                    </div>
                </Modal>
            </div>
        </Card>
    )
}

export default CategoryManagement

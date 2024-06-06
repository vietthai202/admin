import { Button, Card, Input, Select, Table, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteOutlined, PlusCircleOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import Flex from 'components/shared-components/Flex';
import NumberFormat from 'react-number-format';
import { useNavigate } from "react-router-dom";
import productService from 'services/ProductService';
import categoryService from 'services/CategoryService';
import utils from 'utils';
import { BACKEND_UPLOAD_URL } from 'constants/ApiConstant';
const { Option } = Select


const ProductManagement = () => {
    const navigate = useNavigate();
    const [list, setList] = useState([])
    const [categories, setCategories] = useState([])
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
    const addProduct = () => {
        navigate(`/app/functions/product-management/create`)
    }

    const updateProduct = (productData) => {
        navigate('/app/functions/product-management/update', { state: { productData } });
    };
    const deleteProduct = async (uuid) => {
        try {
            await productService.deleteProduct(uuid);
            message.success('Xóa sản phẩm thành công')
        } catch (error) {
            message.error('Xóa sản phẩm thất bại')
            console.error('ERROR:', error);
        }
    };
    const deleteRow = row => {
        const objKey = 'id'
        let data = list
        data = utils.deleteArrayRow(data, objKey, row?.id)
        setList(data)
        deleteProduct(row?.id)
    }

    const tableColumns = [
        {
            title: 'ID',
            dataIndex: 'id'
        },
        {
            title: 'Hình  ảnh',
            dataIndex: 'image',
            render: (_, record) => (
                <div className="d-flex">
                    <AvatarStatus size={60} type="square" src={BACKEND_UPLOAD_URL + record.image} alt={record.name} />
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'image')
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'description')
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'category')
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            render: price => (
                <div>
                    <NumberFormat
                        displayType={'text'}
                        value={Math.round(price).toLocaleString('vi-VN')}
                       
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                    />
                    {'₫'}
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'price')
        },
        {
            title: 'Số lượng',
            dataIndex: 'ammount',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'total')
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
                    <Button onClick={() => updateProduct(elm)} type="primary" className='m-1'>
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

    const handleShowCategory = value => {
        if (value !== 'All') {
            const searchArray = value && list
            const data = utils.wildCardSearch(searchArray, value)
            setList(data)
            setSelectedRowKeys([])
        } else {
            fetchData()
        }
    }

    const fetchData = async () => {
        try {
            const [categoryData, productData] = await Promise.all([
                categoryService.getAllCategory(),
                productService.getAllProduct()
            ]);
            const categories = categoryData;
            const productList = productData;
            const categoryMap = new Map(categories.map(category => [category.id, category.categoryName]));
            const updatedProductList = productList.map(product => ({
                ...product,
                category: categoryMap.get(product.categoryId) || "Uncategorized"
            }));
            setCategories(categories);
            setList(updatedProductList);
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
                    <div className="mb-3">
                        <Select
                            defaultValue="All"
                            className="w-100"
                            style={{ minWidth: 180 }}
                            onChange={handleShowCategory}
                            placeholder="Category"
                        >
                            <Option value="All">All</Option>
                            {
                                categories.map(elm => (
                                    <Option key={elm.id} value={elm.name}>{elm.name}</Option>
                                ))
                            }
                        </Select>
                    </div>
                </Flex>
                <div>
                    <Button onClick={addProduct} type="primary" icon={<PlusCircleOutlined />} block>Thêm</Button>
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
                    title="Xóa sản phẩm!"
                    open={isDeleteOpen}
                    onOk={confirmDelete}
                    onCancel={closeDeleteConfirmation}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <div className='flex flex-col items-center'>
                        Bạn có chắc chắn muốn xóa sản phẩm này?
                    </div>
                </Modal>
            </div>
        </Card>
    )
}

export default ProductManagement

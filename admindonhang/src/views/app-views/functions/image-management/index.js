import { useEffect, useState } from 'react';
import { Button, Card, Input, Table, message, Modal, Upload } from 'antd';
import { DeleteOutlined, PlusCircleOutlined, SearchOutlined, CopyOutlined, UploadOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import Flex from 'components/shared-components/Flex';
import { useNavigate } from "react-router-dom";
import imageService from 'services/ImageService';
import utils from 'utils';
import { BACKEND_UPLOAD_URL } from 'constants/ApiConstant';
const ImageManagement = () => {
    const navigate = useNavigate();
    const [list, setList] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
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
    const openUploadModal = () => {
        setIsUploadOpen(true);
    };

    const closeUploadModal = () => {
        setIsUploadOpen(false);
    };

    const handleUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            const response = await imageService.uploadImage(formData);
            if (response.status) {
                const uploadedFilename = response.data.filename;
                message.success(`Uploaded file: ${uploadedFilename}`);
                fetchData();
            } else {
                message.error(response.message);
            }
        } catch (error) {
            message.error('Đã xảy ra lỗi khi tải lên hình ảnh: ' + error);
        }
    };

    const deleteImage = async (id) => {
        try {
            await imageService.deleteImage(id);
            message.success('Xóa hình ảnh thành công')
        } catch (error) {
            message.error('Xóa hình ảnh thất bại')
            console.error('ERROR:', error);
        }
    };
    const deleteRow = row => {
        const objKey = 'id'
        let data = list
        data = utils.deleteArrayRow(data, objKey, row.id)
        setList(data)
        deleteImage(row.id)

    }
    const copyFilename = row => {
        navigator.clipboard.writeText(BACKEND_UPLOAD_URL + row?.filename).then(() => {
            message.success('Sao chép hình ảnh thành công');
        }).catch(err => {
            message.error('Đã xảy ra lỗi khi sao chép: ' + err);
        });
    }
    const tableColumns = [
        {
            title: 'ID',
            dataIndex: 'id'
        },
        {
            title: 'Hình  ảnh',
            dataIndex: 'filename',
            render: (_, record) => (
                <div className="d-flex">
                    <AvatarStatus size={60} type="square" src={BACKEND_UPLOAD_URL + record.filename} alt={record.name} />
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'filename')
        },
        {
            title: 'Tên',
            dataIndex: 'filename',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'filename')
        },
        {
            title: 'Đường dẫn',
            dataIndex: 'path',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'path')
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
                    <Button onClick={() => {
                        copyFilename(elm);
                    }} className='m-1' type="primary" >
                        <Flex alignItems="center">
                            <CopyOutlined />
                            <span className="ml-2">Sao chép</span>
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
        await imageService.getAllImage().then((data) => {
            setList(data.data);
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
                        <Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
                    </div>
                    <div className="mb-3">

                    </div>
                </Flex>
                <div>
                    <Button onClick={openUploadModal} type="primary" icon={<PlusCircleOutlined />} block>Thêm hình ảnh</Button>
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
                    title="Xóa hình ảnh!"
                    open={isDeleteOpen}
                    onOk={confirmDelete}
                    onCancel={closeDeleteConfirmation}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <div className='flex flex-col items-center'>
                        Bạn có chắc chắn muốn xóa hình ảnh này?
                    </div>
                </Modal>
                <Modal
                    title="Tải hình ảnh"
                    open={isUploadOpen}
                    onCancel={closeUploadModal}
                    footer={null}
                >
                    <div>
                        <Upload
                            beforeUpload={handleUpload}
                        >
                            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                        </Upload>
                    </div>
                </Modal>
            </div>
        </Card>
    )
}


export default ImageManagement
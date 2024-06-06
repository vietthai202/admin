import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Card, Form, message, Button, Upload, Flex } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import categoryService from 'services/CategoryService';
import imageService from 'services/ImageService';
import { useNavigate } from 'react-router-dom';

const rules = {
    name: [
        {
            required: true,
            message: 'Vui lòng nhập tên danh mục',
        }
    ],
    description: [
        {
            required: true,
            message: 'Vui lòng nhập mô tả danh mục',
        }
    ],
    image: [
        {
            required: true,
            message: 'Vui lòng hình ảnh danh mục',
        }
    ],
    ratio: [
        {
            required: true,
            message: 'Vui lòng nhập giá danh mục',
        }
    ],
    introduce: [
        {
            required: false,
            message: 'Vui lòng nhập phần trăm giảm giá danh mục',
        }
    ],
    constraint: [
        {
            required: false,
            message: 'Vui lòng nhập số lượng danh mục',
        }
    ],
}
const AddCategory = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        ratio: '',
        introduce: '',
        constraint: '',
    });

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSubmit = async (event) => {
        fetchData();
        setFormData({
            name: '',
            description: '',
            image: '',
            ratio: '',
            introduce: '',
            constraint: '',
        });
    };
    const handleUpload = async (file) => {
        try {
            const data = new FormData();
            data.append('image', file);
            const response = await imageService.uploadImage(data);
            if (response.status) {
                const uploadedFilename = response.data.filename;
                setFormData(prevFormData => ({
                    ...prevFormData,
                    image: uploadedFilename,
                }));
                message.success(`Uploaded file: ${uploadedFilename}`);
            } else {
                message.error(response.message);
            }
        } catch (error) {
            message.error('Đã xảy ra lỗi khi tải lên hình ảnh: ' + error);
        }
    };
    const fetchData = async () => {
        try {
            await categoryService.createCategory(formData);
            message.success('Thêm danh mục thành công');
            navigate(`/app/functions/category-management/`)
        } catch (error) {
            message.error('Thêm danh mục thất bại', error)
        }
    };
    const fetchDataCategory = async () => {
        await categoryService.getAllCategory().then((data) => {
            setFormData(data?.data);
        }).catch((error) => {
            console.error("ERROR");
        })
    }
    useEffect(() => {
        fetchDataCategory();
    }, []);
    return (
        <Row gutter={16}>
            <Col xs={24} sm={24} md={24}>
                <Card title="Thông tin cơ bản">
                    <Form onFinish={handleSubmit}>
                        <Form.Item label="Tên danh mục" name="name" rules={rules.name}>
                            <Input placeholder="Tên danh mục" value={formData.name} onChange={e => handleChange('name', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Mô tả" name="description" rules={rules.description}>
                            <Input.TextArea rows={4} placeholder="Mô tả" value={formData.description} onChange={e => handleChange('description', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Hình ảnh" name="image" rules={rules.image} >
                            <Flex gap="middle">
                                <Upload beforeUpload={handleUpload} showUploadList={false} maxCount={1} >
                                    <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                                </Upload>
                                <Input value={formData.image} onChange={e => handleChange('image', e.target.value)} />
                            </Flex>
                        </Form.Item>
                        <Form.Item label="Tỉ lệ" name="ratio" rules={rules.ratio}>
                            <Input placeholder="Tỉ lệ" value={formData.ratio} onChange={e => handleChange('ratio', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Giới thiệu" name="introduce" rules={rules.introduce}>
                            <Input placeholder="Giới thiệu" value={formData.introduce} onChange={e => handleChange('introduce', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Hạn chế" name="constraint" rules={rules.constraint}>
                            <Input placeholder="Hạn chế" value={formData.constraint} onChange={e => handleChange('constraint', e.target.value)} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">Tạo danh mục</Button>
                    </Form>
                </Card>

            </Col>
        </Row>
    )
}

export default AddCategory

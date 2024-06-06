import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Card, Form, message, Button, Upload, Flex } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import categoryService from 'services/CategoryService';
import imageService from 'services/ImageService';
import { useNavigate, useLocation } from 'react-router-dom';
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
            required: false,
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
const UpdateCategory = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const categoryData = location.state.categoryData;
    const title = "Chỉnh sửa danh mục: " + categoryData?.name
    const [formData, setFormData] = useState({
        uuid: categoryData?.uuid,
        name: categoryData?.name,
        description: categoryData?.description,
        image: categoryData?.image,
        ratio: categoryData?.ratio,
        introduce: categoryData?.introduce,
        constraint: categoryData?.constraint,
    });
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
        navigate(`/app/functions/category-management/`)
    };
    const fetchData = async () => {
        try {
            await categoryService.updateCategory(formData);
            message.success('Cập nhật danh mục thành công')
        } catch (error) {
            message.error('Cập nhật danh mục thất bại', error)
        }
    };
    return (
        <Row gutter={16}>
            <Col xs={24} sm={24} md={24}>
                <Card title={title}>
                    <Form onFinish={handleSubmit}>
                        <Form.Item label="Tên danh mục" name="name" rules={rules.name} initialValue={formData.name} >
                            <Input placeholder="Tên danh mục" onChange={e => handleChange('name', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Mô tả" rules={rules.description} name="description" initialValue={formData.description} >
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
                        <Form.Item label="Tỉ lệ" rules={rules.ratio} name="ratio" initialValue={formData.ratio} >
                            <Input placeholder="Tỉ lệ" onChange={e => handleChange('ratio', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Giới thiệu" rules={rules.introduce} name="introduce" initialValue={formData.introduce} >
                            <Input placeholder="Giới thiệu" onChange={e => handleChange('introduce', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Hạn chế" rules={rules.constraint} name="constraint" initialValue={formData.constraint} >
                            <Input placeholder="Hạn chế" onChange={e => handleChange('constraint', e.target.value)} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" >Cập nhật danh mục</Button>
                    </Form>
                </Card>

            </Col>
        </Row>
    )
}

export default UpdateCategory

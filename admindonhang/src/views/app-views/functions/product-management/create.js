import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Card, Form, InputNumber, message, Select, Button, Upload, Flex } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import productService from 'services/ProductService';
import categoryService from 'services/CategoryService';
import imageService from 'services/ImageService';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;
const AddProduct = () => {
    const rules = {
        name: [
            {
                required: true,
                message: 'Vui lòng nhập tên sản phẩm',
            }
        ],
        description: [
            {
                required: true,
                message: 'Vui lòng nhập mô tả sản phẩm',
            }
        ],
        price: [
            {
                required: true,
                message: 'Vui lòng nhập giá sản phẩm',
            }
        ],
        image: [
            {
                required: false,
                message: 'Vui lòng nhập ảnh sản phẩm',
            }
        ],
        category: [
            {
                required: true,
                message: 'Vui lòng nhập danh mục',
            }
        ],
        discount: [
            {
                required: true,
                message: 'Vui lòng nhập phần trăm giảm giá sản phẩm',
            }
        ],
        total: [
            {
                required: true,
                message: 'Vui lòng nhập số lượng sản phẩm',
            }
        ],
    }
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        categoryId: '',
        weight: '',
        ammount: ''
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
            price: '',
            image: '',
            categoryId: '',
            weight: '',
            ammount: ''
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
            await productService.createProduct(formData);
            message.success('Thêm sản phẩm thành công');
            navigate(`/app/functions/product-management`)
        } catch (error) {
            message.error('Thêm sản phẩm thất bại', error)
        }
    };
    const fetchDataCategory = async () => {
        await categoryService.getAllCategory().then((data) => {
            setCategories(data);
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
                        <Form.Item label="Tên sản phẩm" name="name" rules={rules.name}>
                            <Input placeholder="Tên sản phẩm" value={formData.name} onChange={e => handleChange('name', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Giá sản phẩm" name="price" rules={rules.price}>
                            <InputNumber className="w-100" min={0} value={formData.price} onChange={value => handleChange('price', value)} />
                        </Form.Item>
                        <Form.Item label="Mô tả sản phẩm" name="description" rules={rules.description}>
                            <Input.TextArea rows={4} value={formData.description} onChange={e => handleChange('description', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Hình ảnh sản phẩm" name="image" rules={rules.image} >
                            <Flex gap="middle">
                                <Upload beforeUpload={handleUpload} showUploadList={false} maxCount={1} >
                                    <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                                </Upload>
                                <Input value={formData.image} onChange={e => handleChange('image', e.target.value)} />
                            </Flex>
                        </Form.Item>
                        <Form.Item label="Số lượng sản phẩm" name="ammount" rules={rules.total}>
                            <InputNumber className="w-100" min={0} value={formData.ammount} placeholder="Số lượng sản phẩm" onChange={value => handleChange('ammount', value)} />
                        </Form.Item>
                        <Form.Item label="Cân nặng" name="weight" rules={rules.total}>
                            <InputNumber className="w-100" min={0} value={formData.weight} placeholder="Số lượng sản phẩm" onChange={value => handleChange('weight', value)} />
                        </Form.Item>
                        <Form.Item label="Danh mục sản phẩm" rules={rules.category} name="category" >
                            <Select className="w-100" placeholder="Danh mục sản phẩm" value={formData.categoryId} onChange={value => handleChange('categoryId', value)}>
                                {
                                    categories.map(item => (
                                        <Option key={item.id} value={item.id}>{item.categoryName}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Button type="primary" htmlType="submit" >Tạo sản phẩm</Button>
                    </Form>
                </Card>

            </Col>
        </Row>
    )
}

export default AddProduct

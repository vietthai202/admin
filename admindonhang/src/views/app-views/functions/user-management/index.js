import { Button, Table, Form, Input, Modal, Select, Tag, message } from "antd";
import { EditOutlined, PlusCircleOutlined, OrderedListOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NumberFormat from "react-number-format";
import userService from "services/UserService";
import authService from "services/AuthService";
import utils from "utils";


const USER_ROLE = [
  {
    value: 1,
    label: 'CUSTOMER',
  },
  {
    value: 2,
    label: 'ADMIN',
  },
  {
    value: 3,
    label: 'STAFF',
  },
]

const TYPE = [
  {
    value: 'NAPTIEN',
    label: 'NAPTIEN',
  },
  {
    value: 'RUTTIEN',
    label: 'RUTTIEN',
  },
]

const USER_STATUS = [
  {
    value: true,
    label: 'Hoạt động',
  },
  {
    value: false,
    label: 'Không hoạt động',
  },
]

export const UserManagement = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isUpdateBalance, setIsUpdateBalance] = useState(false);

  const [userUpdate, setUserUpdate] = useState();
  const [formValue, setFormValue] = useState();

  const buttonUpdate = async (id, type) => {
    await userService.getUserId(id)
      .then((data) => {
        console.log(data);
        setUserUpdate(data);
        setFormValue({
          email: data.email,
          phone: data.phone,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          active: data.active,
          roleId: data.roleId,
        });

        if (type === 'update') {
          setIsUpdateOpen(true);
        }
        else {
          setIsUpdateBalance(true);
        }
      });
  };

  const doUpdate = async () => {
    // if (authService.isLogger()) {
      try {
        const values = form.getFieldsValue();
        if (userUpdate) {
          const newUser = userUpdate;
          newUser.email = values.email;
          newUser.password = values.password;
          newUser.phone = values.phone;
          newUser.firstName = values.firstName;
          newUser.lastName = values.lastName;
          newUser.active = values.active;
          newUser.roleId = values.roleId;
          newUser.id = newUser.id;
          await userService.updateUser(newUser)
            .then((data) => {
              message.success("Cập nhật thành công!");
              setUpdate(!update);
            })
            .catch((error) => {
              message.error("Cập nhật thất bại!", error);
            })
            .finally(() => {
              setIsUpdateOpen(false);
              form.resetFields();
            });
        }
      } catch (errorInfo) {
        message.error("Có lỗi kìa!!!");
        console.log("Form validation failed:", errorInfo);
      }
    // } else {
    //   message.error('Hết hạn đăng nhập. Vui lòng đăng nhập lại');
    // }
  };

  const cancelUpdate = () => {
    form.resetFields();
    form2.resetFields();
    setIsUpdateOpen(false);
    setIsUpdateBalance(false);
  };

  const renderRole = (roleValue) => {
    const role = USER_ROLE.find(item => item.value === roleValue);
    let color = 'green';
    if (role && role.label === 'ADMIN') {
      color = 'volcano';
    }
    return (
      <Tag color={color} key={roleValue}>
        {role ? role.label : 'Unknown Role'}
      </Tag>
    );
  };

  const renderStatus = (roleValue) => {
    const role = USER_STATUS.find(item => item.value === roleValue);
    let color = 'green';
    if (role && role.value === false) {
      color = 'volcano';
    }
    return (
      <Tag color={color} key={roleValue}>
        {role ? role.label : 'Unknown Role'}
      </Tag>
    );
  };


  const tableColumns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Tài khoản",
      dataIndex: "email",
      sorter: (a, b) => utils.antdTableSorter(a, b, "username"),
    },
    {
      title: "Tên",
      dataIndex: "firstName",
      sorter: (a, b) => utils.antdTableSorter(a, b, "full_name"),
    },
    
    {
      title: "Trạng thái tài khoản",
      dataIndex: "active",
      sorter: (a, b) => utils.antdTableSorter(a, b, "status"),
      render: renderStatus
    },
    {
      title: "Role",
      dataIndex: "roleId",
      sorter: (a, b) => utils.antdTableSorter(a, b, "role"),
      key: 'role',
      render: renderRole
    },
    {
      title: "Hành động",
      dataIndex: "actions",
      render: (_, record) => (
        <div>
          <Button className="m-1" icon={<EditOutlined />} type="primary" onClick={(() => buttonUpdate(record.id, 'update'))} >Sửa</Button>
        </div>
      ),
    },
  ];

  const rowSelection = {
    onChange: (key, rows) => {
      setSelectedRows(rows);
      setSelectedRowKeys(key);
    },
  };

  const fetchData = async () => {
    setLoading(true);
    await userService.getAllUser()
      .then((data) => {
        setList(data);
      })
      .catch((error) => {
        message.error("ERROR");
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [userUpdate, update]);

  useEffect(() => {
    if (userUpdate) {
      form.setFieldsValue(formValue);
    }
  }, [form, formValue, userUpdate, isUpdateOpen]);

  return (
    <div className="table-responsive">
      <Table
        columns={tableColumns}
        dataSource={list}
        rowKey="id"
        loading={loading}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          type: "checkbox",
          preserveSelectedRowKeys: false,
          ...rowSelection,
        }}
      />

      <Modal
        destroyOnClose={true}
        okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
        title="Cập nhật tài khoản người dùng!"
        open={isUpdateOpen}
        onOk={doUpdate}
        onCancel={cancelUpdate}
        okText="Cập nhật"
      >
        <div className='flex flex-col items-center'>
          {userUpdate &&
            <Form
              preserve={false}
              form={form}
              name="updateForm"
              layout="vertical"
              labelCol={{ span: 8 }}
              initialValues={formValue}
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Hãy nhập tên!' }]}
              >
                <Input size="large" placeholder='abc@gmail.com' />
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Hãy nhập số điện thoại' }]}
              >
                <Input size="large"  placeholder='0123456789' />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: false, message: 'Hãy nhập mật khẩu mạnh!' }]}
              >
                <Input type='password' size="large" placeholder='Để trống nếu không muốn thay đổi' />
              </Form.Item>

              <Form.Item
                label="ROLE"
                name="roleId"
                rules={[{ required: true, message: 'Hãy chọn role!' }]}
              >
                <Select
                  options={USER_ROLE}
                />

              </Form.Item>

              <Form.Item
                label="Họ"
                name="firstName"
                rules={[{ required: true, message: 'Hãy nhập tên' }]}
              >
                <Input size="large" placeholder='abc' />
              </Form.Item>

              <Form.Item
                label="Tên"
                name="lastName"
                rules={[{ required: true, message: 'Hãy nhập tên' }]}
              >
                <Input size="large" placeholder='duyen...' />
              </Form.Item>

              <Form.Item
                label="Trạng thái tài khoản"
                name="active"
                rules={[{ required: true, message: 'Hãy chọn trạng thái' }]}
              >
                <Select
                  options={USER_STATUS}
                />
              </Form.Item>
            </Form>
          }
        </div>
      </Modal>

      <Modal
        destroyOnClose={true}
        okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
        title="Thay đối số dư"
        open={isUpdateBalance}
        onOk={""}
        onCancel={cancelUpdate}
        okText="Thay đổi số dư"
      >
        <div className='flex flex-col items-center'>
          <Form
            preserve={false}
            form={form2}
            name="createForm"
            layout="vertical"
            labelCol={{ span: 8 }}
            initialValues={formValue}
            autoComplete="off"
          >

            <div className="balance-label">Số dư hiện tại: {userUpdate?.balance}</div>

            <Form.Item
              label="Số tiền cần thay đổi"
              name="amount"
              min='0'
              rules={[
                { 
                  required: true, 
                  message: 'Nhập số tiền cộng' 
                },
                {
                  pattern: /^[1-9]\d*$/, 
                  message: 'Số tiền phải lớn hơn 1'
                }
              ]}
            >
              <Input size="large" placeholder='12321' />
            </Form.Item>

            <Form.Item
              label="type"
              name="type"
              rules={[{ required: true, message: 'Hãy chọn type' }]}
            >
              <Select
                options={TYPE}

              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;

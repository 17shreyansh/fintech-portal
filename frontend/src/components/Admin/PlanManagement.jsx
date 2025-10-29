import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, message, Typography, Row, Col, Switch, Popconfirm, Tag, Space, Tabs } from 'antd';
import { PlusOutlined, FundProjectionScreenOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import api from '../../services/api';
import { formatCurrency } from '../../utils/currency';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const PlanManagement = () => {
  const [categories, setCategories] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [planModal, setPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');
  const [totalMaturityAmount, setTotalMaturityAmount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/plans/admin/all');
      setCategories(response.data.categories);
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = () => {
    const amount = planForm.getFieldValue('amount');
    const maturityAmount = planForm.getFieldValue('totalMaturityAmount');
    setTotalMaturityAmount(maturityAmount || 0);
  };

  const handleCreatePlan = async (values) => {
    try {
      const planData = {
        ...values,
        oneTimeOnly: values.oneTimeOnly || false
      };
      
      console.log('Submitting plan data:', planData);
      
      if (editingPlan) {
        await api.put(`/plans/${editingPlan._id}`, planData);
        message.success('Plan updated successfully');
      } else {
        await api.post('/plans', planData);
        message.success('Plan created successfully');
      }
      setPlanModal(false);
      setEditingPlan(null);
      planForm.resetFields();
      setTotalMaturityAmount(0);
      fetchData();
    } catch (error) {
      console.error('Plan submission error:', error);
      message.error(editingPlan ? 'Failed to update plan' : 'Failed to create plan');
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    
    planForm.setFieldsValue({
      title: plan.title,
      description: plan.description,
      category: plan.category._id,
      amount: plan.amount,
      totalMaturityAmount: plan.totalMaturityAmount,
      duration: plan.duration,
      isActive: plan.isActive,
      oneTimeOnly: plan.oneTimeOnly
    });
    setTotalMaturityAmount(plan.totalMaturityAmount);
    setPlanModal(true);
  };

  const handleDeletePlan = async (planId) => {
    try {
      await api.delete(`/plans/${planId}`);
      message.success('Plan deleted successfully');
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete plan');
    }
  };

  const handleToggleStatus = async (planId) => {
    try {
      await api.put(`/plans/${planId}/toggle-status`);
      message.success('Plan status updated');
      fetchData();
    } catch (error) {
      message.error('Failed to update plan status');
    }
  };

  const categoryColumns = [
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon) => <span style={{ fontSize: '24px' }}>{icon}</span>,
      width: 80
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Plans Count',
      key: 'planCount',
      render: (_, category) => {
        const count = plans.filter(plan => plan.category._id === category._id).length;
        return <Tag color="blue">{count} Plans</Tag>;
      }
    }
  ];

  const planColumns = [
    {
      title: 'Plan Details',
      key: 'details',
      render: (_, plan) => (
        <div>
          <Text strong>{plan.title}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {plan.category.icon} {plan.category.name}
          </Text>
        </div>
      ),
      width: 200
    },
    {
      title: 'Investment Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <Text strong style={{ color: '#1890ff' }}>{formatCurrency(amount)}</Text>,
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: 'Total Maturity Amount',
      dataIndex: 'totalMaturityAmount',
      key: 'totalMaturityAmount',
      render: (amount) => <Text strong style={{ color: '#52c41a' }}>{formatCurrency(amount)}</Text>,
      sorter: (a, b) => a.totalMaturityAmount - b.totalMaturityAmount
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => `${duration.value} ${duration.unit}`,
      sorter: (a, b) => a.durationInDays - b.durationInDays
    },
    {
      title: 'Investment Type',
      dataIndex: 'oneTimeOnly',
      key: 'oneTimeOnly',
      render: (oneTimeOnly) => (
        <Tag color={oneTimeOnly ? 'orange' : 'blue'}>
          {oneTimeOnly ? 'One Time Only' : 'Repeatable'}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, plan) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleStatus(plan._id)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, plan) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditPlan(plan)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Plan"
            description="Are you sure you want to delete this plan?"
            onConfirm={() => handleDeletePlan(plan._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 150
    }
  ];

  const getFilteredPlans = () => {
    if (activeTab === 'all') return plans;
    return plans.filter(plan => plan.category.name === activeTab);
  };

  return (
    <div>
      <Title level={2}>
        <FundProjectionScreenOutlined /> Investment Plan Management
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card 
            title="Fixed Plan Categories" 
            loading={loading}
          >
            <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
              Categories are fixed and cannot be modified. Only plans can be managed.
            </Text>
            <div className="responsive-table">
              <Table
                dataSource={categories}
                columns={categoryColumns}
                rowKey="_id"
                pagination={false}
                size="small"
              />
            </div>
          </Card>
        </Col>

        <Col xs={24}>
          <Card 
            title="Investment Plans" 
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingPlan(null);
                  planForm.resetFields();
                  setTotalMaturityAmount(0);
                  setPlanModal(true);
                }}
              >
                Add New Plan
              </Button>
            }
            loading={loading}
          >
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="All Plans" key="all" />
              {categories.map(category => (
                <TabPane 
                  tab={`${category.icon} ${category.name}`} 
                  key={category.name} 
                />
              ))}
            </Tabs>
            
            <div className="responsive-table" style={{ marginTop: 16 }}>
              <Table
                dataSource={getFilteredPlans()}
                columns={planColumns}
                rowKey="_id"
                pagination={{ 
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} plans`
                }}
                scroll={{ x: 1000 }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Plan Modal */}
      <Modal
        title={editingPlan ? 'Edit Investment Plan' : 'Create Investment Plan'}
        open={planModal}
        onCancel={() => {
          setPlanModal(false);
          setEditingPlan(null);
          planForm.resetFields();
          setTotalMaturityAmount(0);
        }}
        footer={null}
        width={700}
      >
        <Form form={planForm} onFinish={handleCreatePlan} layout="vertical">
          <Form.Item
            name="title"
            label="Plan Title"
            rules={[{ required: true, message: 'Please enter plan title' }]}
          >
            <Input placeholder="e.g., Gold Premium Plan" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={3} placeholder="Detailed plan description" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select placeholder="Select category">
              {categories.map(cat => (
                <Option key={cat._id} value={cat._id}>
                  {cat.icon} {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="amount"
                label="Investment Amount (₹)"
                rules={[
                  { required: true, message: 'Please enter amount' },
                  {
                    validator: (_, value) => {
                      const numValue = Number(value);
                      if (!value) {
                        return Promise.reject('Please enter amount');
                      }
                      if (isNaN(numValue) || numValue <= 0) {
                        return Promise.reject('Please enter a valid amount');
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input 
                  type="number" 
                  prefix="₹" 
                  placeholder="100" 
                  onChange={handleFormChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="totalMaturityAmount"
                label="Total Maturity Amount (₹)"
                rules={[
                  { required: true, message: 'Please enter total maturity amount' },
                  {
                    validator: (_, value) => {
                      const numValue = Number(value);
                      const investmentAmount = Number(planForm.getFieldValue('amount'));
                      if (!value) {
                        return Promise.reject('Please enter total maturity amount');
                      }
                      if (isNaN(numValue) || numValue <= 0) {
                        return Promise.reject('Please enter a valid amount');
                      }
                      if (investmentAmount && numValue <= investmentAmount) {
                        return Promise.reject('Maturity amount must be greater than investment amount');
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input 
                  type="number" 
                  prefix="₹" 
                  placeholder="1000" 
                  onChange={handleFormChange}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name={['duration', 'value']}
                label="Duration Value"
                rules={[{ required: true, message: 'Please enter duration value' }]}
              >
                <Input 
                  type="number" 
                  placeholder="6" 
                  min={1} 
                  onChange={handleFormChange}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={['duration', 'unit']}
                label="Duration Unit"
                rules={[{ required: true, message: 'Please select duration unit' }]}
              >
                <Select placeholder="Select unit" onChange={handleFormChange}>
                  <Option value="days">Days</Option>
                  <Option value="months">Months</Option>
                  <Option value="years">Years</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="oneTimeOnly"
                label="Investment Type"
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren="One Time" 
                  unCheckedChildren="Repeatable" 
                />
              </Form.Item>
            </Col>
            {editingPlan && (
              <Col span={6}>
                <Form.Item
                  name="isActive"
                  label="Status"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>
              </Col>
            )}
          </Row>

          {totalMaturityAmount > 0 && (
            <Row>
              <Col span={24}>
                <div style={{ 
                  background: '#f6ffed', 
                  border: '1px solid #b7eb8f', 
                  borderRadius: '6px', 
                  padding: '12px', 
                  marginBottom: '16px' 
                }}>
                  <Text strong style={{ color: '#52c41a' }}>
                    Total Maturity Amount: {formatCurrency(totalMaturityAmount)}
                    {planForm.getFieldValue('amount') && (
                      <span style={{ marginLeft: 16, color: '#1890ff' }}>
                        Profit: {formatCurrency(totalMaturityAmount - planForm.getFieldValue('amount'))}
                      </span>
                    )}
                  </Text>
                </div>
              </Col>
            </Row>
          )}

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setPlanModal(false);
                setEditingPlan(null);
                planForm.resetFields();
                setTotalMaturityAmount(0);
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PlanManagement;
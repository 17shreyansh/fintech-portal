import { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  message, 
  Typography, 
  Tag, 
  Space,
  Row,
  Col,
  Spin,
  Empty,
  Timeline,
  Avatar
} from 'antd';
import { 
  PlusOutlined, 
  QuestionCircleOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import api from '../../services/api';

const { TextArea } = Input;
const { Title: PageTitle, Paragraph, Text } = Typography;

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketModal, setTicketModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [contactSettings, setContactSettings] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTickets();
    fetchContactSettings();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/support/my-tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContactSettings = async () => {
    try {
      const response = await api.get('/contact');
      setContactSettings(response.data);
    } catch (error) {
      console.error('Error fetching contact settings:', error);
    }
  };

  const handleCreateTicket = async (values) => {
    setSubmitLoading(true);
    try {
      await api.post('/support', values);
      message.success('Support ticket created successfully! 🎉');
      setTicketModal(false);
      form.resetFields();
      fetchTickets();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create ticket');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'red';
      case 'in-progress': return 'orange';
      case 'resolved': return 'green';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <ExclamationCircleOutlined />;
      case 'in-progress': return <ClockCircleOutlined />;
      case 'resolved': return <CheckCircleOutlined />;
      default: return null;
    }
  };

  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => (
        <Text strong style={{ fontSize: '14px' }}>{subject}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={getStatusColor(status)}
          icon={getStatusIcon(status)}
          style={{ fontWeight: 'bold', padding: '4px 12px' }}
        >
          {status.toUpperCase().replace('-', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Response',
      dataIndex: 'adminResponse',
      key: 'adminResponse',
      render: (response) => (
        <Text style={{ color: response ? '#52c41a' : '#8c8c8c' }}>
          {response ? 'Responded' : 'Pending'}
        </Text>
      ),
    },
  ];

  const openTickets = tickets.filter(t => t.status === 'open');
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress');
  const resolvedTickets = tickets.filter(t => t.status === 'resolved');

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="support-container">
      <div style={{ marginBottom: 24 }}>
        <PageTitle level={2} style={{ color: '#262626', marginBottom: 8 }}>
          <QuestionCircleOutlined /> Help & Support
        </PageTitle>
        <Paragraph style={{ fontSize: 16, color: '#8c8c8c' }}>
          Get help from our support team. We're here to assist you 24/7
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <div style={{ textAlign: 'center' }}>
              <ExclamationCircleOutlined style={{ fontSize: '32px', color: '#f5222d', marginBottom: '8px' }} />
              <div>
                <Text strong style={{ display: 'block', fontSize: '20px' }}>{openTickets.length}</Text>
                <Text style={{ color: '#8c8c8c' }}>Open Tickets</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <div style={{ textAlign: 'center' }}>
              <ClockCircleOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '8px' }} />
              <div>
                <Text strong style={{ display: 'block', fontSize: '20px' }}>{inProgressTickets.length}</Text>
                <Text style={{ color: '#8c8c8c' }}>In Progress</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <div style={{ textAlign: 'center' }}>
              <CheckCircleOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
              <div>
                <Text strong style={{ display: 'block', fontSize: '20px' }}>{resolvedTickets.length}</Text>
                <Text style={{ color: '#8c8c8c' }}>Resolved</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <MessageOutlined />
                <span>My Support Tickets</span>
                <Tag color="blue">{tickets.length} Total</Tag>
              </Space>
            }
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setTicketModal(true)}
              >
                New Ticket
              </Button>
            }
            className="table-card"
          >
            <div className="responsive-table">
              <Table
                dataSource={tickets}
                columns={columns}
                rowKey="_id"
                pagination={{ 
                  pageSize: 8,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} tickets`
                }}
                scroll={{ x: 700 }}
                expandable={{
                  expandedRowRender: (record) => (
                    <div style={{ padding: '16px', background: '#fafafa', borderRadius: '8px' }}>
                      <Timeline>
                        <Timeline.Item 
                          dot={<Avatar size="small" icon={<QuestionCircleOutlined />} />}
                          color="blue"
                        >
                          <div>
                            <Text strong>You created this ticket</Text>
                            <div style={{ marginTop: 8 }}>
                              <Text>{record.description}</Text>
                            </div>
                            <div style={{ marginTop: 4, color: '#8c8c8c', fontSize: '12px' }}>
                              {new Date(record.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </Timeline.Item>
                        {record.adminResponse && (
                          <Timeline.Item 
                            dot={<Avatar size="small" icon={<CustomerServiceOutlined />} />}
                            color="green"
                          >
                            <div>
                              <Text strong>Support Team Response</Text>
                              <div style={{ marginTop: 8 }}>
                                <Text>{record.adminResponse}</Text>
                              </div>
                              <div style={{ marginTop: 4, color: '#8c8c8c', fontSize: '12px' }}>
                                {new Date(record.updatedAt).toLocaleString()}
                              </div>
                            </div>
                          </Timeline.Item>
                        )}
                      </Timeline>
                    </div>
                  ),
                }}
                locale={{ emptyText: <Empty description="No support tickets yet" /> }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title="Quick Help"
            className="help-card"
            extra={<CustomerServiceOutlined style={{ color: '#1890ff' }} />}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                  📞 Contact Information
                </Text>
                <Text style={{ color: '#8c8c8c' }}>
                  Email: {contactSettings?.email || 'support@fintech.com'}<br/>
                  Phone: {contactSettings?.phone || '+1 (555) 123-4567'}<br/>
                  Hours: {contactSettings?.workingHours || '24/7 Support'}
                </Text>
              </div>
              
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                  🚀 Common Issues
                </Text>
                <Text style={{ color: '#8c8c8c' }}>
                  {contactSettings?.commonIssues?.map((issue, index) => (
                    <span key={index}>• {issue}<br/></span>
                  )) || (
                    <>
                      • Deposit not reflecting<br/>
                      • Withdrawal delays<br/>
                      • Investment questions<br/>
                      • Account security
                    </>
                  )}
                </Text>
              </div>
              
              <Button 
                type="primary" 
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setTicketModal(true)}
                style={{ width: '100%', height: '48px', fontWeight: 'bold' }}
              >
                Create New Ticket
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          <Space>
            <PlusOutlined />
            <span>Create Support Ticket</span>
          </Space>
        }
        open={ticketModal}
        onCancel={() => setTicketModal(false)}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleCreateTicket} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Please enter subject' }]}
          >
            <Input 
              placeholder="Brief description of your issue"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="Describe your issue in detail. Include any relevant information that might help us assist you better."
              style={{ fontSize: '14px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              loading={submitLoading}
              style={{ width: '100%', height: '48px', fontWeight: 'bold' }}
            >
              Create Support Ticket
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Support;
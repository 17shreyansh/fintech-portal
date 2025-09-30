import { useState, useEffect } from 'react';
import { Table, Button, Tag, Modal, Form, Input, Select, message, Typography, Card } from 'antd';
import { QuestionCircleOutlined, EditOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

const SupportManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/support/all');
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicket = async (values) => {
    try {
      await api.put(`/support/${selectedTicket._id}`, values);
      message.success('Ticket updated successfully');
      setUpdateModal(false);
      form.resetFields();
      fetchTickets();
    } catch (error) {
      message.error('Failed to update ticket');
    }
  };

  const openUpdateModal = (ticket) => {
    setSelectedTicket(ticket);
    form.setFieldsValue({
      status: ticket.status,
      adminResponse: ticket.adminResponse || '',
    });
    setUpdateModal(true);
  };

  const columns = [
    {
      title: 'User',
      dataIndex: ['user', 'name'],
      key: 'user',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'open' ? 'red' : 
          status === 'in-progress' ? 'orange' : 'green'
        }>
          {status.toUpperCase().replace('-', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => openUpdateModal(record)}
        >
          Update
        </Button>
      ),
    },
  ];

  const openTickets = tickets.filter(t => t.status === 'open');
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress');
  const resolvedTickets = tickets.filter(t => t.status === 'resolved');

  return (
    <div>
      <Title level={2}>
        <QuestionCircleOutlined /> Support Ticket Management
      </Title>

      <Card 
        title={`Open Tickets (${openTickets.length})`} 
        style={{ marginBottom: 24 }}
        loading={loading}
      >
        <Table
          dataSource={openTickets}
          columns={columns}
          rowKey="_id"
          pagination={false}
          size="small"
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ margin: 0 }}>
                <p><strong>Description:</strong></p>
                <p>{record.description}</p>
                {record.adminResponse && (
                  <>
                    <p><strong>Admin Response:</strong></p>
                    <p>{record.adminResponse}</p>
                  </>
                )}
              </div>
            ),
          }}
        />
      </Card>

      <Card 
        title={`In Progress Tickets (${inProgressTickets.length})`} 
        style={{ marginBottom: 24 }}
        loading={loading}
      >
        <Table
          dataSource={inProgressTickets}
          columns={columns}
          rowKey="_id"
          pagination={false}
          size="small"
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ margin: 0 }}>
                <p><strong>Description:</strong></p>
                <p>{record.description}</p>
                {record.adminResponse && (
                  <>
                    <p><strong>Admin Response:</strong></p>
                    <p>{record.adminResponse}</p>
                  </>
                )}
              </div>
            ),
          }}
        />
      </Card>

      <Card title="All Tickets" loading={loading}>
        <Table
          dataSource={tickets}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ margin: 0 }}>
                <p><strong>Description:</strong></p>
                <p>{record.description}</p>
                {record.adminResponse && (
                  <>
                    <p><strong>Admin Response:</strong></p>
                    <p>{record.adminResponse}</p>
                  </>
                )}
              </div>
            ),
          }}
        />
      </Card>

      <Modal
        title="Update Support Ticket"
        open={updateModal}
        onCancel={() => setUpdateModal(false)}
        footer={null}
        width={600}
      >
        {selectedTicket && (
          <div>
            <Card title="Ticket Details" style={{ marginBottom: 16 }}>
              <p><strong>User:</strong> {selectedTicket.user.name}</p>
              <p><strong>Subject:</strong> {selectedTicket.subject}</p>
              <p><strong>Description:</strong> {selectedTicket.description}</p>
            </Card>

            <Form form={form} onFinish={handleUpdateTicket} layout="vertical">
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select>
                  <Option value="open">Open</Option>
                  <Option value="in-progress">In Progress</Option>
                  <Option value="resolved">Resolved</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="adminResponse"
                label="Admin Response"
                rules={[{ required: true, message: 'Please enter response' }]}
              >
                <TextArea rows={4} placeholder="Enter your response to the user" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  Update Ticket
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupportManagement;
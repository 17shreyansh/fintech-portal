import { useState } from 'react';
import { Button, message, Typography, Space } from 'antd';
import { ShareAltOutlined, CopyOutlined, GiftOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ReferralBar = ({ userId }) => {
  const [copying, setCopying] = useState(false);
  
  const referralLink = `${window.location.origin}/register`;
  
  const handleCopyLink = async () => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(referralLink);
      message.success('Referral link copied to clipboard!');
    } catch (error) {
      message.error('Failed to copy link');
    } finally {
      setCopying(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join FinTech Investment Platform',
          text: 'Start your investment journey with exclusive benefits!',
          url: referralLink,
        });
      } catch (error) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #f0f0f0'
      }}
    >
      <Space align="center">
        <GiftOutlined style={{ color: '#fff', fontSize: 18 }} />
        <div>
          <Text strong style={{ color: '#fff', fontSize: 14 }}>
            Invite Friends & Earn Rewards
          </Text>
          <br />
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
            Share your referral link and get bonus when friends join
          </Text>
        </div>
      </Space>

      <Space>
        <Button
          type="primary"
          ghost
          size="small"
          icon={<CopyOutlined />}
          loading={copying}
          onClick={handleCopyLink}
          style={{
            borderColor: '#fff',
            color: '#fff',
            background: 'rgba(255,255,255,0.1)'
          }}
        >
          Copy Link
        </Button>
        <Button
          type="primary"
          size="small"
          icon={<ShareAltOutlined />}
          onClick={handleShare}
          style={{
            background: '#fff',
            borderColor: '#fff',
            color: '#667eea'
          }}
        >
          Share
        </Button>
      </Space>
    </div>
  );
};

export default ReferralBar;
import { Card, Button, Typography } from 'antd';
import { formatCurrency } from '../../utils/currency';
import aiImage from '../../assets/ai.webp';
import goldImage from '../../assets/gold.jpg';
import silverImage from '../../assets/silver.jpg';
import dioImage from '../../assets/dio.jpg';

const { Title, Text } = Typography;

const planImages = {
  'AI Robot': aiImage,
  'Gold': goldImage,
  'Silver': silverImage,
  'Diamond': dioImage,
};

const PlanCard = ({ plan, onBuyPlan, loading = false }) => {
  console.log('Plan category:', plan.category?.name, 'Available images:', Object.keys(planImages));
  
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        background: plan.isLocked ? 'linear-gradient(180deg, #f5f5f5 0%, #e8e8e8 100%)' : 'linear-gradient(180deg, #e6e6ff 0%, #ffffff 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        opacity: plan.isLocked ? 0.6 : 1,
      }}
    >
      {/* Ribbon */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: -40,
          background: plan.isLocked ? '#ff4d4f' : '#a64dff',
          color: '#fff',
          transform: 'rotate(-45deg)',
          width: 140,
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 'bold',
          padding: '4px 0',
        }}
      >
        {plan.isLocked ? 'LOCKED' : `${plan.duration.value} ${plan.duration.unit}`}
      </div>

      {/* One Time Badge */}
      {plan.oneTimeOnly && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: '#fa8c16',
            color: '#fff',
            borderRadius: '12px',
            padding: '4px 8px',
            fontSize: 10,
            fontWeight: 'bold',
          }}
        >
          ONE TIME
        </div>
      )}

      {/* Image */}
      <div style={{ paddingTop: 32 }}>
        <img
          src={planImages[plan.category?.name]}
          alt={plan.category?.name}
          style={{ height: 120, objectFit: 'contain', mixBlendMode: 'multiply' }}
        />
      </div>

      {/* Title */}
      <Title level={4} style={{ margin: '12px 0', color: '#262626' }}>
        {plan.title}
      </Title>

      {/* Investment + Return */}
      <div style={{ marginBottom: 16 }}>
        <Text style={{ display: 'block', color: '#595959' }}>
          Investment : {formatCurrency(plan.amount)}
        </Text>
        <Text style={{ display: 'block', color: '#595959' }}>
          Total Return : {formatCurrency(plan.expectedReturn)}
        </Text>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 16px 16px 16px', marginTop: 'auto' }}>
        <Button
          type={plan.isLocked ? 'default' : 'primary'}
          block
          size="large"
          loading={loading}
          disabled={plan.isLocked}
          onClick={() => !plan.isLocked && onBuyPlan(plan)}
          style={{
            fontWeight: 'bold',
            height: '44px',
            borderRadius: '8px',
          }}
        >
          {plan.isLocked ? 'Already Invested' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
};

export default PlanCard;

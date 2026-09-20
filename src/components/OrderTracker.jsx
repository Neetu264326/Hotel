import { Check, Circle, Truck } from 'lucide-react'

const steps = [
  { label: 'Order Confirmed' },
  { label: 'Restaurant Accepted' },
  { label: 'Preparing Your Food' },
  { label: 'Picked Up' },
  { label: 'On the Way' },
  { label: 'Delivered' },
]

const OrderTracker = ({ currentStep, estimatedMinutes }) => {
  return (
    <div className="order-tracker" style={{ background: '#fff', borderRadius: 24, boxShadow: 'var(--shadow-lg)', padding: 32 }}>
      <div className="track-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy)' }}>Order Status</h3>
          <p style={{ color: 'var(--text-gray)', fontSize: 14 }}>
            {currentStep >= steps.length - 1 ? 'Delivered successfully 🎉' : `Estimated delivery in ${estimatedMinutes} minutes`}
          </p>
        </div>
        {currentStep < steps.length - 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFF8F0', padding: '10px 16px', borderRadius: 999 }}>
            <Truck size={20} color="var(--coral)" />
            <strong style={{ color: 'var(--coral)', fontSize: 15 }}>{steps[currentStep].label}</strong>
          </div>
        )}
      </div>

      <div className="track-progress" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', paddingTop: 12 }}>
        <div
          className="track-line"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 24,
            left: '5%',
            right: '5%',
            height: 4,
            borderRadius: 2,
            background: '#E5E7EB',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--coral), var(--gold))',
              borderRadius: 2,
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>

        {steps.map((step, i) => {
          const isDone = i < currentStep
          const isCurrent = i === currentStep
          return (
            <div key={i} className="track-step" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, width: '16.6%', textAlign: 'center' }}>
              <div
                className={`track-dot ${isCurrent ? 'track-current' : ''}`}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: isDone ? 'var(--gradient-green)' : isCurrent ? 'var(--gradient-coral)' : '#F3F4F6',
                  border: isCurrent ? '3px solid #FFC9B5' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDone || isCurrent ? '#fff' : '#9CA3AF',
                  boxShadow: isCurrent ? 'var(--shadow-coral)' : 'none',
                  transition: 'all 0.4s ease',
                }}
              >
                {isDone ? <Check size={20} /> : <Circle size={isCurrent ? 20 : 16} />}
              </div>
              <span
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? 'var(--coral)' : isDone ? '#15803D' : 'var(--text-light)',
                  maxWidth: 70,
                  lineHeight: 1.3,
                }}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OrderTracker

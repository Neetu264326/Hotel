import { Banknote, CreditCard, Wallet, Building2, CheckCircle2 } from 'lucide-react'

export const paymentMethods = [
  { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: Banknote },
  { id: 'upi', name: 'UPI', desc: 'Pay using any UPI app', icon: SmartphoneIcon },
  { id: 'card', name: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'netbanking', name: 'Net Banking', desc: 'All major banks supported', icon: Building2 },
  { id: 'wallet', name: 'Wallet', desc: 'Pay via e-wallets', icon: Wallet },
]

function SmartphoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props} style={{ color: 'var(--coral)' }}>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  )
}

const PaymentMethod = ({ selected, onSelect }) => {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} role="radiogroup" aria-label="Payment method">
        {paymentMethods.map((method) => {
          const Icon = method.icon
          const active = selected === method.id
          return (
            <button
              key={method.id}
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(method.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 18px',
                borderRadius: 16,
                border: active ? '2px solid var(--coral)' : '2px solid var(--border)',
                background: active ? '#FFF8F0' : '#fff',
                boxShadow: active ? 'var(--shadow-coral)' : 'none',
                transform: active ? 'translateX(4px)' : 'none',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: active ? 'var(--gradient-coral)' : '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: active ? '#fff' : 'var(--coral)',
                  flexShrink: 0,
                  transition: 'all 0.3s',
                }}
              >
                <Icon size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 15, color: 'var(--navy)' }}>{method.name}</strong>
                <p style={{ fontSize: 13, color: 'var(--text-gray)' }}>{method.desc}</p>
              </div>
              {active && <CheckCircle2 size={22} color="var(--coral)" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default PaymentMethod

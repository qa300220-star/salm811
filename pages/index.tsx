import { useState } from 'react'

export default function Home() {
  const [code, setCode] = useState('')

  const handleSubmit = () => {
    if (!code.trim()) {
      alert('يرجى إدخال الرمز')
      return
    }
    alert('تم توصيل الإنترنت بنجاح')
    setCode('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1928, #0d2a3a)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      direction: 'rtl'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '30px 20px',
        width: '100%',
        maxWidth: '360px',
        border: '1px solid rgba(255,215,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffd700' }}>أون لاين</h1>
          <p style={{ color: '#fff', fontSize: '1rem' }}>نت لاسلكي سريع | تغطية شاملة</p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#4caf50', borderRadius: '50%' }}></span>
            <span style={{ color: '#fff', fontSize: '12px' }}>الشبكة متاحة</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="ادخل الرمز"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,215,0,0.5)',
              padding: '12px',
              fontSize: '1rem',
              color: '#fff',
              textAlign: 'center',
              outline: 'none'
            }}
          />
          <button style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff3366, #ff6680)',
            border: 'none',
            cursor: 'pointer',
            color: 'white',
            fontSize: '1.2rem'
          }}>📋</button>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #ff3366, #ff6680)',
            border: 'none',
            borderRadius: '50px',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          تسجيل الدخول
        </button>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <button style={{
            flex: 1,
            padding: '10px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid #ffd700',
            borderRadius: '50px',
            color: '#ffd700',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>الأسعار</button>
          <button style={{
            flex: 1,
            padding: '10px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid #ffd700',
            borderRadius: '50px',
            color: '#ffd700',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>نقاط البيع</button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', color: 'rgba(255,255,255,0.7)' }}>
          للاستفسار والدعم:<br />
          <a href="tel:774629815" style={{ color: '#ffaa66', textDecoration: 'none' }}>774629815</a>
        </div>

        <div style={{ textAlign: 'center', marginTop: '15px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>
          تطوير سالم
        </div>
      </div>
    </div>
  )
}

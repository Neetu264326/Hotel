import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info)
  }

  handleReload = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="page-enter" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
          <div className="container">
            <div style={{ textAlign: 'center', background: '#fff', borderRadius: 32, boxShadow: 'var(--shadow-lg)', padding: 60, maxWidth: 500, margin: '0 auto' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>😵</div>
              <h1 style={{ fontSize: 26, color: 'var(--navy)', marginBottom: 8 }}>Something went wrong</h1>
              <p style={{ color: 'var(--text-gray)', marginBottom: 28 }}>
                An unexpected error occurred. Reload the app to continue.
              </p>
              <div style={{ display: 'grid', gap: 12 }}>
                <button className="btn btn-primary btn-lg" onClick={this.handleReload}>
                  Reload App
                </button>
              </div>
            </div>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
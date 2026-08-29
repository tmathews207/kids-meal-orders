import { Component } from 'react'

// Without this, any single render error anywhere in the tree takes the
// whole page down to a blank white screen with no way to recover -- bad
// for an app kids use unsupervised. Catches it and offers a reload instead.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="app">
          <div className="login-screen">
            <h1>Something went wrong</h1>
            <p>Sorry about that. Try reloading the page.</p>
            <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

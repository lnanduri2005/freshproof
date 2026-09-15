import { useEffect, useState } from 'react'
import './App.css'

const resources = [
  {
    id: 1,
    name: 'Northside Food Bank',
    category: 'Food',
    city: 'Seattle',
    address: '100 Example Street, Seattle, WA',
    phone: '(206) 555-0101',
    website: 'https://northside.example.com',
    hours: 'Monday-Friday, 9 AM-3 PM',
    description: 'Free groceries and basic food supplies for local families.',
    checked: 'September 1, 2026',
    status: 'Recently Checked',
  },
  {
    id: 2,
    name: 'Hope Housing Center',
    category: 'Housing',
    city: 'Seattle',
    address: '200 Example Avenue, Seattle, WA',
    phone: '(206) 555-0102',
    website: 'https://hopehousing.example.com',
    hours: 'Monday-Thursday, 10 AM-4 PM',
    description: 'Help finding temporary housing and rental assistance.',
    checked: 'August 15, 2026',
    status: 'Needs Review',
  },
  {
    id: 3,
    name: 'Community Legal Aid',
    category: 'Legal Help',
    city: 'Seattle',
    address: '300 Example Road, Seattle, WA',
    phone: '(206) 555-0103',
    website: 'https://legalaid.example.com',
    hours: 'Tuesday-Friday, 9 AM-5 PM',
    description: 'Free legal information and appointments for community members.',
    checked: 'September 3, 2026',
    status: 'Recently Checked',
  },
]

function App() {
  const [page, setPage] = useState('home')
  const [loggedIn, setLoggedIn] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [selectedResource, setSelectedResource] = useState(resources[0])
  const [message, setMessage] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/categories')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data)
      })
      .catch((error) => {
        console.error('Error loading categories:', error)
      })
  }, [])

  function navigate(nextPage) {
    setPage(nextPage)
    setMessage('')
  }

  function suggestUpdate() {
    navigate(loggedIn ? 'update' : 'login')
  }

  const filteredResources = resources.filter((resource) => {
    const searchText =
      `${resource.name} ${resource.category} ${resource.city} ${resource.description}`

    return (
      searchText.toLowerCase().includes(query.trim().toLowerCase()) &&
      (category === '' || resource.category === category)
    )
  })

  return (
    <div className="app">
      <header>
        <div className="site-title">FreshProof</div>

        <nav aria-label="Main navigation">
          <button
            onClick={() => navigate('home')}
            aria-current={page === 'home' ? 'page' : undefined}
          >
            Home
          </button>

          <button
            onClick={() => navigate('resources')}
            aria-current={page === 'resources' ? 'page' : undefined}
          >
            Resources
          </button>

          <button
            onClick={() => navigate('login')}
            aria-current={page === 'login' ? 'page' : undefined}
          >
            Login
          </button>

          {loggedIn && (
            <button onClick={() => navigate('dashboard')}>
              Dashboard
            </button>
          )}
        </nav>
      </header>

      <main>
        {page === 'home' && (
          <section className="home-page">
            <h1>Find Community Resources</h1>

            <p>
              Search local food, housing, legal help, mental health,
              childcare, and other community resources.
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                setCategory('')
                navigate('resources')
              }}
            >
              <label className="visually-hidden" htmlFor="home-search">
                Search resources
              </label>

              <div className="search-row">
                <input
                  id="home-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search for a resource"
                />

                <button type="submit">Search</button>
              </div>
            </form>

            <div className="button-row categories">
              {categories.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCategory(item.name)
                    setQuery('')
                    navigate('resources')
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <section className="common-resources">
              <h2>Browse common resources</h2>

              <div className="common-grid">
                {resources.map((resource) => (
                  <article className="card" key={resource.id}>
                    <p className="resource-meta">{resource.category}</p>

                    <h3>{resource.name}</h3>

                    <p>{resource.description}</p>

                    <button
                      className="text-button"
                      onClick={() => {
                        setSelectedResource(resource)
                        navigate('details')
                      }}
                    >
                      View Details
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}

        {page === 'resources' && (
          <section>
            <h1>Community Resources</h1>

            <div className="filters">
              <div>
                <label htmlFor="resource-search">
                  Search resources
                </label>

                <input
                  id="resource-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Enter a name or keyword"
                />
              </div>

              <div>
                <label htmlFor="category">Category</label>

                <select
                  id="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value="">All categories</option>

                  {categories.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="resource-list">
              {filteredResources.map((resource) => (
                <article className="card resource-card" key={resource.id}>
                  <h2>{resource.name}</h2>

                  <p className="resource-meta">
                    {resource.category} &middot; {resource.city}
                  </p>

                  <p>{resource.description}</p>

                  <div className="card-actions">
                    <span
                      className={`status ${
                        resource.status === 'Needs Review'
                          ? 'status-review'
                          : ''
                      }`}
                    >
                      {resource.status}
                    </span>

                    <button
                      className="secondary-button"
                      onClick={() => {
                        setSelectedResource(resource)
                        navigate('details')
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </article>
              ))}

              {filteredResources.length === 0 && (
                <div className="card">
                  <p>No resources match your search.</p>

                  <button
                    onClick={() => {
                      setQuery('')
                      setCategory('')
                    }}
                  >
                    Show All Resources
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {page === 'details' && (
          <section className="details-page">
            <h1>{selectedResource.name}</h1>

            <div className="details-layout">
              <div className="details-main">
                <dl>
                  <dt>Category</dt>
                  <dd>{selectedResource.category}</dd>

                  <dt>Address</dt>
                  <dd>{selectedResource.address}</dd>

                  <dt>Phone</dt>
                  <dd>{selectedResource.phone}</dd>

                  <dt>Website</dt>
                  <dd>{selectedResource.website}</dd>

                  <dt>Hours</dt>
                  <dd>{selectedResource.hours}</dd>

                  <dt>Description</dt>
                  <dd>{selectedResource.description}</dd>
                </dl>
              </div>

              <aside>
                <div className="card information-status">
                  <h2>Information status</h2>

                  <p>
                    <span
                      className={`status ${
                        selectedResource.status === 'Needs Review'
                          ? 'status-review'
                          : ''
                      }`}
                    >
                      {selectedResource.status}
                    </span>
                  </p>

                  <p className="resource-meta">Last checked</p>

                  <p>{selectedResource.checked}</p>
                </div>

                <div className="button-row">
                  <button
                    className="secondary-button"
                    onClick={() =>
                      setMessage(
                        'To share a correction, choose Suggest an Update.'
                      )
                    }
                  >
                    Report incorrect information
                  </button>

                  <button onClick={suggestUpdate}>
                    Suggest an Update
                  </button>
                </div>

                {message && <p role="status">{message}</p>}
              </aside>
            </div>
          </section>
        )}

        {page === 'login' && (
          <section className="form-section login-card card">
            <h1>Contributor Login</h1>

            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault()
                setLoggedIn(true)
                navigate('dashboard')
              }}
            >
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                autoComplete="username"
              />

              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
              />

              <button type="submit">Login</button>
            </form>

            <button
              className="text-button back-link"
              onClick={() => navigate('home')}
            >
              Back to Home
            </button>
          </section>
        )}

        {page === 'dashboard' && (
          <section>
            <h1>Contributor Dashboard</h1>

            {message && (
              <p className="message" role="status">
                {message}
              </p>
            )}

            <p>
              Welcome! You can suggest changes to community resource
              information.
            </p>

            <button onClick={suggestUpdate}>
              Suggest an Update
            </button>

            <h2 className="contributions-heading">
              My Contributions
            </h2>

            <ul className="card contributions">
              <li>
                <span>Northside Food Bank</span>
                <span className="status status-review">
                  Pending
                </span>
              </li>

              <li>
                <span>Community Legal Aid</span>
                <span className="status">
                  Approved
                </span>
              </li>

              <li>
                <span>Hope Housing Center</span>
                <span className="status status-review">
                  Needs More Info
                </span>
              </li>
            </ul>
          </section>
        )}

        {page === 'update' && loggedIn && (
          <section className="form-section">
            <h1>Suggest an Update</h1>

            <p className="organization-name">
              {selectedResource.name}
            </p>

            <form
              className="card"
              noValidate
              onSubmit={(event) => {
                event.preventDefault()
                navigate('dashboard')
                setMessage('Update submitted successfully.')
              }}
            >
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                defaultValue={selectedResource.phone}
              />

              <label htmlFor="website">Website</label>
              <input
                id="website"
                defaultValue={selectedResource.website}
              />

              <label htmlFor="hours">Hours</label>
              <input
                id="hours"
                defaultValue={selectedResource.hours}
              />

              <label htmlFor="notes">Notes</label>
              <textarea id="notes" rows="4" />

              <label htmlFor="evidence">Evidence URL</label>
              <input
                id="evidence"
                placeholder="https://example.com"
              />

              <button type="submit">
                Submit Update
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
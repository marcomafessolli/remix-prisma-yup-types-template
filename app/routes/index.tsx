import { Link } from 'remix'

export default function Index() {
  return (
    <div>
      <h1>Index</h1>
      <p>This is the index page</p>

      <Link to='/users'>Users</Link>
    </div>
  )
}

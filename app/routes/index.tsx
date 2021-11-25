import type { HeadersFunction } from 'remix'

export let headers: HeadersFunction = () => {
  return {
    'Cache-Control': `public, max-age=${60 * 10}, s-maxage=${
      60 * 60 * 24 * 30
    }`,
  }
}

export default function Index() {
  return (
    <div>
      <h1>Index</h1>
      <p>This is the index page</p>
    </div>
  )
}

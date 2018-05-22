import test from 'ava'
import nock from 'nock'
import fetch from 'node-fetch'

const isCertified = async (id) => {
  const isLicensed = await fetch(`http://www.foo.com/v1/employees?id=${id}&check=license`, { method: 'GET' })
    .then(r => r.json())

  const hasDegree = await fetch(`http://www.foo.com/v1/employees?id=${id}&check=degree`, { method: 'GET' })
    .then(r => r.json())

  return isLicensed && hasDegree
}

test('nock needs persistence', async t => {
  nock('http://www.foo.com')
    .get('/v1/employees')
    .query(() => true)
    .reply(200, true)

  const actual = await isCertified(123)
  const expected = true
  t.is(actual, expected)
})

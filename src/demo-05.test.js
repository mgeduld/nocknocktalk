import test from 'ava'
import nock from 'nock'
import fetch from 'node-fetch'

const isCertified = async (id) => {
  const isLicensed = await fetch(`http://www.foo.com/v1/employees?id=${id}&check=license`, { method: 'GET' })
    .then(r => r.json())

  const hasDegree = await fetch(`http://www.foo.com/v1/employees?id=${id}&check=degree`, { method: 'GET' })
    .then(r => r.json())

  return isLicensed.check && hasDegree.check
}

test.afterEach.always(() => { nock.cleanAll() })

test.serial('nock twice and return true', async t => {
  nock('http://www.foo.com')
    .persist()
    .get('/v1/employees')
    .query(() => true)
    .reply(200, { check: true })

  const actual = await isCertified(123)
  const expected = true
  t.is(actual, expected)
})

test.serial('nock twice and return false ', async t => {
  nock('http://www.foo.com')
    .persist()
    .get('/v1/employees')
    .query(() => true)
    .reply(200, { check: false })

  const actual = await isCertified(123)
  const expected = false
  t.is(actual, expected)
})

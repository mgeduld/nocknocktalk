import test from 'ava'
import nock from 'nock'
import fetch from 'node-fetch'

const getEmployee = (id) =>
  fetch(`http://www.foo.com/v1/employees?ID=${id}`, { method: 'GET' })
    .then(r => r.json())

test('nock with error', async t => {
  nock('http://www.foo.com')
    .get('/v1/employees')
    .query({ id: 123 })
    .reply(200, { name: 'John Smith' })

  const actual = (await getEmployee(123)).name
  const expected = 'John Smith'
  t.is(actual, expected)
})



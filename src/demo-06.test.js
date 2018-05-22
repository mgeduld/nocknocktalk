import test from 'ava'
import nock from 'nock'
import fetch from 'node-fetch'

const hasTasks = async (id) => {
  const tasks = await fetch(`http://www.foo.com/v1/tasks`, {
    method: 'POST',
    body: JSON.stringify({ id })
  }).then(r => r.json())

  return tasks.active
}

test.afterEach.always(() => { nock.cleanAll() })

test.serial('nock post', async t => {
  nock('http://www.foo.com')
    .post('/v1/tasks', { id: 123 })
    .reply(200, { active: true })

  const actual = await hasTasks(123)
  const expected = true
  t.is(actual, expected)
})

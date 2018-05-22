import test from 'ava'
import nock from 'nock'
import fetch from 'node-fetch'

const hasTasks = async (id) => {
  const hasFooTasks = await fetch(`http://www.foo.com/v1/tasks`, {
    method: 'POST',
    body: JSON.stringify({ id, exception: 'foo' })
  }).then(r => r.json())

  const hasBarTasks = await fetch(`http://www.foo.com/v1/tasks`, {
    method: 'POST',
    body: JSON.stringify({ id, exception: 'bar' })
  }).then(r => r.json())

  const hasBazTasks = await fetch(`http://www.foo.com/v1/tasks`, {
    method: 'POST',
    body: JSON.stringify({ id, exception: 'baz' })
  }).then(r => r.json())

  return hasFooTasks.active && hasBarTasks.active && hasBazTasks.active
}

test.afterEach.always(() => { nock.cleanAll() })

test.serial('nock post all true', async t => {
  nock('http://www.foo.com')
    .persist()
    .post('/v1/tasks', () => true)
    .reply(200, { active: true })

  const actual = await hasTasks(123)
  const expected = true
  t.is(actual, expected)
})

test.serial('nock post all false', async t => {
  nock('http://www.foo.com')
    .persist()
    .post('/v1/tasks', () => true)
    .reply(200, { active: false })

  const actual = await hasTasks(123)
  const expected = false
  t.is(actual, expected)
})

test.serial('nock post one true, two false', async t => {
  nock('http://www.foo.com')
    .persist()
    .post('/v1/tasks', () => true)
    .reply(200, (path, body) => {
      const { exception } = JSON.parse(body)

      return { active: exception === 'baz' }
    })

  const actual = await hasTasks(123)
  const expected = false
  t.is(actual, expected)
})

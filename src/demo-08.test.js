import test from 'ava'
import nock from 'nock'
import fetch from 'node-fetch'

const doStuff = async () => {
  await fetch(`http://www.foo.com/v1/api1?foo=bar&baz=qux`, { method: 'GET' })

  await fetch(`http://www.foo.com/v1/api2`, {
    method: 'POST',
    body: JSON.stringify({ animal: 'cat' })
  })

  await fetch(`http://www.foo.com/v1/api2`, {
    method: 'POST',
    body: JSON.stringify({ animal: 'dog' })
  })
}

test.afterEach.always(() => { nock.cleanAll() })

test.serial('nock isDone', async t => {
  const firstCall = nock('http://www.foo.com')
    .get('/v1/api1')
    .query({ foo: 'bar', baz: 'qux' })
    .reply(200)

  const secondAndThirdCalls = nock('http://www.foo.com')
    .post('/v1/api2', { animal: 'cat' })
    .reply(200)
    .post('/v1/api2', { animal: 'dog' })
    .reply(200)

  await doStuff()

  t.is(firstCall.isDone(), true)
  t.is(secondAndThirdCalls.isDone(), true)
})


import { Client } from '../src';

const baseUrl = process.env.BASE_PATH!;
const apiKey = process.env.API_KEY;
const client = new Client(baseUrl, apiKey);

test('route actions', async () => {
  const resource = client.getRouteResource();
  const newId = await resource.add({
    uris: ['/test/html'],
    plugins: {},
  });
  expect(newId).toBeTruthy();

  const newData = await resource.get(newId);
  expect(newData.uris![0]).toEqual('/test/html');

  const updateId = await resource.set(newId, {
    uris: ['/test.html'],
    plugins: {},
  });
  expect(updateId).toEqual(newId);

  const data = await resource.get(newId);
  expect(data.uris![0]).toEqual('/test.html');

  const deleteId = await resource.remove(newId);
  expect(deleteId).toEqual(newId);
});

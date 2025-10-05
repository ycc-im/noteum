import fs from 'node:fs';
import { a as createServerRpc, c as createServerFn } from './ssr.mjs';
import '@tanstack/react-router';
import 'react/jsx-runtime';
import 'react';
import '@tanstack/react-devtools';
import '@logto/react';
import 'node:async_hooks';
import '@tanstack/react-router/ssr/server';

const filePath = "todos.json";
async function readTodos() {
  return JSON.parse(await fs.promises.readFile(filePath, "utf-8").catch(() => JSON.stringify([{
    id: 1,
    name: "Get groceries"
  }, {
    id: 2,
    name: "Buy a new phone"
  }], null, 2)));
}
const addTodo_createServerFn_handler = createServerRpc("src_routes_demo_start_server-funcs_tsx--addTodo_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return addTodo.__executeServer(opts, signal);
});
const addTodo = createServerFn({
  method: "POST"
}).validator((d) => d).handler(addTodo_createServerFn_handler, async ({
  data
}) => {
  const todos = await readTodos();
  todos.push({
    id: todos.length + 1,
    name: data
  });
  await fs.promises.writeFile(filePath, JSON.stringify(todos, null, 2));
  return todos;
});

export { addTodo_createServerFn_handler };
//# sourceMappingURL=demo.start.server-funcs-BLTpK4LO.mjs.map

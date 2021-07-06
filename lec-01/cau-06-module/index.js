import { createHttpInstance, RESPONSE_TYPES } from "./httpservice.js";

document.getElementById("btnRequest").addEventListener("click", () => {
  const http = createHttpInstance({
    endpoint: "https://jsonplaceholder.typicode.com",
  });
  const result = document.getElementById("result");

  const body = {
    title: "Learn javascript",
    body: "Learn javascript everyday",
  };

  http
    .post("/posts", { body, responseType: RESPONSE_TYPES.Json })
    .then((response) => {
      result.innerHTML = `<p>Result: ${JSON.stringify(response)}`;
    })
    .catch((e) => {
      result.innerHTML = `<p>Error: ${JSON.stringify(e)}`;
    });
});

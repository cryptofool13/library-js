import { app } from "./app";

app.listen(app.get("port"), () => {
  console.log(`app running at http://localhost:${app.get("port")}`);
});

import 'reflect-metadata';
import { Factory } from "./core";
import { UsersModule } from "./app";
const app = Factory([UsersModule]);
const port = 3000;
app.listen(port, () => console.log(`Mini-Nest listening on http://localhost:${port}`));

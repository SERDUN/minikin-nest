import 'reflect-metadata';
import { Factory } from "./core";
import { UsersModule } from "./app";
import { InternalServerErrorFilter } from "./app/filters";

const app = Factory([UsersModule])

app.useGlobalFilters(new InternalServerErrorFilter())

const port = 3000;

app.listen(port, () => console.log(`Mini-Nest listening on http://localhost:${port}`));

import { container, Factory } from "./core";
import { UsersModule } from "./features/users/users.module";

const app = Factory([UsersModule])

const port = 8081;

app.listen(port, () => console.log(`Mini-Nest listening on http://localhost:${port}`));

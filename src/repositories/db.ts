import postgres, {PostgresType, Sql} from 'postgres'

const db = postgres({
    host: 'dpg-csf6iktsvqrc73fbqjrg-a.frankfurt-postgres.render.com',
    port: 5432,
    database: 'main_t3fe',
    username: 'admin',
    password: 'wYSPPXLyEwOgigHmYBaeDoeEKC5I72IA',
    ssl: "allow"
});

export const getDbConnection = <T extends Record<string, PostgresType<unknown>>>() => {
    return db as Sql<T>;
}

export type Database = {
	uri: string;
	dbname: string;
	options: string;
	user: string;
	password: string;
}

export type IEnv = {
	database: Database;
}
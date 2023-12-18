export class Database {
	constructor(config) {
		this.config = config;
	}

	async query(sql, single = false) {
		const response = await fetch(`${this.config.api}/${sql}`);
		const data = await response.json();

		if (response.ok) {
			if (single) {
				return await data[0];
			} else {
				return await data;
			}
		} else {
			return null;
		}
	}
}
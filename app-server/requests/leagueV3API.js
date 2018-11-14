import { API_KEY } from "../lol-config";
const { RESTDataSource } = require('apollo-datasource-rest');

export default class leagueV3API extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://eun1.api.riotgames.com/lol/league/v3/positions/by-summoner/';
    }

    async getLeagueRank(summonerId) {
        return this.get(`${summonerId}?api_key=${API_KEY}`);
    }
}
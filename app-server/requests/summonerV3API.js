import { API_KEY } from "../lol-config";
const { RESTDataSource } = require('apollo-datasource-rest');

export default class summonerV3API extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://eun1.api.riotgames.com/lol/summoner/v3/summoners/by-name/';
    }

    async getSummoner(summonerName) {
        return this.get(`${summonerName}?api_key=${API_KEY}`);
    }
}
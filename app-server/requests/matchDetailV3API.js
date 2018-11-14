import { API_KEY } from "../lol-config";

const { RESTDataSource } = require('apollo-datasource-rest');

export default class matchDetailV3APIV3API extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://eun1.api.riotgames.com/lol/match/v3/matches/';
    }

    async getMatcheDetails(matchId) {
        return this.get(matchId + `?api_key=${API_KEY}`);
    }
}
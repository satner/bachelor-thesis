import { API_KEY, QUEUE, SEASON } from "../lol-config";

const { RESTDataSource } = require('apollo-datasource-rest');

export default class matchV3API extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://eun1.api.riotgames.com/lol/match/v3/matchlists/by-account/';
    }

    async getMatches(accountId) {
        return this.get(accountId + `?queue=${QUEUE}&season=${SEASON}&api_key=${API_KEY}`);
    }
}
'use strict';
import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
export class PixabayApi {
    // #BASE_URL = 'https://pixabay.com/api/';
    #API_KEY = '31498114-afd850579f929b713e5d5f459';

    constructor() {
        this.page = null;
        this.searchQuery = null;
    }

    fetchPhotos() {
        const searchParams = {
            params: {
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: this.page,
            per_page: '40',
            key: this.#API_KEY,
        },
    };

    return axios.get(`/`, searchParams);
    // return axios.get(`${this.#BASE_URL}`, searchParams);
    }
}
'use strict';

export class PixabayApi {
    #BASE_URL = 'https://pixabay.com/api/';
    #API_KEY = '31498114-afd850579f929b713e5d5f459';

    constructor() {
        this.page = null;
        this.searchQuery = null;
    }

    fetchPhotos() {
        const searchParams = new URLSearchParams({
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: this.page,
            per_page: '40',
            key: this.#API_KEY,
        })

        return fetch(
            `${this.#BASE_URL}?${searchParams}`
        ).then(resopnse => {
            if (!resopnse.ok) {
                throw new Error(resopnse.status);
            }

            return resopnse.json();
        });
    }
}
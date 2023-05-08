import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import {
    CategoriesResponse,
    Categories,
    ProductResponse,
    Product,
} from '../types';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    private api: HttpClient;
    private baseURL: string = 'https://dummyjson.com';

    constructor(private http: HttpClient) {
        this.api = http;
    }

    getCategories() {
        return new Promise<Categories>((resolve, reject) => {
            this.api
                .get<CategoriesResponse>(`${this.baseURL}/products/categories`)
                .pipe(
                    map((categories) => {
                        return categories.map((category) => {
                            const obj = {
                                key: category,
                                title: category,
                            };

                            obj.title = obj.title.replaceAll('-', ' ');
                            obj.title =
                                obj.title.charAt(0).toUpperCase() +
                                obj.title.slice(1);

                            return obj;
                        });
                    })
                )
                .subscribe((data: Categories) => {
                    resolve(data);
                });
        });
    }

    getCategoryProducts(category: string) {
        return new Promise<Array<Product>>((resolve, reject) => {
            this.api
                .get<ProductResponse>(
                    `${this.baseURL}/products/category/${category}`
                )
                .subscribe((data: ProductResponse) => {
                    resolve(data.products);
                });
        });
    }

    getProducts(search: string, category: string = '') {
        const params: HttpParams = new HttpParams()
            .set('q', search)
            .set('category', category) // This is actually does not work but I added it to simulate
            .set('limit', 5);

        return new Promise<Array<Product>>((resolve, reject) => {
            this.api
                .get<ProductResponse>(`${this.baseURL}/products/search`, {
                    params,
                })
                .subscribe((data: ProductResponse) => {
                    resolve(data.products);
                });
        });
    }

    getProduct(id: number) {
        return new Promise<Product>((resolve, reject) => {
            this.api
                .get<Product>(`${this.baseURL}/products/${id}`)
                .subscribe((data: Product) => {
                    resolve(data);
                });
        });
    }
}

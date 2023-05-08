import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounce, interval } from 'rxjs';

import { Categories, Products, Product } from 'src/app/types';
import { CategoryService } from '../../services/category.service';

@Component({
    selector: 'app-typeahead-search',
    templateUrl: './typeahead-search.component.html',
    styleUrls: ['./typeahead-search.component.scss'],
    providers: [CategoryService],
})
export class TypeaheadSearchComponent implements OnInit {
    private apiService: CategoryService;

    categories: Categories = [];
    searchResults: Products = [];
    searchResult: Product | null = null;

    searchText: FormControl;
    category: FormControl;
    dropdownOpen: boolean = false;

    constructor(service: CategoryService) {
        this.apiService = service;
        this.searchText = new FormControl('');
        this.category = new FormControl('');
    }

    ngOnInit() {
        this.apiService.getCategories().then((data) => {
            this.categories = data;
        });

        this.initLastSearch();

        this.searchText.valueChanges
            .pipe(debounce(() => interval(300)))
            .subscribe({
                next: (value) => this.searchInputOnchange(value),
                error(msg) {
                    console.log(msg);
                },
            });

        this.category.valueChanges.subscribe({
            next: (value) => this.categoryOnChange(value),
            error(msg) {
                console.log(msg);
            },
        });
    }

    searchInputOnchange(value: string) {
        if (value.trim()) {
            this.apiService
                .getProducts(value, this.category.value)
                .then((data) => {
                    this.searchResults = data;
                    this.dropdownOpen = true;
                });
        } else {
            const lastSearch = localStorage.getItem('lastSearch') || '';
            if (lastSearch) {
                this.searchResults = JSON.parse(lastSearch).map(
                    ({ product }: { product: Product }) => product
                );
                console.log(this.searchResults);
                this.dropdownOpen = true;
            }
        }
    }

    setLastSearch(product: Product) {
        try {
            const lastSearchText = localStorage.getItem('lastSearch');
            let lastSearches = [];

            if (lastSearchText) {
                lastSearches = JSON.parse(lastSearchText);
            }

            lastSearches = lastSearches.filter(
                ({ product: p }: { product: Product }) => p.id !== product.id
            );

            console.log(product);
            console.log(this.category);
            console.log(lastSearches);

            lastSearches.unshift({
                product,
                category: this.category.value,
            });

            localStorage.setItem(
                'lastSearch',
                JSON.stringify(lastSearches.slice(0, 5))
            );
        } catch (error) {
            console.log(error);
        }
    }

    initLastSearch() {
        try {
            const lastSearch = localStorage.getItem('lastSearch') || '';
            const lastSearchList = JSON.parse(lastSearch);
            if (lastSearchList.length) {
                this.searchText.setValue(
                    lastSearchList[0].product.brand +
                        ' ' +
                        lastSearchList[0].product.title
                );
                this.category.setValue(lastSearchList[0].category);
                this.searchResults = lastSearchList;
                this.dropdownOpen = false;
            }
        } catch (error) {}
    }

    categoryOnChange(category: string) {
        if (this.searchText.value.trim()) {
            this.searchInputOnchange(this.searchText.value);
        } else {
            this.apiService.getCategoryProducts(category).then((data) => {
                this.searchResults = data;
                this.dropdownOpen = true;
            });
        }
    }

    searchResultOnClick(result: Product) {
        this.searchText.setValue(result.brand + ' ' + result.title);
        this.dropdownOpen = false;
        this.searchResults = [];
        this.apiService.getProduct(result.id).then((data) => {
            this.searchResult = data;
            this.setLastSearch(data);
        });
    }

    search() {
        this.searchInputOnchange(this.searchText.value);
    }
}

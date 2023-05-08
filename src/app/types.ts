export type CategoriesResponse = Array<string>;

export type Categories = Array<Category>;

export type Category = {
    key: string;
    title: string;
};

export type ProductResponse = {
    products: Array<Product>;
    limit: number;
    skip: number;
    total: number;
};

export type Products = Array<Product>;

export type Product = {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: Array<string>;
};

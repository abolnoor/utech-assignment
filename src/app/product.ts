export class Product {

    constructor() {
        this.name = '';
        this.description = '';
        this.color = '';
        this.weight = '';
        this.code = '';
        this.categories = [];
        this.image = null;
    }


    id: number;	// Product's Id
    name: string;	// Product's New Name _ optional
    description: string;	// Product's New Description _ optional
    color: string;	// Product's New Color _ optional
    weight: string;	// Product's New Weight _ optional
    code: string;	// Product's New Unique Code _ optional
    image: File;	// Product's New image _ optional
    categories: number[];	// List of Product's New Categories IDs _ optional
}

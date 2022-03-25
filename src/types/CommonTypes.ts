export interface PaginationInterface {
    size? :number;
    page? : number;
    totalPages? :number;
    totalCount? : number;
    hasPrevious? :boolean;
    hasNext? :boolean;
}

export interface SearchInterface extends PaginationInterface{
    searchKeyword? : string;
}

interface Dummy {

}

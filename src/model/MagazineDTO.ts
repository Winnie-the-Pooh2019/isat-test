export interface MagazineDTO {
    name: string,
    authors: string[],
    date: string,
    content: string,
    tagIds: number[],
    reviews: number[],
    _id: number
}